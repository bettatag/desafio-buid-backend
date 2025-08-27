import { Injectable } from '@nestjs/common';
import {
  ISendTextMessageInput,
  ISendMediaMessageInput,
  IWebhookEventInput,
} from '../../domain/contracts/input/send-message-input.contract';
import {
  ISendMessageOutput,
  IMessageOutput,
} from '../../domain/contracts/output/message-output.contract';
import { IMessageRepository } from '../../domain/repositories/message-repository.contract';

@Injectable()
export class MessageRepository implements IMessageRepository {
  private messages: IMessageOutput[] = [
    {
      id: 'msg-1',
      timestamp: Date.now() - 3600000,
      from: '5511999999999@s.whatsapp.net',
      to: '5511888888888@s.whatsapp.net',
      content: 'Olá! Como você está?',
      type: 'text',
      status: 'delivered',
      fromMe: false,
      instanceName: 'bot-ia-teste',
    },
    {
      id: 'msg-2',
      timestamp: Date.now() - 3500000,
      from: '5511888888888@s.whatsapp.net',
      to: '5511999999999@s.whatsapp.net',
      content: 'Olá! Estou bem, obrigado por perguntar!',
      type: 'text',
      status: 'read',
      fromMe: true,
      instanceName: 'bot-ia-teste',
    },
    {
      id: 'msg-3',
      timestamp: Date.now() - 1800000,
      from: '5511777777777@s.whatsapp.net',
      to: '5511888888888@s.whatsapp.net',
      content: 'Preciso de ajuda com meu pedido',
      type: 'text',
      status: 'delivered',
      fromMe: false,
      instanceName: 'bot-ia-teste',
    },
  ];

  private webhookEvents: IWebhookEventInput[] = [];

  async sendTextMessage(input: ISendTextMessageInput): Promise<ISendMessageOutput> {
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = Date.now();

    // Simular delay se especificado
    if (input.options?.delay) {
      await new Promise((resolve) => setTimeout(resolve, input.options!.delay));
    }

    // Adicionar mensagem ao histórico
    const message: IMessageOutput = {
      id: messageId,
      timestamp,
      from: `${input.instanceName}@bot`,
      to: input.number,
      content: input.text,
      type: 'text',
      status: 'sent',
      fromMe: true,
      instanceName: input.instanceName,
    };

    this.messages.push(message);

    // Simular resposta automática do bot (se configurado)
    setTimeout(() => {
      this.simulateAutoReply(input.instanceName, input.number, input.text);
    }, 2000);

    return {
      messageId,
      status: 'sent',
      timestamp,
      instanceName: input.instanceName,
      to: input.number,
    };
  }

  async sendMediaMessage(input: ISendMediaMessageInput): Promise<ISendMessageOutput> {
    const messageId = `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = Date.now();

    // Simular delay se especificado
    if (input.options?.delay) {
      await new Promise((resolve) => setTimeout(resolve, input.options!.delay));
    }

    // Adicionar mensagem de mídia ao histórico
    const message: IMessageOutput = {
      id: messageId,
      timestamp,
      from: `${input.instanceName}@bot`,
      to: input.number,
      content:
        input.caption || `[${input.mediaType.toUpperCase()}] ${input.fileName || 'Media file'}`,
      type: input.mediaType,
      status: 'sent',
      fromMe: true,
      instanceName: input.instanceName,
    };

    this.messages.push(message);

    return {
      messageId,
      status: 'sent',
      timestamp,
      instanceName: input.instanceName,
      to: input.number,
    };
  }

  async processWebhookEvent(input: IWebhookEventInput): Promise<void> {
    // Armazenar evento para auditoria
    this.webhookEvents.push({
      ...input,
      payload: {
        ...input.payload,
        processedAt: new Date().toISOString(),
      },
    });

    // Processar mensagem recebida
    if (input.event === 'messages.upsert' && input.data) {
      const message: IMessageOutput = {
        id: input.data.id,
        timestamp: input.data.timestamp,
        from: input.data.from,
        to: `${input.instance.instanceName}@bot`,
        content: input.data.text,
        type: input.data.type,
        status: 'received',
        fromMe: input.data.fromMe,
        instanceName: input.instance.instanceName,
      };

      this.messages.push(message);
    }
  }

  async getMessageHistory(
    instanceName: string,
    contactNumber: string,
    limit = 50,
  ): Promise<IMessageOutput[]> {
    // Filtrar mensagens por instância e contato
    const filteredMessages = this.messages
      .filter(
        (msg) =>
          msg.instanceName === instanceName &&
          (msg.from === contactNumber || msg.to === contactNumber),
      )
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);

    return filteredMessages;
  }

  async markAsRead(instanceName: string, messageId: string): Promise<void> {
    const messageIndex = this.messages.findIndex(
      (msg) => msg.id === messageId && msg.instanceName === instanceName,
    );

    if (messageIndex !== -1) {
      this.messages[messageIndex] = {
        ...this.messages[messageIndex],
        status: 'read',
      };
    }
  }

  // Método auxiliar para simular resposta automática
  private async simulateAutoReply(
    instanceName: string,
    contactNumber: string,
    receivedText: string,
  ): Promise<void> {
    // Simular resposta automática baseada no texto recebido
    let autoReply = '';

    if (receivedText.toLowerCase().includes('olá') || receivedText.toLowerCase().includes('oi')) {
      autoReply = 'Olá! Como posso ajudá-lo hoje?';
    } else if (receivedText.toLowerCase().includes('ajuda')) {
      autoReply = 'Claro! Estou aqui para ajudar. O que você precisa?';
    } else if (
      receivedText.toLowerCase().includes('tchau') ||
      receivedText.toLowerCase().includes('bye')
    ) {
      autoReply = 'Até logo! Foi um prazer conversar com você!';
    } else {
      autoReply = 'Interessante! Pode me contar mais sobre isso?';
    }

    // Adicionar resposta automática
    const replyMessage: IMessageOutput = {
      id: `auto-reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      from: `${instanceName}@bot`,
      to: contactNumber,
      content: autoReply,
      type: 'text',
      status: 'sent',
      fromMe: true,
      instanceName,
    };

    this.messages.push(replyMessage);
  }

  // Método para obter estatísticas (útil para debugging)
  getStats() {
    return {
      totalMessages: this.messages.length,
      totalWebhookEvents: this.webhookEvents.length,
      messagesByInstance: this.messages.reduce(
        (acc, msg) => {
          acc[msg.instanceName] = (acc[msg.instanceName] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }
}
