export enum MessageRole {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
  SYSTEM = 'SYSTEM',
}

export interface MessageMetadata {
  tokensUsed?: number;
  model?: string;
  finishReason?: string;
  temperature?: number;
  maxTokens?: number;
  [key: string]: any;
}

export class ConversationMessageEntity {
  constructor(
    public readonly id: string,
    public readonly conversationId: string,
    public readonly content: string,
    public readonly role: MessageRole,
    public readonly createdAt: Date,
    public readonly metadata: MessageMetadata | null = null,
    public readonly openaiMessageId: string | null = null,
    public readonly tokensUsed: number | null = null,
    public readonly model: string | null = null,
    public readonly finishReason: string | null = null,
  ) {}

  // Métodos de negócio
  public isUserMessage(): boolean {
    return this.role === MessageRole.USER;
  }

  public isAssistantMessage(): boolean {
    return this.role === MessageRole.ASSISTANT;
  }

  public isSystemMessage(): boolean {
    return this.role === MessageRole.SYSTEM;
  }

  public hasTokenUsage(): boolean {
    return this.tokensUsed !== null && this.tokensUsed > 0;
  }

  public getTokenCost(): number {
    if (!this.hasTokenUsage()) return 0;
    
    // Custo aproximado por token (pode ser configurável)
    const costPerToken = 0.000002; // $0.000002 por token (exemplo GPT-4)
    return this.tokensUsed! * costPerToken;
  }

  public belongsToConversation(conversationId: string): boolean {
    return this.conversationId === conversationId;
  }

  // Métodos adicionais para os testes
  public isFromUser(): boolean {
    return this.role === MessageRole.USER;
  }

  public isFromAssistant(): boolean {
    return this.role === MessageRole.ASSISTANT;
  }

  public isFromSystem(): boolean {
    return this.role === MessageRole.SYSTEM;
  }

  public getAge(): number {
    return Date.now() - this.createdAt.getTime();
  }

  public getContentLength(): number {
    return this.content.length;
  }

  public getMetadataValue(key: string, defaultValue?: any): any {
    if (!this.metadata) return defaultValue;
    return this.metadata[key] !== undefined ? this.metadata[key] : defaultValue;
  }

  public isComplete(): boolean {
    return this.finishReason !== null && this.finishReason !== undefined;
  }

  // Factory methods
  public static createUserMessage(
    id: string,
    conversationId: string,
    content: string,
  ): ConversationMessageEntity {
    return new ConversationMessageEntity(
      id,
      conversationId,
      content,
      MessageRole.USER,
      new Date(),
    );
  }

  public static createAssistantMessage(
    id: string,
    conversationId: string,
    content: string,
    metadata?: MessageMetadata,
    openaiMessageId?: string,
    tokensUsed?: number,
    model?: string,
    finishReason?: string,
  ): ConversationMessageEntity {
    return new ConversationMessageEntity(
      id,
      conversationId,
      content,
      MessageRole.ASSISTANT,
      new Date(),
      metadata || null,
      openaiMessageId || null,
      tokensUsed || null,
      model || null,
      finishReason || null,
    );
  }

  public static createSystemMessage(
    id: string,
    conversationId: string,
    content: string,
  ): ConversationMessageEntity {
    return new ConversationMessageEntity(
      id,
      conversationId,
      content,
      MessageRole.SYSTEM,
      new Date(),
    );
  }

  // Factory method genérico
  public static create(input: {
    conversationId: string;
    content: string;
    role: 'user' | 'assistant' | 'system';
    metadata?: MessageMetadata;
    openaiMessageId?: string;
    tokensUsed?: number;
    model?: string;
    finishReason?: string;
  }): ConversationMessageEntity {
    const id = require('uuid').v4();
    let role: MessageRole;
    
    switch (input.role) {
      case 'user':
        role = MessageRole.USER;
        break;
      case 'assistant':
        role = MessageRole.ASSISTANT;
        break;
      case 'system':
        role = MessageRole.SYSTEM;
        break;
      default:
        role = MessageRole.USER;
    }

    return new ConversationMessageEntity(
      id,
      input.conversationId,
      input.content,
      role,
      new Date(),
      input.metadata || null,
      input.openaiMessageId || null,
      input.tokensUsed || null,
      input.model || null,
      input.finishReason || null,
    );
  }
}
