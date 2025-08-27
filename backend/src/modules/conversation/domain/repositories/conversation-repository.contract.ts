import { ConversationEntity } from '../entities/conversation.entity';
import { ConversationMessageEntity } from '../entities/conversation-message.entity';
import { 
  ICreateConversationInput,
  IUpdateConversationInput,
  ICreateMessageInput,
  IGetConversationsInput,
  IGetMessagesInput
} from '../contracts/input/conversation-input.contract';
import {
  IConversationOutput,
  IConversationMessageOutput,
  IConversationListOutput,
  IMessageListOutput,
  IConversationStatsOutput
} from '../contracts/output/conversation-output.contract';

export interface IConversationRepository {
  // Conversation CRUD
  createConversation(input: ICreateConversationInput): Promise<IConversationOutput>;
  updateConversation(input: IUpdateConversationInput): Promise<IConversationOutput>;
  deleteConversation(conversationId: string, userId: number): Promise<void>;
  findConversationById(conversationId: string, userId: number): Promise<IConversationOutput | null>;
  findConversationsByUser(input: IGetConversationsInput): Promise<IConversationListOutput>;
  
  // Message CRUD
  createMessage(input: ICreateMessageInput): Promise<IConversationMessageOutput>;
  findMessagesByConversation(input: IGetMessagesInput): Promise<IMessageListOutput>;
  findMessageById(messageId: string): Promise<IConversationMessageOutput | null>;
  
  // Stats and Analytics
  getConversationStats(userId: number): Promise<IConversationStatsOutput>;
  getTokenUsageByUser(userId: number, startDate?: Date, endDate?: Date): Promise<number>;
  
  // Utility methods
  incrementMessageCount(conversationId: string): Promise<void>;
  updateLastMessageTime(conversationId: string): Promise<void>;
}
