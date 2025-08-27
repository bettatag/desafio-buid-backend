export interface IAuthConfig {
  /**
   * Access token expiration time in minutes
   */
  readonly accessTokenExpirationMinutes: number;

  /**
   * Default refresh token expiration time in days
   */
  readonly refreshTokenExpirationDays: number;

  /**
   * Long-lived refresh token expiration time in days (remember me)
   */
  readonly refreshTokenLongLivedDays: number;

  /**
   * BCrypt salt rounds for password hashing
   */
  readonly bcryptSaltRounds: number;

  /**
   * JWT secret key
   */
  readonly jwtSecret: string;

  /**
   * JWT issuer
   */
  readonly jwtIssuer: string;

  /**
   * JWT audience
   */
  readonly jwtAudience: string;
}
