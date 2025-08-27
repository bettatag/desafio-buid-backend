import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { OPENAI_SETTINGS_REPOSITORY_TOKEN } from '../../../../shared/constants/di-constants';
import { IOpenAISettingsRepository } from '../../domain/repositories/openai-settings-repository.contract';
import { IOpenAISettingsUseCase } from '../contracts/Services/openai-settings-usecase.contract';
import { ICreateOpenAISettingsInput } from '../../domain/contracts/input/create-openai-settings-input.contract';
import {
  IOpenAISettingsOutput,
  IOpenAISettingsDeleteOutput,
} from '../../domain/contracts/output/openai-settings-output.contract';

@Injectable()
export class OpenAISettingsUseCase implements IOpenAISettingsUseCase {
  constructor(
    @Inject(OPENAI_SETTINGS_REPOSITORY_TOKEN)
    private readonly openAISettingsRepository: IOpenAISettingsRepository,
  ) {}

  async create(
    instanceName: string,
    input: ICreateOpenAISettingsInput,
  ): Promise<IOpenAISettingsOutput> {
    this.validateInstanceName(instanceName);
    this.validateCreateInput(input);

    // Verificar se já existem configurações para esta instância
    const existingSettings = await this.openAISettingsRepository.find(instanceName);
    if (existingSettings) {
      throw new BadRequestException(
        `Settings for instance "${instanceName}" already exist. Use update instead.`,
      );
    }

    const settings = await this.openAISettingsRepository.create(instanceName, input);
    return settings;
  }

  async find(instanceName: string): Promise<IOpenAISettingsOutput | null> {
    this.validateInstanceName(instanceName);

    const settings = await this.openAISettingsRepository.find(instanceName);
    if (!settings) {
      throw new NotFoundException(`Settings for instance "${instanceName}" not found`);
    }

    return settings;
  }

  async update(
    instanceName: string,
    input: ICreateOpenAISettingsInput,
  ): Promise<IOpenAISettingsOutput> {
    this.validateInstanceName(instanceName);
    this.validateCreateInput(input);

    // Verificar se as configurações existem
    const existingSettings = await this.openAISettingsRepository.find(instanceName);
    if (!existingSettings) {
      throw new NotFoundException(`Settings for instance "${instanceName}" not found`);
    }

    const updatedSettings = await this.openAISettingsRepository.update(instanceName, input);
    return updatedSettings;
  }

  async delete(instanceName: string): Promise<IOpenAISettingsDeleteOutput> {
    this.validateInstanceName(instanceName);

    // Verificar se as configurações existem
    const existingSettings = await this.openAISettingsRepository.find(instanceName);
    if (!existingSettings) {
      throw new NotFoundException(`Settings for instance "${instanceName}" not found`);
    }

    await this.openAISettingsRepository.delete(instanceName);

    return {
      message: `Settings for instance "${instanceName}" deleted successfully`,
      deletedId: existingSettings.id,
    };
  }

  private validateInstanceName(instanceName: string): void {
    if (!instanceName || instanceName.trim().length === 0) {
      throw new BadRequestException('Instance name is required');
    }
  }

  private validateCreateInput(input: ICreateOpenAISettingsInput): void {
    if (input.expire !== undefined && (input.expire < 60 || input.expire > 86400)) {
      throw new BadRequestException(
        'Expire time must be between 60 seconds and 24 hours (86400 seconds)',
      );
    }

    if (input.delayMessage !== undefined && input.delayMessage < 0) {
      throw new BadRequestException('Delay message must be greater than or equal to 0');
    }

    if (input.debounceTime !== undefined && input.debounceTime < 0) {
      throw new BadRequestException('Debounce time must be greater than or equal to 0');
    }

    if (input.keywordFinish && input.keywordFinish.trim().length === 0) {
      throw new BadRequestException('Keyword finish cannot be empty if provided');
    }

    if (input.unknownMessage && input.unknownMessage.trim().length === 0) {
      throw new BadRequestException('Unknown message cannot be empty if provided');
    }

    // Validar configuração de webhook se fornecida
    if (input.webhookConfig) {
      if (input.webhookConfig.url && !this.isValidUrl(input.webhookConfig.url)) {
        throw new BadRequestException('Invalid webhook URL format');
      }

      if (input.webhookConfig.events && input.webhookConfig.events.length === 0) {
        throw new BadRequestException('Webhook events list cannot be empty if provided');
      }
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
