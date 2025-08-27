import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerException, ThrottlerModuleOptions, ThrottlerStorage } from '@nestjs/throttler';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: {
    id: string;
    [key: string]: any;
  };
}

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  constructor(
    options: ThrottlerModuleOptions,
    storageService: ThrottlerStorage,
    reflector: Reflector,
  ) {
    super(options, storageService, reflector);
  }

  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    // Verifica se o endpoint tem o decorator @SkipThrottle()
    const skipThrottle = this.reflector.getAllAndOverride<boolean>('skipThrottle', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipThrottle) {
      return true;
    }

    return super.shouldSkip(context);
  }
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const request = req as RequestWithUser;
    
    // Prioriza o IP real do cliente (considerando proxies/load balancers)
    const clientIp = this.getClientIp(request);
    
    // Se o usuário estiver autenticado, combina IP + User ID para rate limiting mais preciso
    const userId = request.user?.id;
    
    if (userId) {
      return `${clientIp}-${userId}`;
    }
    
    return clientIp;
  }

  protected async throwThrottlingException(context: ExecutionContext): Promise<void> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const clientIp = this.getClientIp(request);
    
    // Log do rate limiting para monitoramento
    console.warn(`Rate limit exceeded for IP: ${clientIp} at ${new Date().toISOString()}`);
    
    throw new ThrottlerException('Too many requests. Please try again later.');
  }

  private getClientIp(request: RequestWithUser): string {
    // Tenta obter o IP real considerando proxies e load balancers
    const forwarded = request.headers['x-forwarded-for'] as string;
    const realIp = request.headers['x-real-ip'] as string;
    const cfConnectingIp = request.headers['cf-connecting-ip'] as string; // Cloudflare
    
    if (cfConnectingIp) return cfConnectingIp;
    if (realIp) return realIp;
    if (forwarded) return forwarded.split(',')[0].trim();
    
    return request.ip || request.connection.remoteAddress || 'unknown';
  }
}
