import { ApiProperty } from '@nestjs/swagger';
import { OpenAISettingsEntity } from '../../domain/entities/openai-settings.entity';

export class OpenAISettingsResponseDto {
  @ApiProperty({
    description: 'Configurações OpenAI criadas/encontradas',
    type: OpenAISettingsEntity,
  })
  settings: OpenAISettingsEntity;

  @ApiProperty({ description: 'Mensagem de sucesso', example: 'Configurações criadas com sucesso' })
  message: string;
}

export class OpenAISettingsDeleteResponseDto {
  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Configurações deletadas com sucesso',
  })
  message: string;

  @ApiProperty({ description: 'ID das configurações deletadas', example: 'settings-123' })
  deletedId: string;
}
