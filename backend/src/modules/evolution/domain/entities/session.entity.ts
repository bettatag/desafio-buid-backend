import { ApiProperty } from '@nestjs/swagger';

export class SessionEntity {
  @ApiProperty({
    description: 'ID único da sessão',
    example: 'session_123456789',
  })
  public readonly id: string;

  @ApiProperty({
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  public readonly instanceName: string;

  @ApiProperty({
    description: 'JID do contato',
    example: '5511999999999@s.whatsapp.net',
  })
  public readonly remoteJid: string;

  @ApiProperty({
    description: 'Status da sessão',
    enum: ['opened', 'paused', 'closed'],
    example: 'opened',
  })
  public readonly status: 'opened' | 'paused' | 'closed';

  @ApiProperty({
    description: 'Contexto da conversa',
    example: 'Cliente interessado em produtos',
  })
  public readonly context: string;

  @ApiProperty({
    description: 'Timestamp da criação da sessão',
    example: 1640995200000,
  })
  public readonly createdAt: number;

  @ApiProperty({
    description: 'Timestamp da última atualização',
    example: 1640995800000,
  })
  public readonly updatedAt: number;

  @ApiProperty({
    description: 'Timestamp da última mensagem',
    example: 1640995800000,
  })
  public readonly lastMessageAt?: number;

  @ApiProperty({
    description: 'Total de mensagens na sessão',
    example: 15,
  })
  public readonly messageCount: number;

  constructor(
    id: string,
    instanceName: string,
    remoteJid: string,
    status: 'opened' | 'paused' | 'closed',
    context: string,
    createdAt: number,
    updatedAt: number,
    messageCount: number,
    lastMessageAt?: number,
  ) {
    this.id = id;
    this.instanceName = instanceName;
    this.remoteJid = remoteJid;
    this.status = status;
    this.context = context;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.messageCount = messageCount;
    this.lastMessageAt = lastMessageAt;
  }

  // Métodos de negócio
  public isActive(): boolean {
    return this.status === 'opened';
  }

  public isPaused(): boolean {
    return this.status === 'paused';
  }

  public isClosed(): boolean {
    return this.status === 'closed';
  }

  public canReceiveMessages(): boolean {
    return this.status === 'opened';
  }

  public shouldProcessWithAI(): boolean {
    return this.status === 'opened';
  }

  public static create(
    instanceName: string,
    remoteJid: string,
    status: 'opened' | 'paused' | 'closed' = 'opened',
    context: string = '',
  ): SessionEntity {
    const now = Date.now();
    const id = `session_${now}_${Math.random().toString(36).substr(2, 9)}`;

    return new SessionEntity(
      id,
      instanceName,
      remoteJid,
      status,
      context,
      now,
      now,
      0,
    );
  }
}
