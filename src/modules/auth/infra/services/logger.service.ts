import { Injectable } from '@nestjs/common';

import { ILoggerService } from '../../domain/contracts/services/logger-service.contract';

@Injectable()
export class LoggerService implements ILoggerService {
  private formatMessage(level: string, message: string, context?: any): string {
    const timestamp = new Date().toISOString();
    let contextStr = '';

    if (context !== undefined) {
      try {
        contextStr = ` | Context: ${JSON.stringify(context)}`;
      } catch (error) {
        // Handle circular references
        contextStr = ` | Context: [Circular Reference]`;
      }
    }

    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  debug(message: string, context?: any): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: any): void {
    console.info(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: any): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: Error, context?: any): void {
    const errorContext = error ? { ...context, error: error.message, stack: error.stack } : context;
    console.error(this.formatMessage('error', message, errorContext));
  }
}
