import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { OPENAI_BOT_REPOSITORY_TOKEN } from '../../../../shared/constants/di-constants';
import { IChangeStatusInput } from '../../domain/contracts/input/change-status-input.contract';
import { ICreateOpenAIBotInput } from '../../domain/contracts/input/create-openai-bot-input.contract';
import { IUpdateOpenAIBotInput } from '../../domain/contracts/input/update-openai-bot-input.contract';
import {
  IOpenAIBotOutput,
  IOpenAIBotListOutput,
  IOpenAIBotDeleteOutput,
  IOpenAIBotStatusOutput,
} from '../../domain/contracts/output/openai-bot-output.contract';
import { IOpenAIBotRepository } from '../../domain/repositories/openai-bot-repository.contract';
import { IOpenAIBotUseCase } from '../contracts/Services/openai-bot-usecase.contract';

@Injectable()
export class OpenAIBotUseCase implements IOpenAIBotUseCase {
  constructor(
    @Inject(OPENAI_BOT_REPOSITORY_TOKEN)
    private readonly openAIBotRepository: IOpenAIBotRepository,
  ) {}

  async create(instanceName: string, input: ICreateOpenAIBotInput): Promise<IOpenAIBotOutput> {
    // Validações de negócio
    this.validateCreateInput(input);
    this.validateInstanceName(instanceName);

    const bot = await this.openAIBotRepository.create(instanceName, input);
    return bot;
  }

  async findAll(instanceName: string): Promise<IOpenAIBotListOutput> {
    this.validateInstanceName(instanceName);

    const bots = await this.openAIBotRepository.findAll(instanceName);
    return {
      bots,
      total: bots.length,
    };
  }

  async findById(instanceName: string, id: string): Promise<IOpenAIBotOutput | null> {
    this.validateInstanceName(instanceName);
    this.validateId(id);

    const bot = await this.openAIBotRepository.findById(instanceName, id);
    if (!bot) {
      throw new NotFoundException(`OpenAI bot with ID ${id} not found`);
    }

    return bot;
  }

  async update(instanceName: string, input: IUpdateOpenAIBotInput): Promise<IOpenAIBotOutput> {
    this.validateInstanceName(instanceName);
    this.validateUpdateInput(input);

    // Verificar se o bot existe
    const existingBot = await this.openAIBotRepository.findById(instanceName, input.id);
    if (!existingBot) {
      throw new NotFoundException(`OpenAI bot with ID ${input.id} not found`);
    }

    const updatedBot = await this.openAIBotRepository.update(instanceName, input);
    return updatedBot;
  }

  async delete(instanceName: string, id: string): Promise<IOpenAIBotDeleteOutput> {
    this.validateInstanceName(instanceName);
    this.validateId(id);

    // Verificar se o bot existe
    const existingBot = await this.openAIBotRepository.findById(instanceName, id);
    if (!existingBot) {
      throw new NotFoundException(`OpenAI bot with ID ${id} not found`);
    }

    await this.openAIBotRepository.delete(instanceName, id);

    return {
      message: `OpenAI bot ${existingBot.name} deleted successfully`,
      deletedId: id,
    };
  }

  async changeStatus(
    instanceName: string,
    input: IChangeStatusInput,
  ): Promise<IOpenAIBotStatusOutput> {
    this.validateInstanceName(instanceName);
    this.validateChangeStatusInput(input);

    // Verificar se o bot existe
    const existingBot = await this.openAIBotRepository.findById(instanceName, input.id);
    if (!existingBot) {
      throw new NotFoundException(`OpenAI bot with ID ${input.id} not found`);
    }

    const updatedBot = await this.openAIBotRepository.changeStatus(instanceName, input);

    return {
      id: updatedBot.id,
      enabled: updatedBot.enabled,
      message: `OpenAI bot ${updatedBot.name} ${updatedBot.enabled ? 'enabled' : 'disabled'} successfully`,
    };
  }

  private validateInstanceName(instanceName: string): void {
    if (!instanceName || instanceName.trim().length === 0) {
      throw new BadRequestException('Instance name is required');
    }
  }

