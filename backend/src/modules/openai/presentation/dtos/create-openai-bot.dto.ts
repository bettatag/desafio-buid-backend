import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  IsNumber,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { BotType, TriggerType, TriggerOperator } from '../../domain/entities/openai-bot.entity';

export class CreateOpenAIBotDto {
  @ApiProperty({
    description: 'Nome do bot OpenAI',
    example: 'Assistente de Vendas',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Status do bot (ativo/inativo)',
    example: true,
  })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({
    description: 'ID das credenciais OpenAI',
    example: 'creds-uuid-456',
  })
  @IsString()
  openaiCredsId: string;

  @ApiProperty({
    description: 'Tipo do bot',
    enum: ['assistant', 'chatCompletion'],
    example: 'chatCompletion',
  })
  @IsEnum(['assistant', 'chatCompletion'])
  botType: BotType;

  @ApiProperty({
    description: 'ID do assistente OpenAI (obrigatório para tipo assistant)',
    example: 'asst_abc123',
    required: false,
  })
  @IsOptional()
  @IsString()
  assistantId?: string;

  @ApiProperty({
    description: 'URL da função personalizada',
    example: 'https://api.example.com/function',
    required: false,
  })
  @IsOptional()
  @IsString()
  functionUrl?: string;

  @ApiProperty({
    description: 'Modelo OpenAI a ser usado',
    example: 'gpt-3.5-turbo',
    required: false,
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({
    description: 'Mensagens de sistema',
    type: [String],
    example: ['Você é um assistente útil e prestativo'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  systemMessages?: string[];

  @ApiProperty({
    description: 'Mensagens do assistente',
    type: [String],
    example: ['Como posso ajudá-lo hoje?'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assistantMessages?: string[];

  @ApiProperty({
    description: 'Mensagens do usuário',
    type: [String],
    example: ['Olá', 'Preciso de ajuda'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  userMessages?: string[];

  @ApiProperty({
    description: 'Número máximo de tokens (1-4096)',
    example: 1000,
    minimum: 1,
    maximum: 4096,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4096)
  maxTokens?: number;

  @ApiProperty({
    description: 'Tipo de trigger',
    enum: ['all', 'keyword'],
    example: 'keyword',
  })
  @IsEnum(['all', 'keyword'])
  triggerType: TriggerType;

  @ApiProperty({
    description: 'Operador do trigger',
    enum: ['contains', 'equals', 'startsWith', 'endsWith', 'regex', 'none'],
    example: 'contains',
  })
  @IsEnum(['contains', 'equals', 'startsWith', 'endsWith', 'regex', 'none'])
  triggerOperator: TriggerOperator;

  @ApiProperty({
    description: 'Valor do trigger (obrigatório para trigger tipo keyword)',
    example: 'vendas',
    required: false,
  })
  @IsOptional()
  @IsString()
  triggerValue?: string;

  @ApiProperty({
    description: 'Tempo de expiração em minutos',
    example: 30,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
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
    description: 'Lista de JIDs a serem ignorados',
    type: [String],
    example: ['5511999887766@s.whatsapp.net'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ignoreJids?: string[];
}
