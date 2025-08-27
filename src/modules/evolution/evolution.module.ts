import { Module } from '@nestjs/common';
import {
  CREATE_INSTANCE_USE_CASE_TOKEN,
  CREATE_EVOLUTION_INSTANCE_REPOSITORY_TOKEN,
  FETCH_INSTANCES_USE_CASE_TOKEN,
  INSTANCE_MANAGEMENT_USE_CASE_TOKEN,
  INSTANCE_MANAGEMENT_REPOSITORY_TOKEN,
} from '../../shared/constants/di-constants';
import { CreateEvolutionInstanceUseCase } from './application/use-cases/create-instance-usecase';
import { CreateEvolutionInstanceRepository } from './infra/repositories/create-evolution-instance.repository';
import { FetchInstancesUseCase } from './application/use-cases/fetch-instances-usecase';
import { InstanceManagementUseCase } from './application/use-cases/instance-management-usecase';
import { InstanceManagementRepository } from './infra/repositories/instance-management.repository';
import { EvolutionController } from './presentation/controllers/evolution.controller';

@Module({
  controllers: [EvolutionController],
  providers: [
    {
      provide: CREATE_INSTANCE_USE_CASE_TOKEN,
      useClass: CreateEvolutionInstanceUseCase,
    },
    {
      provide: CREATE_EVOLUTION_INSTANCE_REPOSITORY_TOKEN,
      useClass: CreateEvolutionInstanceRepository,
    },
    {
      provide: FETCH_INSTANCES_USE_CASE_TOKEN,
      useClass: FetchInstancesUseCase,
    },
    {
      provide: INSTANCE_MANAGEMENT_USE_CASE_TOKEN,
      useClass: InstanceManagementUseCase,
    },
    {
      provide: INSTANCE_MANAGEMENT_REPOSITORY_TOKEN,
      useClass: InstanceManagementRepository,
    },
  ],
  exports: [
    CREATE_INSTANCE_USE_CASE_TOKEN,
    CREATE_EVOLUTION_INSTANCE_REPOSITORY_TOKEN,
    FETCH_INSTANCES_USE_CASE_TOKEN,
    INSTANCE_MANAGEMENT_USE_CASE_TOKEN,
    INSTANCE_MANAGEMENT_REPOSITORY_TOKEN,
  ],
})
export class EvolutionModule {}
