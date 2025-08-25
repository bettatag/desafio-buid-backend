import { Evolution } from '../../presentation/dtos/create-evolution-intance.dto';

export interface EvolutionRepositoryInterface {
  create(evolution: Evolution): Promise<Evolution>;
  findById(id: string): Promise<Evolution | null>;
  findAll(): Promise<Evolution[]>;
  update(id: string, evolution: Partial<Evolution>): Promise<Evolution>;
  delete(id: string): Promise<void>;
  findByName(name: string): Promise<Evolution | null>;
  findByVersion(version: string): Promise<Evolution[]>;
}
