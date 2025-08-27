import { Module } from '@nestjs/common';
import {
  CREATE_INSTANCE_USE_CASE_TOKEN,
  CREATE_EVOLUTION_INSTANCE_REPOSITORY_TOKEN,
  FETCH_INSTANCES_USE_CASE_TOKEN,
  INSTANCE_MANAGEMENT_USE_CASE_TOKEN,
  INSTANCE_MANAGEMENT_REPOSITORY_TOKEN,
  MESSAGE_USE_CASE_TOKEN,
  MESSAGE_REPOSITORY_TOKEN,
  SESSION_USE_CASE_TOKEN,
  SESSION_REPOSITORY_TOKEN,
} from '../../shared/constants/di-constants';
import { CreateEvolutionInstanceUseCase } from './application/use-cases/create-instance-usecase';
import { FetchInstancesUseCase } from './application/use-cases/fetch-instances-usecase';
import { InstanceManagementUseCase } from './application/use-cases/instance-management-usecase';
import { MessageUseCase } from './application/use-cases/message-usecase';
import { SessionUseCase } from './application/use-cases/session-usecase';
import { CreateEvolutionInstanceRepository } from './infra/repositories/create-evolution-instance.repository';
import { InstanceManagementRepository } from './infra/repositories/instance-management.repository';
import { MessageRepository } from './infra/repositories/message.repository';
import { SessionRepository } from './infra/repositories/session.repository';
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
    {
      provide: MESSAGE_USE_CASE_TOKEN,
      useClass: MessageUseCase,
    },
    {
      provide: MESSAGE_REPOSITORY_TOKEN,
      useClass: MessageRepository,
    },
    {
      provide: SESSION_USE_CASE_TOKEN,
      useClass: SessionUseCase,
    },
    {
      provide: SESSION_REPOSITORY_TOKEN,
      useClass: SessionRepository,
    },
  ],
  exports: [
    CREATE_INSTANCE_USE_CASE_TOKEN,
    CREATE_EVOLUTION_INSTANCE_REPOSITORY_TOKEN,
    FETCH_INSTANCES_USE_CASE_TOKEN,
    INSTANCE_MANAGEMENT_USE_CASE_TOKEN,
    INSTANCE_MANAGEMENT_REPOSITORY_TOKEN,
    MESSAGE_USE_CASE_TOKEN,
    MESSAGE_REPOSITORY_TOKEN,
    SESSION_USE_CASE_TOKEN,
    SESSION_REPOSITORY_TOKEN,
  ],
})
export class EvolutionModule {}
