import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import {
  AUTH_USE_CASE_TOKEN,
  AUTH_REPOSITORY_TOKEN,
  PASSWORD_SERVICE_TOKEN,
  TOKEN_SERVICE_TOKEN,
  LOGGER_SERVICE_TOKEN,
  AUTH_CONFIG_TOKEN,
} from '../../shared/constants/di-constants';
import { AuthUseCase } from './application/use-cases/auth-usecase';
import { AuthConfig } from './infra/config/auth.config';
import { AuthRepository } from './infra/repositories/auth.repository';
import { LoggerService } from './infra/services/logger.service';
import { PasswordService } from './infra/services/password.service';
import { TokenService } from './infra/services/token.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { GlobalGuard } from './presentation/guards/global.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key-here',
      signOptions: {
        issuer: 'evolution-api',
        audience: 'evolution-api-users',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_CONFIG_TOKEN,
      useClass: AuthConfig,
    },
    {
      provide: PASSWORD_SERVICE_TOKEN,
      useClass: PasswordService,
    },
    {
      provide: TOKEN_SERVICE_TOKEN,
      useClass: TokenService,
    },
    {
      provide: LOGGER_SERVICE_TOKEN,
      useClass: LoggerService,
    },
    {
      provide: AUTH_REPOSITORY_TOKEN,
      useClass: AuthRepository,
    },
    {
      provide: AUTH_USE_CASE_TOKEN,
      useClass: AuthUseCase,
    },
    {
      provide: APP_GUARD,
      useClass: GlobalGuard,
    },
  ],
  exports: [
    AUTH_USE_CASE_TOKEN,
    AUTH_REPOSITORY_TOKEN,
    LOGGER_SERVICE_TOKEN,
    PASSWORD_SERVICE_TOKEN,
    TOKEN_SERVICE_TOKEN,
    AUTH_CONFIG_TOKEN,
  ],
})
export class AuthModule {}
