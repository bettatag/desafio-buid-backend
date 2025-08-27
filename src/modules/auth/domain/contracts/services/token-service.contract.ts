import { UserEntity } from '../../entities/user.entity';

export interface ITokenService {
  /**
   * Generate access token for user
   * @param user User entity
   * @returns JWT access token
   */
  generateAccessToken(user: UserEntity): Promise<string>;

  /**
   * Generate refresh token for user
   * @param user User entity
   * @param longLived Whether token should be long-lived (30 days vs 7 days)
   * @returns JWT refresh token
   */
  generateRefreshToken(user: UserEntity, longLived?: boolean): Promise<string>;

  /**
   * Validate and decode access token
   * @param token JWT token
   * @returns Decoded payload or null if invalid
   */
  validateAccessToken(token: string): Promise<any>;

  /**
   * Validate and decode refresh token
   * @param token JWT token
   * @returns Decoded payload or null if invalid
   */
  validateRefreshToken(token: string): Promise<any>;
}
