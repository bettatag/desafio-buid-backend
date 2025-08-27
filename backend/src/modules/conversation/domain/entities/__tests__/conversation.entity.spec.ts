import { ConversationEntity } from '../conversation.entity';

describe('ConversationEntity', () => {
  const validProps = {
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

  describe('constructor', () => {
    it('should create ConversationEntity with all properties', () => {
      // Act
      const conversation = new ConversationEntity(
        validProps.id,
        validProps.userId,
        validProps.title,
        validProps.context,
        validProps.isActive,
        validProps.createdAt,
        validProps.updatedAt,
        validProps.totalMessages,
        validProps.lastMessageAt,
      );

      // Assert
      expect(conversation.id).toBe(validProps.id);
      expect(conversation.userId).toBe(validProps.userId);
      expect(conversation.title).toBe(validProps.title);
      expect(conversation.context).toBe(validProps.context);
      expect(conversation.isActive).toBe(validProps.isActive);
      expect(conversation.createdAt).toBe(validProps.createdAt);
      expect(conversation.updatedAt).toBe(validProps.updatedAt);
      expect(conversation.totalMessages).toBe(validProps.totalMessages);
      expect(conversation.lastMessageAt).toBe(validProps.lastMessageAt);
    });

    it('should create ConversationEntity without optional properties', () => {
      // Arrange & Act
      const conversation = new ConversationEntity(
        'conv-123',
        1,
        null,
        null,
        true,
        new Date(),
        new Date(),
        0,
      );

      // Assert
      expect(conversation.title).toBeNull();
      expect(conversation.context).toBeNull();
      expect(conversation.totalMessages).toBe(0);
      expect(conversation.lastMessageAt).toBeNull();
    });

    it('should handle null values for optional properties', () => {
      // Arrange & Act
      const conversation = new ConversationEntity(
        'conv-123',
        1,
        null,
        null,
        true,
        new Date(),
        new Date(),
        0,
        null,
      );

      // Assert
      expect(conversation.title).toBeNull();
      expect(conversation.context).toBeNull();
      expect(conversation.lastMessageAt).toBeNull();
    });
  });

  describe('hasMessages', () => {
    it('should return true when conversation has messages', () => {
      // Arrange
      const conversation = new ConversationEntity(
        'conv-123', 1, 'Test', null, true, new Date(), new Date(), 5
      );

      // Act & Assert
      expect(conversation.hasMessages()).toBe(true);
    });

    it('should return false when conversation has no messages', () => {
      // Arrange
      const conversation = new ConversationEntity(
        'conv-123', 1, 'Test', null, true, new Date(), new Date(), 0
      );

      // Act & Assert
      expect(conversation.hasMessages()).toBe(false);
    });
  });

  describe('canAddMessages', () => {
    it('should return true when conversation is active', () => {
      // Arrange
      const conversation = new ConversationEntity(
        'conv-123', 1, 'Test', null, true, new Date(), new Date(), 0
      );

      // Act & Assert
      expect(conversation.canAddMessages()).toBe(true);
    });

    it('should return false when conversation is inactive', () => {
      // Arrange
      const conversation = new ConversationEntity(
        'conv-123', 1, 'Test', null, false, new Date(), new Date(), 0
      );

      // Act & Assert
      expect(conversation.canAddMessages()).toBe(false);
    });
  });

  describe('getAge', () => {
    it('should return age in milliseconds', () => {
      // Arrange
      const createdAt = new Date('2024-01-01T00:00:00.000Z');
      const conversation = new ConversationEntity(
        'conv-123', 1, 'Test', null, true, createdAt, new Date(), 0
      );

      // Act
      const age = conversation.getAge();

      // Assert
      expect(age).toBeGreaterThan(0);
      expect(typeof age).toBe('number');
    });

    it('should return correct age for recent conversation', () => {
      // Arrange
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const conversation = new ConversationEntity(
        'conv-123', 1, 'Test', null, true, fiveMinutesAgo, new Date(), 0
      );

      // Act
      const age = conversation.getAge();

      // Assert
      expect(age).toBeGreaterThanOrEqual(5 * 60 * 1000 - 100); // Allow 100ms tolerance
      expect(age).toBeLessThan(5 * 60 * 1000 + 1000); // Allow 1s tolerance
    });
  });

  describe('getTimeSinceLastMessage', () => {
    it('should return time since last message when lastMessageAt exists', () => {
      // Arrange
      const lastMessageAt = new Date('2024-01-01T00:00:00.000Z');
      const conversation = new ConversationEntity(
        'conv-123', 1, 'Test', null, true, new Date(), new Date(), 1, lastMessageAt
      );

      // Act
      const timeSince = conversation.getTimeSinceLastMessage();

      // Assert
      expect(timeSince).toBeGreaterThan(0);
      expect(typeof timeSince).toBe('number');
    });

    it('should return null when lastMessageAt is null', () => {
      // Arrange
      const conversation = new ConversationEntity(
        'conv-123', 1, 'Test', null, true, new Date(), new Date(), 0, null
      );

      // Act
      const timeSince = conversation.getTimeSinceLastMessage();

      // Assert
      expect(timeSince).toBeNull();
    });

    it('should return null when lastMessageAt is undefined', () => {
      // Arrange
      const conversation = new ConversationEntity(
        'conv-123', 1, 'Test', null, true, new Date(), new Date(), 0
      );

      // Act
      const timeSince = conversation.getTimeSinceLastMessage();

      // Assert
      expect(timeSince).toBeNull();
    });
  });

  describe('isRecentlyActive', () => {
    it('should return true when last message was within threshold', () => {
      // Arrange
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const conversation = new ConversationEntity(
        'conv-123', 1, 'Test', null, true, new Date(), new Date(), 1, fiveMinutesAgo
      );

      // Act
      const isRecent = conversation.isRecentlyActive(10 * 60 * 1000); // 10 minutes threshold

      // Assert
      expect(isRecent).toBe(true);
    });

    it('should return false when last message was beyond threshold', () => {
      // Arrange
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      const conversation = new ConversationEntity(
        'conv-123', 1, 'Test', null, true, new Date(), new Date(), 1, fifteenMinutesAgo
      );

      // Act
      const isRecent = conversation.isRecentlyActive(10 * 60 * 1000); // 10 minutes threshold

      // Assert
      expect(isRecent).toBe(false);
    });

    it('should return false when lastMessageAt is null', () => {
      // Arrange
      const conversation = new ConversationEntity(
        'conv-123', 1, 'Test', null, true, new Date(), new Date(), 0, null
      );

      // Act
      const isRecent = conversation.isRecentlyActive(10 * 60 * 1000);

      // Assert
      expect(isRecent).toBe(false);
    });

    it('should use default threshold of 1 hour when not provided', () => {
      // Arrange
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const conversation = new ConversationEntity(
        'conv-123', 1, 'Test', null, true, new Date(), new Date(), 1, thirtyMinutesAgo
      );

      // Act
      const isRecent = conversation.isRecentlyActive();

      // Assert
      expect(isRecent).toBe(true);
    });
  });

  describe('getDisplayTitle', () => {
    it('should return title when title exists', () => {
      // Arrange
      const conversation = new ConversationEntity(
        'conv-123', 1, 'My Conversation', null, true, new Date(), new Date(), 0
      );

      // Act
      const displayTitle = conversation.getDisplayTitle();

      // Assert
      expect(displayTitle).toBe('My Conversation');
    });

    it('should return default title when title is null', () => {
      // Arrange
      const conversation = new ConversationEntity(
        'conv-123', 1, null, null, true, new Date(), new Date(), 0
      );

      // Act
      const displayTitle = conversation.getDisplayTitle();

      // Assert
      expect(displayTitle).toBe('Conversa sem título');
    });

    it('should return default title when title is empty string', () => {
      // Arrange
      const conversation = new ConversationEntity(
        'conv-123', 1, '', null, true, new Date(), new Date(), 0
      );

      // Act
      const displayTitle = conversation.getDisplayTitle();

      // Assert
      expect(displayTitle).toBe('Conversa sem título');
    });

    it('should return custom default title when provided', () => {
      // Arrange
      const conversation = new ConversationEntity(
        'conv-123', 1, null, null, true, new Date(), new Date(), 0
      );

      // Act
      const displayTitle = conversation.getDisplayTitle('Untitled Chat');

      // Assert
      expect(displayTitle).toBe('Untitled Chat');
    });
  });

  describe('create (static method)', () => {
    it('should create ConversationEntity with default values', () => {
      // Arrange
      const input = {
        userId: 1,
        title: 'Test Conversation',
      };

      // Act
      const conversation = ConversationEntity.create(input);

      // Assert
      expect(conversation.userId).toBe(input.userId);
      expect(conversation.title).toBe(input.title);
      expect(conversation.id).toBeDefined();
      expect(conversation.isActive).toBe(true);
      expect(conversation.totalMessages).toBe(0);
      expect(conversation.createdAt).toBeInstanceOf(Date);
      expect(conversation.updatedAt).toBeInstanceOf(Date);
      expect(conversation.lastMessageAt).toBeNull();
    });

    it('should create ConversationEntity with custom values', () => {
      // Arrange
      const input = {
        userId: 1,
        title: 'Custom Conversation',
        context: 'Custom context',
        isActive: false,
      };

      // Act
      const conversation = ConversationEntity.create(input);

      // Assert
      expect(conversation.title).toBe(input.title);
      expect(conversation.context).toBe(input.context);
      expect(conversation.isActive).toBe(input.isActive);
    });

    it('should generate unique IDs for different conversations', () => {
      // Arrange
      const input1 = { userId: 1, title: 'Conv 1' };
      const input2 = { userId: 1, title: 'Conv 2' };

      // Mock uuid to return different values
      const mockUuid = jest.requireMock('uuid');
      mockUuid.v4 = jest.fn()
        .mockReturnValueOnce('uuid-1')
        .mockReturnValueOnce('uuid-2');

      // Act
      const conversation1 = ConversationEntity.create(input1);
      const conversation2 = ConversationEntity.create(input2);

      // Assert
      expect(conversation1.id).not.toBe(conversation2.id);
      expect(conversation1.id).toBe('uuid-1');
      expect(conversation2.id).toBe('uuid-2');
    });

    it('should use current timestamp for createdAt and updatedAt', () => {
      // Arrange
      const before = new Date();
      const input = { userId: 1, title: 'Test' };

      // Act
      const conversation = ConversationEntity.create(input);
      const after = new Date();

      // Assert
      expect(conversation.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(conversation.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(conversation.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(conversation.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('business logic consistency', () => {
    it('should have consistent behavior for active conversations', () => {
      // Arrange
      const activeConversation = new ConversationEntity(
        'conv-123', 1, 'Test', null, true, new Date(), new Date(), 0
      );

      // Act & Assert
      expect(activeConversation.isActive).toBe(true);
      expect(activeConversation.canAddMessages()).toBe(true);
    });

    it('should have consistent behavior for inactive conversations', () => {
      // Arrange
      const inactiveConversation = new ConversationEntity(
        'conv-123', 1, 'Test', null, false, new Date(), new Date(), 0
      );

      // Act & Assert
      expect(inactiveConversation.isActive).toBe(false);
      expect(inactiveConversation.canAddMessages()).toBe(false);
    });

    it('should handle edge cases gracefully', () => {
      // Arrange
      const edgeCaseConversation = new ConversationEntity(
        'conv-123', 1, '', null, true, new Date(), new Date(), 0, null
      );

      // Act & Assert
      expect(edgeCaseConversation.hasMessages()).toBe(false);
      expect(edgeCaseConversation.getTimeSinceLastMessage()).toBeNull();
      expect(edgeCaseConversation.isRecentlyActive()).toBe(false);
      expect(edgeCaseConversation.getDisplayTitle()).toBe('Conversa sem título');
    });
  });
});