export interface IMessageOutput {
  id: string;
  timestamp: number;
  from: string;
  to: string;
  content: string;
  type: string;
  status: string;
  fromMe: boolean;
  instanceName: string;
}

export interface ISendMessageOutput {
  messageId: string;
  status: 'sent' | 'pending' | 'failed';
  timestamp: number;
  instanceName: string;
  to: string;
}

