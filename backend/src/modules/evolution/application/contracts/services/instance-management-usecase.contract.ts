import { EvolutionInstanceEntity } from '../../../domain/entities/evolution-instance.entity';

export interface IConnectInstanceInput {
  instanceName: string;
}

export interface IConnectionStateInput {
  instanceName: string;
}

export interface ILogoutInstanceInput {
  instanceName: string;
}

export interface IDeleteInstanceInput {
  instanceName: string;
}

export interface IRestartInstanceInput {
  instanceName: string;
}

export interface IGetSettingsInput {
  instanceName: string;
}

export interface IUpdateSettingsInput {
  instanceName: string;
  settings: {
    webhook?: string;
    webhook_by_events?: boolean;
    events?: string[];
    reject_call?: boolean;
    msg_call?: string;
    groups_ignore?: boolean;
    always_online?: boolean;
    read_messages?: boolean;
    read_status?: boolean;
    websocket_enabled?: boolean;
    websocket_events?: string[];
    proxy?: {
      host?: string;
      port?: string;
      protocol?: 'http' | 'https';
      username?: string;
      password?: string;
    };
  };
}

export interface IInstanceManagementUseCase {
  connect(input: IConnectInstanceInput): Promise<{ status: string; qrcode?: string }>;
  getConnectionState(input: IConnectionStateInput): Promise<{ state: string }>;
  logout(input: ILogoutInstanceInput): Promise<{ message: string }>;
  delete(input: IDeleteInstanceInput): Promise<{ message: string }>;
  restart(input: IRestartInstanceInput): Promise<{ message: string }>;
  getSettings(input: IGetSettingsInput): Promise<EvolutionInstanceEntity>;
  updateSettings(input: IUpdateSettingsInput): Promise<EvolutionInstanceEntity>;
}
