import { CanActivate, ExecutionContext, Injectable, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../../../../shared/decorators/is-public.decorator';

@Injectable()
export class GlobalGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const logContext = {
      method: request.method,
      url: request.url,
      userAgent: request.get('user-agent') || 'unknown',
      ip: request.ip || 'unknown',
    };

    // 1. Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // 3. Default to access token validation (blocked for now)
    return false;
  }
}
