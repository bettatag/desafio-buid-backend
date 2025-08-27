import {
  Injectable,
  Inject,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import {
  AUTH_REPOSITORY_TOKEN,
  PASSWORD_SERVICE_TOKEN,
  TOKEN_SERVICE_TOKEN,
  LOGGER_SERVICE_TOKEN,
} from '../../../../shared/constants/di-constants';
import { IAuthRepository } from '../../domain/repositories/auth-repository.contract';
import { IPasswordService } from '../../domain/contracts/services/password-service.contract';
import { ITokenService } from '../../domain/contracts/services/token-service.contract';
import { ILoggerService } from '../../domain/contracts/services/logger-service.contract';
import { IAuthUseCase } from '../contracts/Services/auth-usecase.contract';
import { ILoginInput } from '../../domain/contracts/input/login-input.contract';
import { IRegisterInput } from '../../domain/contracts/input/register-input.contract';
import { IRefreshTokenInput } from '../../domain/contracts/input/refresh-token-input.contract';
import {
  IAuthOutput,
  IRefreshOutput,
  ILogoutOutput,
} from '../../domain/contracts/output/auth-output.contract';
import { UserEntity } from '../../domain/entities/user.entity';
import { TokenEntity } from '../../domain/entities/token.entity';

@Injectable()
export class AuthUseCase implements IAuthUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY_TOKEN)
    private readonly authRepository: IAuthRepository,
    @Inject(PASSWORD_SERVICE_TOKEN)
    private readonly passwordService: IPasswordService,
    @Inject(TOKEN_SERVICE_TOKEN)
    private readonly tokenService: ITokenService,
    @Inject(LOGGER_SERVICE_TOKEN)
    private readonly logger: ILoggerService,
  ) {}

  async login(input: ILoginInput): Promise<IAuthOutput> {
    // Validar input primeiro
    this.validateLoginInput(input);

    this.logger.debug('Login attempt started', { email: input.email });

    // Buscar usuário
    const user = await this.findAndValidateUser(input.email);

    // Verificar senha
    await this.verifyPassword(input.password, user.id);

    // Gerar e salvar tokens
    const tokens = await this.generateAndSaveTokens(user, input.rememberMe);

    this.logger.info('User logged in successfully', { userId: user.id });

    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async register(input: IRegisterInput): Promise<IAuthOutput> {
    // Validar input primeiro
    this.validateRegisterInput(input);

    this.logger.debug('Registration attempt started', { email: input.email });

    // Verificar se usuário já existe
    await this.checkUserExists(input.email);

    // Criar usuário
    const user = await this.createNewUser(input);

    // Gerar e salvar tokens
    const tokens = await this.generateAndSaveTokens(user, false);

    this.logger.info('User registered successfully', { userId: user.id });

    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async refreshToken(input: IRefreshTokenInput): Promise<IRefreshOutput> {
    this.logger.debug('Token refresh attempt started');

    if (!input || !input.refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    // Validar refresh token
    const payload = await this.tokenService.validateRefreshToken(input.refreshToken);
    if (!payload) {
      this.logger.warn('Invalid refresh token provided');
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Buscar usuário
    const user = await this.authRepository.findUserById(payload.sub);
    if (!user || !user.canLogin()) {
      this.logger.warn('User not found or cannot login', { userId: payload.sub });
      throw new UnauthorizedException('User not found or inactive');
    }

    // Verificar se token existe no banco
    const storedToken = await this.authRepository.findTokenByValue(input.refreshToken);
    if (!storedToken || storedToken.isExpired()) {
      this.logger.warn('Refresh token not found or expired', { userId: user.id });
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Gerar novo access token
    const accessToken = await this.tokenService.generateAccessToken(user);
    await this.authRepository.saveToken(TokenEntity.createAccessToken(accessToken, user.id));

    this.logger.info('Token refreshed successfully', { userId: user.id });

    return {
      accessToken,
    };
  }

  async logout(userId: string): Promise<ILogoutOutput> {
    this.logger.debug('Logout attempt started', { userId });

    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    // Deletar todos os tokens do usuário
    await this.authRepository.deleteUserTokens(userId);

    this.logger.info('User logged out successfully', { userId });

    return {
      message: 'Logged out successfully',
    };
  }

  async validateAccessToken(token: string): Promise<UserEntity | null> {
    try {
      const payload = await this.tokenService.validateAccessToken(token);
      if (!payload) {
        return null;
      }

      // Verificar se token existe no banco e não expirou
      const storedToken = await this.authRepository.findTokenByValue(token);
      if (!storedToken || storedToken.isExpired()) {
        return null;
      }

      // Buscar usuário
      const user = await this.authRepository.findUserById(payload.sub);
      if (!user || !user.canLogin()) {
        return null;
      }

      return user;
    } catch (error) {
      this.logger.error('Error validating access token', error);
      return null;
    }
  }

  async validateRefreshToken(token: string): Promise<UserEntity | null> {
    try {
      const payload = await this.tokenService.validateRefreshToken(token);
      if (!payload) {
        return null;
      }

      // Verificar se token existe no banco e não expirou
      const storedToken = await this.authRepository.findTokenByValue(token);
      if (!storedToken || storedToken.isExpired()) {
        return null;
      }

      // Buscar usuário
      const user = await this.authRepository.findUserById(payload.sub);
      if (!user || !user.canLogin()) {
        return null;
      }

      return user;
    } catch (error) {
      this.logger.error('Error validating refresh token', error);
      return null;
    }
  }

  // Private helper methods
  private validateLoginInput(input: ILoginInput): void {
    if (!input || !input.email || !input.password) {
      throw new BadRequestException('Email and password are required');
    }
  }

  private validateRegisterInput(input: IRegisterInput): void {
    if (!input || !input.email || !input.password || !input.name) {
      throw new BadRequestException('Email, password, and name are required');
    }

    if (input.password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }
  }

  private async findAndValidateUser(email: string): Promise<UserEntity> {
    const user = await this.authRepository.findUserByEmail(email.toLowerCase());
    if (!user || !user.canLogin()) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  private async verifyPassword(password: string, userId: string): Promise<void> {
    const passwordHash = await this.authRepository.getPasswordHash(userId);
    if (!passwordHash || !(await this.passwordService.verify(password, passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  private async checkUserExists(email: string): Promise<void> {
    const existingUser = await this.authRepository.findUserByEmail(email.toLowerCase());
    if (existingUser) {
      throw new ConflictException('User already exists with this email');
    }
  }

  private async createNewUser(input: IRegisterInput): Promise<UserEntity> {
    const hashedPassword = await this.passwordService.hash(input.password);
    return this.authRepository.createUser(input.email.toLowerCase(), hashedPassword, input.name);
  }

  private async generateAndSaveTokens(
    user: UserEntity,
    rememberMe = false,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.tokenService.generateAccessToken(user);
    const refreshToken = await this.tokenService.generateRefreshToken(user, rememberMe);

    // Salvar tokens no banco
    await this.authRepository.saveToken(TokenEntity.createAccessToken(accessToken, user.id));
    await this.authRepository.saveToken(
      rememberMe
        ? TokenEntity.createRefreshToken(refreshToken, user.id, 30) // 30 dias
        : TokenEntity.createRefreshToken(refreshToken, user.id, 7), // 7 dias
    );

    return { accessToken, refreshToken };
  }
}
