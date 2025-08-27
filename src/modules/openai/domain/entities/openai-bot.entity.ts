import { ApiProperty } from '@nestjs/swagger';

export type BotType = 'assistant' | 'chatCompletion';
export type TriggerType = 'all' | 'keyword';
export type TriggerOperator = 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'regex' | 'none';

export class OpenAIBotEntity {
  @ApiProperty({
    description: 'ID único do bot OpenAI',
    example: 'bot-uuid-123',
  })
  public readonly id: string;

  @ApiProperty({
    description: 'Nome do bot',
    example: 'Assistente Virtual',
  })
  public readonly name: string;

  @ApiProperty({
    description: 'Status do bot (ativo/inativo)',
    example: true,
  })
  public readonly enabled: boolean;

  @ApiProperty({
    description: 'ID das credenciais OpenAI',
    example: 'creds-uuid-456',
  })
  public readonly openaiCredsId: string;

  @ApiProperty({
    description: 'Tipo do bot',
    enum: ['assistant', 'chatCompletion'],
    example: 'chatCompletion',
  })
  public readonly botType: BotType;

  @ApiProperty({
    description: 'ID do assistente OpenAI (para tipo assistant)',
    example: 'asst_abc123',
    required: false,
  })
  public readonly assistantId?: string;

  @ApiProperty({
    description: 'URL da função personalizada',
    example: 'https://api.example.com/function',
    required: false,
  })
  public readonly functionUrl?: string;

  @ApiProperty({
    description: 'Modelo OpenAI a ser usado',
    example: 'gpt-3.5-turbo',
    required: false,
  })
  public readonly model?: string;

  @ApiProperty({
    description: 'Mensagens de sistema',
    type: [String],
    example: ['Você é um assistente útil'],
    required: false,
  })
  public readonly systemMessages?: string[];

  @ApiProperty({
    description: 'Mensagens do assistente',
    type: [String],
    example: ['Como posso ajudá-lo?'],
    required: false,
  })
  public readonly assistantMessages?: string[];

  @ApiProperty({
    description: 'Mensagens do usuário',
    type: [String],
    example: ['Olá'],
    required: false,
  })
  public readonly userMessages?: string[];

  @ApiProperty({
    description: 'Número máximo de tokens',
    example: 1000,
    required: false,
  })
  public readonly maxTokens?: number;

  @ApiProperty({
    description: 'Tipo de trigger',
    enum: ['all', 'keyword'],
    example: 'keyword',
  })
  public readonly triggerType: TriggerType;

  @ApiProperty({
    description: 'Operador do trigger',
    enum: ['contains', 'equals', 'startsWith', 'endsWith', 'regex', 'none'],
    example: 'contains',
  })
  public readonly triggerOperator: TriggerOperator;

  @ApiProperty({
    description: 'Valor do trigger',
    example: 'ajuda',
    required: false,
  })
  public readonly triggerValue?: string;

  @ApiProperty({
    description: 'Tempo de expiração em minutos',
    example: 30,
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
    description: 'Delay entre mensagens em ms',
    example: 1000,
    required: false,
  })
  public readonly delayMessage?: number;

  @ApiProperty({
    description: 'Mensagem para comandos desconhecidos',
    example: 'Desculpe, não entendi',
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
    description: 'Tempo de debounce em ms',
    example: 1000,
    required: false,
  })
  public readonly debounceTime?: number;

