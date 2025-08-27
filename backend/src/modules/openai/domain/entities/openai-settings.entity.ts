import { ApiProperty } from '@nestjs/swagger';

export class OpenAISettingsEntity {
  @ApiProperty({
    description: 'ID único das configurações',
    example: 'settings-uuid-123',
  })
  public readonly id: string;

  @ApiProperty({
    description: 'Nome da instância',
    example: 'minha-instancia',
  })
  public readonly instanceName: string;

  @ApiProperty({
    description: 'Tempo de expiração da sessão em segundos',
    example: 3600,
    required: false,
  })
  public readonly expire?: number;

  @ApiProperty({
    description: 'Palavra-chave para finalizar conversa',
    example: 'sair',
    required: false,
  })
  public readonly keywordFinish?: string;

  @ApiProperty({
    description: 'Delay entre mensagens em milissegundos',
    example: 1000,
    required: false,
  })
  public readonly delayMessage?: number;

  @ApiProperty({
    description: 'Mensagem para comandos desconhecidos',
    example: 'Desculpe, não entendi sua mensagem',
    required: false,
  })
  public readonly unknownMessage?: string;

  @ApiProperty({
    description: 'Escutar mensagens enviadas por mim',
    example: false,
    required: false,
  })
  public readonly listeningFromMe?: boolean;

  @ApiProperty({
    description: 'Parar bot quando eu envio mensagem',
    example: false,
    required: false,
  })
  public readonly stopBotFromMe?: boolean;

  @ApiProperty({
    description: 'Manter conversa aberta',
    example: true,
    required: false,
  })
  public readonly keepOpen?: boolean;

  @ApiProperty({
    description: 'Tempo de debounce em milissegundos',
    example: 1000,
    required: false,
  })
  public readonly debounceTime?: number;

  @ApiProperty({
    description: 'Configurações de webhook',
    type: Object,
    required: false,
  })
  public readonly webhookConfig?: {
    url?: string;
    events?: string[];
    enabled?: boolean;
  };

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-01T00:00:00Z',
  })
  public readonly createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2024-01-01T00:00:00Z',
  })
  public readonly updatedAt: Date;

  constructor(
    id: string,
    instanceName: string,
    createdAt: Date,
    updatedAt: Date,
    expire?: number,
    keywordFinish?: string,
    delayMessage?: number,
    unknownMessage?: string,
    listeningFromMe?: boolean,
    stopBotFromMe?: boolean,
    keepOpen?: boolean,
    debounceTime?: number,
    webhookConfig?: { url?: string; events?: string[]; enabled?: boolean },
  ) {
    this.id = id;
    this.instanceName = instanceName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.expire = expire;
    this.keywordFinish = keywordFinish;
    this.delayMessage = delayMessage;
    this.unknownMessage = unknownMessage;
    this.listeningFromMe = listeningFromMe;
    this.stopBotFromMe = stopBotFromMe;
    this.keepOpen = keepOpen;
    this.debounceTime = debounceTime;
    this.webhookConfig = webhookConfig;
  }

  // Métodos de negócio
  hasExpiration(): boolean {
    return !!this.expire && this.expire > 0;
  }

  hasKeywordFinish(): boolean {
    return !!this.keywordFinish && this.keywordFinish.trim().length > 0;
  }

  hasUnknownMessage(): boolean {
    return !!this.unknownMessage && this.unknownMessage.trim().length > 0;
  }

  hasWebhookConfig(): boolean {
    return !!this.webhookConfig && !!this.webhookConfig.url;
  }

  isWebhookEnabled(): boolean {
    return this.hasWebhookConfig() && this.webhookConfig!.enabled === true;
  }

  shouldKeepOpen(): boolean {
    return this.keepOpen === true;
  }

  shouldListenFromMe(): boolean {
    return this.listeningFromMe === true;
  }

  shouldStopBotFromMe(): boolean {
    return this.stopBotFromMe === true;
  }

  getInfo(): string {
    return `Settings for ${this.instanceName}`;
  }

  static create(data: {
    id: string;
    instanceName: string;
    createdAt?: Date;
    updatedAt?: Date;
    expire?: number;
    keywordFinish?: string;
    delayMessage?: number;
    unknownMessage?: string;
    listeningFromMe?: boolean;
    stopBotFromMe?: boolean;
    keepOpen?: boolean;
    debounceTime?: number;
    webhookConfig?: { url?: string; events?: string[]; enabled?: boolean };
  }): OpenAISettingsEntity {
    return new OpenAISettingsEntity(
      data.id,
      data.instanceName,
      data.createdAt || new Date(),
      data.updatedAt || new Date(),
      data.expire,
      data.keywordFinish,
      data.delayMessage,
      data.unknownMessage,
      data.listeningFromMe,
      data.stopBotFromMe,
      data.keepOpen,
      data.debounceTime,
      data.webhookConfig,
    );
  }
}
