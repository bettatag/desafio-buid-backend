import { MessageRole } from '../../entities/conversation-message.entity';

export interface IConversationOutput {
  id: string;
  userId: number;
  title: string | null;
  context: any | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  totalMessages: number;
  lastMessageAt: Date | null;
}

export interface IConversationMessageOutput {
  id: string;
  conversationId: string;
  content: string;
  role: MessageRole;
  createdAt: Date;
  metadata: any | null;
  openaiMessageId: string | null;
  tokensUsed: number | null;
  model: string | null;
  finishReason: string | null;
}

export interface IConversationListOutput {
  conversations: IConversationOutput[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IMessageListOutput {
  messages: IConversationMessageOutput[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IChatCompletionOutput {
  message: IConversationMessageOutput;
  conversation: IConversationOutput;
  tokensUsed: number;
  cost: number;
}

export interface IConversationStatsOutput {
  totalConversations: number;
  activeConversations: number;
  totalMessages: number;
  totalTokensUsed: number;
  estimatedCost: number;
  averageMessagesPerConversation: number;
}
