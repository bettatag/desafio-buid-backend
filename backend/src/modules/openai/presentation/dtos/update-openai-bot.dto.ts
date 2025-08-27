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

export class UpdateOpenAIBotDto {
  @ApiProperty({
    description: 'Nome do bot OpenAI',
    example: 'Assistente de Vendas Atualizado',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Status do bot (ativo/inativo)',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiProperty({
    description: 'ID das credenciais OpenAI',
    example: 'creds-uuid-456',
    required: false,
  })
  @IsOptional()
  @IsString()
  openaiCredsId?: string;

  @ApiProperty({
    description: 'Tipo do bot',
    enum: ['assistant', 'chatCompletion'],
    example: 'chatCompletion',
    required: false,
  })
  @IsOptional()
  @IsEnum(['assistant', 'chatCompletion'])
  botType?: BotType;

  @ApiProperty({
    description: 'ID do assistente OpenAI',
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
    example: 'gpt-4',
    required: false,
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({
    description: 'Mensagens de sistema',
    type: [String],
    example: ['Você é um assistente de vendas especializado'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  systemMessages?: string[];

  @ApiProperty({
    description: 'Mensagens do assistente',
    type: [String],
    example: ['Posso ajudá-lo com informações sobre nossos produtos'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assistantMessages?: string[];

  @ApiProperty({
    description: 'Mensagens do usuário',
    type: [String],
    example: ['Quero comprar', 'Preciso de informações'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  userMessages?: string[];

  @ApiProperty({
    description: 'Número máximo de tokens (1-4096)',
    example: 1500,
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
    required: false,
  })
  @IsOptional()
  @IsEnum(['all', 'keyword'])
  triggerType?: TriggerType;

  @ApiProperty({
    description: 'Operador do trigger',
    enum: ['contains', 'equals', 'startsWith', 'endsWith', 'regex', 'none'],
    example: 'startsWith',
    required: false,
  })
  @IsOptional()
  @IsEnum(['contains', 'equals', 'startsWith', 'endsWith', 'regex', 'none'])
  triggerOperator?: TriggerOperator;

  @ApiProperty({
    description: 'Valor do trigger',
    example: 'comprar',
    required: false,
  })
  @IsOptional()
  @IsString()
  triggerValue?: string;

  @ApiProperty({
    description: 'Tempo de expiração em minutos',
    example: 60,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  expire?: number;

  @ApiProperty({
    description: 'Palavra-chave para finalizar conversa',
    example: 'tchau',
    required: false,
  })
  @IsOptional()
  @IsString()
  keywordFinish?: string;

  @ApiProperty({
    description: 'Delay entre mensagens em milissegundos',
    example: 2000,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  delayMessage?: number;

  @ApiProperty({
    description: 'Mensagem para comandos desconhecidos',
    example: 'Não entendi. Digite "vendas" para falar com nosso assistente',
    required: false,
  })
  @IsOptional()
  @IsString()
  unknownMessage?: string;

  @ApiProperty({
    description: 'Escutar mensagens enviadas por mim',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  listeningFromMe?: boolean;

  @ApiProperty({
    description: 'Parar bot quando eu envio mensagem',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  stopBotFromMe?: boolean;

  @ApiProperty({
    description: 'Manter conversa aberta',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  keepOpen?: boolean;

  @ApiProperty({
    description: 'Tempo de debounce em milissegundos',
    example: 500,
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
    example: ['5511888777666@s.whatsapp.net', '5511999887766@s.whatsapp.net'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ignoreJids?: string[];
}
