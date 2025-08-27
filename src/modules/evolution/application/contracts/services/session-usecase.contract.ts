import { ICreateSessionInput, IChangeSessionStatusInput, IGetSessionsInput, IUpdateSessionContextInput } from '../../../domain/contracts/input/session-input.contract';
import { ISessionOutput, ISessionListOutput } from '../../../domain/contracts/output/session-output.contract';

export interface ISessionUseCase {
  createSession(input: ICreateSessionInput): Promise<ISessionOutput>;
  changeSessionStatus(input: IChangeSessionStatusInput): Promise<ISessionOutput>;
  getSessions(input: IGetSessionsInput): Promise<ISessionListOutput>;
  getSession(instanceName: string, remoteJid: string): Promise<ISessionOutput | null>;
  updateSessionContext(input: IUpdateSessionContextInput): Promise<ISessionOutput>;
  deleteSession(instanceName: string, remoteJid: string): Promise<void>;
  getSessionStats(instanceName: string): Promise<{
    total: number;
    opened: number;
    paused: number;
    closed: number;
    totalMessages: number;
  }>;
}
