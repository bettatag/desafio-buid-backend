import { ExecutionContext, Injectable, Inject, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../../../../shared/decorators/is-public.decorator';
import { USE_REFRESH_TOKEN_KEY } from '../../../../shared/decorators/use-refresh-token.decorator';
import {
  AUTH_USE_CASE_TOKEN,
  LOGGER_SERVICE_TOKEN,
} from '../../../../shared/constants/di-constants';
import { IAuthUseCase } from '../../application/contracts/Services/auth-usecase.contract';
import { ILoggerService } from '../../domain/contracts/services/logger-service.contract';

@Injectable()
export class GlobalGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(AUTH_USE_CASE_TOKEN)
    private readonly authUseCase: IAuthUseCase,
    @Inject(LOGGER_SERVICE_TOKEN)
    private readonly logger: ILoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const logContext = {
      method: request.method,
      url: request.url,
      userAgent: request.get('user-agent') || 'unknown',
      ip: request.ip || 'unknown',
    };

    this.logger.debug('Global Auth Guard activated', logContext);

    // 1. Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.debug('Public route detected, bypassing authentication', logContext);
      return true;
    }

    // 2. Check for refresh token decorator
    const useRefreshToken = this.reflector.getAllAndOverride<boolean>(USE_REFRESH_TOKEN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (useRefreshToken) {
      this.logger.debug('Refresh token endpoint detected', logContext);
      return this.validateRefreshTokenFromCookie(request);
    }

    // 3. Default to access token validation
    return this.validateAccessTokenFromCookie(request);
  }

  private async validateAccessTokenFromCookie(request: Request): Promise<boolean> {
    try {
      // Extrair token do cookie httpOnly
      const accessToken = request.cookies?.accessToken;

      if (!accessToken) {
        this.logger.debug('No access token found in cookies');
        return false;
      }

      // Validar token
      const user = await this.authUseCase.validateAccessToken(accessToken);

      if (!user) {
        this.logger.debug('Invalid access token');
        return false;
      }

      // Anexar usuário ao request
      (request as any).user = user;
      this.logger.debug('Access token validated successfully', { userId: user.id });

      return true;
    } catch (error) {
      this.logger.error('Error validating access token', error as Error);
      return false;
    }
  }

  private async validateRefreshTokenFromCookie(request: Request): Promise<boolean> {
    try {
      // Extrair token do cookie httpOnly
      const refreshToken = request.cookies?.refreshToken;

      if (!refreshToken) {
        this.logger.debug('No refresh token found in cookies');
        return false;
      }

      // Validar token
      const user = await this.authUseCase.validateRefreshToken(refreshToken);

      if (!user) {
        this.logger.debug('Invalid refresh token');
        return false;
      }

      // Anexar usuário ao request
      (request as any).user = user;
      this.logger.debug('Refresh token validated successfully', { userId: user.id });

      return true;
    } catch (error) {
      this.logger.error('Error validating refresh token', error as Error);
      return false;
    }
  }
}
