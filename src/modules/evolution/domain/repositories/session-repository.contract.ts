import { ICreateSessionInput, IChangeSessionStatusInput, IGetSessionsInput, IUpdateSessionContextInput } from '../contracts/input/session-input.contract';
import { ISessionOutput, ISessionListOutput } from '../contracts/output/session-output.contract';

export interface ISessionRepository {
  createSession(input: ICreateSessionInput): Promise<ISessionOutput>;
  changeSessionStatus(input: IChangeSessionStatusInput): Promise<ISessionOutput>;
  getSessions(input: IGetSessionsInput): Promise<ISessionListOutput>;
  getSession(instanceName: string, remoteJid: string): Promise<ISessionOutput | null>;
  updateSessionContext(input: IUpdateSessionContextInput): Promise<ISessionOutput>;
  deleteSession(instanceName: string, remoteJid: string): Promise<void>;
  incrementMessageCount(instanceName: string, remoteJid: string): Promise<void>;
  updateLastMessageTimestamp(instanceName: string, remoteJid: string): Promise<void>;
}
