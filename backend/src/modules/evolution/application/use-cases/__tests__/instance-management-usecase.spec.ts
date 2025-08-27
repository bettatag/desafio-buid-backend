import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { INSTANCE_MANAGEMENT_REPOSITORY_TOKEN } from '../../../../../shared/constants/di-constants';
import { IInstanceManagementRepository } from '../../../domain/repositories/instance-management-repository.contract';
import { EvolutionInstanceEntity } from '../../../domain/entities/evolution-instance.entity';
import { InstanceManagementUseCase } from '../instance-management-usecase';
import {
  IConnectInstanceInput,
  IConnectionStateInput,
  ILogoutInstanceInput,
  IDeleteInstanceInput,
  IRestartInstanceInput,
  IGetSettingsInput,
  IUpdateSettingsInput,
} from '../../contracts/services/instance-management-usecase.contract';

describe('InstanceManagementUseCase', () => {
  let useCase: InstanceManagementUseCase;
  let mockRepository: jest.Mocked<IInstanceManagementRepository>;

  const mockInstance = new EvolutionInstanceEntity(
    {
      instanceName: 'test-instance',
      instanceId: 'uuid-test-instance',
      webhook_wa_business: 'https://webhook.com',
      access_token_wa_business: 'token-123',
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
      sync_full_history: false,
    },
  );

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
        InstanceManagementUseCase,
        { provide: INSTANCE_MANAGEMENT_REPOSITORY_TOKEN, useValue: mockRepository },
      ],
    }).compile();

    useCase = module.get<InstanceManagementUseCase>(InstanceManagementUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('connect', () => {
    const connectInput: IConnectInstanceInput = { instanceName: 'test-instance' };

    it('should connect instance successfully', async () => {
      // Arrange
      const expectedResult = {
        status: 'connecting',
        qrcode: 'data:image/png;base64,mock-qrcode',
      };
      mockRepository.findByName.mockResolvedValue(mockInstance);
      mockRepository.connect.mockResolvedValue(expectedResult);

      // Act
      const result = await useCase.connect(connectInput);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockRepository.findByName).toHaveBeenCalledWith('test-instance');
      expect(mockRepository.connect).toHaveBeenCalledWith('test-instance');
      expect(mockRepository.findByName).toHaveBeenCalledTimes(1);
      expect(mockRepository.connect).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when instance not found', async () => {
      // Arrange
      mockRepository.findByName.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.connect(connectInput)).rejects.toThrow(NotFoundException);
      await expect(useCase.connect(connectInput)).rejects.toThrow(
        'Instance test-instance not found',
      );
      expect(mockRepository.findByName).toHaveBeenCalledWith('test-instance');
      expect(mockRepository.connect).not.toHaveBeenCalled();
    });

    it('should handle repository connect errors', async () => {
      // Arrange
      mockRepository.findByName.mockResolvedValue(mockInstance);
      mockRepository.connect.mockRejectedValue(new Error('Connection failed'));

      // Act & Assert
      await expect(useCase.connect(connectInput)).rejects.toThrow('Connection failed');
      expect(mockRepository.findByName).toHaveBeenCalledWith('test-instance');
      expect(mockRepository.connect).toHaveBeenCalledWith('test-instance');
    });

    it('should handle connect without qrcode', async () => {
      // Arrange
      const resultWithoutQr = { status: 'already_connected' };
      mockRepository.findByName.mockResolvedValue(mockInstance);
      mockRepository.connect.mockResolvedValue(resultWithoutQr);

      // Act
      const result = await useCase.connect(connectInput);

      // Assert
      expect(result).toEqual(resultWithoutQr);
      expect(result.qrcode).toBeUndefined();
    });
  });

  describe('getConnectionState', () => {
    const stateInput: IConnectionStateInput = { instanceName: 'test-instance' };

    it('should get connection state successfully', async () => {
      // Arrange
      const expectedState = { state: 'open' };
      mockRepository.findByName.mockResolvedValue(mockInstance);
      mockRepository.getConnectionState.mockResolvedValue(expectedState);

      // Act
      const result = await useCase.getConnectionState(stateInput);

      // Assert
      expect(result).toEqual(expectedState);
      expect(mockRepository.findByName).toHaveBeenCalledWith('test-instance');
      expect(mockRepository.getConnectionState).toHaveBeenCalledWith('test-instance');
    });

    it('should throw NotFoundException when instance not found', async () => {
      // Arrange
      mockRepository.findByName.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.getConnectionState(stateInput)).rejects.toThrow(NotFoundException);
      await expect(useCase.getConnectionState(stateInput)).rejects.toThrow(
        'Instance test-instance not found',
      );
      expect(mockRepository.getConnectionState).not.toHaveBeenCalled();
    });

    it('should handle different connection states', async () => {
      // Arrange
      const states = ['open', 'close', 'connecting', 'qr'];
      mockRepository.findByName.mockResolvedValue(mockInstance);

      for (const state of states) {
        mockRepository.getConnectionState.mockResolvedValue({ state });

        // Act
        const result = await useCase.getConnectionState(stateInput);

        // Assert
        expect(result).toEqual({ state });
      }
    });
  });

  describe('logout', () => {
    const logoutInput: ILogoutInstanceInput = { instanceName: 'test-instance' };

    it('should logout instance successfully', async () => {
      // Arrange
      const expectedResult = { message: 'Instance test-instance logged out successfully' };
      mockRepository.findByName.mockResolvedValue(mockInstance);
      mockRepository.logout.mockResolvedValue(expectedResult);

      // Act
      const result = await useCase.logout(logoutInput);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockRepository.findByName).toHaveBeenCalledWith('test-instance');
      expect(mockRepository.logout).toHaveBeenCalledWith('test-instance');
    });

    it('should throw NotFoundException when instance not found', async () => {
      // Arrange
      mockRepository.findByName.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.logout(logoutInput)).rejects.toThrow(NotFoundException);
      await expect(useCase.logout(logoutInput)).rejects.toThrow('Instance test-instance not found');
      expect(mockRepository.logout).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    const deleteInput: IDeleteInstanceInput = { instanceName: 'test-instance' };

    it('should delete instance successfully', async () => {
      // Arrange
      const expectedResult = { message: 'Instance test-instance deleted successfully' };
      mockRepository.findByName.mockResolvedValue(mockInstance);
      mockRepository.delete.mockResolvedValue(expectedResult);

      // Act
      const result = await useCase.delete(deleteInput);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockRepository.findByName).toHaveBeenCalledWith('test-instance');
      expect(mockRepository.delete).toHaveBeenCalledWith('test-instance');
    });

    it('should throw NotFoundException when instance not found', async () => {
      // Arrange
      mockRepository.findByName.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.delete(deleteInput)).rejects.toThrow(NotFoundException);
      await expect(useCase.delete(deleteInput)).rejects.toThrow('Instance test-instance not found');
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('restart', () => {
    const restartInput: IRestartInstanceInput = { instanceName: 'test-instance' };

    it('should restart instance successfully', async () => {
      // Arrange
      const expectedResult = { message: 'Instance test-instance restarted successfully' };
      mockRepository.findByName.mockResolvedValue(mockInstance);
      mockRepository.restart.mockResolvedValue(expectedResult);

      // Act
      const result = await useCase.restart(restartInput);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockRepository.findByName).toHaveBeenCalledWith('test-instance');
      expect(mockRepository.restart).toHaveBeenCalledWith('test-instance');
    });

    it('should throw NotFoundException when instance not found', async () => {
      // Arrange
      mockRepository.findByName.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.restart(restartInput)).rejects.toThrow(NotFoundException);
      await expect(useCase.restart(restartInput)).rejects.toThrow(
        'Instance test-instance not found',
      );
      expect(mockRepository.restart).not.toHaveBeenCalled();
    });
  });

  describe('getSettings', () => {
    const getSettingsInput: IGetSettingsInput = { instanceName: 'test-instance' };

    it('should get settings successfully', async () => {
      // Arrange
      mockRepository.findByName.mockResolvedValue(mockInstance);

      // Act
      const result = await useCase.getSettings(getSettingsInput);

      // Assert
      expect(result).toBe(mockInstance);
      expect(mockRepository.findByName).toHaveBeenCalledWith('test-instance');
      expect(mockRepository.findByName).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when instance not found', async () => {
      // Arrange
      mockRepository.findByName.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.getSettings(getSettingsInput)).rejects.toThrow(NotFoundException);
      await expect(useCase.getSettings(getSettingsInput)).rejects.toThrow(
        'Instance test-instance not found',
      );
    });
  });

  describe('updateSettings', () => {
    const updateSettingsInput: IUpdateSettingsInput = {
      instanceName: 'test-instance',
      settings: {
        reject_call: true,
        msg_call: 'Updated message',
        always_online: false,
      },
    };

    it('should update settings successfully', async () => {
      // Arrange
      const updatedInstance = new EvolutionInstanceEntity(
        mockInstance.instance,
        mockInstance.hash,
        {
          ...mockInstance.settings,
          reject_call: true,
          msg_call: 'Updated message',
          always_online: false,
        },
      );
      mockRepository.findByName.mockResolvedValue(mockInstance);
      mockRepository.updateSettings.mockResolvedValue(updatedInstance);

      // Act
      const result = await useCase.updateSettings(updateSettingsInput);

      // Assert
      expect(result).toBe(updatedInstance);
      expect(mockRepository.findByName).toHaveBeenCalledWith('test-instance');
      expect(mockRepository.updateSettings).toHaveBeenCalledWith('test-instance', {
        reject_call: true,
        msg_call: 'Updated message',
        always_online: false,
      });
    });

    it('should throw NotFoundException when instance not found', async () => {
      // Arrange
      mockRepository.findByName.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.updateSettings(updateSettingsInput)).rejects.toThrow(NotFoundException);
      await expect(useCase.updateSettings(updateSettingsInput)).rejects.toThrow(
        'Instance test-instance not found',
      );
      expect(mockRepository.updateSettings).not.toHaveBeenCalled();
    });

    it('should handle partial settings update', async () => {
      // Arrange
      const partialUpdate: IUpdateSettingsInput = {
        instanceName: 'test-instance',
        settings: { reject_call: true },
      };
      const partiallyUpdatedInstance = new EvolutionInstanceEntity(
        mockInstance.instance,
        mockInstance.hash,
        { ...mockInstance.settings, reject_call: true },
      );
      mockRepository.findByName.mockResolvedValue(mockInstance);
      mockRepository.updateSettings.mockResolvedValue(partiallyUpdatedInstance);

      // Act
      const result = await useCase.updateSettings(partialUpdate);

      // Assert
      expect(result).toBe(partiallyUpdatedInstance);
      expect(mockRepository.updateSettings).toHaveBeenCalledWith('test-instance', {
        reject_call: true,
      });
    });

    it('should handle empty settings update', async () => {
      // Arrange
      const emptyUpdate: IUpdateSettingsInput = {
        instanceName: 'test-instance',
        settings: {},
      };
      mockRepository.findByName.mockResolvedValue(mockInstance);
      mockRepository.updateSettings.mockResolvedValue(mockInstance);

      // Act
      const result = await useCase.updateSettings(emptyUpdate);

      // Assert
      expect(result).toBe(mockInstance);
      expect(mockRepository.updateSettings).toHaveBeenCalledWith('test-instance', {});
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle special characters in instance names', async () => {
      // Arrange
      const specialNameInput = { instanceName: 'test-instance@domain.com' };
      mockRepository.findByName.mockResolvedValue(mockInstance);
      mockRepository.connect.mockResolvedValue({ status: 'connecting' });

      // Act
      const result = await useCase.connect(specialNameInput);

      // Assert
      expect(result.status).toBe('connecting');
      expect(mockRepository.findByName).toHaveBeenCalledWith('test-instance@domain.com');
    });

    it('should handle very long instance names', async () => {
      // Arrange
      const longName = 'a'.repeat(100);
      const longNameInput = { instanceName: longName };
      mockRepository.findByName.mockResolvedValue(mockInstance);
      mockRepository.getConnectionState.mockResolvedValue({ state: 'open' });

      // Act
      const result = await useCase.getConnectionState(longNameInput);

      // Assert
      expect(result.state).toBe('open');
      expect(mockRepository.findByName).toHaveBeenCalledWith(longName);
    });

    it('should handle repository errors in findByName', async () => {
      // Arrange
      const connectInput: IConnectInstanceInput = { instanceName: 'test-instance' };
      mockRepository.findByName.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(useCase.connect(connectInput)).rejects.toThrow('Database error');
      expect(mockRepository.connect).not.toHaveBeenCalled();
    });

    it('should handle concurrent operations on same instance', async () => {
      // Arrange
      const input = { instanceName: 'test-instance' };
      mockRepository.findByName.mockResolvedValue(mockInstance);
      mockRepository.connect.mockResolvedValue({ status: 'connecting' });
      mockRepository.getConnectionState.mockResolvedValue({ state: 'open' });
      mockRepository.logout.mockResolvedValue({ message: 'logged out' });

      // Act
      const promises = [
        useCase.connect(input),
        useCase.getConnectionState(input),
        useCase.logout(input),
      ];
      const results = await Promise.all(promises);

      // Assert
      expect(results).toHaveLength(3);
      expect(results[0]).toEqual({ status: 'connecting' });
      expect(results[1]).toEqual({ state: 'open' });
      expect(results[2]).toEqual({ message: 'logged out' });
      expect(mockRepository.findByName).toHaveBeenCalledTimes(3);
    });
  });

  describe('method call verification', () => {
    it('should call repository methods in correct order for connect', async () => {
      // Arrange
      const input: IConnectInstanceInput = { instanceName: 'test-instance' };
      mockRepository.findByName.mockResolvedValue(mockInstance);
      mockRepository.connect.mockResolvedValue({ status: 'connecting' });

      // Act
      await useCase.connect(input);

      // Assert - verify both methods were called
      expect(mockRepository.findByName).toHaveBeenCalledWith('test-instance');
      expect(mockRepository.connect).toHaveBeenCalledWith('test-instance');
      expect(mockRepository.findByName).toHaveBeenCalledTimes(1);
      expect(mockRepository.connect).toHaveBeenCalledTimes(1);
    });

    it('should not call action methods when instance not found', async () => {
      // Arrange
      const input = { instanceName: 'non-existent' };
      mockRepository.findByName.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.connect(input)).rejects.toThrow(NotFoundException);
      await expect(useCase.getConnectionState(input)).rejects.toThrow(NotFoundException);
      await expect(useCase.logout(input)).rejects.toThrow(NotFoundException);
      await expect(useCase.delete(input)).rejects.toThrow(NotFoundException);
      await expect(useCase.restart(input)).rejects.toThrow(NotFoundException);
      await expect(useCase.getSettings(input)).rejects.toThrow(NotFoundException);

      // Verify no action methods were called
      expect(mockRepository.connect).not.toHaveBeenCalled();
      expect(mockRepository.getConnectionState).not.toHaveBeenCalled();
      expect(mockRepository.logout).not.toHaveBeenCalled();
      expect(mockRepository.delete).not.toHaveBeenCalled();
      expect(mockRepository.restart).not.toHaveBeenCalled();
      expect(mockRepository.updateSettings).not.toHaveBeenCalled();
    });
  });
});
