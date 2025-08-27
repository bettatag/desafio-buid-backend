import { IDbService } from 'src/infra/db/interfaces/db-service.interface';
import { EvolutionInstanceEntity } from '../entities/evolution-instance.entity';

export abstract class ICreateEvolutionInstanceRepository {
  constructor(private readonly dbService: IDbService) {}
  abstract create(httpRequestBody: any): Promise<EvolutionInstanceEntity>;
}
