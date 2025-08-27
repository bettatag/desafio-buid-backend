import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsBoolean, IsOptional, IsObject, Min, Max } from 'class-validator';

class WebhookConfigDto {
  @ApiProperty({
    description: 'URL do webhook',
    example: 'https://meu-webhook.com/openai',
    required: false,
  })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({
    description: 'Eventos que devem acionar o webhook',
    type: [String],
    example: ['MESSAGE_RECEIVED', 'BOT_RESPONSE_SENT'],
    required: false,
  })
  @IsOptional()
  events?: string[];

  @ApiProperty({
    description: 'Status do webhook (ativo/inativo)',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class CreateOpenAISettingsDto {
  @ApiProperty({
    description: 'Tempo de expiração da sessão em segundos (60-86400)',
    example: 3600,
    minimum: 60,
    maximum: 86400,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(60)
  @Max(86400)
  expire?: number;

  @ApiProperty({
    description: 'Palavra-chave para finalizar conversa',
    example: 'sair',
    required: false,
  })
  @IsOptional()
  @IsString()
  keywordFinish?: string;

  @ApiProperty({
    description: 'Delay entre mensagens em milissegundos',
    example: 1000,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  delayMessage?: number;

  @ApiProperty({
    description: 'Mensagem para comandos desconhecidos',
    example: 'Desculpe, não entendi sua mensagem',
    required: false,
  })
  @IsOptional()
  @IsString()
  unknownMessage?: string;

  @ApiProperty({
    description: 'Escutar mensagens enviadas por mim',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  listeningFromMe?: boolean;

  @ApiProperty({
    description: 'Parar bot quando eu envio mensagem',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  stopBotFromMe?: boolean;

  @ApiProperty({
    description: 'Manter conversa aberta',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  keepOpen?: boolean;

  @ApiProperty({
    description: 'Tempo de debounce em milissegundos',
    example: 1000,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  debounceTime?: number;

  @ApiProperty({
    description: 'Configurações de webhook',
    type: WebhookConfigDto,
    required: false,
  })
  @IsOptional()
  @IsObject()
  webhookConfig?: WebhookConfigDto;
}
