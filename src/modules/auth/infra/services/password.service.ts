import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { IPasswordService } from '../../domain/contracts/services/password-service.contract';
import { IAuthConfig } from '../../domain/contracts/config/auth-config.contract';
import { AUTH_CONFIG_TOKEN } from '../../../../shared/constants/di-constants';

@Injectable()
export class PasswordService implements IPasswordService {
  constructor(
    @Inject(AUTH_CONFIG_TOKEN)
    private readonly config: IAuthConfig,
  ) {}

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.config.bcryptSaltRounds);
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
