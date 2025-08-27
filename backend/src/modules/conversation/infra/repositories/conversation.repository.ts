import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { IConversationRepository } from '../../domain/repositories/conversation-repository.contract';
import {
  ICreateConversationInput,
  IUpdateConversationInput,
  ICreateMessageInput,
  IGetConversationsInput,
  IGetMessagesInput
} from '../../domain/contracts/input/conversation-input.contract';
import {
  IConversationOutput,
  IConversationMessageOutput,
  IConversationListOutput,
  IMessageListOutput,
  IConversationStatsOutput
} from '../../domain/contracts/output/conversation-output.contract';
import { PRISMA_CLIENT_TOKEN } from '../../../../shared/constants/di-constants';

@Injectable()
export class ConversationRepository implements IConversationRepository {
  constructor(
    @Inject(PRISMA_CLIENT_TOKEN)
    private readonly prisma: PrismaClient,
  ) {}

  async createConversation(input: ICreateConversationInput): Promise<IConversationOutput> {
    const conversation = await this.prisma.conversation.create({
      data: {
        id: uuidv4(),
        userId: input.userId,
        title: input.title || null,
        context: input.context || null,
        isActive: true,
        totalMessages: 0,
      },
    });

    return this.mapConversationToOutput(conversation);
  }

  async updateConversation(input: IUpdateConversationInput): Promise<IConversationOutput> {
    const updateData: any = {};
    
    if (input.title !== undefined) updateData.title = input.title;
    if (input.context !== undefined) updateData.context = input.context;
    if (input.isActive !== undefined) updateData.isActive = input.isActive;

    const conversation = await this.prisma.conversation.update({
      where: {
        id: input.conversationId,
        userId: input.userId, // Garante que só o dono pode atualizar
      },
      data: updateData,
    });

    return this.mapConversationToOutput(conversation);
  }

  async deleteConversation(conversationId: string, userId: number): Promise<void> {
    // Soft delete - apenas desativa a conversa
    await this.prisma.conversation.update({
      where: {
        id: conversationId,
        userId: userId,
      },
      data: {
        isActive: false,
      },
    });
  }

  async findConversationById(conversationId: string, userId: number): Promise<IConversationOutput | null> {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        ...(userId > 0 && { userId }), // Se userId for 0, não filtra por usuário (para mensagens do sistema)
      },
    });

    if (!conversation) return null;

    return this.mapConversationToOutput(conversation);
  }

  async findConversationsByUser(input: IGetConversationsInput): Promise<IConversationListOutput> {
    const { userId, page = 1, limit = 20, isActive, search } = input;
    const skip = (page - 1) * limit;

    const where: any = {
      userId,
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [conversations, total] = await Promise.all([
      this.prisma.conversation.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.conversation.count({ where }),
    ]);

    return {
      conversations: conversations.map(this.mapConversationToOutput),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createMessage(input: ICreateMessageInput): Promise<IConversationMessageOutput> {
    const message = await this.prisma.conversationMessage.create({
      data: {
        id: uuidv4(),
        conversationId: input.conversationId,
        content: input.content,
        role: input.role,
        metadata: input.metadata || undefined,
        openaiMessageId: input.openaiMessageId || null,
        tokensUsed: input.tokensUsed || null,
        model: input.model || null,
        finishReason: input.finishReason || null,
      },
    });

    return this.mapMessageToOutput(message);
  }

  async findMessagesByConversation(input: IGetMessagesInput): Promise<IMessageListOutput> {
    const { conversationId, page = 1, limit = 50, role } = input;
    const skip = (page - 1) * limit;

    const where: any = {
      conversationId,
      ...(role && { role }),
    };

    const [messages, total] = await Promise.all([
      this.prisma.conversationMessage.findMany({
        where,
        orderBy: { createdAt: 'asc' }, // Mensagens em ordem cronológica
        skip,
        take: limit,
      }),
      this.prisma.conversationMessage.count({ where }),
    ]);

    return {
      messages: messages.map(this.mapMessageToOutput),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findMessageById(messageId: string): Promise<IConversationMessageOutput | null> {
    const message = await this.prisma.conversationMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) return null;

    return this.mapMessageToOutput(message);
  }

  async getConversationStats(userId: number): Promise<IConversationStatsOutput> {
    const [
      totalConversations,
      activeConversations,
      totalMessages,
      tokenStats,
    ] = await Promise.all([
      this.prisma.conversation.count({
        where: { userId },
      }),
      this.prisma.conversation.count({
        where: { userId, isActive: true },
      }),
      this.prisma.conversationMessage.count({
        where: {
          conversation: { userId },
        },
      }),
      this.prisma.conversationMessage.aggregate({
        where: {
          conversation: { userId },
          tokensUsed: { not: null },
        },
        _sum: { tokensUsed: true },
      }),
    ]);

    const totalTokensUsed = tokenStats._sum.tokensUsed || 0;
    const estimatedCost = this.calculateEstimatedCost(totalTokensUsed);
    const averageMessagesPerConversation = totalConversations > 0 
      ? Math.round(totalMessages / totalConversations * 100) / 100
      : 0;

    return {
      totalConversations,
      activeConversations,
      totalMessages,
      totalTokensUsed,
      estimatedCost,
      averageMessagesPerConversation,
    };
  }

  async getTokenUsageByUser(userId: number, startDate?: Date, endDate?: Date): Promise<number> {
    const where: any = {
      conversation: { userId },
      tokensUsed: { not: null },
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const result = await this.prisma.conversationMessage.aggregate({
      where,
      _sum: { tokensUsed: true },
    });

    return result._sum.tokensUsed || 0;
  }

  async incrementMessageCount(conversationId: string): Promise<void> {
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        totalMessages: { increment: 1 },
      },
    });
  }

  async updateLastMessageTime(conversationId: string): Promise<void> {
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  // Métodos auxiliares privados
  private mapConversationToOutput(conversation: any): IConversationOutput {
    return {
      id: conversation.id,
      userId: conversation.userId,
      title: conversation.title,
      context: conversation.context,
      isActive: conversation.isActive,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      totalMessages: conversation.totalMessages,
      lastMessageAt: conversation.lastMessageAt,
    };
  }

  private mapMessageToOutput(message: any): IConversationMessageOutput {
    return {
      id: message.id,
      conversationId: message.conversationId,
      content: message.content,
      role: message.role,
      createdAt: message.createdAt,
      metadata: message.metadata,
      openaiMessageId: message.openaiMessageId,
      tokensUsed: message.tokensUsed,
      model: message.model,
      finishReason: message.finishReason,
    };
  }

  private calculateEstimatedCost(totalTokens: number): number {
    // Custo médio estimado por token (mistura de modelos)
    const averageCostPerToken = 0.00001; // $0.00001 por token
    return totalTokens * averageCostPerToken;
  }
}
