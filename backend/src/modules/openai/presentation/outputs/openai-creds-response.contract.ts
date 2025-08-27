import { ApiProperty } from '@nestjs/swagger';
import { OpenAICredsEntity } from '../../domain/entities/openai-creds.entity';

export class OpenAICredsResponseDto {
  @ApiProperty({ description: 'Credenciais OpenAI criadas/encontradas', type: OpenAICredsEntity })
  creds: OpenAICredsEntity;

  @ApiProperty({ description: 'Mensagem de sucesso', example: 'Credenciais criadas com sucesso' })
  message: string;
}

export class OpenAICredsListResponseDto {
  @ApiProperty({
    description: 'Lista de credenciais OpenAI',
    type: [OpenAICredsEntity],
    isArray: true,
  })
  creds: OpenAICredsEntity[];

  @ApiProperty({ description: 'Total de credenciais encontradas', example: 2 })
  total: number;

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Credenciais encontradas com sucesso',
  })
  message: string;
}

export class OpenAICredsDeleteResponseDto {
  @ApiProperty({ description: 'Mensagem de sucesso', example: 'Credenciais deletadas com sucesso' })
  message: string;

  @ApiProperty({ description: 'ID das credenciais deletadas', example: 'creds-123' })
  deletedId: string;
}
