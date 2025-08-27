import { MessageRole, MessageMetadata } from '../../entities/conversation-message.entity';

export interface ICreateConversationInput {
  userId: number;
  title?: string;
  context?: any;
}

export interface IUpdateConversationInput {
  conversationId: string;
  userId: number;
  title?: string;
  context?: any;
  isActive?: boolean;
}

export interface ICreateMessageInput {
  conversationId: string;
  content: string;
  role: MessageRole;
  metadata?: MessageMetadata;
  openaiMessageId?: string;
  tokensUsed?: number;
  model?: string;
  finishReason?: string;
}

export interface IGetConversationsInput {
  userId: number;
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
}

export interface IGetMessagesInput {
  conversationId: string;
  userId: number;
  page?: number;
  limit?: number;
  role?: MessageRole;
}

export interface IChatCompletionInput {
  conversationId: string;
  userId: number;
  message: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}
