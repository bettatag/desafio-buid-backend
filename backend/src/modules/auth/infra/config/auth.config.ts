import { Injectable } from '@nestjs/common';

import { IAuthConfig } from '../../domain/contracts/config/auth-config.contract';

@Injectable()
export class AuthConfig implements IAuthConfig {
  readonly accessTokenExpirationMinutes = 15;
  readonly refreshTokenExpirationDays = 7;
  readonly refreshTokenLongLivedDays = 30;
  readonly bcryptSaltRounds = 12;
  readonly jwtSecret = process.env.JWT_SECRET || 'your-secret-key-here';
  readonly jwtIssuer = 'evolution-api';
  readonly jwtAudience = 'evolution-api-users';
}
