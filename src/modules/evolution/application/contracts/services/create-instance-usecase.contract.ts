import { ICreateInstanceInput } from '../input/create-instance-input.contract';
import { ICreateInstanceOutput } from '../output/create-instance-output.contract';

export abstract class ICreateInstanceUseCase {
  abstract create(evolutionInstance: ICreateInstanceInput): Promise<ICreateInstanceOutput>;
}
