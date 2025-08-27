import { Injectable, Inject } from '@nestjs/common';
import { INSTANCE_MANAGEMENT_REPOSITORY_TOKEN } from '../../../../shared/constants/di-constants';
import { IInstanceManagementRepository } from '../../domain/repositories/instance-management-repository.contract';
import { EvolutionInstanceEntity } from '../../domain/entities/evolution-instance.entity';
import {
  IFetchInstancesInput,
  IFetchInstancesUseCase,
} from '../contracts/services/fetch-instances-usecase.contract';

@Injectable()
export class FetchInstancesUseCase implements IFetchInstancesUseCase {
  constructor(
    @Inject(INSTANCE_MANAGEMENT_REPOSITORY_TOKEN)
    private readonly instanceRepository: IInstanceManagementRepository,
  ) {}

  async execute(input?: IFetchInstancesInput): Promise<EvolutionInstanceEntity[]> {
    const filters = input
      ? {
          instanceName: input.instanceName,
          status: input.status,
        }
      : undefined;

    return await this.instanceRepository.findAll(filters);
  }
}
