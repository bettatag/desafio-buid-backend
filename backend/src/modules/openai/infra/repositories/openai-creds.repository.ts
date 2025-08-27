import { Injectable, Inject } from '@nestjs/common';
import { DB_SERVICE_TOKEN } from '../../../../shared/constants/di-constants';
import { IDbService } from '../../../../shared/db/interfaces/db-service.interface';
import { IOpenAICredsRepository } from '../../domain/repositories/openai-creds-repository.contract';
import { OpenAICredsEntity } from '../../domain/entities/openai-creds.entity';
import { ICreateOpenAICredsInput } from '../../domain/contracts/input/create-openai-creds-input.contract';

@Injectable()
export class OpenAICredsRepository implements IOpenAICredsRepository {
  constructor(
    @Inject(DB_SERVICE_TOKEN)
    private readonly dbService: IDbService,
  ) {}

  async create(instanceName: string, input: ICreateOpenAICredsInput): Promise<OpenAICredsEntity> {
    // Mock implementation - Em um cenário real, isso salvaria no banco de dados
    const mockCreds = OpenAICredsEntity.create({
      id: `creds-${Date.now()}`,
      name: input.name,
      apiKey: input.apiKey,
      organization: input.organization,
      enabled: input.enabled ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return mockCreds;
  }

  async findAll(instanceName: string): Promise<OpenAICredsEntity[]> {
    // Mock implementation - Em um cenário real, isso buscaria do banco de dados
    const mockCreds: OpenAICredsEntity[] = [
      OpenAICredsEntity.create({
        id: 'creds-1',
        name: 'main-openai-creds',
        apiKey: 'sk-proj-vxzixTRvq1234567890abcdef',
        enabled: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }),
      OpenAICredsEntity.create({
        id: 'creds-2',
        name: 'backup-openai-creds',
        apiKey: 'sk-proj-abcdef1234567890vxzixTRvq',
        organization: 'org-abc123',
        enabled: false,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      }),
    ];

    return mockCreds;
  }

  async findById(instanceName: string, id: string): Promise<OpenAICredsEntity | null> {
    const creds = await this.findAll(instanceName);
    return creds.find((cred) => cred.id === id) || null;
  }

  async findByName(instanceName: string, name: string): Promise<OpenAICredsEntity | null> {
    const creds = await this.findAll(instanceName);
    return creds.find((cred) => cred.name.toLowerCase() === name.toLowerCase()) || null;
  }

  async delete(instanceName: string, id: string): Promise<void> {
    // Mock implementation - Em um cenário real, isso deletaria do banco de dados
    const existingCreds = await this.findById(instanceName, id);
    if (!existingCreds) {
      throw new Error(`Credentials with ID ${id} not found`);
    }
    // Simular deleção
  }
}
