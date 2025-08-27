// User types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Auth types
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Evolution API types
export interface EvolutionInstance {
  instanceName: string;
  instanceId: string;
  status: string;
  webhook_wa_business: string | null;
  access_token_wa_business: string;
}

export interface CreateInstanceResponse {
  instance: EvolutionInstance;
  hash: {
    apikey: string;
  };
  settings: {
    reject_call: boolean;
    msg_call: string;
    groups_ignore: boolean;
    always_online: boolean;
    read_messages: boolean;
    read_status: boolean;
    sync_full_history: boolean;
  };
}

// OpenAI types
export type BotType = 'assistant' | 'chatCompletion';
export type TriggerType = 'keyword' | 'all' | 'none';
export type TriggerOperator = 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'regex' | 'none';

export interface OpenAIBot {
  id: string;
  name: string;
  enabled: boolean;
  openaiCredsId: string;
  botType: BotType;
  assistantId?: string;
  functionUrl?: string;
  model?: string;
  systemMessages?: string[];
  assistantMessages?: string[];
  userMessages?: string[];
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  triggerType?: TriggerType;
  triggerOperator?: TriggerOperator;
  triggerValue?: string;
  ignoreJids?: string[];
}

export interface OpenAIBotResponse {
  bot: OpenAIBot;
  message: string;
}

export interface OpenAIBotListResponse {
  bots: OpenAIBot[];
  total: number;
  message: string;
}

export interface OpenAICreds {
  id: string;
  name: string;
  apiKey: string;
  organizationId?: string;
  instanceName: string;
  createdAt: Date;
  updatedAt: Date;
}

// Conversation types
export type MessageRole = 'user' | 'assistant' | 'system';

export interface ConversationMessage {
  id: string;
  conversationId: string;
  content: string;
  role: MessageRole;
  tokensUsed?: number;
  model?: string;
  finishReason?: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  title: string;
  userId: number;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
  isActive: boolean;
  messageCount: number;
  totalTokensUsed: number;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt?: Date;
}

export interface ConversationListResponse {
  conversations: Conversation[];
  total: number;
  page: number;
  limit: number;
}

export interface MessageListResponse {
  messages: ConversationMessage[];
  total: number;
  page: number;
  limit: number;
}

export interface ChatCompletionResponse {
  message: ConversationMessage;
  conversation: Conversation;
  tokensUsed: number;
  cost: number;
}

export interface ConversationStats {
  totalConversations: number;
  totalMessages: number;
  totalTokensUsed: number;
  averageMessagesPerConversation: number;
  mostUsedModel: string;
  totalCost: number;
}

// API Error types
export interface ApiError {
  message: string;
  statusCode: number;
  error: string;
  timestamp: string;
  path: string;
}
