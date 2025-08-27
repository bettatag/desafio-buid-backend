import { Injectable, Inject } from '@nestjs/common';
import { DB_SERVICE_TOKEN } from '../../../../shared/constants/di-constants';
import { IDbService } from '../../../../shared/db/interfaces/db-service.interface';
import { IOpenAIBotRepository } from '../../domain/repositories/openai-bot-repository.contract';
import { OpenAIBotEntity } from '../../domain/entities/openai-bot.entity';
import { ICreateOpenAIBotInput } from '../../domain/contracts/input/create-openai-bot-input.contract';
import { IUpdateOpenAIBotInput } from '../../domain/contracts/input/update-openai-bot-input.contract';
import { IChangeStatusInput } from '../../domain/contracts/input/change-status-input.contract';

@Injectable()
export class OpenAIBotRepository implements IOpenAIBotRepository {
  constructor(
    @Inject(DB_SERVICE_TOKEN)
    private readonly dbService: IDbService,
  ) {}

  async create(instanceName: string, input: ICreateOpenAIBotInput): Promise<OpenAIBotEntity> {
    // Mock implementation - Em um cenário real, isso salvaria no banco de dados
    const mockBot = OpenAIBotEntity.create({
      id: `bot-${Date.now()}`,
      name: input.name,
      enabled: input.enabled,
      openaiCredsId: input.openaiCredsId,
      botType: input.botType,
      triggerType: input.triggerType,
      triggerOperator: input.triggerOperator,
      assistantId: input.assistantId,
      functionUrl: input.functionUrl,
      model: input.model,
      systemMessages: input.systemMessages,
      assistantMessages: input.assistantMessages,
      userMessages: input.userMessages,
      maxTokens: input.maxTokens,
      triggerValue: input.triggerValue,
      expire: input.expire,
      keywordFinish: input.keywordFinish,
      delayMessage: input.delayMessage,
      unknownMessage: input.unknownMessage,
      listeningFromMe: input.listeningFromMe,
      stopBotFromMe: input.stopBotFromMe,
      keepOpen: input.keepOpen,
      debounceTime: input.debounceTime,
      ignoreJids: input.ignoreJids,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return mockBot;
  }

  async findAll(instanceName: string): Promise<OpenAIBotEntity[]> {
    // Mock implementation - Em um cenário real, isso buscaria do banco de dados
    const mockBots: OpenAIBotEntity[] = [
      OpenAIBotEntity.create({
        id: 'bot-1',
        name: 'Assistente de Vendas',
        enabled: true,
        openaiCredsId: 'creds-1',
        botType: 'chatCompletion',
        triggerType: 'keyword',
        triggerOperator: 'contains',
        triggerValue: 'vendas',
        model: 'gpt-3.5-turbo',
        systemMessages: ['Você é um assistente de vendas especializado'],
        maxTokens: 1000,
        expire: 30,
        unknownMessage: 'Desculpe, não entendi. Digite "vendas" para começar.',
        keepOpen: true,
        debounceTime: 1000,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }),
      OpenAIBotEntity.create({
        id: 'bot-2',
        name: 'Suporte Técnico',
        enabled: false,
        openaiCredsId: 'creds-2',
        botType: 'assistant',
        assistantId: 'asst_abc123',
        triggerType: 'keyword',
        triggerOperator: 'startsWith',
        triggerValue: 'suporte',
        expire: 60,
        unknownMessage: 'Para suporte técnico, digite "suporte" no início da mensagem.',
        keepOpen: false,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      }),
      OpenAIBotEntity.create({
        id: 'bot-3',
        name: 'Atendimento Geral',
        enabled: true,
        openaiCredsId: 'creds-3',
        botType: 'chatCompletion',
        triggerType: 'all',
        triggerOperator: 'none',
        model: 'gpt-4',
        systemMessages: ['Você é um atendente virtual prestativo e educado'],
        maxTokens: 500,
        unknownMessage: 'Como posso ajudá-lo hoje?',
        keepOpen: true,
        listeningFromMe: false,
        stopBotFromMe: true,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      }),
    ];

    return mockBots;
  }

  async findById(instanceName: string, id: string): Promise<OpenAIBotEntity | null> {
    const bots = await this.findAll(instanceName);
    return bots.find((bot) => bot.id === id) || null;
  }

  async update(instanceName: string, input: IUpdateOpenAIBotInput): Promise<OpenAIBotEntity> {
    // Mock implementation - Em um cenário real, isso atualizaria no banco de dados
    const existingBot = await this.findById(instanceName, input.id);
    if (!existingBot) {
      throw new Error(`Bot with ID ${input.id} not found`);
    }

    const updatedBot = OpenAIBotEntity.create({
      id: existingBot.id,
      name: input.name ?? existingBot.name,
      enabled: input.enabled ?? existingBot.enabled,
      openaiCredsId: input.openaiCredsId ?? existingBot.openaiCredsId,
      botType: input.botType ?? existingBot.botType,
      triggerType: input.triggerType ?? existingBot.triggerType,
      triggerOperator: input.triggerOperator ?? existingBot.triggerOperator,
      assistantId: input.assistantId ?? existingBot.assistantId,
      functionUrl: input.functionUrl ?? existingBot.functionUrl,
      model: input.model ?? existingBot.model,
      systemMessages: input.systemMessages ?? existingBot.systemMessages,
      assistantMessages: input.assistantMessages ?? existingBot.assistantMessages,
      userMessages: input.userMessages ?? existingBot.userMessages,
      maxTokens: input.maxTokens ?? existingBot.maxTokens,
      triggerValue: input.triggerValue ?? existingBot.triggerValue,
      expire: input.expire ?? existingBot.expire,
      keywordFinish: input.keywordFinish ?? existingBot.keywordFinish,
      delayMessage: input.delayMessage ?? existingBot.delayMessage,
      unknownMessage: input.unknownMessage ?? existingBot.unknownMessage,
      listeningFromMe: input.listeningFromMe ?? existingBot.listeningFromMe,
      stopBotFromMe: input.stopBotFromMe ?? existingBot.stopBotFromMe,
      keepOpen: input.keepOpen ?? existingBot.keepOpen,
      debounceTime: input.debounceTime ?? existingBot.debounceTime,
      ignoreJids: input.ignoreJids ?? existingBot.ignoreJids,
      createdAt: existingBot.createdAt,
      updatedAt: new Date(),
    });

    return updatedBot;
  }

  async delete(instanceName: string, id: string): Promise<void> {
    // Mock implementation - Em um cenário real, isso deletaria do banco de dados
    const existingBot = await this.findById(instanceName, id);
    if (!existingBot) {
      throw new Error(`Bot with ID ${id} not found`);
    }
    // Simular deleção
  }

  async changeStatus(instanceName: string, input: IChangeStatusInput): Promise<OpenAIBotEntity> {
    // Mock implementation - Em um cenário real, isso atualizaria o status no banco de dados
    const existingBot = await this.findById(instanceName, input.id);
    if (!existingBot) {
      throw new Error(`Bot with ID ${input.id} not found`);
    }

    const updatedBot = OpenAIBotEntity.create({
      ...existingBot,
      enabled: input.enabled,
      updatedAt: new Date(),
    });

    return updatedBot;
  }
}
