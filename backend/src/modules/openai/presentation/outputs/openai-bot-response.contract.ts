import { ApiProperty } from '@nestjs/swagger';
import { OpenAIBotEntity } from '../../domain/entities/openai-bot.entity';

export class OpenAIBotResponseDto {
  @ApiProperty({ description: 'Bot OpenAI criado/atualizado', type: OpenAIBotEntity })
  bot: OpenAIBotEntity;

  @ApiProperty({ description: 'Mensagem de sucesso', example: 'Bot criado com sucesso' })
  message: string;
}

export class OpenAIBotListResponseDto {
  @ApiProperty({
    description: 'Lista de bots OpenAI',
    type: [OpenAIBotEntity],
    isArray: true,
  })
  bots: OpenAIBotEntity[];

  @ApiProperty({ description: 'Total de bots encontrados', example: 3 })
  total: number;

  @ApiProperty({ description: 'Mensagem de sucesso', example: 'Bots encontrados com sucesso' })
  message: string;
}

export class OpenAIBotDeleteResponseDto {
  @ApiProperty({ description: 'Mensagem de sucesso', example: 'Bot deletado com sucesso' })
  message: string;

  @ApiProperty({ description: 'ID do bot deletado', example: 'bot-123' })
  deletedId: string;
}

export class OpenAIBotStatusResponseDto {
  @ApiProperty({ description: 'ID do bot', example: 'bot-123' })
  id: string;

  @ApiProperty({ description: 'Status atual do bot', example: true })
  enabled: boolean;

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Status do bot alterado com sucesso',
  })
  message: string;
}
