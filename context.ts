/* import { ExecutionContext, Injectable, Inject, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../../shared/custom decorators/is-public.decorator';
import { USE_REFRESH_TOKEN_KEY } from '../../shared/custom decorators/use-refresh-token.decorator';
import {
  ICUSTOM_LOGGER_SERVICE,
  IVALIDATE_ACCESS_TOKEN_SERVICE,
  IVALIDATE_REFRESH_TOKEN_SERVICE,
} from '../../shared/dependenty-injection-constants/constants';
import { ICustomLoggerService } from '../../shared/services/interfaces/custom-logger-service.interface';
import { IValidateTokenService } from '../services/interfaces/validate-token-service.interface';

@Injectable()
export class GlobalGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(ICUSTOM_LOGGER_SERVICE)
    private readonly logger: ICustomLoggerService,
    @Inject(IVALIDATE_ACCESS_TOKEN_SERVICE)
    private readonly validateAccessTokenService: IValidateTokenService,
    @Inject(IVALIDATE_REFRESH_TOKEN_SERVICE)
    private readonly validateRefreshTokenService: IValidateTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const logContext = {
      method: request.method,
      url: request.url,
      userAgent: request.get('user-agent') || 'unknown',
      ip: request.ip || 'unknown',
    };

    this.logger.debug('Global Auth Guard activated', 'GlobalGuard', logContext);

    // 1. Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.debug(
        'Public route detected, bypassing authentication',
        'GlobalGuard',
        logContext,
      );
      return true;
    }

    // 2. Check for refresh token decorator
    const useRefreshToken = this.reflector.getAllAndOverride<boolean>(USE_REFRESH_TOKEN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (useRefreshToken) {
      this.logger.debug('Refresh token endpoint detected', 'GlobalGuard', logContext);
      return this.validateRefreshTokenService.exec(request);
    }

    // 3. Default to access token validation
    return this.validateAccessTokenService.exec(request);
  }
}

 */
