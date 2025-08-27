import { ConversationMessageEntity, MessageRole, MessageMetadata } from '../conversation-message.entity';

describe('ConversationMessageEntity', () => {
  const validMetadata: MessageMetadata = { source: 'whatsapp', messageId: 'wa-123' };
  
  const validProps = {
    id: 'msg-123',
    conversationId: 'conv-123',
    content: 'Hello, world!',
    role: MessageRole.USER,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    metadata: validMetadata,
    openaiMessageId: 'openai-msg-123',
    tokensUsed: 10,
    model: 'gpt-3.5-turbo',
    finishReason: 'stop',
  };

  describe('constructor', () => {
    it('should create ConversationMessageEntity with all properties', () => {
      // Act
      const message = new ConversationMessageEntity(
        validProps.id,
        validProps.conversationId,
        validProps.content,
        validProps.role,
        validProps.createdAt,
        validProps.metadata,
        validProps.openaiMessageId,
        validProps.tokensUsed,
        validProps.model,
        validProps.finishReason,
      );

      // Assert
      expect(message.id).toBe(validProps.id);
      expect(message.conversationId).toBe(validProps.conversationId);
      expect(message.content).toBe(validProps.content);
      expect(message.role).toBe(validProps.role);
      expect(message.createdAt).toBe(validProps.createdAt);
      expect(message.metadata).toBe(validProps.metadata);
      expect(message.openaiMessageId).toBe(validProps.openaiMessageId);
      expect(message.tokensUsed).toBe(validProps.tokensUsed);
      expect(message.model).toBe(validProps.model);
      expect(message.finishReason).toBe(validProps.finishReason);
    });

    it('should create ConversationMessageEntity without optional properties', () => {
      // Arrange & Act
      const message = new ConversationMessageEntity(
        'msg-123',
        'conv-123',
        'Hello',
        MessageRole.USER,
        new Date(),
      );

      // Assert
      expect(message.metadata).toBeNull();
      expect(message.openaiMessageId).toBeNull();
      expect(message.tokensUsed).toBeNull();
      expect(message.model).toBeNull();
      expect(message.finishReason).toBeNull();
    });

    it('should handle null values for optional properties', () => {
      // Arrange & Act
      const message = new ConversationMessageEntity(
        'msg-123',
        'conv-123',
        'Hello',
        MessageRole.USER,
        new Date(),
        null,
        null,
        null,
        null,
        null,
      );

      // Assert
      expect(message.metadata).toBeNull();
      expect(message.openaiMessageId).toBeNull();
      expect(message.tokensUsed).toBeNull();
      expect(message.model).toBeNull();
      expect(message.finishReason).toBeNull();
    });
  });

  describe('isFromUser', () => {
    it('should return true when role is USER', () => {
      // Arrange
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.USER, new Date()
      );

      // Act & Assert
      expect(message.isFromUser()).toBe(true);
    });

    it('should return false when role is ASSISTANT', () => {
      // Arrange
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.ASSISTANT, new Date()
      );

      // Act & Assert
      expect(message.isFromUser()).toBe(false);
    });

    it('should return false when role is SYSTEM', () => {
      // Arrange
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.SYSTEM, new Date()
      );

      // Act & Assert
      expect(message.isFromUser()).toBe(false);
    });
  });

  describe('isFromAssistant', () => {
    it('should return true when role is ASSISTANT', () => {
      // Arrange
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.ASSISTANT, new Date()
      );

      // Act & Assert
      expect(message.isFromAssistant()).toBe(true);
    });

    it('should return false when role is USER', () => {
      // Arrange
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.USER, new Date()
      );

      // Act & Assert
      expect(message.isFromAssistant()).toBe(false);
    });

    it('should return false when role is SYSTEM', () => {
      // Arrange
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.SYSTEM, new Date()
      );

      // Act & Assert
      expect(message.isFromAssistant()).toBe(false);
    });
  });

  describe('isFromSystem', () => {
    it('should return true when role is SYSTEM', () => {
      // Arrange
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.SYSTEM, new Date()
      );

      // Act & Assert
      expect(message.isFromSystem()).toBe(true);
    });

    it('should return false when role is USER', () => {
      // Arrange
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.USER, new Date()
      );

      // Act & Assert
      expect(message.isFromSystem()).toBe(false);
    });

    it('should return false when role is ASSISTANT', () => {
      // Arrange
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.ASSISTANT, new Date()
      );

      // Act & Assert
      expect(message.isFromSystem()).toBe(false);
    });
  });

  describe('hasTokenUsage', () => {
    it('should return true when tokensUsed is a positive number', () => {
      // Arrange
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.USER, new Date(), null, null, 10
      );

      // Act & Assert
      expect(message.hasTokenUsage()).toBe(true);
    });

    it('should return false when tokensUsed is zero', () => {
      // Arrange
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.USER, new Date(), null, null, 0
      );

      // Act & Assert
      expect(message.hasTokenUsage()).toBe(false);
    });

    it('should return false when tokensUsed is null', () => {
      // Arrange
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.USER, new Date(), null, null, null
      );

      // Act & Assert
      expect(message.hasTokenUsage()).toBe(false);
    });

    it('should return false when tokensUsed is undefined', () => {
      // Arrange
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.USER, new Date()
      );

      // Act & Assert
      expect(message.hasTokenUsage()).toBe(false);
    });
  });

  describe('getAge', () => {
    it('should return age in milliseconds', () => {
      // Arrange
      const createdAt = new Date('2024-01-01T00:00:00.000Z');
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.USER, createdAt
      );

      // Act
      const age = message.getAge();

      // Assert
      expect(age).toBeGreaterThan(0);
      expect(typeof age).toBe('number');
    });

    it('should return correct age for recent message', () => {
      // Arrange
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.USER, oneMinuteAgo
      );

      // Act
      const age = message.getAge();

      // Assert
      expect(age).toBeGreaterThanOrEqual(60 * 1000 - 100); // Allow 100ms tolerance
      expect(age).toBeLessThan(60 * 1000 + 1000); // Allow 1s tolerance
    });
  });

  describe('getContentLength', () => {
    it('should return correct content length', () => {
      // Arrange
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello, world!', MessageRole.USER, new Date()
      );

      // Act
      const length = message.getContentLength();

      // Assert
      expect(length).toBe(13); // 'Hello, world!'.length
    });

    it('should return 0 for empty content', () => {
      // Arrange
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', '', MessageRole.USER, new Date()
      );

      // Act
      const length = message.getContentLength();

      // Assert
      expect(length).toBe(0);
    });

    it('should handle unicode characters correctly', () => {
      // Arrange
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', '🚀 Hello!', MessageRole.USER, new Date()
      );

      // Act
      const length = message.getContentLength();

      // Assert
      expect(length).toBe(9); // '🚀 Hello!'.length
    });
  });

  describe('getMetadataValue', () => {
    it('should return metadata value when key exists', () => {
      // Arrange
      const metadata = { source: 'whatsapp', messageId: 'wa-123', type: 'text' };
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.USER, new Date(), metadata
      );

      // Act
      const source = message.getMetadataValue('source');
      const messageId = message.getMetadataValue('messageId');

      // Assert
      expect(source).toBe('whatsapp');
      expect(messageId).toBe('wa-123');
    });

    it('should return undefined when key does not exist', () => {
      // Arrange
      const metadata = { source: 'whatsapp' };
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.USER, new Date(), metadata
      );

      // Act
      const nonExistent = message.getMetadataValue('nonExistent');

      // Assert
      expect(nonExistent).toBeUndefined();
    });

    it('should return undefined when metadata is null', () => {
      // Arrange
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.USER, new Date(), null
      );

      // Act
      const value = message.getMetadataValue('source');

      // Assert
      expect(value).toBeUndefined();
    });

    it('should return undefined when metadata is undefined', () => {
      // Arrange
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.USER, new Date()
      );

      // Act
      const value = message.getMetadataValue('source');

      // Assert
      expect(value).toBeUndefined();
    });

    it('should return default value when key does not exist and default is provided', () => {
      // Arrange
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.USER, new Date(), {}
      );

      // Act
      const value = message.getMetadataValue('source', 'unknown');

      // Assert
      expect(value).toBe('unknown');
    });
  });

  describe('isComplete', () => {
    it('should return true when finishReason indicates completion', () => {
      // Arrange
      const completedMessage = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.ASSISTANT, new Date(), null, null, null, null, 'stop'
      );

      // Act & Assert
      expect(completedMessage.isComplete()).toBe(true);
    });

    it('should return true when finishReason is "length"', () => {
      // Arrange
      const lengthLimitMessage = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.ASSISTANT, new Date(), null, null, null, null, 'length'
      );

      // Act & Assert
      expect(lengthLimitMessage.isComplete()).toBe(true);
    });

    it('should return false when finishReason is null', () => {
      // Arrange
      const incompleteMessage = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.ASSISTANT, new Date(), null, null, null, null, null
      );

      // Act & Assert
      expect(incompleteMessage.isComplete()).toBe(false);
    });

    it('should return false when finishReason is undefined', () => {
      // Arrange
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.ASSISTANT, new Date()
      );

      // Act & Assert
      expect(message.isComplete()).toBe(false);
    });
  });

  describe('create (static method)', () => {
    it('should create ConversationMessageEntity with default values', () => {
      // Arrange
      const input = {
        conversationId: 'conv-123',
        content: 'Hello!',
        role: 'user' as const,
      };

      // Act
      const message = ConversationMessageEntity.create(input);

      // Assert
      expect(message.conversationId).toBe(input.conversationId);
      expect(message.content).toBe(input.content);
      expect(message.role).toBe(MessageRole.USER);
      expect(message.id).toBeDefined();
      expect(message.createdAt).toBeInstanceOf(Date);
      expect(message.metadata).toBeNull();
      expect(message.openaiMessageId).toBeNull();
      expect(message.tokensUsed).toBeNull();
      expect(message.model).toBeNull();
      expect(message.finishReason).toBeNull();
    });

    it('should create ConversationMessageEntity with custom values', () => {
      // Arrange
      const input = {
        conversationId: 'conv-123',
        content: 'Custom message',
        role: 'assistant' as const,
        metadata: { source: 'openai' },
        openaiMessageId: 'openai-123',
        tokensUsed: 15,
        model: 'gpt-4',
        finishReason: 'stop',
      };

      // Act
      const message = ConversationMessageEntity.create(input);

      // Assert
      expect(message.role).toBe(MessageRole.ASSISTANT);
      expect(message.metadata).toBe(input.metadata);
      expect(message.openaiMessageId).toBe(input.openaiMessageId);
      expect(message.tokensUsed).toBe(input.tokensUsed);
      expect(message.model).toBe(input.model);
      expect(message.finishReason).toBe(input.finishReason);
    });

    it('should generate unique IDs for different messages', () => {
      // Arrange
      const input1 = { conversationId: 'conv-123', content: 'Message 1', role: 'user' as const };
      const input2 = { conversationId: 'conv-123', content: 'Message 2', role: 'user' as const };

      // Mock uuid to return different values
      const mockUuid = jest.requireMock('uuid');
      mockUuid.v4 = jest.fn()
        .mockReturnValueOnce('msg-1')
        .mockReturnValueOnce('msg-2');

      // Act
      const message1 = ConversationMessageEntity.create(input1);
      const message2 = ConversationMessageEntity.create(input2);

      // Assert
      expect(message1.id).not.toBe(message2.id);
      expect(message1.id).toBe('msg-1');
      expect(message2.id).toBe('msg-2');
    });

    it('should use current timestamp for createdAt', () => {
      // Arrange
      const before = new Date();
      const input = { conversationId: 'conv-123', content: 'Test', role: 'user' as const };

      // Act
      const message = ConversationMessageEntity.create(input);
      const after = new Date();

      // Assert
      expect(message.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(message.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('business logic consistency', () => {
    it('should have consistent role-based behavior', () => {
      // Arrange
      const userMessage = new ConversationMessageEntity(
        'msg-1', 'conv-123', 'Hello', MessageRole.USER, new Date()
      );
      const assistantMessage = new ConversationMessageEntity(
        'msg-2', 'conv-123', 'Hi there', MessageRole.ASSISTANT, new Date()
      );
      const systemMessage = new ConversationMessageEntity(
        'msg-3', 'conv-123', 'System message', MessageRole.SYSTEM, new Date()
      );

      // Act & Assert
      expect(userMessage.isFromUser()).toBe(true);
      expect(userMessage.isFromAssistant()).toBe(false);
      expect(userMessage.isFromSystem()).toBe(false);

      expect(assistantMessage.isFromUser()).toBe(false);
      expect(assistantMessage.isFromAssistant()).toBe(true);
      expect(assistantMessage.isFromSystem()).toBe(false);

      expect(systemMessage.isFromUser()).toBe(false);
      expect(systemMessage.isFromAssistant()).toBe(false);
      expect(systemMessage.isFromSystem()).toBe(true);
    });

    it('should handle edge cases gracefully', () => {
      // Arrange
      const edgeCaseMessage = new ConversationMessageEntity(
        'msg-123', 'conv-123', '', MessageRole.USER, new Date(), null, null, null, null, null
      );

      // Act & Assert
      expect(edgeCaseMessage.getContentLength()).toBe(0);
      expect(edgeCaseMessage.hasTokenUsage()).toBe(false);
      expect(edgeCaseMessage.isComplete()).toBe(false);
      expect(edgeCaseMessage.getMetadataValue('source')).toBeUndefined();
    });

    it('should maintain immutability of metadata', () => {
      // Arrange
      const originalMetadata = { source: 'whatsapp', messageId: 'wa-123' };
      const message = new ConversationMessageEntity(
        'msg-123', 'conv-123', 'Hello', MessageRole.USER, new Date(), { ...originalMetadata }
      );

      // Act
      const retrievedMetadata = message.getMetadataValue('source');
      originalMetadata.source = 'modified'; // Modify original object

      // Assert
      expect(retrievedMetadata).toBe('whatsapp'); // Should not be affected by external modification
      expect(message.getMetadataValue('source')).toBe('whatsapp'); // Message metadata should be unchanged
    });
  });
});