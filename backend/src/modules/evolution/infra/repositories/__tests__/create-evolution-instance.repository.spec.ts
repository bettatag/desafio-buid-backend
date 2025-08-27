import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PRISMA_CLIENT_TOKEN } from '../../../../../shared/constants/di-constants';
import { ERROR_MESSAGES } from '../../../../../shared/errors/error-messages';
import { CreateEvolutionInstanceRepository } from '../create-evolution-instance.repository';
import { ICreateInstanceInput } from '../../../domain/contracts/input/create-instance-input.contract';
import { EvolutionInstanceEntity } from '../../../domain/entities/evolution-instance.entity';

describe('CreateEvolutionInstanceRepository', () => {
  let repository: CreateEvolutionInstanceRepository;
  let mockPrismaClient: any;

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

  const mockPrismaResponse = {
    id: 'uuid-evolution-instance',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    instance: {
      id: 'uuid-instance',
      instanceName: 'test-instance',
      instanceId: '5511999887766',
      webhookWaBusiness: 'https://example.com/webhook',
      accessTokenWaBusiness: 'valid-token-123456789',
      status: 'ACTIVE',
    },
    hash: {
      id: 'uuid-hash',
      apikey: 'valid-token-123456789',
    },
    settings: {
      id: 'uuid-settings',
      rejectCall: false,
      msgCall: 'Calls not accepted',
      groupsIgnore: false,
      alwaysOnline: true,
      readMessages: true,
      readStatus: true,
      syncFullHistory: true,
    },
  };

  beforeEach(async () => {
    // Create mocks
    mockPrismaClient = {
      evolutionInstance: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateEvolutionInstanceRepository,
        { provide: PRISMA_CLIENT_TOKEN, useValue: mockPrismaClient },
      ],
    }).compile();

    repository = module.get<CreateEvolutionInstanceRepository>(CreateEvolutionInstanceRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create evolution instance successfully', async () => {
      // Arrange
      mockPrismaClient.evolutionInstance.create.mockResolvedValue(mockPrismaResponse);

      // Act
      const result = await repository.create(validInput);

      // Assert
      expect(result).toBeInstanceOf(EvolutionInstanceEntity);
      expect(result.instance.instanceName).toBe('test-instance');
      expect(result.instance.instanceId).toBe('5511999887766');
      expect(result.instance.webhook_wa_business).toBe('https://example.com/webhook');
      expect(result.instance.access_token_wa_business).toBe('valid-token-123456789');
      expect(result.instance.status).toBe('ACTIVE');
      expect(result.hash.apikey).toBe('valid-token-123456789');
      expect(result.settings.reject_call).toBe(false);
      expect(result.settings.msg_call).toBe('Calls not accepted');
      expect(result.settings.sync_full_history).toBe(true);

      expect(mockPrismaClient.evolutionInstance.create).toHaveBeenCalledWith({
        data: {
          instance: {
            create: {
              instanceName: 'test-instance',
              instanceId: '5511999887766',
              webhookWaBusiness: 'https://example.com/webhook',
              accessTokenWaBusiness: 'valid-token-123456789',
              status: 'ACTIVE',
            },
          },
          hash: {
            create: {
              apikey: 'valid-token-123456789',
            },
          },
          settings: {
            create: {
              rejectCall: false,
              msgCall: 'Calls not accepted',
              groupsIgnore: false,
              alwaysOnline: true,
              readMessages: true,
              readStatus: true,
              syncFullHistory: true,
            },
          },
        },
        include: {
          instance: true,
          hash: true,
          settings: true,
        },
      });
    });

    it('should handle null webhook correctly', async () => {
      // Arrange
      const inputWithNullWebhook = { ...validInput, webhook: null as any };
      const responseWithNullWebhook = {
        ...mockPrismaResponse,
        instance: { ...mockPrismaResponse.instance, webhookWaBusiness: null },
      };
      mockPrismaClient.evolutionInstance.create.mockResolvedValue(responseWithNullWebhook);

      // Act
      const result = await repository.create(inputWithNullWebhook);

      // Assert
      expect(result.instance.webhook_wa_business).toBeNull();
      expect(mockPrismaClient.evolutionInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            instance: expect.objectContaining({
              create: expect.objectContaining({
                webhookWaBusiness: null,
              }),
            }),
          }),
        }),
      );
    });

    it('should throw HttpException when instance data is missing', async () => {
      // Arrange
      const incompleteResponse = {
        ...mockPrismaResponse,
        instance: null,
      };
      mockPrismaClient.evolutionInstance.create.mockResolvedValue(incompleteResponse);

      // Act & Assert
      await expect(repository.create(validInput)).rejects.toThrow(HttpException);
      await expect(repository.create(validInput)).rejects.toThrow(
        ERROR_MESSAGES.INVALID_INSTANCE_DATA,
      );
    });

    it('should throw HttpException when hash data is missing', async () => {
      // Arrange
      const incompleteResponse = {
        ...mockPrismaResponse,
        hash: null,
      };
      mockPrismaClient.evolutionInstance.create.mockResolvedValue(incompleteResponse);

      // Act & Assert
      await expect(repository.create(validInput)).rejects.toThrow(HttpException);
      await expect(repository.create(validInput)).rejects.toThrow(
        ERROR_MESSAGES.INVALID_INSTANCE_DATA,
      );
    });

    it('should throw HttpException when settings data is missing', async () => {
      // Arrange
      const incompleteResponse = {
        ...mockPrismaResponse,
        settings: null,
      };
      mockPrismaClient.evolutionInstance.create.mockResolvedValue(incompleteResponse);

      // Act & Assert
      await expect(repository.create(validInput)).rejects.toThrow(HttpException);
      await expect(repository.create(validInput)).rejects.toThrow(
        ERROR_MESSAGES.INVALID_INSTANCE_DATA,
      );
    });

    it('should handle database constraint errors', async () => {
      // Arrange
      const constraintError = new Error('Unique constraint violation');
      constraintError.name = 'PrismaClientKnownRequestError';
      mockPrismaClient.evolutionInstance.create.mockRejectedValue(constraintError);

      // Act & Assert
      await expect(repository.create(validInput)).rejects.toThrow(HttpException);
      await expect(repository.create(validInput)).rejects.toThrow(
        ERROR_MESSAGES.DATABASE_SAVE_ERROR,
      );
    });

    it('should handle general database errors', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      mockPrismaClient.evolutionInstance.create.mockRejectedValue(dbError);

      // Act & Assert
      await expect(repository.create(validInput)).rejects.toThrow(HttpException);
      await expect(repository.create(validInput)).rejects.toThrow(
        ERROR_MESSAGES.DATABASE_SAVE_ERROR,
      );
    });

    it('should re-throw HttpException without wrapping', async () => {
      // Arrange
      const httpError = new HttpException('Custom HTTP error', HttpStatus.CONFLICT);
      mockPrismaClient.evolutionInstance.create.mockRejectedValue(httpError);

      // Act & Assert
      await expect(repository.create(validInput)).rejects.toThrow(httpError);
      expect(mockPrismaClient.evolutionInstance.create).toHaveBeenCalledTimes(1);
    });

    it('should use correct Prisma transaction structure', async () => {
      // Arrange
      mockPrismaClient.evolutionInstance.create.mockResolvedValue(mockPrismaResponse);

      // Act
      await repository.create(validInput);

      // Assert
      expect(mockPrismaClient.evolutionInstance.create).toHaveBeenCalledWith({
        data: {
          instance: { create: expect.any(Object) },
          hash: { create: expect.any(Object) },
          settings: { create: expect.any(Object) },
        },
        include: {
          instance: true,
          hash: true,
          settings: true,
        },
      });
    });

    it('should create entity with correct status', async () => {
      // Arrange
      mockPrismaClient.evolutionInstance.create.mockResolvedValue(mockPrismaResponse);

      // Act
      const result = await repository.create(validInput);

      // Assert
      expect(result.instance.status).toBe('ACTIVE');
      expect(mockPrismaClient.evolutionInstance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            instance: expect.objectContaining({
              create: expect.objectContaining({
                status: 'ACTIVE',
              }),
            }),
          }),
        }),
      );
    });
  });

  describe('error status codes', () => {
    it('should throw INTERNAL_SERVER_ERROR for invalid instance data', async () => {
      // Arrange
      const incompleteResponse = { ...mockPrismaResponse, instance: null };
      mockPrismaClient.evolutionInstance.create.mockResolvedValue(incompleteResponse);

      // Act & Assert
      try {
        await repository.create(validInput);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect((error as HttpException).getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });

    it('should throw INTERNAL_SERVER_ERROR for database errors', async () => {
      // Arrange
      mockPrismaClient.evolutionInstance.create.mockRejectedValue(
        new Error('Database connection failed'),
      );

      // Act & Assert
      try {
        await repository.create(validInput);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect((error as HttpException).getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('entity creation validation', () => {
    it('should create valid EvolutionInstanceEntity', async () => {
      // Arrange
      mockPrismaClient.evolutionInstance.create.mockResolvedValue(mockPrismaResponse);

      // Act
      const result = await repository.create(validInput);

      // Assert
      expect(result).toBeInstanceOf(EvolutionInstanceEntity);
      expect(result.isValid()).toBe(true);
      expect(result.isActive()).toBe(true);
      expect(result.hasValidWebhook()).toBe(true);
    });

    it('should handle entity creation with minimal data', async () => {
      // Arrange
      const minimalResponse = {
        ...mockPrismaResponse,
        instance: {
          ...mockPrismaResponse.instance,
          webhookWaBusiness: null,
        },
      };
      mockPrismaClient.evolutionInstance.create.mockResolvedValue(minimalResponse);

      // Act
      const result = await repository.create(validInput);

      // Assert
      expect(result).toBeInstanceOf(EvolutionInstanceEntity);
      expect(result.instance.webhook_wa_business).toBeNull();
      expect(result.hasValidWebhook()).toBe(false);
    });
  });
});
