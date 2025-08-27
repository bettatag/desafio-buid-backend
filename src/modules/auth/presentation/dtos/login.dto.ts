import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'admin@teste.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'admin123',
    minLength: 6,
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({
    description: 'Lembrar do login por mais tempo',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Remember me must be a boolean' })
  rememberMe?: boolean;
}
