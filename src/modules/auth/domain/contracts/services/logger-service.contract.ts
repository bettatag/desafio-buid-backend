export interface ILoggerService {
  /**
   * Log debug information
   * @param message Debug message
   * @param context Optional context data
   */
  debug(message: string, context?: any): void;

  /**
   * Log informational message
   * @param message Info message
   * @param context Optional context data
   */
  info(message: string, context?: any): void;

  /**
   * Log warning message
   * @param message Warning message
   * @param context Optional context data
   */
  warn(message: string, context?: any): void;

  /**
   * Log error message
   * @param message Error message
   * @param error Optional error object
   * @param context Optional context data
   */
  error(message: string, error?: Error, context?: any): void;
}
