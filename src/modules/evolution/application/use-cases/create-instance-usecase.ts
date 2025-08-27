import { Injectable, Inject } from '@nestjs/common';
import { CREATE_EVOLUTION_INSTANCE_REPOSITORY_TOKEN } from 'src/shared/constants/di-constants';
import { ICreateEvolutionInstanceRepository } from '../../domain/repositories/create-evolution-instance-repository.contract';
import { ICreateInstanceUseCaseInput } from '../contracts/input/create-instance-usecase-input.contract';
import { ICreateInstanceUseCaseOutput } from '../contracts/output/create-instance-usecase-output.contract';
import { ICreateInstanceUseCase } from '../contracts/Services/create-instance-usecase.contract';

@Injectable()
export class CreateEvolutionInstanceUseCase implements ICreateInstanceUseCase {
  constructor(
    @Inject(CREATE_EVOLUTION_INSTANCE_REPOSITORY_TOKEN)
    private readonly createEvolutionInstanceRepository: ICreateEvolutionInstanceRepository,
  ) {}

  async create(
    createInstanceUseCaseInput: ICreateInstanceUseCaseInput,
  ): Promise<ICreateInstanceUseCaseOutput> {
    return await this.createEvolutionInstanceRepository.create(createInstanceUseCaseInput);
  }
}
