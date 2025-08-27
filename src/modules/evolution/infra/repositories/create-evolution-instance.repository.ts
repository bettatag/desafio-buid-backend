import { Inject, Injectable } from '@nestjs/common';
import { IDbService } from 'src/infra/db/interfaces/db-service.interface';
import { PRISMA_CLIENT_TOKEN } from 'src/shared/constants/di-constants';
import { ICreateInstanceRepositoryInput } from '../../application/contracts/input/create-instance-repository-input.contract';
import { ICreateInstanceRepositoryOutput } from '../../application/contracts/output/create-instance-repository-output.contracts';
import { ICreateEvolutionInstanceRepository } from '../../domain/repositories/create-evolution-instance-repository.contract';

@Injectable()
export class CreateEvolutionInstanceRepository implements ICreateEvolutionInstanceRepository {
  constructor(
    @Inject(PRISMA_CLIENT_TOKEN)
    private readonly prismaClient: IDbService,
  ) {}

  async create(
    createInstanceRepositoryInput: ICreateInstanceRepositoryInput,
  ): Promise<ICreateInstanceRepositoryOutput> {
    return = await this.prismaClient.evolutionInstance.create({
      data: {
        id: evolution.id,
        name: evolution.name,
        description: evolution.description,
        version: evolution.version,
        isActive: evolution.isActive,
        createdAt: evolution.createdAt,
        updatedAt: evolution.updatedAt,
      },
    });

    return new Evolution(
      created.id,
      created.name,
      created.description,
      created.version,
      created.isActive,
      created.createdAt,
      created.updatedAt,
    );
  }

  async findById(id: string): Promise<Evolution | null> {
    const evolution = await this.prisma.evolution.findUnique({
      where: { id },
    });

    if (!evolution) {
      return null;
    }

    return new Evolution(
      evolution.id,
      evolution.name,
      evolution.description,
      evolution.version,
      evolution.isActive,
      evolution.createdAt,
      evolution.updatedAt,
    );
  }

  async findAll(): Promise<Evolution[]> {
    const evolutions = await this.prisma.evolution.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return evolutions.map(
      (evolution) =>
        new Evolution(
          evolution.id,
          evolution.name,
          evolution.description,
          evolution.version,
          evolution.isActive,
          evolution.createdAt,
          evolution.updatedAt,
        ),
    );
  }

  async update(id: string, updateData: Partial<Evolution>): Promise<Evolution> {
    const updated = await this.prisma.evolution.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    return new Evolution(
      updated.id,
      updated.name,
      updated.description,
      updated.version,
      updated.isActive,
      updated.createdAt,
      updated.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.evolution.delete({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Evolution | null> {
    const evolution = await this.prisma.evolution.findFirst({
      where: { name },
    });

    if (!evolution) {
      return null;
    }

    return new Evolution(
      evolution.id,
      evolution.name,
      evolution.description,
      evolution.version,
      evolution.isActive,
      evolution.createdAt,
      evolution.updatedAt,
    );
  }

  async findByVersion(version: string): Promise<Evolution[]> {
    const evolutions = await this.prisma.evolution.findMany({
      where: { version },
      orderBy: { createdAt: 'desc' },
    });

    return evolutions.map(
      (evolution) =>
        new Evolution(
          evolution.id,
          evolution.name,
          evolution.description,
          evolution.version,
          evolution.isActive,
          evolution.createdAt,
          evolution.updatedAt,
        ),
    );
  }
}
