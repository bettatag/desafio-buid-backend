export class UserEntity {
  public readonly id: string;
  public readonly email: string;
  public readonly name: string;
  public readonly password: string; // Senha hasheada
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public readonly isActive: boolean;

  constructor(
    id: string,
    email: string,
    name: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    isActive: boolean = true,
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isActive = isActive;
  }

  // Métodos de negócio
  isValidUser(): boolean {
    return !!this.email?.trim() && !!this.name?.trim() && this.isActive && this.isValidEmail();
  }

  private isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  getDisplayName(): string {
    return this.name || this.email.split('@')[0];
  }

  canLogin(): boolean {
    return this.isActive && this.isValidUser();
  }

  static create(data: {
    id: string;
    email: string;
    name: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
  }): UserEntity {
    return new UserEntity(
      data.id,
      data.email,
      data.name,
      data.password,
      data.createdAt || new Date(),
      data.updatedAt || new Date(),
      data.isActive ?? true,
    );
  }
}
