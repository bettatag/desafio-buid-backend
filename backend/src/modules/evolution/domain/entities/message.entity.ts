import { ApiProperty } from '@nestjs/swagger';

export class MessageEntity {
  @ApiProperty({
    description: 'ID único da mensagem',
    example: 'msg_123456789',
  })
  public readonly id: string;

  @ApiProperty({
    description: 'Timestamp da mensagem',
    example: 1640995200000,
  })
  public readonly timestamp: number;

  @ApiProperty({
    description: 'JID do remetente',
    example: '5511999999999@s.whatsapp.net',
  })
  public readonly from: string;

  @ApiProperty({
    description: 'JID do destinatário',
    example: '5511888888888@s.whatsapp.net',
  })
  public readonly to: string;

  @ApiProperty({
    description: 'Conteúdo da mensagem',
    example: 'Olá, como você está?',
  })
  public readonly content: string;

  @ApiProperty({
    description: 'Tipo da mensagem',
    example: 'text',
  })
  public readonly type: string;

  @ApiProperty({
    description: 'Status da mensagem',
    example: 'sent',
  })
  public readonly status: string;

  @ApiProperty({
    description: 'Indica se a mensagem é de mim',
    example: false,
  })
  public readonly fromMe: boolean;

  @ApiProperty({
    description: 'Nome da instância que enviou/recebeu a mensagem',
    example: 'minha-instancia',
  })
  public readonly instanceName: string;

  constructor(
    id: string,
    timestamp: number,
    from: string,
    to: string,
    content: string,
    type: string,
    status: string,
    fromMe: boolean,
    instanceName: string,
  ) {
    this.id = id;
    this.timestamp = timestamp;
    this.from = from;
    this.to = to;
    this.content = content;
    this.type = type;
    this.status = status;
    this.fromMe = fromMe;
    this.instanceName = instanceName;
  }
}

