import { Injectable, Inject } from '@nestjs/common';
import { DB_SERVICE_TOKEN } from '../../../../shared/constants/di-constants';
import { IDbService } from '../../../../shared/db/interfaces/db-service.interface';
import { IOpenAISettingsRepository } from '../../domain/repositories/openai-settings-repository.contract';
import { OpenAISettingsEntity } from '../../domain/entities/openai-settings.entity';
import { ICreateOpenAISettingsInput } from '../../domain/contracts/input/create-openai-settings-input.contract';

@Injectable()
export class OpenAISettingsRepository implements IOpenAISettingsRepository {
  private mockSettings: Map<string, OpenAISettingsEntity> = new Map();

  constructor(
    @Inject(DB_SERVICE_TOKEN)
    private readonly dbService: IDbService,
  ) {}

  async create(
    instanceName: string,
    input: ICreateOpenAISettingsInput,
  ): Promise<OpenAISettingsEntity> {
    // Mock implementation - Em um cenário real, isso salvaria no banco de dados
    const mockSettings = OpenAISettingsEntity.create({
      id: `settings-${instanceName}-${Date.now()}`,
      instanceName,
      expire: input.expire,
      keywordFinish: input.keywordFinish,
      delayMessage: input.delayMessage,
      unknownMessage: input.unknownMessage,
      listeningFromMe: input.listeningFromMe,
      stopBotFromMe: input.stopBotFromMe,
      keepOpen: input.keepOpen,
      debounceTime: input.debounceTime,
      webhookConfig: input.webhookConfig,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Armazenar no mock storage
    this.mockSettings.set(instanceName, mockSettings);

    return mockSettings;
  }

  async find(instanceName: string): Promise<OpenAISettingsEntity | null> {
    // Mock implementation - Em um cenário real, isso buscaria do banco de dados
    const existingSettings = this.mockSettings.get(instanceName);
    if (existingSettings) {
      return existingSettings;
    }

    // Retornar configurações padrão se não existirem
    if (instanceName === 'pramin') {
      const defaultSettings = OpenAISettingsEntity.create({
        id: 'settings-pramin-default',
        instanceName: 'pramin',
        expire: 3600,
        keywordFinish: 'sair',
        delayMessage: 1000,
        unknownMessage: 'Desculpe, não entendi. Digite "ajuda" para ver as opções disponíveis.',
        listeningFromMe: false,
        stopBotFromMe: false,
        keepOpen: true,
        debounceTime: 1000,
        webhookConfig: {
          enabled: false,
        },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      });

      this.mockSettings.set(instanceName, defaultSettings);
      return defaultSettings;
    }

    return null;
  }

  async update(
    instanceName: string,
    input: ICreateOpenAISettingsInput,
  ): Promise<OpenAISettingsEntity> {
    // Mock implementation - Em um cenário real, isso atualizaria no banco de dados
    const existingSettings = await this.find(instanceName);
    if (!existingSettings) {
      throw new Error(`Settings for instance ${instanceName} not found`);
    }

    const updatedSettings = OpenAISettingsEntity.create({
      id: existingSettings.id,
      instanceName,
      expire: input.expire ?? existingSettings.expire,
      keywordFinish: input.keywordFinish ?? existingSettings.keywordFinish,
      delayMessage: input.delayMessage ?? existingSettings.delayMessage,
      unknownMessage: input.unknownMessage ?? existingSettings.unknownMessage,
      listeningFromMe: input.listeningFromMe ?? existingSettings.listeningFromMe,
      stopBotFromMe: input.stopBotFromMe ?? existingSettings.stopBotFromMe,
      keepOpen: input.keepOpen ?? existingSettings.keepOpen,
      debounceTime: input.debounceTime ?? existingSettings.debounceTime,
      webhookConfig: input.webhookConfig ?? existingSettings.webhookConfig,
      createdAt: existingSettings.createdAt,
      updatedAt: new Date(),
    });

    // Atualizar no mock storage
    this.mockSettings.set(instanceName, updatedSettings);

    return updatedSettings;
  }

  async delete(instanceName: string): Promise<void> {
    // Mock implementation - Em um cenário real, isso deletaria do banco de dados
    const existingSettings = await this.find(instanceName);
    if (!existingSettings) {
      throw new Error(`Settings for instance ${instanceName} not found`);
    }

    // Remover do mock storage
    this.mockSettings.delete(instanceName);
  }
}
