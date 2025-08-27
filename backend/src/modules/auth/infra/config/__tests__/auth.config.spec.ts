import { AuthConfig } from '../auth.config';

describe('AuthConfig', () => {
  let config: AuthConfig;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Backup original environment
    originalEnv = { ...process.env };
    config = new AuthConfig();
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('default values', () => {
    it('should have correct default accessTokenExpirationMinutes', () => {
      expect(config.accessTokenExpirationMinutes).toBe(15);
    });

    it('should have correct default refreshTokenExpirationDays', () => {
      expect(config.refreshTokenExpirationDays).toBe(7);
    });

    it('should have correct default refreshTokenLongLivedDays', () => {
      expect(config.refreshTokenLongLivedDays).toBe(30);
    });

    it('should have correct default bcryptSaltRounds', () => {
      expect(config.bcryptSaltRounds).toBe(12);
    });

    it('should have correct default jwtIssuer', () => {
      expect(config.jwtIssuer).toBe('evolution-api');
    });

    it('should have correct default jwtAudience', () => {
      expect(config.jwtAudience).toBe('evolution-api-users');
    });

    it('should use default JWT secret when environment variable is not set', () => {
      // Arrange
      delete process.env.JWT_SECRET;
      const newConfig = new AuthConfig();

      // Assert
      expect(newConfig.jwtSecret).toBe('your-secret-key-here');
    });

    it('should use environment JWT secret when available', () => {
      // Arrange
      process.env.JWT_SECRET = 'custom-secret-from-env';
      const newConfig = new AuthConfig();

      // Assert
      expect(newConfig.jwtSecret).toBe('custom-secret-from-env');
    });
  });

  describe('environment variable handling', () => {
    it('should use empty string JWT secret when environment variable is empty', () => {
      // Arrange
      process.env.JWT_SECRET = '';
      const newConfig = new AuthConfig();

      // Assert
      expect(newConfig.jwtSecret).toBe('your-secret-key-here'); // Falls back to default
    });

    it('should use JWT secret with special characters', () => {
      // Arrange
      process.env.JWT_SECRET = 'secret!@#$%^&*()_+-={}[]|\\:";\'<>?,./ 🔐';
      const newConfig = new AuthConfig();

      // Assert
      expect(newConfig.jwtSecret).toBe('secret!@#$%^&*()_+-={}[]|\\:";\'<>?,./ 🔐');
    });

    it('should use very long JWT secret', () => {
      // Arrange
      const longSecret = 'a'.repeat(1000);
      process.env.JWT_SECRET = longSecret;
      const newConfig = new AuthConfig();

      // Assert
      expect(newConfig.jwtSecret).toBe(longSecret);
      expect(newConfig.jwtSecret.length).toBe(1000);
    });

    it('should handle undefined environment variable', () => {
      // Arrange
      process.env.JWT_SECRET = undefined;
      const newConfig = new AuthConfig();

      // Assert
      expect(newConfig.jwtSecret).toBe('your-secret-key-here');
    });
  });

  describe('properties', () => {
    it('should have accessTokenExpirationMinutes property', () => {
      // Assert
      expect(config).toHaveProperty('accessTokenExpirationMinutes');
      expect(typeof config.accessTokenExpirationMinutes).toBe('number');
    });

    it('should have refreshTokenExpirationDays property', () => {
      // Assert
      expect(config).toHaveProperty('refreshTokenExpirationDays');
      expect(typeof config.refreshTokenExpirationDays).toBe('number');
    });

    it('should have refreshTokenLongLivedDays property', () => {
      // Assert
      expect(config).toHaveProperty('refreshTokenLongLivedDays');
      expect(typeof config.refreshTokenLongLivedDays).toBe('number');
    });

    it('should have bcryptSaltRounds property', () => {
      // Assert
      expect(config).toHaveProperty('bcryptSaltRounds');
      expect(typeof config.bcryptSaltRounds).toBe('number');
    });

    it('should have jwtSecret property', () => {
      // Assert
      expect(config).toHaveProperty('jwtSecret');
      expect(typeof config.jwtSecret).toBe('string');
    });

    it('should have jwtIssuer property', () => {
      // Assert
      expect(config).toHaveProperty('jwtIssuer');
      expect(typeof config.jwtIssuer).toBe('string');
    });

    it('should have jwtAudience property', () => {
      // Assert
      expect(config).toHaveProperty('jwtAudience');
      expect(typeof config.jwtAudience).toBe('string');
    });
  });

  describe('value types', () => {
    it('should have numeric accessTokenExpirationMinutes', () => {
      expect(typeof config.accessTokenExpirationMinutes).toBe('number');
      expect(config.accessTokenExpirationMinutes).toBeGreaterThan(0);
    });

    it('should have numeric refreshTokenExpirationDays', () => {
      expect(typeof config.refreshTokenExpirationDays).toBe('number');
      expect(config.refreshTokenExpirationDays).toBeGreaterThan(0);
    });

    it('should have numeric refreshTokenLongLivedDays', () => {
      expect(typeof config.refreshTokenLongLivedDays).toBe('number');
      expect(config.refreshTokenLongLivedDays).toBeGreaterThan(0);
    });

    it('should have numeric bcryptSaltRounds', () => {
      expect(typeof config.bcryptSaltRounds).toBe('number');
      expect(config.bcryptSaltRounds).toBeGreaterThan(0);
    });

    it('should have string jwtSecret', () => {
      expect(typeof config.jwtSecret).toBe('string');
      expect(config.jwtSecret.length).toBeGreaterThan(0);
    });

    it('should have string jwtIssuer', () => {
      expect(typeof config.jwtIssuer).toBe('string');
      expect(config.jwtIssuer.length).toBeGreaterThan(0);
    });

    it('should have string jwtAudience', () => {
      expect(typeof config.jwtAudience).toBe('string');
      expect(config.jwtAudience.length).toBeGreaterThan(0);
    });
  });

  describe('logical relationships', () => {
    it('should have refreshTokenLongLivedDays greater than refreshTokenExpirationDays', () => {
      expect(config.refreshTokenLongLivedDays).toBeGreaterThan(config.refreshTokenExpirationDays);
    });

    it('should have reasonable token expiration times', () => {
      // Access token should be relatively short (< 1 hour)
      expect(config.accessTokenExpirationMinutes).toBeLessThan(60);

      // Refresh token should be at least 1 day
      expect(config.refreshTokenExpirationDays).toBeGreaterThanOrEqual(1);

      // Long-lived refresh token should be at least a week
      expect(config.refreshTokenLongLivedDays).toBeGreaterThanOrEqual(7);
    });

    it('should have reasonable bcrypt salt rounds', () => {
      // Salt rounds should be secure but not too slow
      expect(config.bcryptSaltRounds).toBeGreaterThanOrEqual(10);
      expect(config.bcryptSaltRounds).toBeLessThanOrEqual(15);
    });
  });

  describe('instantiation', () => {
    it('should be instantiable', () => {
      expect(config).toBeInstanceOf(AuthConfig);
    });

    it('should create multiple instances with same values', () => {
      const config1 = new AuthConfig();
      const config2 = new AuthConfig();

      expect(config1.accessTokenExpirationMinutes).toBe(config2.accessTokenExpirationMinutes);
      expect(config1.refreshTokenExpirationDays).toBe(config2.refreshTokenExpirationDays);
      expect(config1.refreshTokenLongLivedDays).toBe(config2.refreshTokenLongLivedDays);
      expect(config1.bcryptSaltRounds).toBe(config2.bcryptSaltRounds);
      expect(config1.jwtSecret).toBe(config2.jwtSecret);
      expect(config1.jwtIssuer).toBe(config2.jwtIssuer);
      expect(config1.jwtAudience).toBe(config2.jwtAudience);
    });

    it('should not be affected by changes to process.env after instantiation', () => {
      // Arrange
      process.env.JWT_SECRET = 'initial-secret';
      const configBeforeChange = new AuthConfig();
      const initialSecret = configBeforeChange.jwtSecret;

      // Act
      process.env.JWT_SECRET = 'changed-secret';
      const configAfterChange = new AuthConfig();

      // Assert
      expect(configBeforeChange.jwtSecret).toBe('initial-secret'); // Should not change
      expect(configAfterChange.jwtSecret).toBe('changed-secret'); // Should use new value
      expect(initialSecret).toBe('initial-secret');
    });
  });

  describe('interface compliance', () => {
    it('should implement IAuthConfig interface', () => {
      // This test ensures all required properties exist
      expect(config).toHaveProperty('accessTokenExpirationMinutes');
      expect(config).toHaveProperty('refreshTokenExpirationDays');
      expect(config).toHaveProperty('refreshTokenLongLivedDays');
      expect(config).toHaveProperty('bcryptSaltRounds');
      expect(config).toHaveProperty('jwtSecret');
      expect(config).toHaveProperty('jwtIssuer');
      expect(config).toHaveProperty('jwtAudience');
    });

    it('should have all properties with correct types', () => {
      expect(typeof config.accessTokenExpirationMinutes).toBe('number');
      expect(typeof config.refreshTokenExpirationDays).toBe('number');
      expect(typeof config.refreshTokenLongLivedDays).toBe('number');
      expect(typeof config.bcryptSaltRounds).toBe('number');
      expect(typeof config.jwtSecret).toBe('string');
      expect(typeof config.jwtIssuer).toBe('string');
      expect(typeof config.jwtAudience).toBe('string');
    });
  });
});
