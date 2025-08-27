import { ICreateEvolutionInstanceRepository } from '../../../domain/repositories/create-evolution-instance-repository.contract';
import { ICreateInstanceUseCaseInput } from '../input/create-instance-usecase-input.contract';
import { ICreateInstanceUseCaseOutput } from '../output/create-instance-usecase-output.contract';
export abstract class ICreateInstanceUseCase {
  constructor(
    private readonly createEvolutionInstanceRepository: ICreateEvolutionInstanceRepository,
  ) {}
  abstract create(
    createInstanceUseCaseInput: ICreateInstanceUseCaseInput,
  ): Promise<ICreateInstanceUseCaseOutput>;
}
