import { ICreateInstanceInput } from '../contracts/input/create-instance-input.contract';
import { ICreateInstanceOutput } from '../contracts/output/create-instance-output.contract';

export interface ICreateEvolutionInstanceRepository {
  create(createInstanceInput: ICreateInstanceInput): Promise<ICreateInstanceOutput>;
}
