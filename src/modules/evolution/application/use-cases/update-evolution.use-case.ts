import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { EVOLUTION_REPOSITORY } from '../../../../shared/constants/di-constants';
import { Evolution } from '../../presentation/dtos/create-evolution-intance.dto';
import { EvolutionRepositoryInterface } from '../../domain/contracts/evolution.repository.interface';
import { UpdateEvolutionDto } from '../contracts/Services/create-instance-usecase.contract';

@Injectable()
export class UpdateEvolutionUseCase {
  constructor(
    @Inject(EVOLUTION_REPOSITORY)
    private readonly evolutionRepository: EvolutionRepositoryInterface,
  ) {}

  async execute(id: string, updateDto: UpdateEvolutionDto): Promise<Evolution> {
    const existingEvolution = await this.evolutionRepository.findById(id);

    if (!existingEvolution) {
      throw new NotFoundException(`Evolution with ID ${id} not found`);
    }

    return await this.evolutionRepository.update(id, updateDto);
  }
}
