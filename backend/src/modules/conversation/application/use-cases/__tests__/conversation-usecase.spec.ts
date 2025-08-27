import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConversationUseCase } from '../conversation-usecase';
import { IConversationRepository } from '../../../domain/repositories/conversation-repository.contract';
import { CONVERSATION_REPOSITORY_TOKEN } from '../../../../../shared/constants/di-constants';
import { MessageRole } from '../../../domain/entities/conversation-message.entity';
import {
  ICreateConversationInput,
  IUpdateConversationInput,
  ICreateMessageInput,
  IGetConversationsInput,
  IGetMessagesInput,
} from '../../../domain/contracts/input/conversation-input.contract';
import {
  IConversationOutput,
  IConversationMessageOutput,
  IConversationListOutput,
  IMessageListOutput,
  IConversationStatsOutput,
} from '../../../domain/contracts/output/conversation-output.contract';

describe('ConversationUseCase', () => {
  let conversationUseCase: ConversationUseCase;
  let conversationRepository: jest.Mocked<IConversationRepository>;

  const mockConversationOutput: IConversationOutput = {
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

  const mockMessageOutput: IConversationMessageOutput = {
    id: 'msg-123',
    conversationId: 'conv-123',
    content: 'Hello, world!',
    role: MessageRole.USER,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    metadata: { source: 'whatsapp' },
    openaiMessageId: 'openai-msg-123',
    tokensUsed: 10,
    model: 'gpt-3.5-turbo',
    finishReason: 'stop',
  };

  const mockConversationListOutput: IConversationListOutput = {
    conversations: [mockConversationOutput],
    total: 1,
    page: 1,
    limit: 20,
    totalPages: 1,
  };

  const mockMessageListOutput: IMessageListOutput = {
    messages: [mockMessageOutput],
    total: 1,
    page: 1,
    limit: 50,
    totalPages: 1,
  };

  const mockStatsOutput: IConversationStatsOutput = {
    totalConversations: 10,
    activeConversations: 8,
    totalMessages: 100,
    totalTokensUsed: 1000,
    estimatedCost: 0.01,
    averageMessagesPerConversation: 10,
  };

  beforeEach(async () => {
    const mockRepository = {
      createConversation: jest.fn(),
      updateConversation: jest.fn(),
      deleteConversation: jest.fn(),
      findConversationById: jest.fn(),
      findConversationsByUser: jest.fn(),
      createMessage: jest.fn(),
      findMessagesByConversation: jest.fn(),
      findMessageById: jest.fn(),
      getConversationStats: jest.fn(),
      getTokenUsageByUser: jest.fn(),
      incrementMessageCount: jest.fn(),
      updateLastMessageTime: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationUseCase,
        {
          provide: CONVERSATION_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
      ],
    }).compile();

    conversationUseCase = module.get<ConversationUseCase>(ConversationUseCase);
    conversationRepository = module.get(CONVERSATION_REPOSITORY_TOKEN);
  });

  describe('createConversation', () => {
    const validInput: ICreateConversationInput = {
      userId: 1,
      title: 'Test Conversation',
      context: 'Test context',
    };

    it('should successfully create conversation with valid input', async () => {
      // Arrange
      conversationRepository.createConversation.mockResolvedValue(mockConversationOutput);

      // Act
      const result = await conversationUseCase.createConversation(validInput);

      // Assert
      expect(result).toEqual(mockConversationOutput);
      expect(conversationRepository.createConversation).toHaveBeenCalledWith(validInput);
      expect(conversationRepository.createConversation).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpException when userId is missing', async () => {
      // Arrange
      const invalidInput = { ...validInput, userId: undefined as any };

      // Act & Assert
      await expect(conversationUseCase.createConversation(invalidInput))
        .rejects.toThrow(new HttpException('UserId é obrigatório', HttpStatus.BAD_REQUEST));
      expect(conversationRepository.createConversation).not.toHaveBeenCalled();
    });

    it('should throw HttpException when userId is not positive', async () => {
      // Arrange
      const invalidInput = { ...validInput, userId: 0 };

      // Act & Assert
      await expect(conversationUseCase.createConversation(invalidInput))
        .rejects.toThrow(new HttpException('UserId deve ser um número positivo', HttpStatus.BAD_REQUEST));
      expect(conversationRepository.createConversation).not.toHaveBeenCalled();
    });

    it('should handle repository errors and throw internal server error', async () => {
      // Arrange
      conversationRepository.createConversation.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(conversationUseCase.createConversation(validInput))
        .rejects.toThrow(new HttpException('Erro interno ao criar conversa', HttpStatus.INTERNAL_SERVER_ERROR));
      expect(conversationRepository.createConversation).toHaveBeenCalledWith(validInput);
    });

    it('should preserve HttpException from repository', async () => {
      // Arrange
      const httpError = new HttpException('Validation failed', HttpStatus.CONFLICT);
      conversationRepository.createConversation.mockRejectedValue(httpError);

      // Act & Assert
      await expect(conversationUseCase.createConversation(validInput))
        .rejects.toThrow(httpError);
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

    it('should successfully update conversation with valid input', async () => {
      // Arrange
      conversationRepository.updateConversation.mockResolvedValue(mockConversationOutput);

      // Act
      const result = await conversationUseCase.updateConversation(validInput);

      // Assert
      expect(result).toEqual(mockConversationOutput);
      expect(conversationRepository.updateConversation).toHaveBeenCalledWith(validInput);
      expect(conversationRepository.updateConversation).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpException when conversationId is missing', async () => {
      // Arrange
      const invalidInput = { ...validInput, conversationId: '' };

      // Act & Assert
      await expect(conversationUseCase.updateConversation(invalidInput))
        .rejects.toThrow(new HttpException('ConversationId é obrigatório', HttpStatus.BAD_REQUEST));
    });

    it('should throw HttpException when userId is missing', async () => {
      // Arrange
      const invalidInput = { ...validInput, userId: undefined as any };

      // Act & Assert
      await expect(conversationUseCase.updateConversation(invalidInput))
        .rejects.toThrow(new HttpException('UserId é obrigatório', HttpStatus.BAD_REQUEST));
    });
  });

  describe('deleteConversation', () => {
    it('should successfully delete conversation', async () => {
      // Arrange
      conversationRepository.deleteConversation.mockResolvedValue();

      // Act
      await conversationUseCase.deleteConversation('conv-123', 1);

      // Assert
      expect(conversationRepository.deleteConversation).toHaveBeenCalledWith('conv-123', 1);
      expect(conversationRepository.deleteConversation).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpException when conversationId is missing', async () => {
      // Act & Assert
      await expect(conversationUseCase.deleteConversation('', 1))
        .rejects.toThrow(new HttpException('ConversationId é obrigatório', HttpStatus.BAD_REQUEST));
    });

    it('should throw HttpException when userId is missing', async () => {
      // Act & Assert
      await expect(conversationUseCase.deleteConversation('conv-123', undefined as any))
        .rejects.toThrow(new HttpException('UserId é obrigatório', HttpStatus.BAD_REQUEST));
    });
  });

  describe('getConversation', () => {
    it('should successfully get conversation when it exists', async () => {
      // Arrange
      conversationRepository.findConversationById.mockResolvedValue(mockConversationOutput);

      // Act
      const result = await conversationUseCase.getConversation('conv-123', 1);

      // Assert
      expect(result).toEqual(mockConversationOutput);
      expect(conversationRepository.findConversationById).toHaveBeenCalledWith('conv-123', 1);
    });

    it('should throw NotFoundException when conversation does not exist', async () => {
      // Arrange
      conversationRepository.findConversationById.mockResolvedValue(null);

      // Act & Assert
      await expect(conversationUseCase.getConversation('conv-123', 1))
        .rejects.toThrow(new Error('Conversation not found or access denied'));
    });
  });

  describe('getConversations', () => {
    const validInput: IGetConversationsInput = {
      userId: 1,
      page: 1,
      limit: 20,
      isActive: true,
      search: 'test',
    };

    it('should successfully get conversations with valid input', async () => {
      // Arrange
      conversationRepository.findConversationsByUser.mockResolvedValue(mockConversationListOutput);

      // Act
      const result = await conversationUseCase.getConversations(validInput);

      // Assert
      expect(result).toEqual(mockConversationListOutput);
      expect(conversationRepository.findConversationsByUser).toHaveBeenCalledWith(expect.objectContaining({
        userId: validInput.userId,
        page: validInput.page,
        limit: validInput.limit,
        isActive: validInput.isActive,
        search: validInput.search,
      }));
    });

    it('should use default values when not provided', async () => {
      // Arrange
      const minimalInput = { userId: 1 };
      conversationRepository.findConversationsByUser.mockResolvedValue(mockConversationListOutput);

      // Act
      const result = await conversationUseCase.getConversations(minimalInput);

      // Assert
      expect(result).toEqual(mockConversationListOutput);
      expect(conversationRepository.findConversationsByUser).toHaveBeenCalledWith(expect.objectContaining({
        userId: 1,
        page: 1,
        limit: 20,
      }));
    });

    it('should limit maximum results per page', async () => {
      // Arrange
      const inputWithLargeLimit = { userId: 1, limit: 1000 };
      conversationRepository.findConversationsByUser.mockResolvedValue(mockConversationListOutput);

      // Act
      await conversationUseCase.getConversations(inputWithLargeLimit);

      // Assert
      expect(conversationRepository.findConversationsByUser).toHaveBeenCalledWith(expect.objectContaining({
        limit: 100, // Should be capped at 100
      }));
    });
  });

  describe('addMessage', () => {
    const validInput: ICreateMessageInput = {
      conversationId: 'conv-123',
      content: 'Hello, world!',
      role: MessageRole.USER,
      metadata: { source: 'whatsapp' },
      openaiMessageId: 'openai-msg-123',
      tokensUsed: 10,
      model: 'gpt-3.5-turbo',
      finishReason: 'stop',
    };

    it('should successfully create message with valid input', async () => {
      // Arrange
      conversationRepository.findConversationById.mockResolvedValue(mockConversationOutput);
      conversationRepository.createMessage.mockResolvedValue(mockMessageOutput);
      conversationRepository.incrementMessageCount.mockResolvedValue();
      conversationRepository.updateLastMessageTime.mockResolvedValue();

      // Act
      const result = await conversationUseCase.addMessage(validInput);

      // Assert
      expect(result).toEqual(mockMessageOutput);
      expect(conversationRepository.createMessage).toHaveBeenCalledWith(validInput);
      expect(conversationRepository.incrementMessageCount).toHaveBeenCalledWith('conv-123');
      expect(conversationRepository.updateLastMessageTime).toHaveBeenCalledWith('conv-123');
    });

    it('should throw error when conversation does not exist', async () => {
      // Arrange
      conversationRepository.findConversationById.mockResolvedValue(null);

      // Act & Assert
      await expect(conversationUseCase.addMessage(validInput))
        .rejects.toThrow(new Error('Conversation not found or inactive'));
    });

    it('should throw error when conversation is inactive', async () => {
      // Arrange
      const inactiveConversation = { ...mockConversationOutput, isActive: false };
      conversationRepository.findConversationById.mockResolvedValue(inactiveConversation);

      // Act & Assert
      await expect(conversationUseCase.addMessage(validInput))
        .rejects.toThrow(new Error('Conversation not found or inactive'));
    });
  });

  describe('getMessages', () => {
    const validInput: IGetMessagesInput = {
      conversationId: 'conv-123',
      userId: 1,
      page: 1,
      limit: 50,
      role: MessageRole.USER,
    };

    it('should successfully get messages with valid input', async () => {
      // Arrange
      conversationRepository.findMessagesByConversation.mockResolvedValue(mockMessageListOutput);

      // Act
      const result = await conversationUseCase.getMessages(validInput);

      // Assert
      expect(result).toEqual(mockMessageListOutput);
      expect(conversationRepository.findMessagesByConversation).toHaveBeenCalledWith(expect.objectContaining({
        conversationId: validInput.conversationId,
        userId: validInput.userId,
        page: validInput.page,
        limit: validInput.limit,
        role: validInput.role,
      }));
    });

    it('should use default values when not provided', async () => {
      // Arrange
      const minimalInput = { conversationId: 'conv-123', userId: 1 };
      conversationRepository.findMessagesByConversation.mockResolvedValue(mockMessageListOutput);

      // Act
      const result = await conversationUseCase.getMessages(minimalInput);

      // Assert
      expect(result).toEqual(mockMessageListOutput);
      expect(conversationRepository.findMessagesByConversation).toHaveBeenCalledWith(expect.objectContaining({
        conversationId: 'conv-123',
        userId: 1,
        page: 1,
        limit: 50,
      }));
    });
  });

  describe('getStats', () => {
    it('should successfully get conversation stats', async () => {
      // Arrange
      conversationRepository.getConversationStats.mockResolvedValue(mockStatsOutput);

      // Act
      const result = await conversationUseCase.getStats(1);

      // Assert
      expect(result).toEqual(mockStatsOutput);
      expect(conversationRepository.getConversationStats).toHaveBeenCalledWith(1);
    });
  });

  describe('getTokenUsage', () => {
    it('should successfully get token usage', async () => {
      // Arrange
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      conversationRepository.getTokenUsageByUser.mockResolvedValue(500);

      // Act
      const result = await conversationUseCase.getTokenUsage(1, startDate, endDate);

      // Assert
      expect(result).toBe(500);
      expect(conversationRepository.getTokenUsageByUser).toHaveBeenCalledWith(1, startDate, endDate);
    });

    it('should work without date filters', async () => {
      // Arrange
      conversationRepository.getTokenUsageByUser.mockResolvedValue(1000);

      // Act
      const result = await conversationUseCase.getTokenUsage(1);

      // Assert
      expect(result).toBe(1000);
      expect(conversationRepository.getTokenUsageByUser).toHaveBeenCalledWith(1, undefined, undefined);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle repository errors gracefully', async () => {
      // Arrange
      const validInput: ICreateConversationInput = { userId: 1, title: 'Test' };
      conversationRepository.createConversation.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await expect(conversationUseCase.createConversation(validInput))
        .rejects.toThrow(new HttpException('Erro interno ao criar conversa', HttpStatus.INTERNAL_SERVER_ERROR));
    });

    it('should handle concurrent operations', async () => {
      // Arrange
      const input1: ICreateConversationInput = { userId: 1, title: 'Conv 1' };
      const input2: ICreateConversationInput = { userId: 1, title: 'Conv 2' };
      
      conversationRepository.createConversation
        .mockResolvedValueOnce({ ...mockConversationOutput, id: 'conv-1', title: 'Conv 1' })
        .mockResolvedValueOnce({ ...mockConversationOutput, id: 'conv-2', title: 'Conv 2' });

      // Act
      const [result1, result2] = await Promise.all([
        conversationUseCase.createConversation(input1),
        conversationUseCase.createConversation(input2),
      ]);

      // Assert
      expect(result1.id).toBe('conv-1');
      expect(result2.id).toBe('conv-2');
      expect(conversationRepository.createConversation).toHaveBeenCalledTimes(2);
    });
  });
});