  @ApiProperty({
    description: 'JIDs a serem ignorados',
    type: [String],
    example: ['5511999887766@s.whatsapp.net'],
    required: false,
  })
  public readonly ignoreJids?: string[];

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
    name: string,
    enabled: boolean,
    openaiCredsId: string,
    botType: BotType,
    triggerType: TriggerType,
    triggerOperator: TriggerOperator,
    createdAt: Date,
    updatedAt: Date,
    assistantId?: string,
    functionUrl?: string,
    model?: string,
    systemMessages?: string[],
    assistantMessages?: string[],
    userMessages?: string[],
    maxTokens?: number,
    triggerValue?: string,
    expire?: number,
    keywordFinish?: string,
    delayMessage?: number,
    unknownMessage?: string,
    listeningFromMe?: boolean,
    stopBotFromMe?: boolean,
    keepOpen?: boolean,
    debounceTime?: number,
    ignoreJids?: string[],
  ) {
    this.id = id;
    this.name = name;
    this.enabled = enabled;
    this.openaiCredsId = openaiCredsId;
    this.botType = botType;
    this.triggerType = triggerType;
    this.triggerOperator = triggerOperator;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.assistantId = assistantId;
    this.functionUrl = functionUrl;
    this.model = model;
    this.systemMessages = systemMessages;
    this.assistantMessages = assistantMessages;
    this.userMessages = userMessages;
    this.maxTokens = maxTokens;
    this.triggerValue = triggerValue;
    this.expire = expire;
    this.keywordFinish = keywordFinish;
    this.delayMessage = delayMessage;
    this.unknownMessage = unknownMessage;
    this.listeningFromMe = listeningFromMe;
    this.stopBotFromMe = stopBotFromMe;
    this.keepOpen = keepOpen;
    this.debounceTime = debounceTime;
    this.ignoreJids = ignoreJids;
  }

  // Métodos de negócio
  isActive(): boolean {
    return this.enabled;
  }

  isAssistantType(): boolean {
    return this.botType === 'assistant';
  }

  isChatCompletionType(): boolean {
    return this.botType === 'chatCompletion';
  }

  hasAssistantId(): boolean {
    return !!this.assistantId && this.assistantId.trim().length > 0;
  }

  hasFunctionUrl(): boolean {
    return !!this.functionUrl && this.functionUrl.trim().length > 0;
  }

  hasModel(): boolean {
    return !!this.model && this.model.trim().length > 0;
  }

  hasSystemMessages(): boolean {
    return !!this.systemMessages && this.systemMessages.length > 0;
  }

  hasKeywordTrigger(): boolean {
    return this.triggerType === 'keyword' && !!this.triggerValue;
  }

  hasExpiration(): boolean {
    return !!this.expire && this.expire > 0;
  }

  shouldIgnoreJid(jid: string): boolean {
    return !!this.ignoreJids && this.ignoreJids.includes(jid);
  }

  getInfo(): string {
    return `${this.name} (${this.botType})`;
  }

  static create(data: {
    id: string;
    name: string;
    enabled: boolean;
    openaiCredsId: string;
    botType: BotType;
    triggerType: TriggerType;
    triggerOperator: TriggerOperator;
    createdAt?: Date;
    updatedAt?: Date;
    assistantId?: string;
    functionUrl?: string;
    model?: string;
    systemMessages?: string[];
    assistantMessages?: string[];
    userMessages?: string[];
    maxTokens?: number;
    triggerValue?: string;
    expire?: number;
    keywordFinish?: string;
    delayMessage?: number;
    unknownMessage?: string;
    listeningFromMe?: boolean;
    stopBotFromMe?: boolean;
    keepOpen?: boolean;
    debounceTime?: number;
    ignoreJids?: string[];
  }): OpenAIBotEntity {
    return new OpenAIBotEntity(
      data.id,
      data.name,
      data.enabled,
      data.openaiCredsId,
      data.botType,
      data.triggerType,
      data.triggerOperator,
      data.createdAt || new Date(),
      data.updatedAt || new Date(),
      data.assistantId,
      data.functionUrl,
      data.model,
      data.systemMessages,
      data.assistantMessages,
      data.userMessages,
      data.maxTokens,
      data.triggerValue,
      data.expire,
      data.keywordFinish,
      data.delayMessage,
      data.unknownMessage,
      data.listeningFromMe,
      data.stopBotFromMe,
      data.keepOpen,
      data.debounceTime,
      data.ignoreJids,
    );
  }
}
