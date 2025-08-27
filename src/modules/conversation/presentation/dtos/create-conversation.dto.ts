import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiPropertyOptional({
    description: 'Título da conversa',
    example: 'Conversa sobre IA',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Contexto personalizado da conversa',
    example: { topic: 'artificial intelligence', language: 'pt-BR' },
  })
  @IsOptional()
  @IsObject()
  context?: any;
}
