import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { EVOLUTION_REPOSITORY } from '../../../../shared/constants/di-constants';
import { EvolutionRepositoryInterface } from '../../domain/contracts/evolution.repository.interface';

@Injectable()
export class DeleteEvolutionUseCase {
  constructor(
    @Inject(EVOLUTION_REPOSITORY)
    private readonly evolutionRepository: EvolutionRepositoryInterface,
  ) {}

  async execute(id: string): Promise<void> {
    const existingEvolution = await this.evolutionRepository.findById(id);

    if (!existingEvolution) {
      throw new NotFoundException(`Evolution with ID ${id} not found`);
    }

    await this.evolutionRepository.delete(id);
  }
}
