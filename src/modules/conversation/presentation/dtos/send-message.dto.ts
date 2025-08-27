import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({
    description: 'Mensagem do usuário',
    example: 'Olá, como você pode me ajudar?',
  })
  @IsString()
  message: string;

  @ApiPropertyOptional({
    description: 'Modelo OpenAI a ser usado',
    example: 'gpt-4',
    default: 'gpt-4',
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({
    description: 'Temperatura para controlar criatividade (0.0 - 2.0)',
    example: 0.7,
    minimum: 0,
    maximum: 2,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @ApiPropertyOptional({
    description: 'Máximo de tokens na resposta',
    example: 1000,
    minimum: 1,
    maximum: 4000,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4000)
  maxTokens?: number;
}
