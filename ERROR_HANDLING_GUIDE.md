# NestJS Error Handling Guide

This guide provides professional and customizable error handling patterns for our NestJS application, following best practices and leveraging NestJS built-in exception handling capabilities.

## Table of Contents

1. [Overview](#overview)
2. [Built-in HTTP Exceptions](#built-in-http-exceptions)
3. [Custom Exception Filters](#custom-exception-filters)
4. [Error Handling in Controllers](#error-handling-in-controllers)
5. [Error Handling in Services](#error-handling-in-services)
6. [Custom Business Exceptions](#custom-business-exceptions)
7. [Global Error Handling](#global-error-handling)
8. [Best Practices](#best-practices)

## Overview

NestJS provides a robust exception handling system that automatically catches and processes exceptions thrown during request processing. The framework includes built-in HTTP exceptions and supports custom exception filters for advanced error handling scenarios.

## Built-in HTTP Exceptions

NestJS provides several built-in HTTP exceptions that should be used for standard HTTP error responses:

### Common HTTP Exceptions

```typescript
import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';

// 400 Bad Request
throw new BadRequestException('Invalid input data');

// 401 Unauthorized
throw new UnauthorizedException('Authentication required');

// 403 Forbidden
throw new ForbiddenException('Insufficient permissions');

// 404 Not Found
throw new NotFoundException('Resource not found');

// 409 Conflict
throw new ConflictException('Resource already exists');

// 422 Unprocessable Entity
throw new UnprocessableEntityException('Validation failed');

// 500 Internal Server Error
throw new InternalServerErrorException('Something went wrong');
```

### Custom Error Messages and Details

```typescript
// Simple message
throw new BadRequestException('Invalid email format');

// Custom error object
throw new BadRequestException({
  statusCode: 400,
  message: 'Validation failed',
  error: 'Bad Request',
  details: {
    field: 'email',
    value: 'invalid-email',
    constraint: 'Must be a valid email address'
  }
});

// Array of error messages
throw new BadRequestException([
  'Email is required',
  'Password must be at least 8 characters',
]);
```

## Custom Exception Filters

Create custom exception filters for advanced error handling and logging:

### Global Exception Filter

```typescript
// src/shared/filters/global-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof message === 'string' ? message : (message as any).message,
      ...(typeof message === 'object' && message !== null ? message : {}),
    };

    // Log error details
    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : 'Unknown error',
      'GlobalExceptionFilter',
    );

    response.status(status).json(errorResponse);
  }
}
```

### HTTP Exception Filter

```typescript
// src/shared/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : (exceptionResponse as any).error || 'Unknown error',
      message: typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : (exceptionResponse as any).message || 'An error occurred',
      ...(typeof exceptionResponse === 'object' && exceptionResponse !== null 
        ? exceptionResponse 
        : {}),
    };

    this.logger.warn(
      `HTTP Exception: ${status} - ${request.method} ${request.url}`,
      'HttpExceptionFilter',
    );

    response.status(status).json(errorResponse);
  }
}
```

## Error Handling in Controllers

### Basic Controller Error Handling

```typescript
// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      // Validate input
      if (!id || isNaN(Number(id))) {
        throw new BadRequestException('Invalid user ID format');
      }

      const user = await this.usersService.findOne(Number(id));
      
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      this.logger.log(`User ${id} retrieved successfully`);
      return user;
    } catch (error) {
      // Re-throw HTTP exceptions
      if (error instanceof BadRequestException || 
          error instanceof NotFoundException) {
        throw error;
      }

      // Log unexpected errors
      this.logger.error(
        `Failed to retrieve user ${id}`,
        error.stack,
        'UsersController.findOne',
      );

      // Throw generic error for unexpected exceptions
      throw new InternalServerErrorException(
        'An error occurred while retrieving the user',
      );
    }
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.usersService.findByEmail(createUserDto.email);
      
      if (existingUser) {
        throw new ConflictException(
          `User with email ${createUserDto.email} already exists`,
        );
      }

      const user = await this.usersService.create(createUserDto);
      
      this.logger.log(`User created successfully: ${user.email}`);
      return user;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      this.logger.error(
        `Failed to create user: ${createUserDto.email}`,
        error.stack,
        'UsersController.create',
      );

      throw new InternalServerErrorException(
        'An error occurred while creating the user',
      );
    }
  }
}
```

### Advanced Controller Error Handling with Validation

```typescript
// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    try {
      // Validate input
      if (!loginDto.email || !loginDto.password) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: {
            email: !loginDto.email ? 'Email is required' : undefined,
            password: !loginDto.password ? 'Password is required' : undefined,
          },
        });
      }

      const result = await this.authService.validateUser(
        loginDto.email,
        loginDto.password,
      );

      if (!result) {
        throw new UnauthorizedException({
          message: 'Invalid credentials',
          error: 'Unauthorized',
          statusCode: 401,
        });
      }

      const tokens = await this.authService.generateTokens(result);
      
      this.logger.log(`User ${loginDto.email} logged in successfully`);
      return tokens;
    } catch (error) {
      if (error instanceof BadRequestException || 
          error instanceof UnauthorizedException) {
        throw error;
      }

      this.logger.error(
        `Login failed for email: ${loginDto.email}`,
        error.stack,
        'AuthController.login',
      );

      throw new InternalServerErrorException(
        'An error occurred during authentication',
      );
    }
  }
}
```

## Error Handling in Services

### Basic Service Error Handling

```typescript
// src/users/users.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(
        `Database error while finding user ${id}`,
        error.stack,
        'UsersService.findOne',
      );

      throw new InternalServerErrorException(
        'Database error occurred while retrieving user',
      );
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Check for existing user
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException(
          `User with email ${createUserDto.email} already exists`,
        );
      }

      const user = this.userRepository.create(createUserDto);
      const savedUser = await this.userRepository.save(user);

      this.logger.log(`User created: ${savedUser.email}`);
      return savedUser;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      // Handle database constraint violations
      if (error.code === '23505') { // PostgreSQL unique violation
        throw new ConflictException('Email already exists');
      }

      this.logger.error(
        `Failed to create user: ${createUserDto.email}`,
        error.stack,
        'UsersService.create',
      );

      throw new InternalServerErrorException(
        'Database error occurred while creating user',
      );
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      this.logger.error(
        `Database error while finding user by email: ${email}`,
        error.stack,
        'UsersService.findByEmail',
      );

      throw new InternalServerErrorException(
        'Database error occurred while searching for user',
      );
    }
  }
}
```

### Advanced Service Error Handling with External APIs

```typescript
// src/external/payment.service.ts
import {
  Injectable,
  BadRequestException,
  ServiceUnavailableException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(private readonly httpService: HttpService) {}

  async processPayment(paymentData: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('/api/payments', paymentData, {
          timeout: 10000, // 10 second timeout
        }),
      );

      this.logger.log(`Payment processed successfully: ${paymentData.id}`);
      return response.data;
    } catch (error) {
      const context = `PaymentService.processPayment - Payment ID: ${paymentData.id}`;

      // Handle HTTP errors from external API
      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 400:
            this.logger.warn(`Payment validation failed: ${JSON.stringify(data)}`, context);
            throw new BadRequestException({
              message: 'Payment validation failed',
              details: data.errors || data.message,
            });

          case 402:
            this.logger.warn(`Insufficient funds: ${JSON.stringify(data)}`, context);
            throw new BadRequestException({
              message: 'Insufficient funds',
              code: 'INSUFFICIENT_FUNDS',
            });

          case 503:
            this.logger.error(`Payment service unavailable`, error.stack, context);
            throw new ServiceUnavailableException(
              'Payment service is temporarily unavailable',
            );

          default:
            this.logger.error(
              `External payment API error: ${status}`,
              error.stack,
              context,
            );
            throw new InternalServerErrorException(
              'Payment processing failed due to external service error',
            );
        }
      }

      // Handle network/timeout errors
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        this.logger.error(`Payment service timeout`, error.stack, context);
        throw new ServiceUnavailableException(
          'Payment service request timed out',
        );
      }

      // Handle other network errors
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        this.logger.error(`Payment service connection failed`, error.stack, context);
        throw new ServiceUnavailableException(
          'Unable to connect to payment service',
        );
      }

      // Handle unexpected errors
      this.logger.error(`Unexpected payment processing error`, error.stack, context);
      throw new InternalServerErrorException(
        'An unexpected error occurred during payment processing',
      );
    }
  }
}
```

## Custom Business Exceptions

Create custom exceptions for domain-specific errors:

```typescript
// src/shared/exceptions/business.exceptions.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotActiveException extends HttpException {
  constructor(userId: number) {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        error: 'User Not Active',
        message: `User ${userId} is not active`,
        code: 'USER_NOT_ACTIVE',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class InsufficientBalanceException extends HttpException {
  constructor(available: number, required: number) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Insufficient Balance',
        message: 'Insufficient balance for this operation',
        code: 'INSUFFICIENT_BALANCE',
        details: {
          available,
          required,
          shortfall: required - available,
        },
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class ResourceLockedException extends HttpException {
  constructor(resourceType: string, resourceId: string) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        error: 'Resource Locked',
        message: `${resourceType} ${resourceId} is currently locked`,
        code: 'RESOURCE_LOCKED',
        resourceType,
        resourceId,
      },
      HttpStatus.CONFLICT,
    );
  }
}
```

### Using Custom Exceptions

```typescript
// src/accounts/accounts.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { 
  UserNotActiveException, 
  InsufficientBalanceException 
} from '../shared/exceptions/business.exceptions';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);

  async withdraw(userId: number, amount: number): Promise<void> {
    try {
      const user = await this.findUser(userId);
      
      if (!user.isActive) {
        throw new UserNotActiveException(userId);
      }

      if (user.balance < amount) {
        throw new InsufficientBalanceException(user.balance, amount);
      }

      await this.updateBalance(userId, user.balance - amount);
      
      this.logger.log(`Withdrawal successful: User ${userId}, Amount ${amount}`);
    } catch (error) {
      if (error instanceof UserNotActiveException || 
          error instanceof InsufficientBalanceException) {
        throw error;
      }

      this.logger.error(
        `Withdrawal failed: User ${userId}, Amount ${amount}`,
        error.stack,
        'AccountsService.withdraw',
      );

      throw new InternalServerErrorException(
        'An error occurred during withdrawal processing',
      );
    }
  }
}
```

## Global Error Handling

Register exception filters globally in your application:

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Register global exception filters
  app.useGlobalFilters(
    new GlobalExceptionFilter(),
    new HttpExceptionFilter(),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  logger.log(`Application is running on port ${port}`);
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Error starting application:', error);
  process.exit(1);
});
```

Or register in your app module:

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
```

## Best Practices

### 1. **Consistent Error Structure**
Always return errors in a consistent format:

```typescript
{
  statusCode: number,
  timestamp: string,
  path: string,
  method: string,
  message: string,
  error?: string,
  details?: any,
  code?: string
}
```

### 2. **Proper Logging**
- Log all errors with appropriate context
- Use different log levels (error, warn, debug)
- Include request information and stack traces
- Don't log sensitive information

### 3. **Error Classification**
- **4xx errors**: Client errors (validation, authentication, authorization)
- **5xx errors**: Server errors (database, external services, unexpected errors)
- Use appropriate HTTP status codes

### 4. **Input Validation**
- Validate inputs early in controllers
- Use DTOs with class-validator for automatic validation
- Provide clear validation error messages

### 5. **Exception Handling Strategy**
```typescript
try {
  // Business logic
} catch (error) {
  // 1. Handle known business exceptions
  if (error instanceof BusinessException) {
    throw error;
  }
  
  // 2. Handle known HTTP exceptions
  if (error instanceof HttpException) {
    throw error;
  }
  
  // 3. Log and wrap unexpected errors
  this.logger.error('Unexpected error', error.stack, context);
  throw new InternalServerErrorException('An unexpected error occurred');
}
```

### 6. **Security Considerations**
- Don't expose internal error details to clients
- Sanitize error messages in production
- Log security-related errors for monitoring
- Use generic error messages for authentication failures

### 7. **Performance Considerations**
- Don't catch and re-throw exceptions unnecessarily
- Use appropriate timeout values for external services
- Implement circuit breaker patterns for external dependencies
- Monitor error rates and response times

This guide provides a comprehensive approach to error handling in your NestJS application. Implement these patterns consistently across your codebase for robust and maintainable error management.
