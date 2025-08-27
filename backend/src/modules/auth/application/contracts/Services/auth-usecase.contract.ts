import { ILoginInput } from '../../../domain/contracts/input/login-input.contract';
import { IRegisterInput } from '../../../domain/contracts/input/register-input.contract';
import { IRefreshTokenInput } from '../../../domain/contracts/input/refresh-token-input.contract';
import {
  IAuthOutput,
  IRefreshOutput,
  ILogoutOutput,
} from '../../../domain/contracts/output/auth-output.contract';
import { UserEntity } from '../../../domain/entities/user.entity';

export interface IAuthUseCase {
  login(input: ILoginInput): Promise<IAuthOutput>;
  register(input: IRegisterInput): Promise<IAuthOutput>;
  refreshToken(input: IRefreshTokenInput): Promise<IRefreshOutput>;
  logout(userId: string): Promise<ILogoutOutput>;
  validateAccessToken(token: string): Promise<UserEntity | null>;
  validateRefreshToken(token: string): Promise<UserEntity | null>;
}
