import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { MESSAGE_REPOSITORY_TOKEN } from '../../../../shared/constants/di-constants';
import { IMessageRepository } from '../../domain/repositories/message-repository.contract';
import { IMessageUseCase } from '../contracts/Services/message-usecase.contract';
import { ISendTextMessageInput, ISendMediaMessageInput, IWebhookEventInput } from '../../domain/contracts/input/send-message-input.contract';
import { ISendMessageOutput, IMessageOutput } from '../../domain/contracts/output/message-output.contract';

@Injectable()
export class MessageUseCase implements IMessageUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY_TOKEN)
    private readonly messageRepository: IMessageRepository,
  ) {}

  async sendTextMessage(input: ISendTextMessageInput): Promise<ISendMessageOutput> {
    try {
      // Validar se a instância existe e está conectada
      if (!input.instanceName) {
        throw new HttpException('Nome da instância é obrigatório', HttpStatus.BAD_REQUEST);
      }

      if (!input.number || !input.text) {
        throw new HttpException('Número e texto são obrigatórios', HttpStatus.BAD_REQUEST);
      }

      // Normalizar número do telefone
      const normalizedNumber = this.normalizePhoneNumber(input.number);
      const normalizedInput = {
        ...input,
        number: normalizedNumber,
      };

      return await this.messageRepository.sendTextMessage(normalizedInput);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao enviar mensagem de texto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendMediaMessage(input: ISendMediaMessageInput): Promise<ISendMessageOutput> {
    try {
      // Validar se a instância existe e está conectada
      if (!input.instanceName) {
        throw new HttpException('Nome da instância é obrigatório', HttpStatus.BAD_REQUEST);
      }

      if (!input.number || !input.mediaUrl || !input.mediaType) {
        throw new HttpException('Número, URL da mídia e tipo são obrigatórios', HttpStatus.BAD_REQUEST);
      }

      // Validar tipo de mídia
      const validMediaTypes = ['image', 'video', 'audio', 'document'];
      if (!validMediaTypes.includes(input.mediaType)) {
        throw new HttpException('Tipo de mídia inválido', HttpStatus.BAD_REQUEST);
      }

      // Normalizar número do telefone
      const normalizedNumber = this.normalizePhoneNumber(input.number);
      const normalizedInput = {
        ...input,
        number: normalizedNumber,
      };

      return await this.messageRepository.sendMediaMessage(normalizedInput);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao enviar mensagem de mídia',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async processWebhookEvent(input: IWebhookEventInput): Promise<void> {
    try {
      // Processar diferentes tipos de eventos
      switch (input.event) {
        case 'messages.upsert':
          await this.handleMessageReceived(input);
          break;
        case 'connection.update':
          await this.handleConnectionUpdate(input);
          break;
        case 'qr.updated':
          await this.handleQRUpdate(input);
          break;
        default:
          console.log(`Evento não tratado: ${input.event}`);
      }

      await this.messageRepository.processWebhookEvent(input);
    } catch (error) {
      console.error('Erro ao processar evento webhook:', error);
      throw new HttpException(
        'Erro interno ao processar evento webhook',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMessageHistory(instanceName: string, contactNumber: string, limit?: number): Promise<IMessageOutput[]> {
    try {
      if (!instanceName || !contactNumber) {
        throw new HttpException('Nome da instância e número do contato são obrigatórios', HttpStatus.BAD_REQUEST);
      }

      const normalizedNumber = this.normalizePhoneNumber(contactNumber);
      return await this.messageRepository.getMessageHistory(instanceName, normalizedNumber, limit);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao buscar histórico de mensagens',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async markAsRead(instanceName: string, messageId: string): Promise<void> {
    try {
      if (!instanceName || !messageId) {
        throw new HttpException('Nome da instância e ID da mensagem são obrigatórios', HttpStatus.BAD_REQUEST);
      }

      await this.messageRepository.markAsRead(instanceName, messageId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao marcar mensagem como lida',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private normalizePhoneNumber(number: string): string {
    // Remove caracteres especiais e espaços
    let normalized = number.replace(/[^\d]/g, '');

    // Se não começar com código do país, assume Brasil (55)
    if (normalized.length === 11 && !normalized.startsWith('55')) {
      normalized = '55' + normalized;
    }

    // Adiciona sufixo do WhatsApp se necessário
    if (!normalized.includes('@')) {
      normalized = normalized + '@s.whatsapp.net';
    }

    return normalized;
  }

  private async handleMessageReceived(input: IWebhookEventInput): Promise<void> {
    // Lógica para processar mensagem recebida
    console.log(`Mensagem recebida na instância ${input.instance.instanceName}:`, input.data);
  }

  private async handleConnectionUpdate(input: IWebhookEventInput): Promise<void> {
    // Lógica para processar atualização de conexão
    console.log(`Status de conexão atualizado para ${input.instance.instanceName}:`, input.instance.status);
  }

  private async handleQRUpdate(input: IWebhookEventInput): Promise<void> {
    // Lógica para processar atualização de QR Code
    console.log(`QR Code atualizado para ${input.instance.instanceName}`);
  }
}

