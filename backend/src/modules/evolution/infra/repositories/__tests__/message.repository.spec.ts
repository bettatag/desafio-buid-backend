import { MessageRepository } from '../message.repository';
import {
  ISendTextMessageInput,
  ISendMediaMessageInput,
  IWebhookEventInput,
} from '../../../domain/contracts/input/send-message-input.contract';

describe('MessageRepository', () => {
  let messageRepository: MessageRepository;

  beforeEach(() => {
    messageRepository = new MessageRepository();
  });

  describe('sendTextMessage', () => {
    const validInput: ISendTextMessageInput = {
      instanceName: 'test-instance',
      number: '5511999999999@s.whatsapp.net',
      text: 'Hello World',
      options: {
        delay: 100, // Use small delay for testing
        presence: 'composing',
      },
    };

    it('should successfully send text message and return correct output', async () => {
      // Act
      const result = await messageRepository.sendTextMessage(validInput);

      // Assert
      expect(result).toEqual({
        messageId: expect.stringMatching(/^msg-\d+-\w+$/),
        status: 'sent',
        timestamp: expect.any(Number),
        instanceName: 'test-instance',
        to: '5511999999999@s.whatsapp.net',
      });
      expect(result.timestamp).toBeGreaterThan(Date.now() - 1000);
      expect(result.timestamp).toBeLessThanOrEqual(Date.now());
    });

    it('should add message to internal messages array', async () => {
      // Arrange
      const initialStats = messageRepository.getStats();
      const initialCount = initialStats.totalMessages;

      // Act
      await messageRepository.sendTextMessage(validInput);

      // Assert
      const updatedStats = messageRepository.getStats();
      expect(updatedStats.totalMessages).toBe(initialCount + 1);
      expect(updatedStats.messagesByInstance['test-instance']).toBeGreaterThan(0);
    });

    it('should respect delay option when provided', async () => {
      // Arrange
      const startTime = Date.now();
      const inputWithDelay = { ...validInput, options: { delay: 50 } };

      // Act
      await messageRepository.sendTextMessage(inputWithDelay);

      // Assert
      const endTime = Date.now();
      expect(endTime - startTime).toBeGreaterThanOrEqual(50);
    });

    it('should work without options', async () => {
      // Arrange
      const inputWithoutOptions = { ...validInput, options: undefined };

      // Act
      const result = await messageRepository.sendTextMessage(inputWithoutOptions);

      // Assert
      expect(result).toEqual({
        messageId: expect.stringMatching(/^msg-\d+-\w+$/),
        status: 'sent',
        timestamp: expect.any(Number),
        instanceName: 'test-instance',
        to: '5511999999999@s.whatsapp.net',
      });
    });

    it('should trigger auto-reply simulation after 2 seconds', async () => {
      // Arrange
      const initialStats = messageRepository.getStats();
      const initialCount = initialStats.totalMessages;

      // Act
      await messageRepository.sendTextMessage(validInput);

      // Wait for auto-reply
      await new Promise(resolve => setTimeout(resolve, 2100));

      // Assert
      const updatedStats = messageRepository.getStats();
      expect(updatedStats.totalMessages).toBe(initialCount + 2); // Original + auto-reply
    });

    it('should generate different message IDs for concurrent calls', async () => {
      // Act
      const promises = Array(5).fill(null).map(() => messageRepository.sendTextMessage(validInput));
      const results = await Promise.all(promises);

      // Assert
      const messageIds = results.map(r => r.messageId);
      const uniqueIds = new Set(messageIds);
      expect(uniqueIds.size).toBe(5);
    });
  });

  describe('sendMediaMessage', () => {
    const validInput: ISendMediaMessageInput = {
      instanceName: 'test-instance',
      number: '5511999999999@s.whatsapp.net',
      mediaUrl: 'https://example.com/image.jpg',
      mediaType: 'image',
      caption: 'Test image',
      fileName: 'test.jpg',
    };

    it('should successfully send media message and return correct output', async () => {
      // Act
      const result = await messageRepository.sendMediaMessage(validInput);

      // Assert
      expect(result).toEqual({
        messageId: expect.stringMatching(/^media-\d+-\w+$/),
        status: 'sent',
        timestamp: expect.any(Number),
        instanceName: 'test-instance',
        to: '5511999999999@s.whatsapp.net',
      });
    });

    it('should handle different media types correctly', async () => {
      // Arrange
      const mediaTypes = ['image', 'video', 'audio', 'document'] as const;

      // Act & Assert
      for (const mediaType of mediaTypes) {
        const input = { ...validInput, mediaType };
        const result = await messageRepository.sendMediaMessage(input);
        expect(result.status).toBe('sent');
      }
    });

    it('should use caption in message content when provided', async () => {
      // Arrange
      const inputWithCaption = { ...validInput, caption: 'Custom caption' };
      const initialCount = messageRepository.getStats().totalMessages;

      // Act
      await messageRepository.sendMediaMessage(inputWithCaption);

      // Assert
      const stats = messageRepository.getStats();
      expect(stats.totalMessages).toBe(initialCount + 1);
    });

    it('should use fileName in message content when caption is not provided', async () => {
      // Arrange
      const inputWithoutCaption = { ...validInput, caption: undefined, fileName: 'document.pdf' };
      const initialCount = messageRepository.getStats().totalMessages;

      // Act
      await messageRepository.sendMediaMessage(inputWithoutCaption);

      // Assert
      const stats = messageRepository.getStats();
      expect(stats.totalMessages).toBe(initialCount + 1);
    });
  });

  describe('processWebhookEvent', () => {
    const validInput: IWebhookEventInput = {
      event: 'messages.upsert',
      instance: {
        instanceName: 'test-instance',
        status: 'open',
      },
      data: {
        id: 'msg-webhook-123',
        timestamp: 1640995200000,
        from: '5511999999999@s.whatsapp.net',
        text: 'Hello from webhook',
        type: 'conversation',
        fromMe: false,
      },
    };

    it('should successfully process webhook event', async () => {
      // Arrange
      const initialStats = messageRepository.getStats();
      const initialWebhookCount = initialStats.totalWebhookEvents;
      const initialMessageCount = initialStats.totalMessages;

      // Act
      await messageRepository.processWebhookEvent(validInput);

      // Assert
      const updatedStats = messageRepository.getStats();
      expect(updatedStats.totalWebhookEvents).toBe(initialWebhookCount + 1);
      expect(updatedStats.totalMessages).toBe(initialMessageCount + 1);
    });

    it('should add processedAt timestamp to webhook event', async () => {
      // Arrange
      const beforeProcessing = new Date().toISOString();

      // Act
      await messageRepository.processWebhookEvent(validInput);

      // Assert
      const stats = messageRepository.getStats();
      expect(stats.totalWebhookEvents).toBeGreaterThan(0);
    });

    it('should handle webhook events without data', async () => {
      // Arrange
      const eventWithoutData = {
        event: 'connection.update',
        instance: validInput.instance,
      };

      // Act & Assert
      await expect(messageRepository.processWebhookEvent(eventWithoutData)).resolves.not.toThrow();
    });

    it('should process different event types', async () => {
      // Arrange
      const eventTypes = ['messages.upsert', 'connection.update', 'qr.updated'];

      // Act & Assert
      for (const event of eventTypes) {
        const eventInput = { ...validInput, event };
        await expect(messageRepository.processWebhookEvent(eventInput)).resolves.not.toThrow();
      }
    });
  });

  describe('getMessageHistory', () => {
    beforeEach(async () => {
      // Seed some test messages
      await messageRepository.sendTextMessage({
        instanceName: 'test-instance',
        number: '5511999999999@s.whatsapp.net',
        text: 'Message 1',
      });
      await messageRepository.sendTextMessage({
        instanceName: 'test-instance',
        number: '5511888888888@s.whatsapp.net',
        text: 'Message 2',
      });
    });

    it('should return messages for specific instance and contact', async () => {
      // Act
      const messages = await messageRepository.getMessageHistory('test-instance', '5511999999999@s.whatsapp.net');

      // Assert
      expect(messages).toBeInstanceOf(Array);
      expect(messages.length).toBeGreaterThan(0);
      expect(messages[0]).toEqual({
        id: expect.any(String),
        timestamp: expect.any(Number),
        from: expect.any(String),
        to: expect.any(String),
        content: expect.any(String),
        type: expect.any(String),
        status: expect.any(String),
        fromMe: expect.any(Boolean),
        instanceName: 'test-instance',
      });
    });

    it('should respect limit parameter', async () => {
      // Act
      const messages = await messageRepository.getMessageHistory('test-instance', '5511999999999@s.whatsapp.net', 1);

      // Assert
      expect(messages.length).toBeLessThanOrEqual(1);
    });

    it('should return messages sorted by timestamp (newest first)', async () => {
      // Arrange
      await messageRepository.sendTextMessage({
        instanceName: 'test-instance',
        number: '5511999999999@s.whatsapp.net',
        text: 'Newer message',
      });

      // Act
      const messages = await messageRepository.getMessageHistory('test-instance', '5511999999999@s.whatsapp.net');

      // Assert
      expect(messages.length).toBeGreaterThan(1);
      for (let i = 0; i < messages.length - 1; i++) {
        expect(messages[i].timestamp).toBeGreaterThanOrEqual(messages[i + 1].timestamp);
      }
    });

    it('should return empty array for non-existent instance', async () => {
      // Act
      const messages = await messageRepository.getMessageHistory('non-existent', '5511999999999@s.whatsapp.net');

      // Assert
      expect(messages).toEqual([]);
    });
  });

  describe('markAsRead', () => {
    let messageId: string;

    beforeEach(async () => {
      // Create a test message
      const result = await messageRepository.sendTextMessage({
        instanceName: 'test-instance',
        number: '5511999999999@s.whatsapp.net',
        text: 'Test message',
      });
      messageId = result.messageId;
    });

    it('should successfully mark message as read', async () => {
      // Act & Assert
      await expect(messageRepository.markAsRead('test-instance', messageId)).resolves.not.toThrow();
    });

    it('should handle non-existent message gracefully', async () => {
      // Act & Assert
      await expect(messageRepository.markAsRead('test-instance', 'non-existent-id')).resolves.not.toThrow();
    });

    it('should handle non-existent instance gracefully', async () => {
      // Act & Assert
      await expect(messageRepository.markAsRead('non-existent', messageId)).resolves.not.toThrow();
    });
  });

  describe('getStats', () => {
    it('should return correct statistics structure', () => {
      // Act
      const stats = messageRepository.getStats();

      // Assert
      expect(stats).toEqual({
        totalMessages: expect.any(Number),
        totalWebhookEvents: expect.any(Number),
        messagesByInstance: expect.any(Object),
      });
    });

    it('should track messages by instance correctly', async () => {
      // Arrange
      const initialStats = messageRepository.getStats();

      // Act
      await messageRepository.sendTextMessage({
        instanceName: 'instance-1',
        number: '5511999999999@s.whatsapp.net',
        text: 'Test',
      });
      await messageRepository.sendTextMessage({
        instanceName: 'instance-2',
        number: '5511999999999@s.whatsapp.net',
        text: 'Test',
      });

      // Assert
      const updatedStats = messageRepository.getStats();
      expect(updatedStats.totalMessages).toBe(initialStats.totalMessages + 2);
      expect(updatedStats.messagesByInstance['instance-1']).toBeGreaterThan(0);
      expect(updatedStats.messagesByInstance['instance-2']).toBeGreaterThan(0);
    });
  });
});
