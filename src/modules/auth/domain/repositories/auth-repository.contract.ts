import { UserEntity } from '../entities/user.entity';
import { TokenEntity } from '../entities/token.entity';

export interface IAuthRepository {
  // User operations
  findUserByEmail(email: string): Promise<UserEntity | null>;
  findUserById(id: string): Promise<UserEntity | null>;
  createUser(email: string, hashedPassword: string, name: string): Promise<UserEntity>;
  updateUser(id: string, data: Partial<UserEntity>): Promise<UserEntity>;

  // Password operations
  getPasswordHash(userId: string): Promise<string | null>;

  // Token operations
  saveToken(token: TokenEntity): Promise<void>;
  findTokenByValue(tokenValue: string): Promise<TokenEntity | null>;
  deleteToken(tokenValue: string): Promise<void>;
  deleteUserTokens(userId: string, type?: 'ACCESS' | 'REFRESH'): Promise<void>;

  // Cleanup
  deleteExpiredTokens(): Promise<void>;
}
