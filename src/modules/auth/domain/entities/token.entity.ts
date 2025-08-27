import { ApiProperty } from '@nestjs/swagger';

export type TokenType = 'ACCESS' | 'REFRESH';

export class TokenEntity {
  @ApiProperty({
    description: 'Token JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  public readonly token: string;

  @ApiProperty({
    description: 'Tipo do token',
    enum: ['ACCESS', 'REFRESH'],
    example: 'ACCESS',
  })
  public readonly type: TokenType;

  @ApiProperty({
    description: 'Data de expiração do token',
    example: '2024-01-01T01:00:00Z',
  })
  public readonly expiresAt: Date;

  @ApiProperty({
    description: 'ID do usuário associado ao token',
    example: 'uuid-user-123',
  })
  public readonly userId: string;

  @ApiProperty({
    description: 'Data de criação do token',
    example: '2024-01-01T00:00:00Z',
  })
  public readonly createdAt: Date;

  constructor(
    token: string,
    type: TokenType,
    expiresAt: Date,
    userId: string,
    createdAt: Date = new Date(),
  ) {
    this.token = token;
    this.type = type;
    this.expiresAt = expiresAt;
    this.userId = userId;
    this.createdAt = createdAt;
  }

  // Métodos de negócio
  isValid(): boolean {
    return !!this.token?.trim() && !!this.userId?.trim() && this.expiresAt > new Date();
  }

  isExpired(): boolean {
    return this.expiresAt <= new Date();
  }

  isAccessToken(): boolean {
    return this.type === 'ACCESS';
  }

  isRefreshToken(): boolean {
    return this.type === 'REFRESH';
  }

  getTimeToExpiry(): number {
    return Math.max(0, this.expiresAt.getTime() - Date.now());
  }

  willExpireIn(minutes: number): boolean {
    const targetTime = Date.now() + minutes * 60 * 1000;
    return this.expiresAt.getTime() <= targetTime;
  }

  static createAccessToken(
    token: string,
    userId: string,
    expiresInMinutes: number = 15,
  ): TokenEntity {
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
    return new TokenEntity(token, 'ACCESS', expiresAt, userId);
  }

  static createRefreshToken(token: string, userId: string, expiresInDays: number = 7): TokenEntity {
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
    return new TokenEntity(token, 'REFRESH', expiresAt, userId);
  }
}