  private validateId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('Bot ID is required');
    }
  }

  private validateCreateInput(input: ICreateOpenAIBotInput): void {
    if (!input.name || input.name.trim().length === 0) {
      throw new BadRequestException('Bot name is required');
    }

    if (!input.openaiCredsId || input.openaiCredsId.trim().length === 0) {
      throw new BadRequestException('OpenAI credentials ID is required');
    }

    if (!input.botType) {
      throw new BadRequestException('Bot type is required');
    }

    if (!['assistant', 'chatCompletion'].includes(input.botType)) {
      throw new BadRequestException('Bot type must be either "assistant" or "chatCompletion"');
    }

    if (
      input.botType === 'assistant' &&
      (!input.assistantId || input.assistantId.trim().length === 0)
    ) {
      throw new BadRequestException('Assistant ID is required for assistant bot type');
    }

    if (!input.triggerType) {
      throw new BadRequestException('Trigger type is required');
    }

    if (!['all', 'keyword'].includes(input.triggerType)) {
      throw new BadRequestException('Trigger type must be either "all" or "keyword"');
    }

    if (
      input.triggerType === 'keyword' &&
      (!input.triggerValue || input.triggerValue.trim().length === 0)
    ) {
      throw new BadRequestException('Trigger value is required for keyword trigger type');
    }

    if (!input.triggerOperator) {
      throw new BadRequestException('Trigger operator is required');
    }

    const validOperators = ['contains', 'equals', 'startsWith', 'endsWith', 'regex', 'none'];
    if (!validOperators.includes(input.triggerOperator)) {
      throw new BadRequestException(
        `Trigger operator must be one of: ${validOperators.join(', ')}`,
      );
    }

    if (input.maxTokens && (input.maxTokens < 1 || input.maxTokens > 4096)) {
      throw new BadRequestException('Max tokens must be between 1 and 4096');
    }

    if (input.expire && input.expire < 1) {
      throw new BadRequestException('Expire time must be greater than 0');
    }

    if (input.delayMessage && input.delayMessage < 0) {
      throw new BadRequestException('Delay message must be greater than or equal to 0');
    }

    if (input.debounceTime && input.debounceTime < 0) {
      throw new BadRequestException('Debounce time must be greater than or equal to 0');
    }
  }

  private validateUpdateInput(input: IUpdateOpenAIBotInput): void {
    if (!input.id || input.id.trim().length === 0) {
      throw new BadRequestException('Bot ID is required for update');
    }

    if (input.name !== undefined && input.name.trim().length === 0) {
      throw new BadRequestException('Bot name cannot be empty');
    }

    if (input.openaiCredsId !== undefined && input.openaiCredsId.trim().length === 0) {
      throw new BadRequestException('OpenAI credentials ID cannot be empty');
    }

    if (input.botType && !['assistant', 'chatCompletion'].includes(input.botType)) {
      throw new BadRequestException('Bot type must be either "assistant" or "chatCompletion"');
    }

    if (input.triggerType && !['all', 'keyword'].includes(input.triggerType)) {
      throw new BadRequestException('Trigger type must be either "all" or "keyword"');
    }

    if (input.triggerOperator) {
      const validOperators = ['contains', 'equals', 'startsWith', 'endsWith', 'regex', 'none'];
      if (!validOperators.includes(input.triggerOperator)) {
        throw new BadRequestException(
          `Trigger operator must be one of: ${validOperators.join(', ')}`,
        );
      }
    }

    if (input.maxTokens !== undefined && (input.maxTokens < 1 || input.maxTokens > 4096)) {
      throw new BadRequestException('Max tokens must be between 1 and 4096');
    }

    if (input.expire !== undefined && input.expire < 1) {
      throw new BadRequestException('Expire time must be greater than 0');
    }

    if (input.delayMessage !== undefined && input.delayMessage < 0) {
      throw new BadRequestException('Delay message must be greater than or equal to 0');
    }

    if (input.debounceTime !== undefined && input.debounceTime < 0) {
      throw new BadRequestException('Debounce time must be greater than or equal to 0');
    }
  }

  private validateChangeStatusInput(input: IChangeStatusInput): void {
    if (!input.id || input.id.trim().length === 0) {
      throw new BadRequestException('Bot ID is required');
    }

    if (typeof input.enabled !== 'boolean') {
      throw new BadRequestException('Enabled status must be a boolean value');
    }
  }
}
