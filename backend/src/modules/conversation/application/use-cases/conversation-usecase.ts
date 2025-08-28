import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IConversationUseCase } from '../contracts/services/conversation-usecase.contract';
import { IConversationRepository } from '../../domain/repositories/conversation-repository.contract';
import {
  ICreateConversationInput,
  IUpdateConversationInput,
  ICreateMessageInput,
  IGetConversationsInput,
  IGetMessagesInput,
  IChatCompletionInput
} from '../../domain/contracts/input/conversation-input.contract';
import {
  IConversationOutput,
  IConversationMessageOutput,
  IConversationListOutput,
  IMessageListOutput,
  IChatCompletionOutput,
  IConversationStatsOutput
} from '../../domain/contracts/output/conversation-output.contract';
import { MessageRole } from '../../domain/entities/conversation-message.entity';
import { CONVERSATION_REPOSITORY_TOKEN } from '../../../../shared/constants/di-constants';

@Injectable()
export class ConversationUseCase implements IConversationUseCase {
  constructor(
    @Inject(CONVERSATION_REPOSITORY_TOKEN)
    private readonly conversationRepository: IConversationRepository,
  ) {}

  async createConversation(input: ICreateConversationInput): Promise<IConversationOutput> {
    // Validações de negócio
    if (input.userId === undefined || input.userId === null) {
      throw new HttpException('UserId é obrigatório', HttpStatus.BAD_REQUEST);
    }

    if (input.userId <= 0) {
      throw new HttpException('UserId deve ser um número positivo', HttpStatus.BAD_REQUEST);
    }

    // Gerar título automático se não fornecido
    const title = input.title || this.generateDefaultTitle();

    try {
      const conversation = await this.conversationRepository.createConversation({
        ...input,
        title,
      });

      return conversation;
    } catch (error) {
      // Se for uma HttpException, preservar o erro original
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro interno ao criar conversa', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateConversation(input: IUpdateConversationInput): Promise<IConversationOutput> {
    // Validações
    if (!input.conversationId) {
      throw new HttpException('ConversationId é obrigatório', HttpStatus.BAD_REQUEST);
    }

    if (!input.userId) {
      throw new HttpException('UserId é obrigatório', HttpStatus.BAD_REQUEST);
    }

    // Verificar se a conversa existe e pertence ao usuário
    const existingConversation = await this.conversationRepository.findConversationById(
      input.conversationId,
      input.userId,
    );

    if (!existingConversation) {
      throw new Error('Conversation not found or access denied');
    }

    return await this.conversationRepository.updateConversation(input);
  }

  async deleteConversation(conversationId: string, userId: number): Promise<void> {
    // Validações
    if (!conversationId) {
      throw new HttpException('ConversationId é obrigatório', HttpStatus.BAD_REQUEST);
    }

    if (!userId) {
      throw new HttpException('UserId é obrigatório', HttpStatus.BAD_REQUEST);
    }

    // Verificar se a conversa existe e pertence ao usuário
    const existingConversation = await this.conversationRepository.findConversationById(
      conversationId,
      userId,
    );

    if (!existingConversation) {
      throw new Error('Conversation not found or access denied');
    }

    await this.conversationRepository.deleteConversation(conversationId, userId);
  }

  async getConversation(conversationId: string, userId: number): Promise<IConversationOutput> {
    const conversation = await this.conversationRepository.findConversationById(conversationId, userId);

    if (!conversation) {
      throw new Error('Conversation not found or access denied');
    }

    return conversation;
  }

  async getConversations(input: IGetConversationsInput): Promise<IConversationListOutput> {
    // Validações e defaults
    const validatedInput = {
      ...input,
      page: input.page || 1,
      limit: Math.min(input.limit || 20, 100), // Máximo 100 por página
    };

    return await this.conversationRepository.findConversationsByUser(validatedInput);
  }

  async addMessage(input: ICreateMessageInput): Promise<IConversationMessageOutput> {
    // Verificar se a conversa existe e está ativa
    const conversation = await this.conversationRepository.findConversationById(
      input.conversationId,
      0, // Não validamos userId aqui pois pode ser mensagem do sistema
    );

    if (!conversation) {
      throw new Error('Conversation not found or inactive');
    }

    if (!conversation.isActive) {
      throw new Error('Conversation not found or inactive');
    }

    // Criar mensagem
    const message = await this.conversationRepository.createMessage(input);

    // Atualizar contador de mensagens da conversa
    await this.conversationRepository.incrementMessageCount(input.conversationId);
    await this.conversationRepository.updateLastMessageTime(input.conversationId);

    return message;
  }

  async getMessages(input: IGetMessagesInput): Promise<IMessageListOutput> {
    // Verificar acesso à conversa
    const conversation = await this.conversationRepository.findConversationById(
      input.conversationId,
      input.userId,
    );

    if (!conversation) {
      throw new Error('Conversation not found or access denied');
    }

    // Validações e defaults
    const validatedInput = {
      ...input,
      page: input.page || 1,
      limit: Math.min(input.limit || 50, 200), // Máximo 200 mensagens por página
    };

    return await this.conversationRepository.findMessagesByConversation(validatedInput);
  }

  async sendMessage(input: IChatCompletionInput): Promise<IChatCompletionOutput> {
    // Verificar se a conversa existe e pertence ao usuário
    const conversation = await this.conversationRepository.findConversationById(
      input.conversationId,
      input.userId,
    );

    if (!conversation) {
      throw new Error('Conversation not found or access denied');
    }

    if (!conversation.isActive) {
      throw new Error('Cannot send message to inactive conversation');
    }

    // 1. Salvar mensagem do usuário
    const userMessage = await this.addMessage({
      conversationId: input.conversationId,
      content: input.message,
      role: MessageRole.USER,
    });

    try {
      // 2. Chamar OpenAI (simulado - aqui você integraria com a API real)
      const openaiResponse = await this.callOpenAI(input);

      // 3. Salvar resposta do assistente
      const assistantMessage = await this.addMessage({
        conversationId: input.conversationId,
        content: openaiResponse.content,
        role: MessageRole.ASSISTANT,
        metadata: {
          model: openaiResponse.model,
          tokensUsed: openaiResponse.tokensUsed,
          temperature: input.temperature,
          maxTokens: input.maxTokens,
        },
        tokensUsed: openaiResponse.tokensUsed,
        model: openaiResponse.model,
        finishReason: openaiResponse.finishReason,
      });

      // 4. Calcular custo
      const cost = this.calculateCost(openaiResponse.tokensUsed, openaiResponse.model);

      // 5. Buscar conversa atualizada
      const updatedConversation = await this.conversationRepository.findConversationById(
        input.conversationId,
        input.userId,
      );

      return {
        message: assistantMessage,
        conversation: updatedConversation!,
        tokensUsed: openaiResponse.tokensUsed,
        cost,
      };
    } catch (error) {
      // Em caso de erro, salvar mensagem de erro do sistema
      await this.addMessage({
        conversationId: input.conversationId,
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        role: MessageRole.SYSTEM,
      });

      throw error;
    }
  }

  async getStats(userId: number): Promise<IConversationStatsOutput> {
    return await this.conversationRepository.getConversationStats(userId);
  }

  async getTokenUsage(userId: number, startDate?: Date, endDate?: Date): Promise<number> {
    return await this.conversationRepository.getTokenUsageByUser(userId, startDate, endDate);
  }

  // Métodos privados auxiliares
  private generateDefaultTitle(): string {
    const now = new Date();
    return `Conversa ${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  }

  private async callOpenAI(input: IChatCompletionInput): Promise<{
    content: string;
    model: string;
    tokensUsed: number;
    finishReason: string;
  }> {
    // SIMULAÇÃO - Em produção, aqui você faria a chamada real para OpenAI
    // Exemplo de integração:
    /*
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: input.model || 'gpt-4',
      messages: await this.buildMessageHistory(input.conversationId, input.message),
      temperature: input.temperature || 0.7,
      max_tokens: input.maxTokens || 1000,
    });
    */

    // Simulação para desenvolvimento
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simula latência da API

    return {
      content: `Esta é uma resposta simulada para: "${input.message}". Em produção, aqui seria a resposta real da OpenAI.`,
      model: input.model || 'gpt-4',
      tokensUsed: Math.floor(Math.random() * 100) + 50, // Tokens aleatórios para simulação
      finishReason: 'stop',
    };
  }

  private calculateCost(tokensUsed: number, model: string): number {
    // Custos aproximados por modelo (em USD por token)
    const costs: Record<string, number> = {
      'gpt-4': 0.00003,
      'gpt-4-turbo': 0.00001,
      'gpt-3.5-turbo': 0.000002,
    };

    const costPerToken = costs[model] || costs['gpt-4'];
    return tokensUsed * costPerToken;
  }
}
