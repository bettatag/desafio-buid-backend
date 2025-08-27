import { Test, TestingModule } from '@nestjs/testing';
import { ConversationRepository } from '../conversation.repository';
import { PRISMA_CLIENT_TOKEN } from '../../../../../shared/constants/di-constants';
import {
  ICreateConversationInput,
  IUpdateConversationInput,
  ICreateMessageInput,
  IGetConversationsInput,
  IGetMessagesInput,
} from '../../../domain/contracts/input/conversation-input.contract';

describe('ConversationRepository', () => {
  let conversationRepository: ConversationRepository;
  let mockPrisma: any;

  const mockConversation = {
    id: 'conv-123',
    userId: 1,
    title: 'Test Conversation',
    context: 'Test context',
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    totalMessages: 5,
    lastMessageAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  const mockMessage = {
    id: 'msg-123',
    conversationId: 'conv-123',
    content: 'Hello, world!',
    role: 'user',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    metadata: { source: 'whatsapp' },
    openaiMessageId: 'openai-msg-123',
    tokensUsed: 10,
    model: 'gpt-3.5-turbo',
    finishReason: 'stop',
  };

  beforeEach(async () => {
    mockPrisma = {
      conversation: {
        create: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
      conversationMessage: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        aggregate: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationRepository,
        {
          provide: PRISMA_CLIENT_TOKEN,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    conversationRepository = module.get<ConversationRepository>(ConversationRepository);
  });

  describe('createConversation', () => {
    const validInput: ICreateConversationInput = {
      userId: 1,
      title: 'Test Conversation',
      context: 'Test context',
    };

    it('should successfully create conversation and return correct output', async () => {
      // Arrange
      mockPrisma.conversation.create.mockResolvedValue(mockConversation);

      // Act
      const result = await conversationRepository.createConversation(validInput);

      // Assert
      expect(result).toEqual({
        id: mockConversation.id,
        userId: mockConversation.userId,
        title: mockConversation.title,
        context: mockConversation.context,
        isActive: mockConversation.isActive,
        createdAt: mockConversation.createdAt,
        updatedAt: mockConversation.updatedAt,
        totalMessages: mockConversation.totalMessages,
        lastMessageAt: mockConversation.lastMessageAt,
      });
      expect(mockPrisma.conversation.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: validInput.userId,
          title: validInput.title,
          context: validInput.context,
          isActive: true,
          totalMessages: 0,
        }),
      });
    });

    it('should handle null title and context', async () => {
      // Arrange
      const inputWithNulls: ICreateConversationInput = { userId: 1 };
      const conversationWithNulls = { ...mockConversation, title: null, context: null };
      mockPrisma.conversation.create.mockResolvedValue(conversationWithNulls);

      // Act
      const result = await conversationRepository.createConversation(inputWithNulls);

      // Assert
      expect(result.title).toBeNull();
      expect(result.context).toBeNull();
      expect(mockPrisma.conversation.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: null,
          context: null,
        }),
      });
    });

    it('should generate unique IDs for different conversations', async () => {
      // Arrange
      const input1: ICreateConversationInput = { userId: 1, title: 'Conv 1' };
      const input2: ICreateConversationInput = { userId: 1, title: 'Conv 2' };
      
      mockPrisma.conversation.create
        .mockResolvedValueOnce({ ...mockConversation, id: 'conv-1' })
        .mockResolvedValueOnce({ ...mockConversation, id: 'conv-2' });

      // Act
      const [result1, result2] = await Promise.all([
        conversationRepository.createConversation(input1),
        conversationRepository.createConversation(input2),
      ]);

      // Assert
      expect(result1.id).not.toBe(result2.id);
      expect(mockPrisma.conversation.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('updateConversation', () => {
    const validInput: IUpdateConversationInput = {
      conversationId: 'conv-123',
      userId: 1,
      title: 'Updated Title',
      context: 'Updated context',
      isActive: false,
    };

    it('should successfully update conversation', async () => {
      // Arrange
      const updatedConversation = { ...mockConversation, ...validInput };
      mockPrisma.conversation.update.mockResolvedValue(updatedConversation);

      // Act
      const result = await conversationRepository.updateConversation(validInput);

      // Assert
      expect(result.title).toBe(validInput.title);
      expect(result.context).toBe(validInput.context);
      expect(result.isActive).toBe(validInput.isActive);
      expect(mockPrisma.conversation.update).toHaveBeenCalledWith({
        where: {
          id: validInput.conversationId,
          userId: validInput.userId,
        },
        data: {
          title: validInput.title,
          context: validInput.context,
          isActive: validInput.isActive,
        },
      });
    });

    it('should handle partial updates', async () => {
      // Arrange
      const partialInput: IUpdateConversationInput = {
        conversationId: 'conv-123',
        userId: 1,
        title: 'New Title',
      };
      mockPrisma.conversation.update.mockResolvedValue({
        ...mockConversation,
        title: 'New Title',
      });

      // Act
      const result = await conversationRepository.updateConversation(partialInput);

      // Assert
      expect(result.title).toBe('New Title');
      expect(mockPrisma.conversation.update).toHaveBeenCalledWith({
        where: {
          id: partialInput.conversationId,
          userId: partialInput.userId,
        },
        data: {
          title: 'New Title',
        },
      });
    });

    it('should handle undefined values correctly', async () => {
      // Arrange
      const inputWithUndefined: IUpdateConversationInput = {
        conversationId: 'conv-123',
        userId: 1,
        title: undefined,
        context: 'New context',
        isActive: undefined,
      };
      mockPrisma.conversation.update.mockResolvedValue({
        ...mockConversation,
        context: 'New context',
      });

      // Act
      await conversationRepository.updateConversation(inputWithUndefined);

      // Assert
      expect(mockPrisma.conversation.update).toHaveBeenCalledWith({
        where: {
          id: inputWithUndefined.conversationId,
          userId: inputWithUndefined.userId,
        },
        data: {
          context: 'New context',
        },
      });
    });
  });

  describe('deleteConversation', () => {
    it('should soft delete conversation by setting isActive to false', async () => {
      // Arrange
      mockPrisma.conversation.update.mockResolvedValue(mockConversation);

      // Act
      await conversationRepository.deleteConversation('conv-123', 1);

      // Assert
      expect(mockPrisma.conversation.update).toHaveBeenCalledWith({
        where: {
          id: 'conv-123',
          userId: 1,
        },
        data: {
          isActive: false,
        },
      });
    });
  });

  describe('findConversationById', () => {
    it('should find conversation by ID when it exists', async () => {
      // Arrange
      mockPrisma.conversation.findFirst.mockResolvedValue(mockConversation);

      // Act
      const result = await conversationRepository.findConversationById('conv-123', 1);

      // Assert
      expect(result).toEqual(expect.objectContaining({
        id: mockConversation.id,
        userId: mockConversation.userId,
      }));
      expect(mockPrisma.conversation.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'conv-123',
          userId: 1,
        },
      });
    });

    it('should return null when conversation does not exist', async () => {
      // Arrange
      mockPrisma.conversation.findFirst.mockResolvedValue(null);

      // Act
      const result = await conversationRepository.findConversationById('non-existent', 1);

      // Assert
      expect(result).toBeNull();
    });

    it('should not filter by userId when userId is 0 (system messages)', async () => {
      // Arrange
      mockPrisma.conversation.findFirst.mockResolvedValue(mockConversation);

      // Act
      await conversationRepository.findConversationById('conv-123', 0);

      // Assert
      expect(mockPrisma.conversation.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'conv-123',
        },
      });
    });
  });

  describe('findConversationsByUser', () => {
    const validInput: IGetConversationsInput = {
      userId: 1,
      page: 1,
      limit: 20,
      isActive: true,
      search: 'test',
    };

    it('should successfully find conversations with filters', async () => {
      // Arrange
      mockPrisma.conversation.findMany.mockResolvedValue([mockConversation]);
      mockPrisma.conversation.count.mockResolvedValue(1);

      // Act
      const result = await conversationRepository.findConversationsByUser(validInput);

      // Assert
      expect(result).toEqual({
        conversations: [expect.objectContaining({ id: mockConversation.id })],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
      expect(mockPrisma.conversation.findMany).toHaveBeenCalledWith({
        where: {
          userId: 1,
          isActive: true,
          OR: [
            { title: { contains: 'test', mode: 'insensitive' } },
          ],
        },
        orderBy: { updatedAt: 'desc' },
        skip: 0,
        take: 20,
      });
    });

    it('should use default pagination values', async () => {
      // Arrange
      const inputWithDefaults: IGetConversationsInput = { userId: 1 };
      mockPrisma.conversation.findMany.mockResolvedValue([]);
      mockPrisma.conversation.count.mockResolvedValue(0);

      // Act
      const result = await conversationRepository.findConversationsByUser(inputWithDefaults);

      // Assert
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(mockPrisma.conversation.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: { updatedAt: 'desc' },
        skip: 0,
        take: 20,
      });
    });

    it('should calculate totalPages correctly', async () => {
      // Arrange
      mockPrisma.conversation.findMany.mockResolvedValue([]);
      mockPrisma.conversation.count.mockResolvedValue(25);

      // Act
      const result = await conversationRepository.findConversationsByUser({
        userId: 1,
        limit: 10,
      });

      // Assert
      expect(result.totalPages).toBe(3); // Math.ceil(25 / 10)
    });
  });

  describe('createMessage', () => {
    const validInput: ICreateMessageInput = {
      conversationId: 'conv-123',
      content: 'Hello, world!',
      role: 'user',
      metadata: { source: 'whatsapp' },
      openaiMessageId: 'openai-msg-123',
      tokensUsed: 10,
      model: 'gpt-3.5-turbo',
      finishReason: 'stop',
    };

    it('should successfully create message and return correct output', async () => {
      // Arrange
      mockPrisma.conversationMessage.create.mockResolvedValue(mockMessage);

      // Act
      const result = await conversationRepository.createMessage(validInput);

      // Assert
      expect(result).toEqual(expect.objectContaining({
        id: mockMessage.id,
        conversationId: mockMessage.conversationId,
        content: mockMessage.content,
        role: mockMessage.role,
      }));
      expect(mockPrisma.conversationMessage.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          conversationId: validInput.conversationId,
          content: validInput.content,
          role: validInput.role,
          metadata: validInput.metadata,
          openaiMessageId: validInput.openaiMessageId,
          tokensUsed: validInput.tokensUsed,
          model: validInput.model,
          finishReason: validInput.finishReason,
        }),
      });
    });

    it('should handle undefined optional fields', async () => {
      // Arrange
      const minimalInput: ICreateMessageInput = {
        conversationId: 'conv-123',
        content: 'Hello',
        role: 'user',
      };
      const minimalMessage = {
        ...mockMessage,
        metadata: null,
        openaiMessageId: null,
        tokensUsed: null,
        model: null,
        finishReason: null,
      };
      mockPrisma.conversationMessage.create.mockResolvedValue(minimalMessage);

      // Act
      const result = await conversationRepository.createMessage(minimalInput);

      // Assert
      expect(result.metadata).toBeNull();
      expect(result.openaiMessageId).toBeNull();
      expect(mockPrisma.conversationMessage.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          metadata: undefined,
          openaiMessageId: undefined,
        }),
      });
    });
  });

  describe('findMessagesByConversation', () => {
    const validInput: IGetMessagesInput = {
      conversationId: 'conv-123',
      page: 1,
      limit: 50,
      role: 'user',
    };

    it('should successfully find messages with filters', async () => {
      // Arrange
      mockPrisma.conversationMessage.findMany.mockResolvedValue([mockMessage]);
      mockPrisma.conversationMessage.count.mockResolvedValue(1);

      // Act
      const result = await conversationRepository.findMessagesByConversation(validInput);

      // Assert
      expect(result).toEqual({
        messages: [expect.objectContaining({ id: mockMessage.id })],
        total: 1,
        page: 1,
        limit: 50,
        totalPages: 1,
      });
      expect(mockPrisma.conversationMessage.findMany).toHaveBeenCalledWith({
        where: {
          conversationId: 'conv-123',
          role: 'user',
        },
        orderBy: { createdAt: 'asc' },
        skip: 0,
        take: 50,
      });
    });

    it('should use default values and sort chronologically', async () => {
      // Arrange
      const inputWithDefaults: IGetMessagesInput = { conversationId: 'conv-123' };
      mockPrisma.conversationMessage.findMany.mockResolvedValue([]);
      mockPrisma.conversationMessage.count.mockResolvedValue(0);

      // Act
      await conversationRepository.findMessagesByConversation(inputWithDefaults);

      // Assert
      expect(mockPrisma.conversationMessage.findMany).toHaveBeenCalledWith({
        where: { conversationId: 'conv-123' },
        orderBy: { createdAt: 'asc' },
        skip: 0,
        take: 50,
      });
    });
  });

  describe('getConversationStats', () => {
    it('should return correct statistics structure', async () => {
      // Arrange
      mockPrisma.conversation.count
        .mockResolvedValueOnce(10) // totalConversations
        .mockResolvedValueOnce(8); // activeConversations
      mockPrisma.conversationMessage.count.mockResolvedValue(100); // totalMessages
      mockPrisma.conversationMessage.aggregate.mockResolvedValue({
        _sum: { tokensUsed: 1000 },
      });

      // Act
      const result = await conversationRepository.getConversationStats(1);

      // Assert
      expect(result).toEqual({
        totalConversations: 10,
        activeConversations: 8,
        totalMessages: 100,
        totalTokensUsed: 1000,
        estimatedCost: 0.01, // 1000 * 0.00001
        averageMessagesPerConversation: 10, // 100 / 10
      });
    });

    it('should handle zero values correctly', async () => {
      // Arrange
      mockPrisma.conversation.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);
      mockPrisma.conversationMessage.count.mockResolvedValue(0);
      mockPrisma.conversationMessage.aggregate.mockResolvedValue({
        _sum: { tokensUsed: null },
      });

      // Act
      const result = await conversationRepository.getConversationStats(1);

      // Assert
      expect(result.totalTokensUsed).toBe(0);
      expect(result.estimatedCost).toBe(0);
      expect(result.averageMessagesPerConversation).toBe(0);
    });
  });

  describe('getTokenUsageByUser', () => {
    it('should return token usage for user', async () => {
      // Arrange
      mockPrisma.conversationMessage.aggregate.mockResolvedValue({
        _sum: { tokensUsed: 500 },
      });

      // Act
      const result = await conversationRepository.getTokenUsageByUser(1);

      // Assert
      expect(result).toBe(500);
      expect(mockPrisma.conversationMessage.aggregate).toHaveBeenCalledWith({
        where: {
          conversation: { userId: 1 },
          tokensUsed: { not: null },
        },
        _sum: { tokensUsed: true },
      });
    });

    it('should handle date filters', async () => {
      // Arrange
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      mockPrisma.conversationMessage.aggregate.mockResolvedValue({
        _sum: { tokensUsed: 200 },
      });

      // Act
      const result = await conversationRepository.getTokenUsageByUser(1, startDate, endDate);

      // Assert
      expect(result).toBe(200);
      expect(mockPrisma.conversationMessage.aggregate).toHaveBeenCalledWith({
        where: {
          conversation: { userId: 1 },
          tokensUsed: { not: null },
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: { tokensUsed: true },
      });
    });

    it('should return 0 when no tokens found', async () => {
      // Arrange
      mockPrisma.conversationMessage.aggregate.mockResolvedValue({
        _sum: { tokensUsed: null },
      });

      // Act
      const result = await conversationRepository.getTokenUsageByUser(1);

      // Assert
      expect(result).toBe(0);
    });
  });

  describe('incrementMessageCount', () => {
    it('should increment message count for conversation', async () => {
      // Arrange
      mockPrisma.conversation.update.mockResolvedValue(mockConversation);

      // Act
      await conversationRepository.incrementMessageCount('conv-123');

      // Assert
      expect(mockPrisma.conversation.update).toHaveBeenCalledWith({
        where: { id: 'conv-123' },
        data: {
          totalMessages: { increment: 1 },
        },
      });
    });
  });

  describe('updateLastMessageTime', () => {
    it('should update last message time and updatedAt', async () => {
      // Arrange
      mockPrisma.conversation.update.mockResolvedValue(mockConversation);

      // Act
      await conversationRepository.updateLastMessageTime('conv-123');

      // Assert
      expect(mockPrisma.conversation.update).toHaveBeenCalledWith({
        where: { id: 'conv-123' },
        data: {
          lastMessageAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      });
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle Prisma errors gracefully', async () => {
      // Arrange
      const validInput: ICreateConversationInput = { userId: 1, title: 'Test' };
      mockPrisma.conversation.create.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(conversationRepository.createConversation(validInput))
        .rejects.toThrow('Database error');
    });

    it('should handle concurrent operations', async () => {
      // Arrange
      const input1: ICreateConversationInput = { userId: 1, title: 'Conv 1' };
      const input2: ICreateConversationInput = { userId: 1, title: 'Conv 2' };
      
      mockPrisma.conversation.create
        .mockResolvedValueOnce({ ...mockConversation, id: 'conv-1' })
        .mockResolvedValueOnce({ ...mockConversation, id: 'conv-2' });

      // Act
      const [result1, result2] = await Promise.all([
        conversationRepository.createConversation(input1),
        conversationRepository.createConversation(input2),
      ]);

      // Assert
      expect(result1.id).toBe('conv-1');
      expect(result2.id).toBe('conv-2');
      expect(mockPrisma.conversation.create).toHaveBeenCalledTimes(2);
    });
  });
});
