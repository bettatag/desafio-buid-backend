import { Injectable, Inject } from '@nestjs/common';
import { EVOLUTION_REPOSITORY } from '../../../../shared/constants/di-constants';
import { Evolution } from '../../presentation/dtos/create-evolution-intance.dto';
import { EvolutionRepositoryInterface } from '../../domain/repositories/evolution.repository.interface';

@Injectable()
export class FindAllEvolutionsUseCase {
  constructor(
    @Inject(EVOLUTION_REPOSITORY)
    private readonly evolutionRepository: EvolutionRepositoryInterface,
  ) {}

  async execute(): Promise<Evolution[]> {
    return await this.evolutionRepository.findAll();
  }
}
