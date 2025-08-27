import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  HttpException,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AUTH_USE_CASE_TOKEN } from '../../../../shared/constants/di-constants';
import { IsPublic } from '../../../../shared/decorators/is-public.decorator';
import { UseRefreshToken } from '../../../../shared/decorators/use-refresh-token.decorator';
import { IAuthUseCase } from '../../application/contracts/Services/auth-usecase.contract';
import { UserEntity } from '../../domain/entities/user.entity';
import { CurrentUser } from '../decorators/current-user.decorator';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import {
  AuthResponseDto,
  RefreshResponseDto,
  LogoutResponseDto,
} from '../outputs/auth-response.contract';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_USE_CASE_TOKEN)
    private readonly authUseCase: IAuthUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @IsPublic()
  @ApiOperation({
    summary: 'Login do usuário',
    description: 'Autentica o usuário e define cookies httpOnly com tokens JWT',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Credenciais de login',
    examples: {
      admin: {
        summary: 'Login como administrador',
        description: 'Credenciais do usuário administrador',
        value: {
          email: 'admin@teste.com',
          password: 'admin123',
          rememberMe: false,
        },
      },
      user: {
        summary: 'Login como usuário',
        description: 'Credenciais do usuário comum',
        value: {
          email: 'usuario@teste.com',
          password: 'password',
          rememberMe: true,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Login realizado com sucesso',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados de entrada inválidos',
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais inválidas',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    try {
      const result = await this.authUseCase.login(loginDto);

      // Definir cookies httpOnly
      const isProduction = process.env.NODE_ENV === 'production';

      // Access Token - 15 minutos
      response.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutos
        path: '/',
      });

      // Refresh Token - 7 ou 30 dias dependendo do rememberMe
      const refreshMaxAge = loginDto.rememberMe
        ? 30 * 24 * 60 * 60 * 1000 // 30 dias
        : 7 * 24 * 60 * 60 * 1000; // 7 dias

      response.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: refreshMaxAge,
        path: '/auth/refresh',
      });

      return {
        user: UserResponseDto.fromEntity(result.user),
        message: 'Login successful',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error during login',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @IsPublic()
  @ApiOperation({
    summary: 'Registro de novo usuário',
    description: 'Cria uma nova conta de usuário e define cookies httpOnly com tokens JWT',
  })
  @ApiBody({
    type: RegisterDto,
    description: 'Dados para registro',
    examples: {
      newUser: {
        summary: 'Novo usuário',
        description: 'Exemplo de registro de novo usuário',
        value: {
          email: 'novo@usuario.com',
          password: 'minhasenha123',
          name: 'João Silva',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Usuário registrado com sucesso',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados de entrada inválidos',
  })
  @ApiConflictResponse({
    description: 'Email já está em uso',
  })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    try {
      const result = await this.authUseCase.register(registerDto);

      // Definir cookies httpOnly
      const isProduction = process.env.NODE_ENV === 'production';

      response.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutos
        path: '/',
      });

      response.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
        path: '/auth/refresh',
      });

      return {
        user: UserResponseDto.fromEntity(result.user),
        message: 'Registration successful',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error during registration',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseRefreshToken()
  @ApiOperation({
    summary: 'Renovar access token',
    description: 'Renova o access token usando o refresh token do cookie httpOnly',
  })
  @ApiOkResponse({
    description: 'Token renovado com sucesso',
    type: RefreshResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token inválido ou expirado',
  })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshResponseDto> {
    try {
      const refreshToken = request.cookies?.refreshToken;

      if (!refreshToken) {
        throw new HttpException('Refresh token not found', HttpStatus.UNAUTHORIZED);
      }

      const result = await this.authUseCase.refreshToken({ refreshToken });

      // Definir novo access token
      const isProduction = process.env.NODE_ENV === 'production';

      response.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutos
        path: '/',
      });

      // Se houver novo refresh token, definir também
      if (result.refreshToken) {
        response.cookie('refreshToken', result.refreshToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
          path: '/auth/refresh',
        });
      }

      return {
        message: 'Token refreshed successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error during token refresh',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout do usuário',
    description: 'Remove os cookies de autenticação e invalida os tokens',
  })
  @ApiOkResponse({
    description: 'Logout realizado com sucesso',
    type: LogoutResponseDto,
  })
  async logout(
    @CurrentUser() user: UserEntity,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LogoutResponseDto> {
    try {
      await this.authUseCase.logout(user.id);

      // Remover cookies
      response.clearCookie('accessToken', { path: '/' });
      response.clearCookie('refreshToken', { path: '/auth/refresh' });

      return {
        message: 'Logged out successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error during logout',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obter dados do usuário atual',
    description: 'Retorna os dados do usuário autenticado',
  })
  @ApiOkResponse({
    description: 'Dados do usuário retornados com sucesso',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token de acesso inválido ou expirado',
  })
  async getMe(@CurrentUser() user: UserEntity): Promise<UserResponseDto> {
    return UserResponseDto.fromEntity(user);
  }
}
