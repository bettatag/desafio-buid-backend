import { ISendTextMessageInput, ISendMediaMessageInput, IWebhookEventInput } from '../../../domain/contracts/input/send-message-input.contract';
import { ISendMessageOutput, IMessageOutput } from '../../../domain/contracts/output/message-output.contract';

export interface IMessageUseCase {
  sendTextMessage(input: ISendTextMessageInput): Promise<ISendMessageOutput>;
  sendMediaMessage(input: ISendMediaMessageInput): Promise<ISendMessageOutput>;
  processWebhookEvent(input: IWebhookEventInput): Promise<void>;
  getMessageHistory(instanceName: string, contactNumber: string, limit?: number): Promise<IMessageOutput[]>;
  markAsRead(instanceName: string, messageId: string): Promise<void>;
}

