import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infra/db/prisma.service';
import { Evolution } from '../../presentation/dtos/create-evolution-intance.dto';
import { EvolutionRepositoryInterface } from '../../domain/repositories/evolution.repository.interface';

@Injectable()
export class EvolutionRepository implements EvolutionRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(evolution: Evolution): Promise<Evolution> {
    const created = await this.prisma.evolution.create({
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
