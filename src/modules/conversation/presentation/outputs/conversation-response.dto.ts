import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ConversationResponseDto {
  @ApiProperty({
    description: 'ID da conversa',
    example: 'uuid-123-456',
  })
  id: string;

  @ApiProperty({
    description: 'ID do usuário',
    example: 1,
  })
  userId: number;

  @ApiPropertyOptional({
    description: 'Título da conversa',
    example: 'Conversa sobre IA',
  })
  title: string | null;

  @ApiPropertyOptional({
    description: 'Contexto da conversa',
    example: { topic: 'artificial intelligence' },
  })
  context: any | null;

  @ApiProperty({
    description: 'Status ativo da conversa',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-20T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2024-01-20T10:30:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Total de mensagens',
    example: 15,
  })
  totalMessages: number;

  @ApiPropertyOptional({
    description: 'Data da última mensagem',
    example: '2024-01-20T10:25:00.000Z',
  })
  lastMessageAt: Date | null;
}

export class ConversationListResponseDto {
  @ApiProperty({
    description: 'Lista de conversas',
    type: [ConversationResponseDto],
  })
  conversations: ConversationResponseDto[];

  @ApiProperty({
    description: 'Total de conversas',
    example: 25,
  })
  total: number;

  @ApiProperty({
    description: 'Página atual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Limite por página',
    example: 20,
  })
  limit: number;

  @ApiProperty({
    description: 'Total de páginas',
    example: 2,
  })
  totalPages: number;
}

export class MessageResponseDto {
  @ApiProperty({
    description: 'ID da mensagem',
    example: 'uuid-789-012',
  })
  id: string;

  @ApiProperty({
    description: 'ID da conversa',
    example: 'uuid-123-456',
  })
  conversationId: string;

  @ApiProperty({
    description: 'Conteúdo da mensagem',
    example: 'Olá, como posso ajudar?',
  })
  content: string;

  @ApiProperty({
    description: 'Papel da mensagem',
    example: 'USER',
    enum: ['USER', 'ASSISTANT', 'SYSTEM'],
  })
  role: string;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-20T10:20:00.000Z',
  })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Metadados da mensagem',
    example: { model: 'gpt-4', temperature: 0.7 },
  })
  metadata: any | null;

  @ApiPropertyOptional({
    description: 'ID da mensagem na OpenAI',
    example: 'msg_abc123',
  })
  openaiMessageId: string | null;

  @ApiPropertyOptional({
    description: 'Tokens utilizados',
    example: 150,
  })
  tokensUsed: number | null;

  @ApiPropertyOptional({
    description: 'Modelo usado',
    example: 'gpt-4',
  })
  model: string | null;

  @ApiPropertyOptional({
    description: 'Razão de finalização',
    example: 'stop',
  })
  finishReason: string | null;
}

export class MessageListResponseDto {
  @ApiProperty({
    description: 'Lista de mensagens',
    type: [MessageResponseDto],
  })
  messages: MessageResponseDto[];

  @ApiProperty({
    description: 'Total de mensagens',
    example: 50,
  })
  total: number;

  @ApiProperty({
    description: 'Página atual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Limite por página',
    example: 50,
  })
  limit: number;

  @ApiProperty({
    description: 'Total de páginas',
    example: 1,
  })
  totalPages: number;
}

export class ChatCompletionResponseDto {
  @ApiProperty({
    description: 'Mensagem de resposta do assistente',
    type: MessageResponseDto,
  })
  message: MessageResponseDto;

  @ApiProperty({
    description: 'Conversa atualizada',
    type: ConversationResponseDto,
  })
  conversation: ConversationResponseDto;

  @ApiProperty({
    description: 'Tokens utilizados nesta interação',
    example: 150,
  })
  tokensUsed: number;

  @ApiProperty({
    description: 'Custo estimado em USD',
    example: 0.003,
  })
  cost: number;
}

export class ConversationStatsResponseDto {
  @ApiProperty({
    description: 'Total de conversas',
    example: 25,
  })
  totalConversations: number;

  @ApiProperty({
    description: 'Conversas ativas',
    example: 20,
  })
  activeConversations: number;

  @ApiProperty({
    description: 'Total de mensagens',
    example: 500,
  })
  totalMessages: number;

  @ApiProperty({
    description: 'Total de tokens utilizados',
    example: 15000,
  })
  totalTokensUsed: number;

  @ApiProperty({
    description: 'Custo estimado total em USD',
    example: 0.45,
  })
  estimatedCost: number;

  @ApiProperty({
    description: 'Média de mensagens por conversa',
    example: 20.5,
  })
  averageMessagesPerConversation: number;
}
