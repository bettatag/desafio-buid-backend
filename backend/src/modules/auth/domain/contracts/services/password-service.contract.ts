export interface IPasswordService {
  /**
   * Hash a password using bcrypt
   * @param password Plain text password
   * @returns Hashed password
   */
  hash(password: string): Promise<string>;

  /**
   * Verify a password against its hash
   * @param password Plain text password
   * @param hash Hashed password
   * @returns True if password matches
   */
  verify(password: string, hash: string): Promise<boolean>;
}
