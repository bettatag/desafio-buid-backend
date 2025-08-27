import { Test, TestingModule } from '@nestjs/testing';
import { DB_SERVICE_TOKEN } from '../../../../../shared/constants/di-constants';
import { IDbService } from '../../../../../shared/db/interfaces/db-service.interface';
import { InstanceManagementRepository } from '../instance-management.repository';
import { EvolutionInstanceEntity } from '../../../domain/entities/evolution-instance.entity';

describe('InstanceManagementRepository', () => {
  let repository: InstanceManagementRepository;
  let mockDbService: jest.Mocked<IDbService>;

  beforeEach(async () => {
    // Create mocks
    mockDbService = {
      evolutionInstance: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      user: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstanceManagementRepository,
        { provide: DB_SERVICE_TOKEN, useValue: mockDbService },
      ],
    }).compile();

    repository = module.get<InstanceManagementRepository>(InstanceManagementRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all instances when no filters provided', async () => {
      // Act
      const result = await repository.findAll();

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(EvolutionInstanceEntity);
      expect(result[1]).toBeInstanceOf(EvolutionInstanceEntity);
      expect(result[0].instance.instanceName).toBe('instance-1');
      expect(result[1].instance.instanceName).toBe('instance-2');
    });

    it('should return all instances when filters is undefined', async () => {
      // Act
      const result = await repository.findAll(undefined);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].instance.instanceName).toBe('instance-1');
      expect(result[1].instance.instanceName).toBe('instance-2');
    });

    it('should filter instances by instanceName', async () => {
      // Act
      const result = await repository.findAll({ instanceName: 'instance-1' });

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].instance.instanceName).toBe('instance-1');
      expect(result[0].instance.status).toBe('ACTIVE');
    });

    it('should filter instances by status', async () => {
      // Act
      const result = await repository.findAll({ status: 'ACTIVE' });

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].instance.instanceName).toBe('instance-1');
      expect(result[0].instance.status).toBe('ACTIVE');
    });

    it('should filter instances by status INACTIVE', async () => {
      // Act
      const result = await repository.findAll({ status: 'INACTIVE' });

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].instance.instanceName).toBe('instance-2');
      expect(result[0].instance.status).toBe('INACTIVE');
    });

    it('should filter instances by both instanceName and status', async () => {
      // Act
      const result = await repository.findAll({
        instanceName: 'instance-1',
        status: 'ACTIVE',
      });

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].instance.instanceName).toBe('instance-1');
      expect(result[0].instance.status).toBe('ACTIVE');
    });

    it('should return empty array when no instances match filters', async () => {
      // Act
      const result = await repository.findAll({
        instanceName: 'non-existent',
        status: 'ACTIVE',
      });

      // Assert
      expect(result).toHaveLength(0);
    });

    it('should return empty array when status filter does not match', async () => {
      // Act
      const result = await repository.findAll({ status: 'UNKNOWN' });

      // Assert
      expect(result).toHaveLength(0);
    });

    it('should handle partial instanceName matches', async () => {
      // Act
      const result = await repository.findAll({ instanceName: 'instance' });

      // Assert
      expect(result).toHaveLength(2); // Both instances contain 'instance'
      expect(result[0].instance.instanceName).toContain('instance');
      expect(result[1].instance.instanceName).toContain('instance');
    });

    it('should be case-sensitive for instanceName filter', async () => {
      // Act
      const result = await repository.findAll({ instanceName: 'Instance-1' }); // Capital I

      // Assert
      expect(result).toHaveLength(0); // Should not match due to case sensitivity
    });

    it('should be case-sensitive for status filter', async () => {
      // Act
      const result = await repository.findAll({ status: 'active' }); // lowercase

      // Assert
      expect(result).toHaveLength(0); // Should not match due to case sensitivity
    });

    it('should handle empty string filters', async () => {
      // Act
      const result = await repository.findAll({
        instanceName: '',
        status: '',
      });

      // Assert
      expect(result).toHaveLength(2); // Empty strings are treated as truthy and return all instances
    });

    it('should return instances with correct properties', async () => {
      // Act
      const result = await repository.findAll();

      // Assert
      expect(result[0].instance.instanceName).toBe('instance-1');
      expect(result[0].instance.instanceId).toBe('uuid-instance-1');
      expect(result[0].instance.webhook_wa_business).toBe('https://webhook1.com');
      expect(result[0].instance.access_token_wa_business).toBe('token-1');
      expect(result[0].instance.status).toBe('ACTIVE');
      expect(result[0].hash.apikey).toBe('api-key-1');
      expect(result[0].settings.reject_call).toBe(false);
      expect(result[0].settings.always_online).toBe(true);

      expect(result[1].instance.instanceName).toBe('instance-2');
      expect(result[1].instance.instanceId).toBe('uuid-instance-2');
      expect(result[1].instance.webhook_wa_business).toBeNull();
      expect(result[1].instance.access_token_wa_business).toBe('token-2');
      expect(result[1].instance.status).toBe('INACTIVE');
      expect(result[1].hash.apikey).toBe('api-key-2');
      expect(result[1].settings.reject_call).toBe(true);
      expect(result[1].settings.always_online).toBe(false);
    });
  });

  describe('findByName', () => {
    it('should find instance by exact name', async () => {
      // Act
      const result = await repository.findByName('instance-1');

      // Assert
      expect(result).not.toBeNull();
      expect(result!.instance.instanceName).toBe('instance-1');
      expect(result!.instance.status).toBe('ACTIVE');
    });

    it('should find inactive instance by name', async () => {
      // Act
      const result = await repository.findByName('instance-2');

      // Assert
      expect(result).not.toBeNull();
      expect(result!.instance.instanceName).toBe('instance-2');
      expect(result!.instance.status).toBe('INACTIVE');
    });

    it('should return null for non-existent instance', async () => {
      // Act
      const result = await repository.findByName('non-existent');

      // Assert
      expect(result).toBeNull();
    });

    it('should be case-sensitive', async () => {
      // Act
      const result = await repository.findByName('Instance-1'); // Capital I

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for empty string', async () => {
      // Act
      const result = await repository.findByName('');

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for partial name match', async () => {
      // Act
      const result = await repository.findByName('instance'); // Partial match

      // Assert
      expect(result).toBeNull(); // Should require exact match
    });

    it('should handle special characters in instance name', async () => {
      // Act
      const result = await repository.findByName('instance@domain.com');

      // Assert
      expect(result).toBeNull(); // No instance with this name in mock data
    });
  });

  describe('connect', () => {
    it('should return connection result with qrcode', async () => {
      // Act
      const result = await repository.connect('instance-1');

      // Assert
      expect(result).toEqual({
        status: 'connecting',
        qrcode: expect.stringContaining('data:image/png;base64,'),
      });
      expect(result.status).toBe('connecting');
      expect(result.qrcode).toBeDefined();
    });

    it('should handle different instance names', async () => {
      // Act
      const result = await repository.connect('any-instance-name');

      // Assert
      expect(result).toEqual({
        status: 'connecting',
        qrcode: expect.stringContaining('data:image/png;base64,'),
      });
    });

    it('should return consistent result for same instance', async () => {
      // Act
      const result1 = await repository.connect('test-instance');
      const result2 = await repository.connect('test-instance');

      // Assert
      expect(result1).toEqual(result2);
    });
  });

  describe('getConnectionState', () => {
    it('should return connection state', async () => {
      // Act
      const result = await repository.getConnectionState('instance-1');

      // Assert
      expect(result).toEqual({ state: 'open' });
    });

    it('should return same state for any instance', async () => {
      // Act
      const result1 = await repository.getConnectionState('instance-1');
      const result2 = await repository.getConnectionState('instance-2');

      // Assert
      expect(result1).toEqual({ state: 'open' });
      expect(result2).toEqual({ state: 'open' });
    });

    it('should handle special characters in instance name', async () => {
      // Act
      const result = await repository.getConnectionState('test@domain.com');

      // Assert
      expect(result).toEqual({ state: 'open' });
    });
  });

  describe('logout', () => {
    it('should return logout success message', async () => {
      // Act
      const result = await repository.logout('instance-1');

      // Assert
      expect(result).toEqual({
        message: 'Instance instance-1 logged out successfully',
      });
    });

    it('should include instance name in message', async () => {
      // Act
      const result = await repository.logout('test-instance');

      // Assert
      expect(result).toEqual({
        message: 'Instance test-instance logged out successfully',
      });
      expect(result.message).toContain('test-instance');
    });

    it('should handle special characters in instance name', async () => {
      // Act
      const result = await repository.logout('test@domain.com');

      // Assert
      expect(result).toEqual({
        message: 'Instance test@domain.com logged out successfully',
      });
    });
  });

  describe('delete', () => {
    it('should return delete success message', async () => {
      // Act
      const result = await repository.delete('instance-1');

      // Assert
      expect(result).toEqual({
        message: 'Instance instance-1 deleted successfully',
      });
    });

    it('should include instance name in message', async () => {
      // Act
      const result = await repository.delete('test-instance');

      // Assert
      expect(result).toEqual({
        message: 'Instance test-instance deleted successfully',
      });
      expect(result.message).toContain('test-instance');
    });

    it('should handle very long instance names', async () => {
      // Arrange
      const longName = 'a'.repeat(100);

      // Act
      const result = await repository.delete(longName);

      // Assert
      expect(result).toEqual({
        message: `Instance ${longName} deleted successfully`,
      });
    });
  });

  describe('restart', () => {
    it('should return restart success message', async () => {
      // Act
      const result = await repository.restart('instance-1');

      // Assert
      expect(result).toEqual({
        message: 'Instance instance-1 restarted successfully',
      });
    });

    it('should include instance name in message', async () => {
      // Act
      const result = await repository.restart('test-instance');

      // Assert
      expect(result).toEqual({
        message: 'Instance test-instance restarted successfully',
      });
      expect(result.message).toContain('test-instance');
    });

    it('should handle empty instance name', async () => {
      // Act
      const result = await repository.restart('');

      // Assert
      expect(result).toEqual({
        message: 'Instance  restarted successfully',
      });
    });
  });

  describe('updateSettings', () => {
    it('should update settings and return updated instance', async () => {
      // Arrange
      const newSettings = {
        reject_call: true,
        msg_call: 'Updated message',
        always_online: false,
      };

      // Act
      const result = await repository.updateSettings('instance-1', newSettings);

      // Assert
      expect(result).toBeInstanceOf(EvolutionInstanceEntity);
      expect(result.instance.instanceName).toBe('instance-1');
      expect(result.settings.reject_call).toBe(true);
      expect(result.settings.msg_call).toBe('Updated message');
      expect(result.settings.always_online).toBe(false);
      // Other settings should remain from original instance
      expect(result.settings.groups_ignore).toBe(false);
      expect(result.settings.read_messages).toBe(true);
    });

    it('should throw error when instance not found', async () => {
      // Arrange
      const newSettings = { reject_call: true };

      // Act & Assert
      await expect(repository.updateSettings('non-existent', newSettings)).rejects.toThrow(
        'Instance non-existent not found',
      );
    });

    it('should handle partial settings update', async () => {
      // Arrange
      const partialSettings = { reject_call: true };

      // Act
      const result = await repository.updateSettings('instance-2', partialSettings);

      // Assert
      expect(result.settings.reject_call).toBe(true);
      // Other settings should remain unchanged
      expect(result.settings.msg_call).toBe('Não aceito chamadas');
      expect(result.settings.groups_ignore).toBe(true);
      expect(result.settings.always_online).toBe(false);
    });

    it('should handle empty settings object', async () => {
      // Act
      const result = await repository.updateSettings('instance-1', {});

      // Assert
      expect(result).toBeInstanceOf(EvolutionInstanceEntity);
      expect(result.instance.instanceName).toBe('instance-1');
      // All settings should remain unchanged
      expect(result.settings.reject_call).toBe(false);
      expect(result.settings.always_online).toBe(true);
    });

    it('should update multiple settings at once', async () => {
      // Arrange
      const multipleSettings = {
        reject_call: true,
        msg_call: 'New message',
        groups_ignore: true,
        always_online: false,
        read_messages: false,
        read_status: false,
        sync_full_history: false,
      };

      // Act
      const result = await repository.updateSettings('instance-1', multipleSettings);

      // Assert
      expect(result.settings.reject_call).toBe(true);
      expect(result.settings.msg_call).toBe('New message');
      expect(result.settings.groups_ignore).toBe(true);
      expect(result.settings.always_online).toBe(false);
      expect(result.settings.read_messages).toBe(false);
      expect(result.settings.read_status).toBe(false);
      expect(result.settings.sync_full_history).toBe(false);
    });

    it('should preserve instance and hash data during settings update', async () => {
      // Arrange
      const newSettings = { reject_call: true };

      // Act
      const result = await repository.updateSettings('instance-1', newSettings);

      // Assert
      expect(result.instance.instanceName).toBe('instance-1');
      expect(result.instance.instanceId).toBe('uuid-instance-1');
      expect(result.instance.webhook_wa_business).toBe('https://webhook1.com');
      expect(result.instance.access_token_wa_business).toBe('token-1');
      expect(result.instance.status).toBe('ACTIVE');
      expect(result.hash.apikey).toBe('api-key-1');
    });

    it('should handle undefined settings values', async () => {
      // Arrange
      const settingsWithUndefined = {
        reject_call: undefined,
        msg_call: 'Defined message',
        always_online: undefined,
      };

      // Act
      const result = await repository.updateSettings('instance-1', settingsWithUndefined);

      // Assert
      expect(result.settings.msg_call).toBe('Defined message');
      // Undefined values will override existing settings with undefined
      expect(result.settings.reject_call).toBeUndefined();
      expect(result.settings.always_online).toBeUndefined();
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle null instance name in findByName', async () => {
      // Act
      const result = await repository.findByName(null as any);

      // Assert
      expect(result).toBeNull();
    });

    it('should handle undefined instance name in operations', async () => {
      // Act & Assert
      const connectResult = await repository.connect(undefined as any);
      expect(connectResult.status).toBe('connecting');

      const stateResult = await repository.getConnectionState(undefined as any);
      expect(stateResult.state).toBe('open');
    });

    it('should handle concurrent operations', async () => {
      // Act
      const promises = [
        repository.connect('instance-1'),
        repository.getConnectionState('instance-1'),
        repository.logout('instance-1'),
        repository.restart('instance-1'),
      ];
      const results = await Promise.all(promises);

      // Assert
      expect(results).toHaveLength(4);
      expect(results[0]).toEqual(expect.objectContaining({ status: 'connecting' }));
      expect(results[1]).toEqual({ state: 'open' });
      expect(results[2]).toEqual(
        expect.objectContaining({ message: expect.stringContaining('logged out') }),
      );
      expect(results[3]).toEqual(
        expect.objectContaining({ message: expect.stringContaining('restarted') }),
      );
    });
  });

  describe('mock data consistency', () => {
    it('should have consistent mock data structure', async () => {
      // Act
      const instances = await repository.findAll();

      // Assert
      instances.forEach((instance) => {
        expect(instance).toBeInstanceOf(EvolutionInstanceEntity);
        expect(instance.instance).toBeDefined();
        expect(instance.hash).toBeDefined();
        expect(instance.settings).toBeDefined();
        expect(instance.instance.instanceName).toBeDefined();
        expect(instance.instance.instanceId).toBeDefined();
        expect(instance.instance.access_token_wa_business).toBeDefined();
        expect(instance.instance.status).toBeDefined();
        expect(instance.hash.apikey).toBeDefined();
        expect(typeof instance.settings.reject_call).toBe('boolean');
        expect(typeof instance.settings.always_online).toBe('boolean');
        expect(typeof instance.settings.read_messages).toBe('boolean');
        expect(typeof instance.settings.read_status).toBe('boolean');
        expect(typeof instance.settings.groups_ignore).toBe('boolean');
        expect(typeof instance.settings.sync_full_history).toBe('boolean');
      });
    });
  });
});
