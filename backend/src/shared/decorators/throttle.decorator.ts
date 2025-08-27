import { SetMetadata } from '@nestjs/common';
import { Throttle as NestThrottle } from '@nestjs/throttler';

/**
 * Decorator para configurar rate limiting específico em endpoints
 * 
 * @param limit - Número máximo de requests
 * @param ttl - Tempo em milissegundos para a janela de rate limiting
 * 
 * @example
 * // 50 requests por minuto
 * @Throttle(50, 60000)
 * 
 * // 10 requests por 30 segundos
 * @Throttle(10, 30000)
 */
export const Throttle = (limit: number, ttl: number) => NestThrottle({ default: { limit, ttl } });

/**
 * Decorator para desabilitar rate limiting em endpoints específicos
 * Útil para endpoints que não devem ter limitação (ex: health checks)
 */
export const SkipThrottle = () => SetMetadata('skipThrottle', true);

/**
 * Decorators pré-configurados para casos comuns
 */
export const ThrottleStrict = () => Throttle(10, 60000); // 10 requests por minuto
export const ThrottleModerate = () => Throttle(50, 60000); // 50 requests por minuto
export const ThrottleRelaxed = () => Throttle(200, 60000); // 200 requests por minuto
