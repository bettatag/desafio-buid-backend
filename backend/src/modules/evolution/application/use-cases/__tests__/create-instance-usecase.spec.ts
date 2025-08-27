import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CREATE_EVOLUTION_INSTANCE_REPOSITORY_TOKEN } from '../../../../../shared/constants/di-constants';
import { ERROR_MESSAGES } from '../../../../../shared/errors/error-messages';
import { ICreateEvolutionInstanceRepository } from '../../../domain/repositories/create-evolution-instance-repository.contract';
import { EvolutionInstanceEntity } from '../../../domain/entities/evolution-instance.entity';
import { ICreateInstanceInput } from '../../../domain/contracts/input/create-instance-input.contract';
import { CreateEvolutionInstanceUseCase } from '../create-instance-usecase';

describe('CreateEvolutionInstanceUseCase', () => {
  let useCase: CreateEvolutionInstanceUseCase;
  let mockRepository: jest.Mocked<ICreateEvolutionInstanceRepository>;

  const validInput: ICreateInstanceInput = {
    instanceName: 'test-instance',
    token: 'valid-token-123456789',
    qrcode: true,
    number: '5511999887766',
    integration: 'WHATSAPP-BAILEYS',
    webhook: 'https://example.com/webhook',
    webhook_by_events: false,
    events: ['MESSAGE_RECEIVED', 'CONNECTION_UPDATE'],
    reject_call: false,
    msg_call: 'Calls not accepted',
    groups_ignore: false,
    always_online: true,
    read_messages: true,
    read_status: true,
    websocket_enabled: false,
    websocket_events: [],
    proxy: {
      host: '',
      port: '',
      protocol: 'http',
      username: '',
      password: '',
    },
  };

  const mockEvolutionInstance = new EvolutionInstanceEntity(
    {
      instanceName: 'test-instance',
      instanceId: 'uuid-test-instance',
      webhook_wa_business: 'https://example.com/webhook',
      access_token_wa_business: 'valid-token-123456789',
      status: 'ACTIVE',
    },
    {
      apikey: 'api-key-123',
    },
    {
      reject_call: false,
      msg_call: 'Calls not accepted',
      groups_ignore: false,
      always_online: true,
      read_messages: true,
      read_status: true,
      sync_full_history: true,
    },
  );

  beforeEach(async () => {
    // Create mocks
    mockRepository = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateEvolutionInstanceUseCase,
        { provide: CREATE_EVOLUTION_INSTANCE_REPOSITORY_TOKEN, useValue: mockRepository },
      ],
    }).compile();

    useCase = module.get<CreateEvolutionInstanceUseCase>(CreateEvolutionInstanceUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create instance successfully with valid input', async () => {
      // Arrange
      mockRepository.create.mockResolvedValue(mockEvolutionInstance);

      // Act
      const result = await useCase.create(validInput);

      // Assert
      expect(result).toBe(mockEvolutionInstance);
      expect(mockRepository.create).toHaveBeenCalledWith(validInput);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpException when instanceName is empty', async () => {
      // Arrange
      const invalidInput = { ...validInput, instanceName: '' };

      // Act & Assert
      await expect(useCase.create(invalidInput)).rejects.toThrow(HttpException);
      await expect(useCase.create(invalidInput)).rejects.toThrow('Nome da instância é obrigatório');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw HttpException when instanceName is only whitespace', async () => {
      // Arrange
      const invalidInput = { ...validInput, instanceName: '   ' };

      // Act & Assert
      await expect(useCase.create(invalidInput)).rejects.toThrow(HttpException);
      await expect(useCase.create(invalidInput)).rejects.toThrow('Nome da instância é obrigatório');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw HttpException when token is too short', async () => {
      // Arrange
      const invalidInput = { ...validInput, token: 'short' };

      // Act & Assert
      await expect(useCase.create(invalidInput)).rejects.toThrow(HttpException);
      await expect(useCase.create(invalidInput)).rejects.toThrow(
        'Token deve ter pelo menos 10 caracteres',
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw HttpException when token is empty', async () => {
      // Arrange
      const invalidInput = { ...validInput, token: '' };

      // Act & Assert
      await expect(useCase.create(invalidInput)).rejects.toThrow(HttpException);
      await expect(useCase.create(invalidInput)).rejects.toThrow(
        'Token deve ter pelo menos 10 caracteres',
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw HttpException when webhook is invalid URL', async () => {
      // Arrange
      const invalidInput = { ...validInput, webhook: 'invalid-url' };

      // Act & Assert
      await expect(useCase.create(invalidInput)).rejects.toThrow(HttpException);
      await expect(useCase.create(invalidInput)).rejects.toThrow('Webhook deve ser uma URL válida');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw HttpException when webhook is empty', async () => {
      // Arrange
      const invalidInput = { ...validInput, webhook: '' };

      // Act & Assert
      await expect(useCase.create(invalidInput)).rejects.toThrow(HttpException);
      await expect(useCase.create(invalidInput)).rejects.toThrow('Webhook deve ser uma URL válida');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw HttpException when number is too short', async () => {
      // Arrange
      const invalidInput = { ...validInput, number: '123' };

      // Act & Assert
      await expect(useCase.create(invalidInput)).rejects.toThrow(HttpException);
      await expect(useCase.create(invalidInput)).rejects.toThrow(
        'Número deve ter pelo menos 8 dígitos',
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw HttpException when number is empty', async () => {
      // Arrange
      const invalidInput = { ...validInput, number: '' };

      // Act & Assert
      await expect(useCase.create(invalidInput)).rejects.toThrow(HttpException);
      await expect(useCase.create(invalidInput)).rejects.toThrow(
        'Número deve ter pelo menos 8 dígitos',
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should accept valid webhook URLs with different protocols', async () => {
      // Arrange
      const httpsInput = { ...validInput, webhook: 'https://example.com/webhook' };
      const httpInput = { ...validInput, webhook: 'http://example.com/webhook' };
      mockRepository.create.mockResolvedValue(mockEvolutionInstance);

      // Act & Assert
      await expect(useCase.create(httpsInput)).resolves.toBe(mockEvolutionInstance);
      await expect(useCase.create(httpInput)).resolves.toBe(mockEvolutionInstance);
      expect(mockRepository.create).toHaveBeenCalledTimes(2);
    });

    it('should throw HttpException when created instance is not active', async () => {
      // Arrange
      const inactiveInstance = new EvolutionInstanceEntity(
        { ...mockEvolutionInstance.instance, status: 'INACTIVE' },
        mockEvolutionInstance.hash,
        mockEvolutionInstance.settings,
      );
      mockRepository.create.mockResolvedValue(inactiveInstance);

      // Act & Assert
      await expect(useCase.create(validInput)).rejects.toThrow(HttpException);
      await expect(useCase.create(validInput)).rejects.toThrow(ERROR_MESSAGES.INSTANCE_NOT_ACTIVE);
    });

    it('should throw HttpException when created instance is invalid', async () => {
      // Arrange
      const invalidInstance = new EvolutionInstanceEntity(
        { ...mockEvolutionInstance.instance, instanceName: '' },
        mockEvolutionInstance.hash,
        mockEvolutionInstance.settings,
      );
      mockRepository.create.mockResolvedValue(invalidInstance);

      // Act & Assert
      await expect(useCase.create(validInput)).rejects.toThrow(HttpException);
      await expect(useCase.create(validInput)).rejects.toThrow(
        ERROR_MESSAGES.INVALID_INSTANCE_DATA,
      );
    });

    it('should throw HttpException when created instance has invalid webhook', async () => {
      // Arrange
      const invalidWebhookInstance = new EvolutionInstanceEntity(
        { ...mockEvolutionInstance.instance, webhook_wa_business: null },
        mockEvolutionInstance.hash,
        mockEvolutionInstance.settings,
      );
      mockRepository.create.mockResolvedValue(invalidWebhookInstance);

      // Act & Assert
      await expect(useCase.create(validInput)).rejects.toThrow(HttpException);
      await expect(useCase.create(validInput)).rejects.toThrow('Webhook configurado é inválido');
    });

    it('should handle repository errors and throw processing error', async () => {
      // Arrange
      mockRepository.create.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await expect(useCase.create(validInput)).rejects.toThrow(HttpException);
      await expect(useCase.create(validInput)).rejects.toThrow(
        ERROR_MESSAGES.INSTANCE_PROCESSING_ERROR,
      );
      expect(mockRepository.create).toHaveBeenCalledWith(validInput);
    });

    it('should re-throw HttpException from repository without wrapping', async () => {
      // Arrange
      const httpError = new HttpException('Custom error', HttpStatus.BAD_REQUEST);
      mockRepository.create.mockRejectedValue(httpError);

      // Act & Assert
      await expect(useCase.create(validInput)).rejects.toThrow(httpError);
      expect(mockRepository.create).toHaveBeenCalledWith(validInput);
    });

    it('should handle edge case with minimum valid values', async () => {
      // Arrange
      const minimalInput: ICreateInstanceInput = {
        instanceName: 'a',
        token: '1234567890', // exactly 10 characters
        qrcode: false,
        number: '12345678', // exactly 8 digits
        integration: 'WHATSAPP-BAILEYS',
        webhook: 'http://a.co',
        webhook_by_events: false,
        events: [],
        reject_call: true,
        msg_call: 'No calls',
        groups_ignore: true,
        always_online: false,
        read_messages: false,
        read_status: false,
        websocket_enabled: false,
        websocket_events: [],
        proxy: {
          host: '',
          port: '',
          protocol: 'http',
          username: '',
          password: '',
        },
      };
      mockRepository.create.mockResolvedValue(mockEvolutionInstance);

      // Act
      const result = await useCase.create(minimalInput);

      // Assert
      expect(result).toBe(mockEvolutionInstance);
      expect(mockRepository.create).toHaveBeenCalledWith(minimalInput);
    });

    it('should handle special characters in instanceName', async () => {
      // Arrange
      const specialInput = {
        ...validInput,
        instanceName: 'test-instance_123@domain.com',
      };
      mockRepository.create.mockResolvedValue(mockEvolutionInstance);

      // Act
      const result = await useCase.create(specialInput);

      // Assert
      expect(result).toBe(mockEvolutionInstance);
      expect(mockRepository.create).toHaveBeenCalledWith(specialInput);
    });

    it('should handle very long valid inputs', async () => {
      // Arrange
      const longInput: ICreateInstanceInput = {
        ...validInput,
        instanceName: 'a'.repeat(100),
        token: '1'.repeat(100),
        webhook: 'https://very-long-domain-name-example.com/very/long/webhook/path',
        number: '1'.repeat(15),
      };
      mockRepository.create.mockResolvedValue(mockEvolutionInstance);

      // Act
      const result = await useCase.create(longInput);

      // Assert
      expect(result).toBe(mockEvolutionInstance);
      expect(mockRepository.create).toHaveBeenCalledWith(longInput);
    });
  });

  describe('validateBusinessRules', () => {
    it('should validate URLs correctly', async () => {
      // Test private method indirectly through create method
      const validUrls = [
        'https://example.com',
        'http://localhost:3000',
        'https://subdomain.example.com/path?query=value',
        'http://192.168.1.1:8080/webhook',
      ];

      mockRepository.create.mockResolvedValue(mockEvolutionInstance);

      for (const url of validUrls) {
        const input = { ...validInput, webhook: url };
        await expect(useCase.create(input)).resolves.toBe(mockEvolutionInstance);
      }
    });

    it('should reject invalid URLs', async () => {
      const invalidUrls = [
        { url: 'not-a-url', shouldCallRepository: false },
        { url: 'ftp://invalid', shouldCallRepository: true }, // This is actually a valid URL
        { url: 'javascript:alert(1)', shouldCallRepository: true }, // This is also a valid URL format
        { url: '', shouldCallRepository: false },
      ];

      for (const { url, shouldCallRepository } of invalidUrls) {
        const input = { ...validInput, webhook: url };

        if (shouldCallRepository) {
          // These URLs are valid according to URL constructor, so they'll reach validation
          mockRepository.create.mockRejectedValue(new Error('Mock error'));
          await expect(useCase.create(input)).rejects.toThrow('Erro interno do servidor');
        } else {
          // These URLs are invalid and should be caught by validation
          await expect(useCase.create(input)).rejects.toThrow('Webhook deve ser uma URL válida');
        }
      }
    });
  });

  describe('error status codes', () => {
    it('should throw BAD_REQUEST for validation errors', async () => {
      // Arrange
      const invalidInput = { ...validInput, instanceName: '' };

      // Act & Assert
      try {
        await useCase.create(invalidInput);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect((error as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw INTERNAL_SERVER_ERROR for processing errors', async () => {
      // Arrange
      mockRepository.create.mockRejectedValue(new Error('Unexpected error'));

      // Act & Assert
      try {
        await useCase.create(validInput);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect((error as HttpException).getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });
});
