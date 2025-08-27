export interface ISessionOutput {
  id: string;
  instanceName: string;
  remoteJid: string;
  status: 'opened' | 'paused' | 'closed';
  context: string;
  createdAt: number;
  updatedAt: number;
  lastMessageAt?: number;
  messageCount: number;
}

export interface ISessionListOutput {
  sessions: ISessionOutput[];
  total: number;
  page?: number;
  limit?: number;
}
