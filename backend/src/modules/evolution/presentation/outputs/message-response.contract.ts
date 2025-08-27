import { ApiProperty } from '@nestjs/swagger';
import { MessageEntity } from '../../domain/entities/message.entity';

export class SendMessageResponseDto {
  @ApiProperty({
    description: 'ID da mensagem enviada',
    example: 'msg-123456789',
  })
  messageId: string;

  @ApiProperty({
    description: 'Status do envio',
    enum: ['sent', 'pending', 'failed'],
    example: 'sent',
  })
  status: 'sent' | 'pending' | 'failed';

  @ApiProperty({
    description: 'Timestamp do envio',
    example: 1640995200000,
  })
  timestamp: number;

  @ApiProperty({
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  instanceName: string;

  @ApiProperty({
    description: 'Destinatário da mensagem',
    example: '5511999999999@s.whatsapp.net',
  })
  to: string;

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Mensagem enviada com sucesso',
  })
  message: string;
}

export class MessageHistoryResponseDto {
  @ApiProperty({
    description: 'Lista de mensagens',
    type: [MessageEntity],
  })
  messages: MessageEntity[];

  @ApiProperty({
    description: 'Total de mensagens encontradas',
    example: 25,
  })
  total: number;

  @ApiProperty({
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  instanceName: string;

  @ApiProperty({
    description: 'Número do contato',
    example: '5511999999999',
  })
  contactNumber: string;

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Histórico de mensagens recuperado com sucesso',
  })
  message: string;
}

export class WebhookProcessResponseDto {
  @ApiProperty({
    description: 'Status do processamento',
    example: 'processed',
  })
  status: string;

  @ApiProperty({
    description: 'Tipo do evento processado',
    example: 'messages.upsert',
  })
  eventType: string;

  @ApiProperty({
    description: 'Timestamp do processamento',
    example: 1640995200000,
  })
  processedAt: number;

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Evento webhook processado com sucesso',
  })
  message: string;
}

