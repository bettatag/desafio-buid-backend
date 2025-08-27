import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 'uuid-user-123',
  })
  id: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Data de criação do usuário',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2024-01-01T00:00:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Status ativo do usuário',
    example: true,
  })
  isActive: boolean;

  static fromEntity(entity: any): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = entity.id;
    dto.email = entity.email;
    dto.name = entity.name;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.isActive = entity.isActive;
    return dto;
  }
}
