import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { PasswordService } from '../password.service';
import { IAuthConfig } from '../../../domain/contracts/config/auth-config.contract';
import { AUTH_CONFIG_TOKEN } from '../../../../../shared/constants/di-constants';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('PasswordService', () => {
  let service: PasswordService;
  let mockAuthConfig: jest.Mocked<IAuthConfig>;

  beforeEach(async () => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock AuthConfig
    mockAuthConfig = {
      bcryptSaltRounds: 12,
      accessTokenExpirationMinutes: 15,
      refreshTokenExpirationDays: 7,
      refreshTokenLongLivedDays: 30,
      jwtSecret: 'test-secret',
      jwtIssuer: 'test-issuer',
      jwtAudience: 'test-audience',
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordService,
        {
          provide: AUTH_CONFIG_TOKEN,
          useValue: mockAuthConfig,
        },
      ],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('hash', () => {
    it('should hash password using bcrypt with correct salt rounds', async () => {
      // Arrange
      const password = 'testPassword123';
      const hashedPassword = 'hashedPassword123';
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);

      // Act
      const result = await service.hash(password);

      // Assert
      expect(mockedBcrypt.hash).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(password, 12);
      expect(result).toBe(hashedPassword);
    });

    it('should handle empty password', async () => {
      // Arrange
      const password = '';
      const hashedPassword = 'hashedEmptyPassword';
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);

      // Act
      const result = await service.hash(password);

      // Assert
      expect(mockedBcrypt.hash).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(password, 12);
      expect(result).toBe(hashedPassword);
    });

    it('should handle special characters in password', async () => {
      // Arrange
      const password = '!@#$%^&*()_+{}|:"<>?[]\\;\',./-=`~';
      const hashedPassword = 'hashedSpecialPassword';
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);

      // Act
      const result = await service.hash(password);

      // Assert
      expect(mockedBcrypt.hash).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(password, 12);
      expect(result).toBe(hashedPassword);
    });

    it('should throw error when bcrypt.hash fails', async () => {
      // Arrange
      const password = 'testPassword123';
      const error = new Error('Bcrypt hash failed');
      mockedBcrypt.hash.mockRejectedValue(error as never);

      // Act & Assert
      await expect(service.hash(password)).rejects.toThrow('Bcrypt hash failed');
      expect(mockedBcrypt.hash).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(password, 12);
    });

    it('should use correct salt rounds from config', async () => {
      // Arrange
      const customConfig = {
        ...mockAuthConfig,
        bcryptSaltRounds: 8, // Different salt rounds
      };
      const password = 'testPassword123';
      const hashedPassword = 'hashedPassword123';
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);

      // Recreate service with new config
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          PasswordService,
          {
            provide: AUTH_CONFIG_TOKEN,
            useValue: customConfig,
          },
        ],
      }).compile();

      const newService = module.get<PasswordService>(PasswordService);

      // Act
      const result = await newService.hash(password);

      // Assert
      expect(mockedBcrypt.hash).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(password, 8);
      expect(result).toBe(hashedPassword);
    });
  });

  describe('verify', () => {
    it('should verify password successfully when passwords match', async () => {
      // Arrange
      const password = 'testPassword123';
      const hash = 'hashedPassword123';
      mockedBcrypt.compare.mockResolvedValue(true as never);

      // Act
      const result = await service.verify(password, hash);

      // Assert
      expect(mockedBcrypt.compare).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(true);
    });

    it('should return false when passwords do not match', async () => {
      // Arrange
      const password = 'testPassword123';
      const hash = 'differentHashedPassword';
      mockedBcrypt.compare.mockResolvedValue(false as never);

      // Act
      const result = await service.verify(password, hash);

      // Assert
      expect(mockedBcrypt.compare).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(false);
    });

    it('should handle empty password', async () => {
      // Arrange
      const password = '';
      const hash = 'hashedPassword123';
      mockedBcrypt.compare.mockResolvedValue(false as never);

      // Act
      const result = await service.verify(password, hash);

      // Assert
      expect(mockedBcrypt.compare).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(false);
    });

    it('should handle empty hash', async () => {
      // Arrange
      const password = 'testPassword123';
      const hash = '';
      mockedBcrypt.compare.mockResolvedValue(false as never);

      // Act
      const result = await service.verify(password, hash);

      // Assert
      expect(mockedBcrypt.compare).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(false);
    });

    it('should handle special characters in password', async () => {
      // Arrange
      const password = '!@#$%^&*()_+{}|:"<>?[]\\;\',./-=`~';
      const hash = 'hashedSpecialPassword';
      mockedBcrypt.compare.mockResolvedValue(true as never);

      // Act
      const result = await service.verify(password, hash);

      // Assert
      expect(mockedBcrypt.compare).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(true);
    });

    it('should throw error when bcrypt.compare fails', async () => {
      // Arrange
      const password = 'testPassword123';
      const hash = 'hashedPassword123';
      const error = new Error('Bcrypt compare failed');
      mockedBcrypt.compare.mockRejectedValue(error as never);

      // Act & Assert
      await expect(service.verify(password, hash)).rejects.toThrow('Bcrypt compare failed');
      expect(mockedBcrypt.compare).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(password, hash);
    });
  });

  describe('edge cases', () => {
    it('should handle very long passwords', async () => {
      // Arrange
      const longPassword = 'a'.repeat(1000);
      const hashedPassword = 'hashedLongPassword';
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);

      // Act
      const result = await service.hash(longPassword);

      // Assert
      expect(mockedBcrypt.hash).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(longPassword, 12);
      expect(result).toBe(hashedPassword);
    });

    it('should handle unicode characters in password', async () => {
      // Arrange
      const unicodePassword = '测试密码🔒🚀';
      const hashedPassword = 'hashedUnicodePassword';
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);

      // Act
      const result = await service.hash(unicodePassword);

      // Assert
      expect(mockedBcrypt.hash).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(unicodePassword, 12);
      expect(result).toBe(hashedPassword);
    });

    it('should handle null/undefined inputs gracefully', async () => {
      // Arrange
      const password = null as any;
      const hash = 'hashedPassword';
      mockedBcrypt.compare.mockResolvedValue(false as never);

      // Act
      const result = await service.verify(password, hash);

      // Assert
      expect(mockedBcrypt.compare).toHaveBeenCalledTimes(1);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(false);
    });
  });
});
