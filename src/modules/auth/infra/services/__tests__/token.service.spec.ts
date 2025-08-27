import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { TokenService } from '../token.service';
import { UserEntity } from '../../../domain/entities/user.entity';
import { IAuthConfig } from '../../../domain/contracts/config/auth-config.contract';
import { AUTH_CONFIG_TOKEN } from '../../../../../shared/constants/di-constants';

describe('TokenService', () => {
  let service: TokenService;
  let mockJwtService: jest.Mocked<JwtService>;
  let mockAuthConfig: jest.Mocked<IAuthConfig>;
  let testUser: UserEntity;

  beforeEach(async () => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock JwtService
    mockJwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    } as any;

    // Mock AuthConfig
    mockAuthConfig = {
      accessTokenExpirationMinutes: 15,
      refreshTokenExpirationDays: 7,
      refreshTokenLongLivedDays: 30,
      bcryptSaltRounds: 12,
      jwtSecret: 'test-secret',
      jwtIssuer: 'test-issuer',
      jwtAudience: 'test-audience',
    };

    // Test user
    testUser = UserEntity.create({
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashed-password',
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: AUTH_CONFIG_TOKEN,
          useValue: mockAuthConfig,
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('generateAccessToken', () => {
    it('should generate access token with correct payload and options', async () => {
      // Arrange
      const expectedToken = 'access-token-123';
      mockJwtService.signAsync.mockResolvedValue(expectedToken);

      // Act
      const result = await service.generateAccessToken(testUser);

      // Assert
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(1);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        {
          sub: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          type: 'access',
        },
        {
          expiresIn: '15m',
          issuer: 'test-issuer',
          audience: 'test-audience',
        },
      );
      expect(result).toBe(expectedToken);
    });

    it('should handle user with minimal data', async () => {
      // Arrange
      const minimalUser = UserEntity.create({
        id: 'minimal-user',
        email: 'minimal@test.com',
        name: 'M',
        password: 'hash',
      });
      const expectedToken = 'minimal-access-token';
      mockJwtService.signAsync.mockResolvedValue(expectedToken);

      // Act
      const result = await service.generateAccessToken(minimalUser);

      // Assert
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(1);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        {
          sub: 'minimal-user',
          email: 'minimal@test.com',
          name: 'M',
          type: 'access',
        },
        {
          expiresIn: '15m',
          issuer: 'test-issuer',
          audience: 'test-audience',
        },
      );
      expect(result).toBe(expectedToken);
    });

    it('should throw error when JWT signing fails', async () => {
      // Arrange
      const error = new Error('JWT signing failed');
      mockJwtService.signAsync.mockRejectedValue(error);

      // Act & Assert
      await expect(service.generateAccessToken(testUser)).rejects.toThrow('JWT signing failed');
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(1);
    });

    it('should use config values for expiration and issuer/audience', async () => {
      // Arrange
      const customConfig = {
        ...mockAuthConfig,
        accessTokenExpirationMinutes: 30,
        jwtIssuer: 'custom-issuer',
        jwtAudience: 'custom-audience',
      };
      const expectedToken = 'custom-access-token';
      mockJwtService.signAsync.mockResolvedValue(expectedToken);

      // Recreate service with new config
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          TokenService,
          {
            provide: JwtService,
            useValue: mockJwtService,
          },
          {
            provide: AUTH_CONFIG_TOKEN,
            useValue: customConfig,
          },
        ],
      }).compile();

      const newService = module.get<TokenService>(TokenService);

      // Act
      const result = await newService.generateAccessToken(testUser);

      // Assert
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(expect.any(Object), {
        expiresIn: '30m',
        issuer: 'custom-issuer',
        audience: 'custom-audience',
      });
      expect(result).toBe(expectedToken);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate refresh token with default expiration (7 days)', async () => {
      // Arrange
      const expectedToken = 'refresh-token-123';
      mockJwtService.signAsync.mockResolvedValue(expectedToken);

      // Act
      const result = await service.generateRefreshToken(testUser);

      // Assert
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(1);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        {
          sub: 'user-123',
          email: 'test@example.com',
          type: 'refresh',
        },
        {
          expiresIn: '7d',
          issuer: 'test-issuer',
          audience: 'test-audience',
        },
      );
      expect(result).toBe(expectedToken);
    });

    it('should generate refresh token with long-lived expiration (30 days) when longLived=true', async () => {
      // Arrange
      const expectedToken = 'long-lived-refresh-token';
      mockJwtService.signAsync.mockResolvedValue(expectedToken);

      // Act
      const result = await service.generateRefreshToken(testUser, true);

      // Assert
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(1);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        {
          sub: 'user-123',
          email: 'test@example.com',
          type: 'refresh',
        },
        {
          expiresIn: '30d',
          issuer: 'test-issuer',
          audience: 'test-audience',
        },
      );
      expect(result).toBe(expectedToken);
    });

    it('should generate refresh token with default expiration when longLived=false', async () => {
      // Arrange
      const expectedToken = 'short-lived-refresh-token';
      mockJwtService.signAsync.mockResolvedValue(expectedToken);

      // Act
      const result = await service.generateRefreshToken(testUser, false);

      // Assert
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(1);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'refresh',
        }),
        {
          expiresIn: '7d',
          issuer: 'test-issuer',
          audience: 'test-audience',
        },
      );
      expect(result).toBe(expectedToken);
    });

    it('should throw error when JWT signing fails', async () => {
      // Arrange
      const error = new Error('JWT refresh token signing failed');
      mockJwtService.signAsync.mockRejectedValue(error);

      // Act & Assert
      await expect(service.generateRefreshToken(testUser)).rejects.toThrow(
        'JWT refresh token signing failed',
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(1);
    });

    it('should use config values for expiration times', async () => {
      // Arrange
      const customConfig = {
        ...mockAuthConfig,
        refreshTokenExpirationDays: 14,
        refreshTokenLongLivedDays: 60,
      };
      const expectedToken = 'config-refresh-token';
      mockJwtService.signAsync.mockResolvedValue(expectedToken);

      // Recreate service with new config
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          TokenService,
          {
            provide: JwtService,
            useValue: mockJwtService,
          },
          {
            provide: AUTH_CONFIG_TOKEN,
            useValue: customConfig,
          },
        ],
      }).compile();

      const newService = module.get<TokenService>(TokenService);

      // Act - Test default expiration
      await newService.generateRefreshToken(testUser, false);
      expect(mockJwtService.signAsync).toHaveBeenLastCalledWith(
        expect.any(Object),
        expect.objectContaining({ expiresIn: '14d' }),
      );

      // Act - Test long-lived expiration
      await newService.generateRefreshToken(testUser, true);
      expect(mockJwtService.signAsync).toHaveBeenLastCalledWith(
        expect.any(Object),
        expect.objectContaining({ expiresIn: '60d' }),
      );
    });
  });

  describe('validateAccessToken', () => {
    it('should validate access token successfully and return payload', async () => {
      // Arrange
      const token = 'valid-access-token';
      const expectedPayload = {
        sub: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        type: 'access',
      };
      mockJwtService.verifyAsync.mockResolvedValue(expectedPayload);

      // Act
      const result = await service.validateAccessToken(token);

      // Assert
      expect(mockJwtService.verifyAsync).toHaveBeenCalledTimes(1);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(token, {
        issuer: 'test-issuer',
        audience: 'test-audience',
      });
      expect(result).toEqual(expectedPayload);
    });

    it('should return null when token has wrong type', async () => {
      // Arrange
      const token = 'refresh-token-with-wrong-type';
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        type: 'refresh', // Wrong type
      };
      mockJwtService.verifyAsync.mockResolvedValue(payload);

      // Act
      const result = await service.validateAccessToken(token);

      // Assert
      expect(mockJwtService.verifyAsync).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should return null when JWT verification fails', async () => {
      // Arrange
      const token = 'invalid-access-token';
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      // Act
      const result = await service.validateAccessToken(token);

      // Assert
      expect(mockJwtService.verifyAsync).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should return null when token is expired', async () => {
      // Arrange
      const token = 'expired-access-token';
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Token expired'));

      // Act
      const result = await service.validateAccessToken(token);

      // Assert
      expect(mockJwtService.verifyAsync).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should use correct issuer and audience for validation', async () => {
      // Arrange
      const customConfig = {
        ...mockAuthConfig,
        jwtIssuer: 'custom-validation-issuer',
        jwtAudience: 'custom-validation-audience',
      };
      const token = 'token-to-validate';
      const payload = { sub: 'user', type: 'access' };
      mockJwtService.verifyAsync.mockResolvedValue(payload);

      // Recreate service with new config
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          TokenService,
          {
            provide: JwtService,
            useValue: mockJwtService,
          },
          {
            provide: AUTH_CONFIG_TOKEN,
            useValue: customConfig,
          },
        ],
      }).compile();

      const newService = module.get<TokenService>(TokenService);

      // Act
      await newService.validateAccessToken(token);

      // Assert
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(token, {
        issuer: 'custom-validation-issuer',
        audience: 'custom-validation-audience',
      });
    });
  });

  describe('validateRefreshToken', () => {
    it('should validate refresh token successfully and return payload', async () => {
      // Arrange
      const token = 'valid-refresh-token';
      const expectedPayload = {
        sub: 'user-123',
        email: 'test@example.com',
        type: 'refresh',
      };
      mockJwtService.verifyAsync.mockResolvedValue(expectedPayload);

      // Act
      const result = await service.validateRefreshToken(token);

      // Assert
      expect(mockJwtService.verifyAsync).toHaveBeenCalledTimes(1);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(token, {
        issuer: 'test-issuer',
        audience: 'test-audience',
      });
      expect(result).toEqual(expectedPayload);
    });

    it('should return null when token has wrong type', async () => {
      // Arrange
      const token = 'access-token-with-wrong-type';
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        type: 'access', // Wrong type
      };
      mockJwtService.verifyAsync.mockResolvedValue(payload);

      // Act
      const result = await service.validateRefreshToken(token);

      // Assert
      expect(mockJwtService.verifyAsync).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should return null when JWT verification fails', async () => {
      // Arrange
      const token = 'invalid-refresh-token';
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      // Act
      const result = await service.validateRefreshToken(token);

      // Assert
      expect(mockJwtService.verifyAsync).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should return null when token is expired', async () => {
      // Arrange
      const token = 'expired-refresh-token';
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Token expired'));

      // Act
      const result = await service.validateRefreshToken(token);

      // Assert
      expect(mockJwtService.verifyAsync).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle empty token strings', async () => {
      // Arrange
      const emptyToken = '';
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Empty token'));

      // Act
      const accessResult = await service.validateAccessToken(emptyToken);
      const refreshResult = await service.validateRefreshToken(emptyToken);

      // Assert
      expect(accessResult).toBeNull();
      expect(refreshResult).toBeNull();
      expect(mockJwtService.verifyAsync).toHaveBeenCalledTimes(2);
    });

    it('should handle malformed JWT tokens', async () => {
      // Arrange
      const malformedToken = 'not.a.valid.jwt.token';
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Malformed token'));

      // Act
      const result = await service.validateAccessToken(malformedToken);

      // Assert
      expect(result).toBeNull();
      expect(mockJwtService.verifyAsync).toHaveBeenCalledTimes(1);
    });

    it('should handle user with special characters in data', async () => {
      // Arrange
      const specialUser = UserEntity.create({
        id: 'user-with-special-chars-!@#$%',
        email: 'special+chars@test-domain.co.uk',
        name: 'Special User 测试 🚀',
        password: 'special-hash',
      });
      const expectedToken = 'special-token';
      mockJwtService.signAsync.mockResolvedValue(expectedToken);

      // Act
      const result = await service.generateAccessToken(specialUser);

      // Assert
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        {
          sub: 'user-with-special-chars-!@#$%',
          email: 'special+chars@test-domain.co.uk',
          name: 'Special User 测试 🚀',
          type: 'access',
        },
        expect.any(Object),
      );
      expect(result).toBe(expectedToken);
    });

    it('should handle payload without type field', async () => {
      // Arrange
      const token = 'token-without-type';
      const payloadWithoutType = {
        sub: 'user-123',
        email: 'test@example.com',
        // Missing type field
      };
      mockJwtService.verifyAsync.mockResolvedValue(payloadWithoutType);

      // Act
      const result = await service.validateAccessToken(token);

      // Assert
      expect(result).toBeNull();
    });
  });
});
