import { UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AUTH_REPOSITORY_TOKEN,
  PASSWORD_SERVICE_TOKEN,
  TOKEN_SERVICE_TOKEN,
  LOGGER_SERVICE_TOKEN,
} from '../../../../../shared/constants/di-constants';
import { ILoggerService } from '../../../domain/contracts/services/logger-service.contract';
import { IPasswordService } from '../../../domain/contracts/services/password-service.contract';
import { ITokenService } from '../../../domain/contracts/services/token-service.contract';
import { TokenEntity } from '../../../domain/entities/token.entity';
import { UserEntity } from '../../../domain/entities/user.entity';
import { IAuthRepository } from '../../../domain/repositories/auth-repository.contract';
import { AuthUseCase } from '../auth-usecase';

describe('AuthUseCase', () => {
  let useCase: AuthUseCase;
  let mockAuthRepository: jest.Mocked<IAuthRepository>;
  let mockPasswordService: jest.Mocked<IPasswordService>;
  let mockTokenService: jest.Mocked<ITokenService>;
  let mockLogger: jest.Mocked<ILoggerService>;

  const testUser = UserEntity.create({
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashed-password',
    isActive: true,
  });

  const inactiveUser = UserEntity.create({
    id: 'inactive-user',
    email: 'inactive@example.com',
    name: 'Inactive User',
    password: 'hashed-password',
    isActive: false,
  });

  beforeEach(async () => {
    // Create mocks
    mockAuthRepository = {
      findUserByEmail: jest.fn(),
      findUserById: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      getPasswordHash: jest.fn(),
      saveToken: jest.fn(),
      findTokenByValue: jest.fn(),
      deleteToken: jest.fn(),
      deleteUserTokens: jest.fn(),
      deleteExpiredTokens: jest.fn(),
    };

    mockPasswordService = {
      hash: jest.fn(),
      verify: jest.fn(),
    };

    mockTokenService = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      validateAccessToken: jest.fn(),
      validateRefreshToken: jest.fn(),
    };

    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthUseCase,
        { provide: AUTH_REPOSITORY_TOKEN, useValue: mockAuthRepository },
        { provide: PASSWORD_SERVICE_TOKEN, useValue: mockPasswordService },
        { provide: TOKEN_SERVICE_TOKEN, useValue: mockTokenService },
        { provide: LOGGER_SERVICE_TOKEN, useValue: mockLogger },
      ],
    }).compile();

    useCase = module.get<AuthUseCase>(AuthUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const loginInput = {
      email: 'test@example.com',
      password: 'password123',
      rememberMe: false,
    };

    it('should login successfully with valid credentials', async () => {
      // Arrange
      const accessToken = 'access-token-123';
      const refreshToken = 'refresh-token-123';
      mockAuthRepository.findUserByEmail.mockResolvedValue(testUser);
      mockAuthRepository.getPasswordHash.mockResolvedValue('hashed-password');
      mockPasswordService.verify.mockResolvedValue(true);
      mockTokenService.generateAccessToken.mockResolvedValue(accessToken);
      mockTokenService.generateRefreshToken.mockResolvedValue(refreshToken);

      // Act
      const result = await useCase.login(loginInput);

      // Assert
      expect(result).toEqual({
        user: testUser,
        accessToken,
        refreshToken,
      });

      // Verify method calls
      expect(mockLogger.debug).toHaveBeenCalledWith('Login attempt started', {
        email: loginInput.email,
      });
      expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockAuthRepository.getPasswordHash).toHaveBeenCalledWith('user-123');
      expect(mockPasswordService.verify).toHaveBeenCalledWith('password123', 'hashed-password');
      expect(mockTokenService.generateAccessToken).toHaveBeenCalledWith(testUser);
      expect(mockTokenService.generateRefreshToken).toHaveBeenCalledWith(testUser, false);
      expect(mockAuthRepository.saveToken).toHaveBeenCalledTimes(2);
      expect(mockLogger.info).toHaveBeenCalledWith('User logged in successfully', {
        userId: 'user-123',
      });
    });

    it('should login with rememberMe=true and generate long-lived refresh token', async () => {
      // Arrange
      const loginInputWithRememberMe = { ...loginInput, rememberMe: true };
      mockAuthRepository.findUserByEmail.mockResolvedValue(testUser);
      mockAuthRepository.getPasswordHash.mockResolvedValue('hashed-password');
      mockPasswordService.verify.mockResolvedValue(true);
      mockTokenService.generateAccessToken.mockResolvedValue('access-token');
      mockTokenService.generateRefreshToken.mockResolvedValue('refresh-token');

      // Act
      await useCase.login(loginInputWithRememberMe);

      // Assert
      expect(mockTokenService.generateRefreshToken).toHaveBeenCalledWith(testUser, true);
    });

    it('should throw BadRequestException when email is missing', async () => {
      // Arrange
      const invalidInput = { ...loginInput, email: '' };

      // Act & Assert
      await expect(useCase.login(invalidInput)).rejects.toThrow(BadRequestException);
      await expect(useCase.login(invalidInput)).rejects.toThrow('Email and password are required');

      // Verify no other methods were called
      expect(mockAuthRepository.findUserByEmail).not.toHaveBeenCalled();
      expect(mockPasswordService.verify).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when password is missing', async () => {
      // Arrange
      const invalidInput = { ...loginInput, password: '' };

      // Act & Assert
      await expect(useCase.login(invalidInput)).rejects.toThrow(BadRequestException);
      expect(mockAuthRepository.findUserByEmail).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user not found', async () => {
      // Arrange
      mockAuthRepository.findUserByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.login(loginInput)).rejects.toThrow(UnauthorizedException);
      await expect(useCase.login(loginInput)).rejects.toThrow('Invalid credentials');

      expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockPasswordService.verify).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      // Arrange
      mockAuthRepository.findUserByEmail.mockResolvedValue(inactiveUser);

      // Act & Assert
      await expect(useCase.login(loginInput)).rejects.toThrow(UnauthorizedException);
      expect(mockPasswordService.verify).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      // Arrange
      mockAuthRepository.findUserByEmail.mockResolvedValue(testUser);
      mockAuthRepository.getPasswordHash.mockResolvedValue('hashed-password');
      mockPasswordService.verify.mockResolvedValue(false);

      // Act & Assert
      await expect(useCase.login(loginInput)).rejects.toThrow(UnauthorizedException);
      await expect(useCase.login(loginInput)).rejects.toThrow('Invalid credentials');

      expect(mockPasswordService.verify).toHaveBeenCalledWith('password123', 'hashed-password');
      expect(mockTokenService.generateAccessToken).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password hash not found', async () => {
      // Arrange
      mockAuthRepository.findUserByEmail.mockResolvedValue(testUser);
      mockAuthRepository.getPasswordHash.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.login(loginInput)).rejects.toThrow(UnauthorizedException);
      expect(mockPasswordService.verify).not.toHaveBeenCalled();
    });

    it('should convert email to lowercase', async () => {
      // Arrange
      const upperCaseEmailInput = { ...loginInput, email: 'TEST@EXAMPLE.COM' };
      mockAuthRepository.findUserByEmail.mockResolvedValue(testUser);
      mockAuthRepository.getPasswordHash.mockResolvedValue('hashed-password');
      mockPasswordService.verify.mockResolvedValue(true);
      mockTokenService.generateAccessToken.mockResolvedValue('token');
      mockTokenService.generateRefreshToken.mockResolvedValue('refresh');

      // Act
      await useCase.login(upperCaseEmailInput);

      // Assert
      expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should handle token generation errors', async () => {
      // Arrange
      mockAuthRepository.findUserByEmail.mockResolvedValue(testUser);
      mockAuthRepository.getPasswordHash.mockResolvedValue('hashed-password');
      mockPasswordService.verify.mockResolvedValue(true);
      mockTokenService.generateAccessToken.mockRejectedValue(new Error('Token generation failed'));

      // Act & Assert
      await expect(useCase.login(loginInput)).rejects.toThrow('Token generation failed');
      expect(mockAuthRepository.saveToken).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    const registerInput = {
      email: 'new@example.com',
      password: 'newpassword123',
      name: 'New User',
    };

    it('should register user successfully', async () => {
      // Arrange
      const newUser = UserEntity.create({
        id: 'new-user-123',
        email: 'new@example.com',
        name: 'New User',
        password: 'hashed-new-password',
      });
      const accessToken = 'new-access-token';
      const refreshToken = 'new-refresh-token';

      mockAuthRepository.findUserByEmail.mockResolvedValue(null); // User doesn't exist
      mockPasswordService.hash.mockResolvedValue('hashed-new-password');
      mockAuthRepository.createUser.mockResolvedValue(newUser);
      mockTokenService.generateAccessToken.mockResolvedValue(accessToken);
      mockTokenService.generateRefreshToken.mockResolvedValue(refreshToken);

      // Act
      const result = await useCase.register(registerInput);

      // Assert
      expect(result).toEqual({
        user: newUser,
        accessToken,
        refreshToken,
      });

      expect(mockLogger.debug).toHaveBeenCalledWith('Registration attempt started', {
        email: registerInput.email,
      });
      expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith('new@example.com');
      expect(mockPasswordService.hash).toHaveBeenCalledWith('newpassword123');
      expect(mockAuthRepository.createUser).toHaveBeenCalledWith(
        'new@example.com',
        'hashed-new-password',
        'New User',
      );
      expect(mockTokenService.generateRefreshToken).toHaveBeenCalledWith(newUser, false); // rememberMe = false by default
      expect(mockLogger.info).toHaveBeenCalledWith('User registered successfully', {
        userId: 'new-user-123',
      });
    });

    it('should throw BadRequestException when email is missing', async () => {
      // Arrange
      const invalidInput = { ...registerInput, email: '' };

      // Act & Assert
      await expect(useCase.register(invalidInput)).rejects.toThrow(BadRequestException);
      await expect(useCase.register(invalidInput)).rejects.toThrow(
        'Email, password, and name are required',
      );
    });

    it('should throw BadRequestException when password is missing', async () => {
      // Arrange
      const invalidInput = { ...registerInput, password: '' };

      // Act & Assert
      await expect(useCase.register(invalidInput)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when name is missing', async () => {
      // Arrange
      const invalidInput = { ...registerInput, name: '' };

      // Act & Assert
      await expect(useCase.register(invalidInput)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when password is too short', async () => {
      // Arrange
      const invalidInput = { ...registerInput, password: '12345' }; // Only 5 characters

      // Act & Assert
      await expect(useCase.register(invalidInput)).rejects.toThrow(BadRequestException);
      await expect(useCase.register(invalidInput)).rejects.toThrow(
        'Password must be at least 6 characters long',
      );
    });

    it('should throw ConflictException when user already exists', async () => {
      // Arrange
      mockAuthRepository.findUserByEmail.mockResolvedValue(testUser); // User already exists

      // Act & Assert
      await expect(useCase.register(registerInput)).rejects.toThrow(ConflictException);
      await expect(useCase.register(registerInput)).rejects.toThrow(
        'User already exists with this email',
      );

      expect(mockPasswordService.hash).not.toHaveBeenCalled();
      expect(mockAuthRepository.createUser).not.toHaveBeenCalled();
    });

    it('should convert email to lowercase', async () => {
      // Arrange
      const upperCaseEmailInput = { ...registerInput, email: 'NEW@EXAMPLE.COM' };
      mockAuthRepository.findUserByEmail.mockResolvedValue(null);
      mockPasswordService.hash.mockResolvedValue('hashed-password');
      mockAuthRepository.createUser.mockResolvedValue(testUser);
      mockTokenService.generateAccessToken.mockResolvedValue('token');
      mockTokenService.generateRefreshToken.mockResolvedValue('refresh');

      // Act
      await useCase.register(upperCaseEmailInput);

      // Assert
      expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith('new@example.com');
      expect(mockAuthRepository.createUser).toHaveBeenCalledWith(
        'new@example.com',
        'hashed-password',
        'New User',
      );
    });
  });

  describe('refreshToken', () => {
    const refreshTokenInput = {
      refreshToken: 'valid-refresh-token',
    };

    const mockPayload = {
      sub: 'user-123',
      email: 'test@example.com',
      type: 'refresh',
    };

    const mockStoredToken = new TokenEntity(
      'valid-refresh-token',
      'REFRESH',
      new Date(Date.now() + 86400000), // 1 day from now
      'user-123',
    );

    it('should refresh token successfully', async () => {
      // Arrange
      const newAccessToken = 'new-access-token';
      mockTokenService.validateRefreshToken.mockResolvedValue(mockPayload);
      mockAuthRepository.findUserById.mockResolvedValue(testUser);
      mockAuthRepository.findTokenByValue.mockResolvedValue(mockStoredToken);
      mockTokenService.generateAccessToken.mockResolvedValue(newAccessToken);

      // Act
      const result = await useCase.refreshToken(refreshTokenInput);

      // Assert
      expect(result).toEqual({
        accessToken: newAccessToken,
      });

      expect(mockLogger.debug).toHaveBeenCalledWith('Token refresh attempt started');
      expect(mockTokenService.validateRefreshToken).toHaveBeenCalledWith('valid-refresh-token');
      expect(mockAuthRepository.findUserById).toHaveBeenCalledWith('user-123');
      expect(mockAuthRepository.findTokenByValue).toHaveBeenCalledWith('valid-refresh-token');
      expect(mockTokenService.generateAccessToken).toHaveBeenCalledWith(testUser);
      expect(mockAuthRepository.saveToken).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith('Token refreshed successfully', {
        userId: 'user-123',
      });
    });

    it('should throw BadRequestException when refresh token is missing', async () => {
      // Arrange
      const invalidInput = { refreshToken: '' };

      // Act & Assert
      await expect(useCase.refreshToken(invalidInput)).rejects.toThrow(BadRequestException);
      await expect(useCase.refreshToken(invalidInput)).rejects.toThrow('Refresh token is required');
    });

    it('should throw UnauthorizedException when token validation fails', async () => {
      // Arrange
      mockTokenService.validateRefreshToken.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.refreshToken(refreshTokenInput)).rejects.toThrow(UnauthorizedException);
      await expect(useCase.refreshToken(refreshTokenInput)).rejects.toThrow(
        'Invalid refresh token',
      );

      expect(mockLogger.warn).toHaveBeenCalledWith('Invalid refresh token provided');
    });

    it('should throw UnauthorizedException when user not found', async () => {
      // Arrange
      mockTokenService.validateRefreshToken.mockResolvedValue(mockPayload);
      mockAuthRepository.findUserById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.refreshToken(refreshTokenInput)).rejects.toThrow(UnauthorizedException);
      await expect(useCase.refreshToken(refreshTokenInput)).rejects.toThrow(
        'User not found or inactive',
      );

      expect(mockLogger.warn).toHaveBeenCalledWith('User not found or cannot login', {
        userId: 'user-123',
      });
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      // Arrange
      mockTokenService.validateRefreshToken.mockResolvedValue(mockPayload);
      mockAuthRepository.findUserById.mockResolvedValue(inactiveUser);

      // Act & Assert
      await expect(useCase.refreshToken(refreshTokenInput)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when stored token not found', async () => {
      // Arrange
      mockTokenService.validateRefreshToken.mockResolvedValue(mockPayload);
      mockAuthRepository.findUserById.mockResolvedValue(testUser);
      mockAuthRepository.findTokenByValue.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.refreshToken(refreshTokenInput)).rejects.toThrow(UnauthorizedException);
      await expect(useCase.refreshToken(refreshTokenInput)).rejects.toThrow(
        'Invalid or expired refresh token',
      );

      expect(mockLogger.warn).toHaveBeenCalledWith('Refresh token not found or expired', {
        userId: 'user-123',
      });
    });

    it('should throw UnauthorizedException when stored token is expired', async () => {
      // Arrange
      const expiredToken = new TokenEntity(
        'expired-refresh-token',
        'REFRESH',
        new Date(Date.now() - 86400000), // 1 day ago (expired)
        'user-123',
      );
      mockTokenService.validateRefreshToken.mockResolvedValue(mockPayload);
      mockAuthRepository.findUserById.mockResolvedValue(testUser);
      mockAuthRepository.findTokenByValue.mockResolvedValue(expiredToken);

      // Act & Assert
      await expect(useCase.refreshToken(refreshTokenInput)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      // Arrange
      const userId = 'user-123';

      // Act
      const result = await useCase.logout(userId);

      // Assert
      expect(result).toEqual({
        message: 'Logged out successfully',
      });

      expect(mockLogger.debug).toHaveBeenCalledWith('Logout attempt started', { userId });
      expect(mockAuthRepository.deleteUserTokens).toHaveBeenCalledWith(userId);
      expect(mockLogger.info).toHaveBeenCalledWith('User logged out successfully', { userId });
    });

    it('should throw BadRequestException when userId is missing', async () => {
      // Act & Assert
      await expect(useCase.logout('')).rejects.toThrow(BadRequestException);
      await expect(useCase.logout('')).rejects.toThrow('User ID is required');

      expect(mockAuthRepository.deleteUserTokens).not.toHaveBeenCalled();
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      const userId = 'user-123';
      mockAuthRepository.deleteUserTokens.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(useCase.logout(userId)).rejects.toThrow('Database error');
    });
  });

  describe('validateAccessToken', () => {
    const validToken = 'valid-access-token';
    const mockTokenPayload = {
      sub: 'user-123',
      email: 'test@example.com',
      type: 'access',
    };

    const mockStoredAccessToken = new TokenEntity(
      validToken,
      'ACCESS',
      new Date(Date.now() + 900000), // 15 minutes from now
      'user-123',
    );

    it('should validate access token successfully', async () => {
      // Arrange
      mockTokenService.validateAccessToken.mockResolvedValue(mockTokenPayload);
      mockAuthRepository.findTokenByValue.mockResolvedValue(mockStoredAccessToken);
      mockAuthRepository.findUserById.mockResolvedValue(testUser);

      // Act
      const result = await useCase.validateAccessToken(validToken);

      // Assert
      expect(result).toBe(testUser);
      expect(mockTokenService.validateAccessToken).toHaveBeenCalledWith(validToken);
      expect(mockAuthRepository.findTokenByValue).toHaveBeenCalledWith(validToken);
      expect(mockAuthRepository.findUserById).toHaveBeenCalledWith('user-123');
    });

    it('should return null when token service validation fails', async () => {
      // Arrange
      mockTokenService.validateAccessToken.mockResolvedValue(null);

      // Act
      const result = await useCase.validateAccessToken(validToken);

      // Assert
      expect(result).toBeNull();
      expect(mockAuthRepository.findTokenByValue).not.toHaveBeenCalled();
    });

    it('should return null when stored token not found', async () => {
      // Arrange
      mockTokenService.validateAccessToken.mockResolvedValue(mockTokenPayload);
      mockAuthRepository.findTokenByValue.mockResolvedValue(null);

      // Act
      const result = await useCase.validateAccessToken(validToken);

      // Assert
      expect(result).toBeNull();
      expect(mockAuthRepository.findUserById).not.toHaveBeenCalled();
    });

    it('should return null when stored token is expired', async () => {
      // Arrange
      const expiredToken = new TokenEntity(
        validToken,
        'ACCESS',
        new Date(Date.now() - 900000), // 15 minutes ago (expired)
        'user-123',
      );
      mockTokenService.validateAccessToken.mockResolvedValue(mockTokenPayload);
      mockAuthRepository.findTokenByValue.mockResolvedValue(expiredToken);

      // Act
      const result = await useCase.validateAccessToken(validToken);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when user not found', async () => {
      // Arrange
      mockTokenService.validateAccessToken.mockResolvedValue(mockTokenPayload);
      mockAuthRepository.findTokenByValue.mockResolvedValue(mockStoredAccessToken);
      mockAuthRepository.findUserById.mockResolvedValue(null);

      // Act
      const result = await useCase.validateAccessToken(validToken);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when user is inactive', async () => {
      // Arrange
      mockTokenService.validateAccessToken.mockResolvedValue(mockTokenPayload);
      mockAuthRepository.findTokenByValue.mockResolvedValue(mockStoredAccessToken);
      mockAuthRepository.findUserById.mockResolvedValue(inactiveUser);

      // Act
      const result = await useCase.validateAccessToken(validToken);

      // Assert
      expect(result).toBeNull();
    });

    it('should handle and log errors gracefully', async () => {
      // Arrange
      const error = new Error('Validation error');
      mockTokenService.validateAccessToken.mockRejectedValue(error);

      // Act
      const result = await useCase.validateAccessToken(validToken);

      // Assert
      expect(result).toBeNull();
      expect(mockLogger.error).toHaveBeenCalledWith('Error validating access token', error);
    });
  });

  describe('validateRefreshToken', () => {
    const validRefreshToken = 'valid-refresh-token';
    const mockRefreshPayload = {
      sub: 'user-123',
      email: 'test@example.com',
      type: 'refresh',
    };

    const mockStoredRefreshToken = new TokenEntity(
      validRefreshToken,
      'REFRESH',
      new Date(Date.now() + 86400000), // 1 day from now
      'user-123',
    );

    it('should validate refresh token successfully', async () => {
      // Arrange
      mockTokenService.validateRefreshToken.mockResolvedValue(mockRefreshPayload);
      mockAuthRepository.findTokenByValue.mockResolvedValue(mockStoredRefreshToken);
      mockAuthRepository.findUserById.mockResolvedValue(testUser);

      // Act
      const result = await useCase.validateRefreshToken(validRefreshToken);

      // Assert
      expect(result).toBe(testUser);
      expect(mockTokenService.validateRefreshToken).toHaveBeenCalledWith(validRefreshToken);
      expect(mockAuthRepository.findTokenByValue).toHaveBeenCalledWith(validRefreshToken);
      expect(mockAuthRepository.findUserById).toHaveBeenCalledWith('user-123');
    });

    it('should return null when token service validation fails', async () => {
      // Arrange
      mockTokenService.validateRefreshToken.mockResolvedValue(null);

      // Act
      const result = await useCase.validateRefreshToken(validRefreshToken);

      // Assert
      expect(result).toBeNull();
    });

    it('should handle and log errors gracefully', async () => {
      // Arrange
      const error = new Error('Refresh validation error');
      mockTokenService.validateRefreshToken.mockRejectedValue(error);

      // Act
      const result = await useCase.validateRefreshToken(validRefreshToken);

      // Assert
      expect(result).toBeNull();
      expect(mockLogger.error).toHaveBeenCalledWith('Error validating refresh token', error);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle null/undefined inputs gracefully', async () => {
      // Act & Assert - Login
      await expect(useCase.login(null as any)).rejects.toThrow(BadRequestException);
      await expect(useCase.login(undefined as any)).rejects.toThrow(BadRequestException);

      // Act & Assert - Register
      await expect(useCase.register(null as any)).rejects.toThrow(BadRequestException);
      await expect(useCase.register(undefined as any)).rejects.toThrow(BadRequestException);

      // Act & Assert - RefreshToken
      await expect(useCase.refreshToken(null as any)).rejects.toThrow(BadRequestException);
      await expect(useCase.refreshToken(undefined as any)).rejects.toThrow(BadRequestException);
    });

    it('should handle repository failures during login', async () => {
      // Arrange
      const loginInput = { email: 'test@example.com', password: 'password123', rememberMe: false };
      mockAuthRepository.findUserByEmail.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await expect(useCase.login(loginInput)).rejects.toThrow('Database connection failed');
    });

    it('should handle token generation failures during registration', async () => {
      // Arrange
      const registerInput = { email: 'new@example.com', password: 'password123', name: 'New User' };
      const newUser = UserEntity.create({
        id: 'new-user',
        email: 'new@example.com',
        name: 'New User',
        password: 'hashed-password',
      });

      mockAuthRepository.findUserByEmail.mockResolvedValue(null);
      mockPasswordService.hash.mockResolvedValue('hashed-password');
      mockAuthRepository.createUser.mockResolvedValue(newUser);
      mockTokenService.generateAccessToken.mockResolvedValue('access-token');
      mockTokenService.generateRefreshToken.mockRejectedValue(new Error('Token generation failed'));

      // Act & Assert
      await expect(useCase.register(registerInput)).rejects.toThrow('Token generation failed');
    });

    it('should handle special characters in email addresses', async () => {
      // Arrange
      const specialEmailInput = {
        email: 'test+special.chars@sub-domain.example-site.com',
        password: 'password123',
        rememberMe: false,
      };

      mockAuthRepository.findUserByEmail.mockResolvedValue(testUser);
      mockAuthRepository.getPasswordHash.mockResolvedValue('hashed-password');
      mockPasswordService.verify.mockResolvedValue(true);
      mockTokenService.generateAccessToken.mockResolvedValue('token');
      mockTokenService.generateRefreshToken.mockResolvedValue('refresh');

      // Act
      await useCase.login(specialEmailInput);

      // Assert
      expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledWith(
        'test+special.chars@sub-domain.example-site.com',
      );
    });

    it('should handle very long passwords', async () => {
      // Arrange
      const longPassword = 'a'.repeat(1000);
      const loginInput = { email: 'test@example.com', password: longPassword, rememberMe: false };

      mockAuthRepository.findUserByEmail.mockResolvedValue(testUser);
      mockAuthRepository.getPasswordHash.mockResolvedValue('hashed-password');
      mockPasswordService.verify.mockResolvedValue(true);
      mockTokenService.generateAccessToken.mockResolvedValue('token');
      mockTokenService.generateRefreshToken.mockResolvedValue('refresh');

      // Act
      await useCase.login(loginInput);

      // Assert
      expect(mockPasswordService.verify).toHaveBeenCalledWith(longPassword, 'hashed-password');
    });

    it('should handle concurrent login attempts', async () => {
      // Arrange
      const loginInput = { email: 'test@example.com', password: 'password123', rememberMe: false };
      mockAuthRepository.findUserByEmail.mockResolvedValue(testUser);
      mockAuthRepository.getPasswordHash.mockResolvedValue('hashed-password');
      mockPasswordService.verify.mockResolvedValue(true);
      mockTokenService.generateAccessToken.mockResolvedValue('access-token');
      mockTokenService.generateRefreshToken.mockResolvedValue('refresh-token');

      // Act
      const promises = Array(5)
        .fill(null)
        .map(() => useCase.login(loginInput));
      const results = await Promise.all(promises);

      // Assert
      expect(results).toHaveLength(5);
      results.forEach((result) => {
        expect(result).toHaveProperty('user');
        expect(result).toHaveProperty('accessToken');
        expect(result).toHaveProperty('refreshToken');
      });

      // Verify methods were called for each request
      expect(mockAuthRepository.findUserByEmail).toHaveBeenCalledTimes(5);
      expect(mockPasswordService.verify).toHaveBeenCalledTimes(5);
    });
  });
});
