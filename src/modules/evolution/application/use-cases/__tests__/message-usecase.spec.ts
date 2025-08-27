import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MessageUseCase } from '../message-usecase';
import { IMessageRepository } from '../../../domain/repositories/message-repository.contract';
import { MESSAGE_REPOSITORY_TOKEN } from '../../../../../shared/constants/di-constants';
import {
  ISendTextMessageInput,
  ISendMediaMessageInput,
  IWebhookEventInput,
} from '../../../domain/contracts/input/send-message-input.contract';
import {
  ISendMessageOutput,
  IMessageOutput,
} from '../../../domain/contracts/output/message-output.contract';

describe('MessageUseCase', () => {
  let messageUseCase: MessageUseCase;
  let mockMessageRepository: jest.Mocked<IMessageRepository>;

  const mockSendMessageOutput: ISendMessageOutput = {
    messageId: 'msg-123',
    status: 'sent',
    timestamp: 1640995200000,
    instanceName: 'test-instance',
    to: '5511999999999@s.whatsapp.net',
  };

  const mockMessageOutput: IMessageOutput = {
    id: 'msg-123',
    timestamp: 1640995200000,
    from: 'test-instance@bot',
    to: '5511999999999@s.whatsapp.net',
    content: 'Test message',
    type: 'text',
    status: 'sent',
    fromMe: true,
    instanceName: 'test-instance',
  };

  beforeEach(async () => {
    const mockRepository = {
      sendTextMessage: jest.fn(),
      sendMediaMessage: jest.fn(),
      processWebhookEvent: jest.fn(),
      getMessageHistory: jest.fn(),
      markAsRead: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageUseCase,
        {
          provide: MESSAGE_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
      ],
    }).compile();

    messageUseCase = module.get<MessageUseCase>(MessageUseCase);
    mockMessageRepository = module.get(MESSAGE_REPOSITORY_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendTextMessage', () => {
    const validInput: ISendTextMessageInput = {
      instanceName: 'test-instance',
      number: '5511999999999',
      text: 'Hello World',
      options: {
        delay: 1000,
        presence: 'composing',
      },
    };

    it('should successfully send text message with valid input', async () => {
      // Arrange
      mockMessageRepository.sendTextMessage.mockResolvedValue(mockSendMessageOutput);

      // Act
      const result = await messageUseCase.sendTextMessage(validInput);

      // Assert
      expect(result).toEqual(mockSendMessageOutput);
      expect(mockMessageRepository.sendTextMessage).toHaveBeenCalledTimes(1);
      expect(mockMessageRepository.sendTextMessage).toHaveBeenCalledWith({
        ...validInput,
        number: '5511999999999@s.whatsapp.net',
      });
    });

    it('should normalize phone number without @s.whatsapp.net suffix', async () => {
      // Arrange
      const inputWithoutSuffix = { ...validInput, number: '5511999999999' };
      mockMessageRepository.sendTextMessage.mockResolvedValue(mockSendMessageOutput);

      // Act
      await messageUseCase.sendTextMessage(inputWithoutSuffix);

      // Assert
      expect(mockMessageRepository.sendTextMessage).toHaveBeenCalledWith({
        ...inputWithoutSuffix,
        number: '5511999999999@s.whatsapp.net',
      });
    });

    it('should add Brazil country code for 11-digit numbers', async () => {
      // Arrange
      const inputWithoutCountryCode = { ...validInput, number: '11999999999' };
      mockMessageRepository.sendTextMessage.mockResolvedValue(mockSendMessageOutput);

      // Act
      await messageUseCase.sendTextMessage(inputWithoutCountryCode);

      // Assert
      expect(mockMessageRepository.sendTextMessage).toHaveBeenCalledWith({
        ...inputWithoutCountryCode,
        number: '5511999999999@s.whatsapp.net',
      });
    });

    it('should throw HttpException when instanceName is missing', async () => {
      // Arrange
      const invalidInput = { ...validInput, instanceName: '' };

      // Act & Assert
      await expect(messageUseCase.sendTextMessage(invalidInput)).rejects.toThrow(
        new HttpException('Nome da instância é obrigatório', HttpStatus.BAD_REQUEST),
      );
      expect(mockMessageRepository.sendTextMessage).not.toHaveBeenCalled();
    });

    it('should throw HttpException when number is missing', async () => {
      // Arrange
      const invalidInput = { ...validInput, number: '' };

      // Act & Assert
      await expect(messageUseCase.sendTextMessage(invalidInput)).rejects.toThrow(
        new HttpException('Número e texto são obrigatórios', HttpStatus.BAD_REQUEST),
      );
      expect(mockMessageRepository.sendTextMessage).not.toHaveBeenCalled();
    });

    it('should throw HttpException when text is missing', async () => {
      // Arrange
      const invalidInput = { ...validInput, text: '' };

      // Act & Assert
      await expect(messageUseCase.sendTextMessage(invalidInput)).rejects.toThrow(
        new HttpException('Número e texto são obrigatórios', HttpStatus.BAD_REQUEST),
      );
      expect(mockMessageRepository.sendTextMessage).not.toHaveBeenCalled();
    });

    it('should handle repository errors and throw internal server error', async () => {
      // Arrange
      const repositoryError = new Error('Repository connection failed');
      mockMessageRepository.sendTextMessage.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(messageUseCase.sendTextMessage(validInput)).rejects.toThrow(
        new HttpException('Erro interno ao enviar mensagem de texto', HttpStatus.INTERNAL_SERVER_ERROR),
      );
      expect(mockMessageRepository.sendTextMessage).toHaveBeenCalledTimes(1);
    });

    it('should preserve HttpException from repository', async () => {
      // Arrange
      const httpException = new HttpException('Custom error', HttpStatus.FORBIDDEN);
      mockMessageRepository.sendTextMessage.mockRejectedValue(httpException);

      // Act & Assert
      await expect(messageUseCase.sendTextMessage(validInput)).rejects.toThrow(httpException);
      expect(mockMessageRepository.sendTextMessage).toHaveBeenCalledTimes(1);
    });
  });

  describe('sendMediaMessage', () => {
    const validInput: ISendMediaMessageInput = {
      instanceName: 'test-instance',
      number: '5511999999999',
      mediaUrl: 'https://example.com/image.jpg',
      mediaType: 'image',
      caption: 'Test image',
      fileName: 'test.jpg',
    };

    it('should successfully send media message with valid input', async () => {
      // Arrange
      mockMessageRepository.sendMediaMessage.mockResolvedValue(mockSendMessageOutput);

      // Act
      const result = await messageUseCase.sendMediaMessage(validInput);

      // Assert
      expect(result).toEqual(mockSendMessageOutput);
      expect(mockMessageRepository.sendMediaMessage).toHaveBeenCalledTimes(1);
      expect(mockMessageRepository.sendMediaMessage).toHaveBeenCalledWith({
        ...validInput,
        number: '5511999999999@s.whatsapp.net',
      });
    });

    it('should throw HttpException for invalid media type', async () => {
      // Arrange
      const invalidInput = { ...validInput, mediaType: 'invalid' as any };

      // Act & Assert
      await expect(messageUseCase.sendMediaMessage(invalidInput)).rejects.toThrow(
        new HttpException('Tipo de mídia inválido', HttpStatus.BAD_REQUEST),
      );
      expect(mockMessageRepository.sendMediaMessage).not.toHaveBeenCalled();
    });

    it('should accept all valid media types', async () => {
      // Arrange
      mockMessageRepository.sendMediaMessage.mockResolvedValue(mockSendMessageOutput);
      const mediaTypes = ['image', 'video', 'audio', 'document'] as const;

      // Act & Assert
      for (const mediaType of mediaTypes) {
        const input = { ...validInput, mediaType };
        await expect(messageUseCase.sendMediaMessage(input)).resolves.toEqual(mockSendMessageOutput);
      }

      expect(mockMessageRepository.sendMediaMessage).toHaveBeenCalledTimes(4);
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
        id: 'msg-123',
        timestamp: 1640995200000,
        from: '5511999999999@s.whatsapp.net',
        text: 'Hello',
        type: 'text',
        fromMe: false,
      },
    };

    it('should successfully process webhook event', async () => {
      // Arrange
      mockMessageRepository.processWebhookEvent.mockResolvedValue();

      // Act
      await messageUseCase.processWebhookEvent(validInput);

      // Assert
      expect(mockMessageRepository.processWebhookEvent).toHaveBeenCalledTimes(1);
      expect(mockMessageRepository.processWebhookEvent).toHaveBeenCalledWith(validInput);
    });

    it('should handle different event types', async () => {
      // Arrange
      mockMessageRepository.processWebhookEvent.mockResolvedValue();
      const eventTypes = ['messages.upsert', 'connection.update', 'qr.updated', 'unknown.event'];

      // Act & Assert
      for (const event of eventTypes) {
        const input = { ...validInput, event };
        await expect(messageUseCase.processWebhookEvent(input)).resolves.toBeUndefined();
      }

      expect(mockMessageRepository.processWebhookEvent).toHaveBeenCalledTimes(4);
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      const repositoryError = new Error('Processing failed');
      mockMessageRepository.processWebhookEvent.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(messageUseCase.processWebhookEvent(validInput)).rejects.toThrow(
        new HttpException('Erro interno ao processar evento webhook', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('getMessageHistory', () => {
    const mockMessages: IMessageOutput[] = [mockMessageOutput];

    it('should successfully get message history', async () => {
      // Arrange
      mockMessageRepository.getMessageHistory.mockResolvedValue(mockMessages);

      // Act
      const result = await messageUseCase.getMessageHistory('test-instance', '5511999999999', 10);

      // Assert
      expect(result).toEqual(mockMessages);
      expect(mockMessageRepository.getMessageHistory).toHaveBeenCalledTimes(1);
      expect(mockMessageRepository.getMessageHistory).toHaveBeenCalledWith(
        'test-instance',
        '5511999999999@s.whatsapp.net',
        10,
      );
    });

    it('should use default limit when not provided', async () => {
      // Arrange
      mockMessageRepository.getMessageHistory.mockResolvedValue(mockMessages);

      // Act
      await messageUseCase.getMessageHistory('test-instance', '5511999999999');

      // Assert
      expect(mockMessageRepository.getMessageHistory).toHaveBeenCalledWith(
        'test-instance',
        '5511999999999@s.whatsapp.net',
        undefined,
      );
    });

    it('should throw HttpException when instanceName is missing', async () => {
      // Act & Assert
      await expect(messageUseCase.getMessageHistory('', '5511999999999')).rejects.toThrow(
        new HttpException('Nome da instância e número do contato são obrigatórios', HttpStatus.BAD_REQUEST),
      );
      expect(mockMessageRepository.getMessageHistory).not.toHaveBeenCalled();
    });
  });

  describe('markAsRead', () => {
    it('should successfully mark message as read', async () => {
      // Arrange
      mockMessageRepository.markAsRead.mockResolvedValue();

      // Act
      await messageUseCase.markAsRead('test-instance', 'msg-123');

      // Assert
      expect(mockMessageRepository.markAsRead).toHaveBeenCalledTimes(1);
      expect(mockMessageRepository.markAsRead).toHaveBeenCalledWith('test-instance', 'msg-123');
    });

    it('should throw HttpException when parameters are missing', async () => {
      // Act & Assert
      await expect(messageUseCase.markAsRead('', 'msg-123')).rejects.toThrow(
        new HttpException('Nome da instância e ID da mensagem são obrigatórios', HttpStatus.BAD_REQUEST),
      );

      await expect(messageUseCase.markAsRead('test-instance', '')).rejects.toThrow(
        new HttpException('Nome da instância e ID da mensagem são obrigatórios', HttpStatus.BAD_REQUEST),
      );

      expect(mockMessageRepository.markAsRead).not.toHaveBeenCalled();
    });
  });
});
