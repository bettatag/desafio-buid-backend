import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsObject, IsArray, IsBoolean } from 'class-validator';

export class WebhookMessageDto {
  @ApiProperty({
    description: 'ID da mensagem',
    example: 'msg_123456789',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Timestamp da mensagem',
    example: 1640995200000,
  })
  timestamp: number;

  @ApiProperty({
    description: 'JID do remetente',
    example: '5511999999999@s.whatsapp.net',
  })
  @IsString()
  @IsNotEmpty()
  from: string;

  @ApiProperty({
    description: 'Conteúdo da mensagem',
    example: 'Olá, como você está?',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    description: 'Tipo da mensagem',
    example: 'conversation',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Indica se a mensagem é de mim',
    example: false,
  })
  @IsBoolean()
  fromMe: boolean;
}

export class WebhookInstanceDto {
  @ApiProperty({
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  @IsString()
  @IsNotEmpty()
  instanceName: string;

  @ApiProperty({
    description: 'Status da instância',
    example: 'open',
  })
  @IsString()
  status: string;
}

export class WebhookEventDto {
  @ApiProperty({
    description: 'Tipo do evento',
    example: 'messages.upsert',
  })
  @IsString()
  @IsNotEmpty()
  event: string;

  @ApiProperty({
    description: 'Informações da instância',
    type: WebhookInstanceDto,
  })
  @IsObject()
  instance: WebhookInstanceDto;

  @ApiProperty({
    description: 'Dados da mensagem (quando aplicável)',
    type: WebhookMessageDto,
    required: false,
  })
  @IsOptional()
  @IsObject()
  data?: WebhookMessageDto;

  @ApiProperty({
    description: 'Dados adicionais do evento',
    required: false,
  })
  @IsOptional()
  @IsObject()
  payload?: any;
}

