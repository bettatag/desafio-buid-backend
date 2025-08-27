export interface ISendTextMessageInput {
  instanceName: string;
  number: string;
  text: string;
  options?: {
    delay?: number;
    presence?: 'composing' | 'recording' | 'paused';
  };
  quoted?: string;
  mentions?: string[];
}

export interface ISendMediaMessageInput {
  instanceName: string;
  number: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'audio' | 'document';
  caption?: string;
  fileName?: string;
  options?: {
    delay?: number;
    presence?: 'composing' | 'recording' | 'paused';
  };
}

export interface IWebhookEventInput {
  event: string;
  instance: {
    instanceName: string;
    status: string;
  };
  data?: {
    id: string;
    timestamp: number;
    from: string;
    text: string;
    type: string;
    fromMe: boolean;
  };
  payload?: any;
}

