import { IsString, IsOptional, IsObject, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateConversationDto {
  @ApiPropertyOptional({
    description: 'Título da conversa',
    example: 'Conversa sobre IA - Atualizada',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Contexto personalizado da conversa',
    example: { topic: 'machine learning', language: 'pt-BR' },
  })
  @IsOptional()
  @IsObject()
  context?: any;

  @ApiPropertyOptional({
    description: 'Status ativo da conversa',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
