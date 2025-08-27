import { Module } from '@nestjs/common';
import {
  CREATE_INSTANCE_USE_CASE_TOKEN,
  CREATE_EVOLUTION_INSTANCE_REPOSITORY_TOKEN,
} from '../../shared/constants/di-constants';
import { CreateEvolutionInstanceUseCase } from './application/use-cases/create-instance-usecase';
import { CreateEvolutionInstanceRepository } from './infra/repositories/create-evolution-instance.repository';
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
  ],
  exports: [CREATE_INSTANCE_USE_CASE_TOKEN, CREATE_EVOLUTION_INSTANCE_REPOSITORY_TOKEN],
})
export class EvolutionModule {}
