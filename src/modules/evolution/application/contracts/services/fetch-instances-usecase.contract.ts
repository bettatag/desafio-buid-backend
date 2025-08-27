import { EvolutionInstanceEntity } from '../../../domain/entities/evolution-instance.entity';

export interface IFetchInstancesInput {
  instanceName?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'CONNECTING' | 'DISCONNECTED';
}

export interface IFetchInstancesUseCase {
  execute(input?: IFetchInstancesInput): Promise<EvolutionInstanceEntity[]>;
}
