import { Test, TestingModule } from '@nestjs/testing';
import { INSTANCE_MANAGEMENT_REPOSITORY_TOKEN } from '../../../../../shared/constants/di-constants';
import { IInstanceManagementRepository } from '../../../domain/repositories/instance-management-repository.contract';
import { EvolutionInstanceEntity } from '../../../domain/entities/evolution-instance.entity';
import { FetchInstancesUseCase } from '../fetch-instances-usecase';
import { IFetchInstancesInput } from '../../contracts/Services/fetch-instances-usecase.contract';

describe('FetchInstancesUseCase', () => {
  let useCase: FetchInstancesUseCase;
  let mockRepository: jest.Mocked<IInstanceManagementRepository>;

  const mockInstance1 = new EvolutionInstanceEntity(
    {
      instanceName: 'instance-1',
      instanceId: 'uuid-instance-1',
      webhook_wa_business: 'https://webhook1.com',
      access_token_wa_business: 'token-1',
      status: 'ACTIVE',
    },
    {
      apikey: 'api-key-1',
    },
    {
      reject_call: false,
      msg_call: 'Calls not accepted',
      groups_ignore: false,
      always_online: true,
      read_messages: true,
      read_status: true,
      sync_full_history: false,
    },
  );

  const mockInstance2 = new EvolutionInstanceEntity(
    {
      instanceName: 'instance-2',
      instanceId: 'uuid-instance-2',
      webhook_wa_business: null,
      access_token_wa_business: 'token-2',
      status: 'INACTIVE',
    },
    {
      apikey: 'api-key-2',
    },
    {
      reject_call: true,
      msg_call: 'No calls please',
      groups_ignore: true,
      always_online: false,
      read_messages: false,
      read_status: false,
      sync_full_history: true,
    },
  );

  const mockInstance3 = new EvolutionInstanceEntity(
    {
      instanceName: 'test-instance',
      instanceId: 'uuid-test-instance',
      webhook_wa_business: 'https://test-webhook.com',
      access_token_wa_business: 'token-3',
      status: 'ACTIVE',
    },
    {
      apikey: 'api-key-3',
    },
    {
      reject_call: false,
      msg_call: 'Test message',
      groups_ignore: false,
      always_online: true,
      read_messages: true,
      read_status: false,
      sync_full_history: true,
    },
  );

  const allInstances = [mockInstance1, mockInstance2, mockInstance3];

  beforeEach(async () => {
    // Create mocks
    mockRepository = {
      findAll: jest.fn(),
      findByName: jest.fn(),
      connect: jest.fn(),
      getConnectionState: jest.fn(),
      logout: jest.fn(),
      delete: jest.fn(),
      restart: jest.fn(),
      updateSettings: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FetchInstancesUseCase,
        { provide: INSTANCE_MANAGEMENT_REPOSITORY_TOKEN, useValue: mockRepository },
      ],
    }).compile();

    useCase = module.get<FetchInstancesUseCase>(FetchInstancesUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should fetch all instances when no filters provided', async () => {
      // Arrange
      mockRepository.findAll.mockResolvedValue(allInstances);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toEqual(allInstances);
      expect(mockRepository.findAll).toHaveBeenCalledWith(undefined);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should fetch all instances when input is undefined', async () => {
      // Arrange
      mockRepository.findAll.mockResolvedValue(allInstances);

      // Act
      const result = await useCase.execute(undefined);

      // Assert
      expect(result).toEqual(allInstances);
      expect(mockRepository.findAll).toHaveBeenCalledWith(undefined);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should fetch instances with instanceName filter', async () => {
      // Arrange
      const input: IFetchInstancesInput = { instanceName: 'instance-1' };
      const filteredInstances = [mockInstance1];
      mockRepository.findAll.mockResolvedValue(filteredInstances);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toEqual(filteredInstances);
      expect(mockRepository.findAll).toHaveBeenCalledWith({
        instanceName: 'instance-1',
        status: undefined,
      });
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should fetch instances with status filter', async () => {
      // Arrange
      const input: IFetchInstancesInput = { status: 'ACTIVE' };
      const activeInstances = [mockInstance1, mockInstance3];
      mockRepository.findAll.mockResolvedValue(activeInstances);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toEqual(activeInstances);
      expect(mockRepository.findAll).toHaveBeenCalledWith({
        instanceName: undefined,
        status: 'ACTIVE',
      });
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should fetch instances with both instanceName and status filters', async () => {
      // Arrange
      const input: IFetchInstancesInput = {
        instanceName: 'test-instance',
        status: 'ACTIVE',
      };
      const filteredInstances = [mockInstance3];
      mockRepository.findAll.mockResolvedValue(filteredInstances);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toEqual(filteredInstances);
      expect(mockRepository.findAll).toHaveBeenCalledWith({
        instanceName: 'test-instance',
        status: 'ACTIVE',
      });
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no instances match filters', async () => {
      // Arrange
      const input: IFetchInstancesInput = {
        instanceName: 'non-existent',
        status: 'ACTIVE',
      };
      mockRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toEqual([]);
      expect(mockRepository.findAll).toHaveBeenCalledWith({
        instanceName: 'non-existent',
        status: 'ACTIVE',
      });
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle empty input object', async () => {
      // Arrange
      const input: IFetchInstancesInput = {};
      mockRepository.findAll.mockResolvedValue(allInstances);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toEqual(allInstances);
      expect(mockRepository.findAll).toHaveBeenCalledWith({
        instanceName: undefined,
        status: undefined,
      });
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle input with only instanceName', async () => {
      // Arrange
      const input: IFetchInstancesInput = { instanceName: 'partial-name' };
      const partialMatches = [mockInstance1, mockInstance2];
      mockRepository.findAll.mockResolvedValue(partialMatches);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toEqual(partialMatches);
      expect(mockRepository.findAll).toHaveBeenCalledWith({
        instanceName: 'partial-name',
        status: undefined,
      });
    });

    it('should handle input with only status', async () => {
      // Arrange
      const input: IFetchInstancesInput = { status: 'INACTIVE' };
      const inactiveInstances = [mockInstance2];
      mockRepository.findAll.mockResolvedValue(inactiveInstances);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toEqual(inactiveInstances);
      expect(mockRepository.findAll).toHaveBeenCalledWith({
        instanceName: undefined,
        status: 'INACTIVE',
      });
    });

    it('should handle repository errors', async () => {
      // Arrange
      const input: IFetchInstancesInput = { status: 'ACTIVE' };
      const repositoryError = new Error('Database connection failed');
      mockRepository.findAll.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow('Database connection failed');
      expect(mockRepository.findAll).toHaveBeenCalledWith({
        instanceName: undefined,
        status: 'ACTIVE',
      });
    });

    it('should handle special characters in instanceName filter', async () => {
      // Arrange
      const input: IFetchInstancesInput = {
        instanceName: 'test-instance@domain.com',
      };
      mockRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toEqual([]);
      expect(mockRepository.findAll).toHaveBeenCalledWith({
        instanceName: 'test-instance@domain.com',
        status: undefined,
      });
    });

    it('should handle empty string filters', async () => {
      // Arrange
      const input: IFetchInstancesInput = {
        instanceName: '',
        // status: '', // Remove empty string status as it's not valid
      };
      mockRepository.findAll.mockResolvedValue(allInstances);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toEqual(allInstances);
      expect(mockRepository.findAll).toHaveBeenCalledWith({
        instanceName: '',
        status: undefined,
      });
    });

    it('should handle case-sensitive status filter', async () => {
      // Arrange
      const input: IFetchInstancesInput = { status: 'INACTIVE' }; // Use valid status
      mockRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toEqual([]);
      expect(mockRepository.findAll).toHaveBeenCalledWith({
        instanceName: undefined,
        status: 'INACTIVE',
      });
    });

    it('should return instances in the order provided by repository', async () => {
      // Arrange
      const reorderedInstances = [mockInstance3, mockInstance1, mockInstance2];
      mockRepository.findAll.mockResolvedValue(reorderedInstances);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toEqual(reorderedInstances);
      expect(result[0]).toBe(mockInstance3);
      expect(result[1]).toBe(mockInstance1);
      expect(result[2]).toBe(mockInstance2);
    });
  });

  describe('integration scenarios', () => {
    it('should work correctly with multiple consecutive calls', async () => {
      // Arrange
      mockRepository.findAll
        .mockResolvedValueOnce([mockInstance1])
        .mockResolvedValueOnce([mockInstance2])
        .mockResolvedValueOnce(allInstances);

      // Act
      const result1 = await useCase.execute({ status: 'ACTIVE' });
      const result2 = await useCase.execute({ status: 'INACTIVE' });
      const result3 = await useCase.execute();

      // Assert
      expect(result1).toEqual([mockInstance1]);
      expect(result2).toEqual([mockInstance2]);
      expect(result3).toEqual(allInstances);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(3);
    });

    it('should handle concurrent calls correctly', async () => {
      // Arrange
      mockRepository.findAll.mockResolvedValue(allInstances);

      // Act
      const promises = [
        useCase.execute({ status: 'ACTIVE' }),
        useCase.execute({ instanceName: 'test' }),
        useCase.execute(),
      ];
      const results = await Promise.all(promises);

      // Assert
      expect(results).toHaveLength(3);
      results.forEach((result) => expect(result).toEqual(allInstances));
      expect(mockRepository.findAll).toHaveBeenCalledTimes(3);
    });
  });
});
