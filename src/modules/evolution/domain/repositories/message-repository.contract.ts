import { ISendTextMessageInput, ISendMediaMessageInput, IWebhookEventInput } from '../contracts/input/send-message-input.contract';
import { ISendMessageOutput, IMessageOutput } from '../contracts/output/message-output.contract';

export interface IMessageRepository {
  sendTextMessage(input: ISendTextMessageInput): Promise<ISendMessageOutput>;
  sendMediaMessage(input: ISendMediaMessageInput): Promise<ISendMessageOutput>;
  processWebhookEvent(input: IWebhookEventInput): Promise<void>;
  getMessageHistory(instanceName: string, contactNumber: string, limit?: number): Promise<IMessageOutput[]>;
  markAsRead(instanceName: string, messageId: string): Promise<void>;
}

