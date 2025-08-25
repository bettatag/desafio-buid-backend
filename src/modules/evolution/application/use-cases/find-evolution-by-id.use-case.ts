import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { EVOLUTION_REPOSITORY } from '../../../../shared/constants/di-constants';
import { Evolution } from '../../presentation/dtos/create-evolution-intance.dto';
import { EvolutionRepositoryInterface } from '../../domain/repositories/evolution.repository.interface';

@Injectable()
export class FindEvolutionByIdUseCase {
  constructor(
    @Inject(EVOLUTION_REPOSITORY)
    private readonly evolutionRepository: EvolutionRepositoryInterface,
  ) {}

  async execute(id: string): Promise<Evolution> {
    const evolution = await this.evolutionRepository.findById(id);

    if (!evolution) {
      throw new NotFoundException(`Evolution with ID ${id} not found`);
    }

    return evolution;
  }
}
