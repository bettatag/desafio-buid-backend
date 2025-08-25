import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { EVOLUTION_REPOSITORY } from '../../../../shared/constants/di-constants';
import { Evolution } from '../../presentation/dtos/create-evolution-intance.dto';
import { EvolutionRepositoryInterface } from '../../domain/repositories/evolution.repository.interface';
import { CreateEvolutionDto } from '../contracts/services/create-instance-usecase.contract';

@Injectable()
export class CreateEvolutionUseCase {
  constructor(
    @Inject(EVOLUTION_REPOSITORY)
    private readonly evolutionRepository: EvolutionRepositoryInterface,
  ) {}

  async execute(createDto: CreateEvolutionDto): Promise<Evolution> {
    const id = uuidv4();
    const evolution = Evolution.create(
      id,
      createDto.name,
      createDto.description,
      createDto.version,
      createDto.isActive,
    );

    return await this.evolutionRepository.create(evolution);
  }
}
