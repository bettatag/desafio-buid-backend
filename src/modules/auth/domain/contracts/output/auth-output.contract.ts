import { UserEntity } from '../../entities/user.entity';

export interface IAuthOutput {
  user: UserEntity;
  accessToken: string;
  refreshToken: string;
}

export interface IRefreshOutput {
  accessToken: string;
  refreshToken?: string;
}

export interface ILogoutOutput {
  message: string;
}
