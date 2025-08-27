export interface ICreateSessionInput {
  instanceName: string;
  remoteJid: string;
  status?: 'opened' | 'paused' | 'closed';
  context?: string;
}

export interface IChangeSessionStatusInput {
  instanceName: string;
  remoteJid: string;
  status: 'opened' | 'paused' | 'closed';
}

export interface IGetSessionsInput {
  instanceName: string;
  status?: 'opened' | 'paused' | 'closed' | 'all';
  limit?: number;
  offset?: number;
}

export interface IUpdateSessionContextInput {
  instanceName: string;
  remoteJid: string;
  context: string;
}
