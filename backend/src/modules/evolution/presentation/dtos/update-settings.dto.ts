import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsArray,
  IsUrl,
  IsOptional,
  ValidateNested,
  MaxLength,
  ArrayMaxSize,
} from 'class-validator';

class UpdateProxyDto {
  @ApiPropertyOptional({
    description: 'Host do servidor proxy',
    example: '127.0.0.1',
  })
  @IsOptional()
  @IsString()
  host?: string;

  @ApiPropertyOptional({
    description: 'Porta do servidor proxy',
    example: '8080',
  })
  @IsOptional()
  @IsString()
  port?: string;

  @ApiPropertyOptional({
    description: 'Protocolo do proxy',
    enum: ['http', 'https'],
    example: 'http',
  })
  @IsOptional()
  @IsString()
  protocol?: 'http' | 'https';

  @ApiPropertyOptional({
    description: 'Nome de usuário para autenticação no proxy',
    example: 'user',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    description: 'Senha para autenticação no proxy',
    example: 'password',
  })
  @IsOptional()
  @IsString()
  password?: string;
}

export class UpdateSettingsDto {
  @ApiPropertyOptional({
    description: 'URL do webhook para receber eventos',
    example: 'https://seu-webhook.com/callback',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  webhook?: string;

  @ApiPropertyOptional({
    description: 'Indica se o webhook deve ser acionado por eventos',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  webhook_by_events?: boolean;

  @ApiPropertyOptional({
    description: 'Lista de eventos que devem acionar o webhook',
    example: ['MESSAGE_RECEIVED', 'CONNECTION_UPDATE'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  events?: string[];

  @ApiPropertyOptional({
    description: 'Indica se deve rejeitar chamadas automaticamente',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  reject_call?: boolean;

  @ApiPropertyOptional({
    description: 'Mensagem enviada quando uma chamada é rejeitada',
    example: 'Chamadas não são aceitas',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  msg_call?: string;

  @ApiPropertyOptional({
    description: 'Indica se deve ignorar mensagens de grupos',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  groups_ignore?: boolean;

  @ApiPropertyOptional({
    description: 'Mantém a instância sempre online',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  always_online?: boolean;

  @ApiPropertyOptional({
    description: 'Marca mensagens como lidas automaticamente',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  read_messages?: boolean;

  @ApiPropertyOptional({
    description: 'Lê status/stories automaticamente',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  read_status?: boolean;

  @ApiPropertyOptional({
    description: 'Habilita conexão WebSocket',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  websocket_enabled?: boolean;

  @ApiPropertyOptional({
    description: 'Lista de eventos para WebSocket',
    example: ['MESSAGE_RECEIVED'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  websocket_events?: string[];

  @ApiPropertyOptional({
    description: 'Configurações do servidor proxy',
    type: UpdateProxyDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateProxyDto)
  proxy?: UpdateProxyDto;
}
