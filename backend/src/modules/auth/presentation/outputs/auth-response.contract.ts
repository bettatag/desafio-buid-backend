import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../dtos/user-response.dto';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Dados do usuário autenticado',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Login successful',
  })
  message: string;
}

export class RefreshResponseDto {
  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Token refreshed successfully',
  })
  message: string;
}

export class LogoutResponseDto {
  @ApiProperty({
    description: 'Mensagem de logout',
    example: 'Logged out successfully',
  })
  message: string;
}
