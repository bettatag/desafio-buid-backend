import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ITokenService } from '../../domain/contracts/services/token-service.contract';
import { IAuthConfig } from '../../domain/contracts/config/auth-config.contract';
import { UserEntity } from '../../domain/entities/user.entity';
import { AUTH_CONFIG_TOKEN } from '../../../../shared/constants/di-constants';

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(AUTH_CONFIG_TOKEN)
    private readonly config: IAuthConfig,
  ) {}

  async generateAccessToken(user: UserEntity): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      type: 'access',
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: `${this.config.accessTokenExpirationMinutes}m`,
      issuer: this.config.jwtIssuer,
      audience: this.config.jwtAudience,
    });
  }

  async generateRefreshToken(user: UserEntity, longLived = false): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      type: 'refresh',
    };

    const expirationDays = longLived
      ? this.config.refreshTokenLongLivedDays
      : this.config.refreshTokenExpirationDays;

    return this.jwtService.signAsync(payload, {
      expiresIn: `${expirationDays}d`,
      issuer: this.config.jwtIssuer,
      audience: this.config.jwtAudience,
    });
  }

  async validateAccessToken(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        issuer: this.config.jwtIssuer,
        audience: this.config.jwtAudience,
      });

      if (payload.type !== 'access') {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }

  async validateRefreshToken(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        issuer: this.config.jwtIssuer,
        audience: this.config.jwtAudience,
      });

      if (payload.type !== 'refresh') {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }
}
