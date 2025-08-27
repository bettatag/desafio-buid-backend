import { EvolutionInstanceEntity } from '../entities/evolution-instance.entity';

export interface IInstanceManagementRepository {
  findAll(filters?: { instanceName?: string; status?: string }): Promise<EvolutionInstanceEntity[]>;
  findByName(instanceName: string): Promise<EvolutionInstanceEntity | null>;
  connect(instanceName: string): Promise<{ status: string; qrcode?: string }>;
  getConnectionState(instanceName: string): Promise<{ state: string }>;
  logout(instanceName: string): Promise<{ message: string }>;
  delete(instanceName: string): Promise<{ message: string }>;
  restart(instanceName: string): Promise<{ message: string }>;
  updateSettings(instanceName: string, settings: any): Promise<EvolutionInstanceEntity>;
}
