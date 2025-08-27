import { Injectable, Inject } from '@nestjs/common';
import { User } from '@prisma/client';

import { DB_SERVICE_TOKEN } from '../../../../shared/constants/di-constants';
import { IDbService } from '../../../../shared/db/interfaces/db-service.interface';
import { IAuthRepository } from '../../domain/repositories/auth-repository.contract';
import { UserEntity } from '../../domain/entities/user.entity';
import { TokenEntity, TokenType } from '../../domain/entities/token.entity';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @Inject(DB_SERVICE_TOKEN)
    private readonly dbService: IDbService,
  ) {}

  // Cache em memória para tokens (em produção, usar Redis ou banco)
  private tokens: Array<{
    token: string;
    type: TokenType;
    expiresAt: Date;
    userId: string;
    createdAt: Date;
  }> = [];

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const userData = await this.dbService.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!userData) return null;

    return this.mapToUserEntity(userData);
  }

  async findUserById(id: string): Promise<UserEntity | null> {
    const userData = await this.dbService.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!userData) return null;

    return this.mapToUserEntity(userData);
  }

  async createUser(email: string, hashedPassword: string, name: string): Promise<UserEntity> {
    const newUser = await this.dbService.user.create({
      data: {
        email: email.toLowerCase(),
        name: name.trim(),
        password: hashedPassword,
        isActive: true,
      },
    });

    return this.mapToUserEntity(newUser);
  }

  async updateUser(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    const updatedUser = await this.dbService.user.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        isActive: data.isActive,
        updatedAt: new Date(),
      },
    });

    return this.mapToUserEntity(updatedUser);
  }

  async getPasswordHash(userId: string): Promise<string | null> {
    const user = await this.dbService.user.findUnique({
      where: { id: parseInt(userId) },
      select: { password: true },
    });

    return user?.password || null;
  }

  async saveToken(token: TokenEntity): Promise<void> {
    // Remove token existente se houver
    this.tokens = this.tokens.filter((t) => t.token !== token.token);

    // Adiciona novo token
    this.tokens.push({
      token: token.token,
      type: token.type,
      expiresAt: token.expiresAt,
      userId: token.userId,
      createdAt: token.createdAt,
    });

    // Cleanup de tokens expirados
    await this.deleteExpiredTokens();
  }

  async findTokenByValue(tokenValue: string): Promise<TokenEntity | null> {
    const tokenData = this.tokens.find((t) => t.token === tokenValue);
    if (!tokenData) return null;

    return new TokenEntity(
      tokenData.token,
      tokenData.type,
      tokenData.expiresAt,
      tokenData.userId,
      tokenData.createdAt,
    );
  }

  async deleteToken(tokenValue: string): Promise<void> {
    this.tokens = this.tokens.filter((t) => t.token !== tokenValue);
  }

  async deleteUserTokens(userId: string, type?: TokenType): Promise<void> {
    this.tokens = this.tokens.filter((t) => {
      if (t.userId !== userId) return true;
      if (type && t.type !== type) return true;
      return false;
    });
  }

  async deleteExpiredTokens(): Promise<void> {
    const now = new Date();
    this.tokens = this.tokens.filter((t) => t.expiresAt > now);
  }

  private mapToUserEntity(userData: User): UserEntity {
    return UserEntity.create({
      id: userData.id.toString(),
      email: userData.email,
      name: userData.name || '',
      password: userData.password,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      isActive: userData.isActive,
    });
  }
}
