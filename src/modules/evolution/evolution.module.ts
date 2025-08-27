import { Module } from '@nestjs/common';
import { PrismaService } from '../../infra/db/prisma.service';
import { CREATE_INSTANCE_USE_CASE_TOKEN } from '../../shared/constants/di-constants';
import { CreateEvolutionInstanceUseCase } from './application/use-cases/create-instance-usecase';
import { EvolutionController } from './presentation/controllers/evolution.controller';
@Module({
  controllers: [EvolutionController],
  providers: [
    PrismaService,
    {
      provide: CREATE_INSTANCE_USE_CASE_TOKEN,
      useClass: CreateEvolutionInstanceUseCase,
    },
  ],
  exports: [CREATE_INSTANCE_USE_CASE_TOKEN],
})
export class EvolutionModule {}
