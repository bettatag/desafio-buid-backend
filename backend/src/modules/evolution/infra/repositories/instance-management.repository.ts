import { Injectable, Inject } from '@nestjs/common';
import { DB_SERVICE_TOKEN } from '../../../../shared/constants/di-constants';
import { IDbService } from '../../../../shared/db/interfaces/db-service.interface';
import { IInstanceManagementRepository } from '../../domain/repositories/instance-management-repository.contract';
import { EvolutionInstanceEntity } from '../../domain/entities/evolution-instance.entity';

@Injectable()
export class InstanceManagementRepository implements IInstanceManagementRepository {
  constructor(
    @Inject(DB_SERVICE_TOKEN)
    private readonly dbService: IDbService,
  ) {}

  async findAll(filters?: {
    instanceName?: string;
    status?: string;
  }): Promise<EvolutionInstanceEntity[]> {
    // Mock implementation - em um cenário real, isso buscaria do banco de dados
    const mockInstances: EvolutionInstanceEntity[] = [
      new EvolutionInstanceEntity(
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
          msg_call: 'Chamadas não aceitas',
          groups_ignore: false,
          always_online: true,
          read_messages: true,
          read_status: true,
          sync_full_history: false,
        },
      ),
      new EvolutionInstanceEntity(
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
          msg_call: 'Não aceito chamadas',
          groups_ignore: true,
          always_online: false,
          read_messages: false,
          read_status: false,
          sync_full_history: true,
        },
      ),
    ];

    let filteredInstances = mockInstances;

    if (filters?.instanceName) {
      filteredInstances = filteredInstances.filter((instance) =>
        instance.instance.instanceName.includes(filters.instanceName!),
      );
    }

    if (filters?.status) {
      filteredInstances = filteredInstances.filter(
        (instance) => instance.instance.status === filters.status,
      );
    }

    return filteredInstances;
  }

  async findByName(instanceName: string): Promise<EvolutionInstanceEntity | null> {
    const instances = await this.findAll();
    return instances.find((instance) => instance.instance.instanceName === instanceName) || null;
  }

  async connect(instanceName: string): Promise<{ status: string; qrcode?: string }> {
    // Mock implementation - em um cenário real, isso iniciaria a conexão
    return {
      status: 'connecting',
      qrcode:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    };
  }

  async getConnectionState(instanceName: string): Promise<{ state: string }> {
    // Mock implementation
    return { state: 'open' };
  }

  async logout(instanceName: string): Promise<{ message: string }> {
    // Mock implementation
    return { message: `Instance ${instanceName} logged out successfully` };
  }

  async delete(instanceName: string): Promise<{ message: string }> {
    // Mock implementation
    return { message: `Instance ${instanceName} deleted successfully` };
  }

  async restart(instanceName: string): Promise<{ message: string }> {
    // Mock implementation
    return { message: `Instance ${instanceName} restarted successfully` };
  }

  async updateSettings(instanceName: string, settings: any): Promise<EvolutionInstanceEntity> {
    // Mock implementation - em um cenário real, isso atualizaria no banco
    const instance = await this.findByName(instanceName);
    if (!instance) {
      throw new Error(`Instance ${instanceName} not found`);
    }

    // Simular atualização das configurações
    const updatedSettings = {
      ...instance.settings,
      ...settings,
    };

    return new EvolutionInstanceEntity(instance.instance, instance.hash, updatedSettings);
  }
}
