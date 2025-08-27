import { LoggerService } from '../logger.service';

// Mock console methods
const mockConsole = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock Date to control timestamps
const mockDate = new Date('2024-01-01T12:00:00.000Z');

describe('LoggerService', () => {
  let service: LoggerService;
  let originalConsole: typeof console;
  let originalNodeEnv: string | undefined;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock Date
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

    // Backup original console and environment
    originalConsole = global.console;
    originalNodeEnv = process.env.NODE_ENV;

    // Replace console methods with mocks
    global.console = {
      ...originalConsole,
      ...mockConsole,
    };

    service = new LoggerService();
  });

  afterEach(() => {
    // Restore original console and environment
    global.console = originalConsole;
    process.env.NODE_ENV = originalNodeEnv;
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('should format message with timestamp and level', () => {
      // Act
      const result = (service as any).formatMessage('info', 'Test message');

      // Assert
      expect(result).toBe('[2024-01-01T12:00:00.000Z] [INFO] Test message');
    });

    it('should format message with context', () => {
      // Arrange
      const context = { userId: '123', action: 'login' };

      // Act
      const result = (service as any).formatMessage('error', 'Test message', context);

      // Assert
      expect(result).toBe(
        '[2024-01-01T12:00:00.000Z] [ERROR] Test message | Context: {"userId":"123","action":"login"}',
      );
    });

    it('should handle empty context', () => {
      // Act
      const result = (service as any).formatMessage('warn', 'Test message', {});

      // Assert
      expect(result).toBe('[2024-01-01T12:00:00.000Z] [WARN] Test message | Context: {}');
    });

    it('should handle null context', () => {
      // Act
      const result = (service as any).formatMessage('debug', 'Test message', null);

      // Assert
      expect(result).toBe('[2024-01-01T12:00:00.000Z] [DEBUG] Test message | Context: null');
    });

    it('should handle complex nested context', () => {
      // Arrange
      const complexContext = {
        user: { id: '123', name: 'Test User' },
        metadata: { ip: '127.0.0.1', userAgent: 'test-agent' },
        nested: { deep: { value: 'test' } },
      };

      // Act
      const result = (service as any).formatMessage('info', 'Complex message', complexContext);

      // Assert
      expect(result).toContain('[INFO] Complex message | Context:');
      expect(result).toContain('"user":{"id":"123","name":"Test User"}');
      expect(result).toContain('"nested":{"deep":{"value":"test"}}');
    });
  });

  describe('debug', () => {
    it('should log debug message in development environment', () => {
      // Arrange
      process.env.NODE_ENV = 'development';
      const message = 'Debug message';
      const context = { debugInfo: 'test' };

      // Act
      service.debug(message, context);

      // Assert
      expect(mockConsole.debug).toHaveBeenCalledTimes(1);
      expect(mockConsole.debug).toHaveBeenCalledWith(
        '[2024-01-01T12:00:00.000Z] [DEBUG] Debug message | Context: {"debugInfo":"test"}',
      );
    });

    it('should not log debug message in production environment', () => {
      // Arrange
      process.env.NODE_ENV = 'production';
      const message = 'Debug message';

      // Act
      service.debug(message);

      // Assert
      expect(mockConsole.debug).not.toHaveBeenCalled();
    });

    it('should log debug message when NODE_ENV is undefined', () => {
      // Arrange
      delete process.env.NODE_ENV;
      const message = 'Debug message';

      // Act
      service.debug(message);

      // Assert
      expect(mockConsole.debug).toHaveBeenCalledTimes(1);
      expect(mockConsole.debug).toHaveBeenCalledWith(
        '[2024-01-01T12:00:00.000Z] [DEBUG] Debug message',
      );
    });

    it('should log debug message in test environment', () => {
      // Arrange
      process.env.NODE_ENV = 'test';
      const message = 'Debug message';

      // Act
      service.debug(message);

      // Assert
      expect(mockConsole.debug).toHaveBeenCalledTimes(1);
    });

    it('should handle empty debug message', () => {
      // Arrange
      process.env.NODE_ENV = 'development';

      // Act
      service.debug('');

      // Assert
      expect(mockConsole.debug).toHaveBeenCalledWith('[2024-01-01T12:00:00.000Z] [DEBUG] ');
    });
  });

  describe('info', () => {
    it('should log info message', () => {
      // Arrange
      const message = 'Info message';
      const context = { infoData: 'test' };

      // Act
      service.info(message, context);

      // Assert
      expect(mockConsole.info).toHaveBeenCalledTimes(1);
      expect(mockConsole.info).toHaveBeenCalledWith(
        '[2024-01-01T12:00:00.000Z] [INFO] Info message | Context: {"infoData":"test"}',
      );
    });

    it('should log info message without context', () => {
      // Arrange
      const message = 'Simple info message';

      // Act
      service.info(message);

      // Assert
      expect(mockConsole.info).toHaveBeenCalledTimes(1);
      expect(mockConsole.info).toHaveBeenCalledWith(
        '[2024-01-01T12:00:00.000Z] [INFO] Simple info message',
      );
    });

    it('should log info message in production environment', () => {
      // Arrange
      process.env.NODE_ENV = 'production';
      const message = 'Production info';

      // Act
      service.info(message);

      // Assert
      expect(mockConsole.info).toHaveBeenCalledTimes(1);
      expect(mockConsole.info).toHaveBeenCalledWith(
        '[2024-01-01T12:00:00.000Z] [INFO] Production info',
      );
    });

    it('should handle special characters in info message', () => {
      // Arrange
      const message = 'Info with special chars: !@#$%^&*()_+{}|:"<>?[]\\;\',./-=`~';

      // Act
      service.info(message);

      // Assert
      expect(mockConsole.info).toHaveBeenCalledWith(
        '[2024-01-01T12:00:00.000Z] [INFO] Info with special chars: !@#$%^&*()_+{}|:"<>?[]\\;\',./-=`~',
      );
    });
  });

  describe('warn', () => {
    it('should log warning message', () => {
      // Arrange
      const message = 'Warning message';
      const context = { warningType: 'validation' };

      // Act
      service.warn(message, context);

      // Assert
      expect(mockConsole.warn).toHaveBeenCalledTimes(1);
      expect(mockConsole.warn).toHaveBeenCalledWith(
        '[2024-01-01T12:00:00.000Z] [WARN] Warning message | Context: {"warningType":"validation"}',
      );
    });

    it('should log warning message without context', () => {
      // Arrange
      const message = 'Simple warning';

      // Act
      service.warn(message);

      // Assert
      expect(mockConsole.warn).toHaveBeenCalledTimes(1);
      expect(mockConsole.warn).toHaveBeenCalledWith(
        '[2024-01-01T12:00:00.000Z] [WARN] Simple warning',
      );
    });

    it('should log warning in all environments', () => {
      // Test in production
      process.env.NODE_ENV = 'production';
      service.warn('Production warning');
      expect(mockConsole.warn).toHaveBeenCalledTimes(1);

      // Reset and test in development
      mockConsole.warn.mockClear();
      process.env.NODE_ENV = 'development';
      service.warn('Development warning');
      expect(mockConsole.warn).toHaveBeenCalledTimes(1);
    });
  });

  describe('error', () => {
    it('should log error message with error object', () => {
      // Arrange
      const message = 'Error occurred';
      const error = new Error('Test error');
      const context = { userId: '123' };

      // Act
      service.error(message, error, context);

      // Assert
      expect(mockConsole.error).toHaveBeenCalledTimes(1);
      const loggedMessage = mockConsole.error.mock.calls[0][0];
      expect(loggedMessage).toContain('[ERROR] Error occurred | Context:');
      expect(loggedMessage).toContain('"userId":"123"');
      expect(loggedMessage).toContain('"error":"Test error"');
      expect(loggedMessage).toContain('"stack"');
    });

    it('should log error message without error object', () => {
      // Arrange
      const message = 'Error without error object';
      const context = { action: 'test' };

      // Act
      service.error(message, undefined, context);

      // Assert
      expect(mockConsole.error).toHaveBeenCalledTimes(1);
      expect(mockConsole.error).toHaveBeenCalledWith(
        '[2024-01-01T12:00:00.000Z] [ERROR] Error without error object | Context: {"action":"test"}',
      );
    });

    it('should log error message without context', () => {
      // Arrange
      const message = 'Simple error';
      const error = new Error('Simple test error');

      // Act
      service.error(message, error);

      // Assert
      expect(mockConsole.error).toHaveBeenCalledTimes(1);
      const loggedMessage = mockConsole.error.mock.calls[0][0];
      expect(loggedMessage).toContain('[ERROR] Simple error | Context:');
      expect(loggedMessage).toContain('"error":"Simple test error"');
    });

    it('should handle error with custom properties', () => {
      // Arrange
      const message = 'Custom error';
      const customError = new Error('Custom error message');
      (customError as any).code = 'CUSTOM_ERROR_CODE';
      (customError as any).statusCode = 500;

      // Act
      service.error(message, customError);

      // Assert
      expect(mockConsole.error).toHaveBeenCalledTimes(1);
      const loggedMessage = mockConsole.error.mock.calls[0][0];
      expect(loggedMessage).toContain('"error":"Custom error message"');
      expect(loggedMessage).toContain('"stack"');
    });

    it('should merge error context with provided context', () => {
      // Arrange
      const message = 'Merged context error';
      const error = new Error('Test error for merge');
      const context = { userId: '456', action: 'merge-test' };

      // Act
      service.error(message, error, context);

      // Assert
      expect(mockConsole.error).toHaveBeenCalledTimes(1);
      const loggedMessage = mockConsole.error.mock.calls[0][0];
      expect(loggedMessage).toContain('"userId":"456"');
      expect(loggedMessage).toContain('"action":"merge-test"');
      expect(loggedMessage).toContain('"error":"Test error for merge"');
    });

    it('should log error in all environments', () => {
      // Test in production
      process.env.NODE_ENV = 'production';
      service.error('Production error');
      expect(mockConsole.error).toHaveBeenCalledTimes(1);

      // Reset and test in development
      mockConsole.error.mockClear();
      process.env.NODE_ENV = 'development';
      service.error('Development error');
      expect(mockConsole.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('edge cases', () => {
    it('should handle very long messages', () => {
      // Arrange
      const longMessage = 'a'.repeat(10000);

      // Act
      service.info(longMessage);

      // Assert
      expect(mockConsole.info).toHaveBeenCalledTimes(1);
      expect(mockConsole.info.mock.calls[0][0]).toContain(longMessage);
    });

    it('should handle unicode characters in messages', () => {
      // Arrange
      const unicodeMessage = '测试消息 🚀 🔒 ✅';

      // Act
      service.info(unicodeMessage);

      // Assert
      expect(mockConsole.info).toHaveBeenCalledTimes(1);
      expect(mockConsole.info.mock.calls[0][0]).toContain(unicodeMessage);
    });

    it('should handle circular references in context', () => {
      // Arrange
      const circularContext: any = { name: 'circular' };
      circularContext.self = circularContext;

      // Act & Assert - Should not throw
      expect(() => service.info('Circular context test', circularContext)).not.toThrow();
      expect(mockConsole.info).toHaveBeenCalledTimes(1);
      expect(mockConsole.info.mock.calls[0][0]).toContain('[Circular Reference]');
    });

    it('should handle null and undefined messages', () => {
      // Act
      service.info(null as any);
      service.info(undefined as any);

      // Assert
      expect(mockConsole.info).toHaveBeenCalledTimes(2);
      expect(mockConsole.info.mock.calls[0][0]).toContain('[INFO] null');
      expect(mockConsole.info.mock.calls[1][0]).toContain('[INFO] undefined');
    });

    it('should handle context with functions', () => {
      // Arrange
      const contextWithFunction = {
        userId: '123',
        callback: () => 'test',
        nested: { func: function namedFunc() {} },
      };

      // Act
      service.info('Context with functions', contextWithFunction);

      // Assert
      expect(mockConsole.info).toHaveBeenCalledTimes(1);
      // Functions should be serialized by JSON.stringify
      expect(mockConsole.info.mock.calls[0][0]).toContain('"userId":"123"');
    });

    it('should handle Date objects in context', () => {
      // Arrange
      const dateContext = {
        timestamp: mockDate, // Use the mocked date
        userId: '123',
      };

      // Act
      service.info('Date context test', dateContext);

      // Assert
      expect(mockConsole.info).toHaveBeenCalledTimes(1);
      expect(mockConsole.info.mock.calls[0][0]).toContain('"timestamp":"2024-01-01T12:00:00.000Z"');
    });
  });
});
