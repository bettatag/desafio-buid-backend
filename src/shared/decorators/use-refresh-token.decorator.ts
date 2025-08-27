import { SetMetadata } from '@nestjs/common';

export const USE_REFRESH_TOKEN_KEY = 'useRefreshToken';
export const UseRefreshToken = () => SetMetadata(USE_REFRESH_TOKEN_KEY, true);
