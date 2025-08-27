import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class ChangeSessionStatusDto {
  @ApiProperty({
    description: 'JID do contato para alterar o status da sessão',
    example: '5511999999999@s.whatsapp.net',
  })
  @IsString()
  @IsNotEmpty()
  remoteJid: string;

  @ApiProperty({
    description: 'Novo status da sessão',
    enum: ['opened', 'paused', 'closed'],
    example: 'opened',
  })
  @IsEnum(['opened', 'paused', 'closed'])
  status: 'opened' | 'paused' | 'closed';
}

export class CreateSessionDto {
  @ApiProperty({
    description: 'JID do contato para criar a sessão',
    example: '5511999999999@s.whatsapp.net',
  })
  @IsString()
  @IsNotEmpty()
  remoteJid: string;

  @ApiProperty({
    description: 'Status inicial da sessão',
    enum: ['opened', 'paused', 'closed'],
    example: 'opened',
    required: false,
  })
  @IsOptional()
  @IsEnum(['opened', 'paused', 'closed'])
  status?: 'opened' | 'paused' | 'closed';

  @ApiProperty({
    description: 'Contexto inicial da sessão',
    example: 'Cliente interessado em produtos',
    required: false,
  })
  @IsOptional()
  @IsString()
  context?: string;
}

export class GetSessionsQueryDto {
  @ApiProperty({
    description: 'Status das sessões para filtrar',
    enum: ['opened', 'paused', 'closed', 'all'],
    example: 'opened',
    required: false,
  })
  @IsOptional()
  @IsEnum(['opened', 'paused', 'closed', 'all'])
  status?: 'opened' | 'paused' | 'closed' | 'all';

  @ApiProperty({
    description: 'Limite de sessões a retornar',
    example: 50,
    required: false,
  })
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description: 'Deslocamento para paginação',
    example: 0,
    required: false,
  })
  @IsOptional()
  offset?: number;
}
