import {
  ICreateConversationInput,
  IUpdateConversationInput,
  ICreateMessageInput,
  IGetConversationsInput,
  IGetMessagesInput,
  IChatCompletionInput
} from '../../../domain/contracts/input/conversation-input.contract';
import {
  IConversationOutput,
  IConversationMessageOutput,
  IConversationListOutput,
  IMessageListOutput,
  IChatCompletionOutput,
  IConversationStatsOutput
} from '../../../domain/contracts/output/conversation-output.contract';

export interface IConversationUseCase {
  // Conversation management
  createConversation(input: ICreateConversationInput): Promise<IConversationOutput>;
  updateConversation(input: IUpdateConversationInput): Promise<IConversationOutput>;
  deleteConversation(conversationId: string, userId: number): Promise<void>;
  getConversation(conversationId: string, userId: number): Promise<IConversationOutput>;
  getConversations(input: IGetConversationsInput): Promise<IConversationListOutput>;
  
  // Message management
  addMessage(input: ICreateMessageInput): Promise<IConversationMessageOutput>;
  getMessages(input: IGetMessagesInput): Promise<IMessageListOutput>;
  
  // OpenAI Integration
  sendMessage(input: IChatCompletionInput): Promise<IChatCompletionOutput>;
  
  // Analytics
  getStats(userId: number): Promise<IConversationStatsOutput>;
  getTokenUsage(userId: number, startDate?: Date, endDate?: Date): Promise<number>;
}
