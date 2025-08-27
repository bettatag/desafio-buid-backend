import { Type } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsArray,
  IsEnum,
  ValidateNested,
  Length,
  IsUrl,
  IsNotEmpty,
  ArrayMaxSize,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class ProxyDto {
  @ApiProperty({
    description: 'Host do servidor proxy',
    example: '127.0.0.1',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  host: string;

  @ApiProperty({
    description: 'Porta do servidor proxy',
    example: '8080',
    minLength: 1,
    maxLength: 5,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 5)
  port: string;

  @ApiProperty({
    description: 'Protocolo do proxy',
    enum: ['http', 'https'],
    example: 'http',
  })
  @IsEnum(['http', 'https'])
  protocol: 'http' | 'https';

  @ApiProperty({
    description: 'Nome de usuário para autenticação no proxy',
    example: 'user',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  username: string;

  @ApiProperty({
    description: 'Senha para autenticação no proxy',
    example: 'password',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  password: string;
}

export class CreateEvolutionInstanceDto {
  @ApiProperty({
    description: 'Nome da instância do Evolution',
    example: 'minha-instancia',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  instanceName: string;

  @ApiProperty({
    description: 'Token de acesso para a instância',
    example: 'seu-token-aqui-com-pelo-menos-10-caracteres',
    minLength: 10,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 500)
  token: string;

  @ApiProperty({
    description: 'Indica se deve gerar QR Code para conexão',
    example: true,
  })
  @IsBoolean()
  qrcode: boolean;

  @ApiProperty({
    description: 'Número do WhatsApp (com código do país)',
    example: '5511999999999',
    minLength: 8,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  number: string;

  @ApiProperty({
    description: 'Tipo de integração do WhatsApp',
    enum: ['WHATSAPP-BAILEYS'],
    example: 'WHATSAPP-BAILEYS',
  })
  @IsEnum(['WHATSAPP-BAILEYS'])
  integration: 'WHATSAPP-BAILEYS';

  @ApiProperty({
    description: 'URL do webhook para receber eventos',
    example: 'https://seu-webhook.com/callback',
    maxLength: 500,
  })
  @IsString()
  @IsUrl()
  @MaxLength(500)
  webhook: string;

  @ApiProperty({
    description: 'Indica se o webhook deve ser acionado por eventos',
    example: true,
  })
  @IsBoolean()
  webhook_by_events: boolean;

  @ApiProperty({
    description: 'Lista de eventos que devem acionar o webhook',
    example: ['MESSAGE_RECEIVED', 'CONNECTION_UPDATE', 'QRCODE_UPDATED'],
    type: [String],
    maxItems: 50,
  })
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  events: string[];

  @ApiProperty({
    description: 'Indica se deve rejeitar chamadas automáticamente',
    example: false,
  })
  @IsBoolean()
  reject_call: boolean;

  @ApiProperty({
    description: 'Mensagem enviada quando uma chamada é rejeitada',
    example: 'Chamadas não são aceitas nesta instância',
    maxLength: 500,
  })
  @IsString()
  @MaxLength(500)
  msg_call: string;

  @ApiProperty({
    description: 'Indica se deve ignorar mensagens de grupos',
    example: false,
  })
  @IsBoolean()
  groups_ignore: boolean;

  @ApiProperty({
    description: 'Mantém a instância sempre online',
    example: true,
  })
  @IsBoolean()
  always_online: boolean;

  @ApiProperty({
    description: 'Marca mensagens como lidas automaticamente',
    example: true,
  })
  @IsBoolean()
  read_messages: boolean;

  @ApiProperty({
    description: 'Lê status/stories automaticamente',
    example: true,
  })
  @IsBoolean()
  read_status: boolean;

  @ApiProperty({
    description: 'Habilita conexão WebSocket',
    example: false,
  })
  @IsBoolean()
  websocket_enabled: boolean;

  @ApiProperty({
    description: 'Lista de eventos para WebSocket',
    example: ['MESSAGE_RECEIVED', 'CONNECTION_UPDATE'],
    type: [String],
    maxItems: 50,
  })
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  websocket_events: string[];

  @ApiProperty({
    description: 'Configurações do servidor proxy',
    type: ProxyDto,
  })
  @ValidateNested()
  @Type(() => ProxyDto)
  proxy: ProxyDto;
}
