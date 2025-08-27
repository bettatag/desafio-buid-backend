import { ICreateInstanceInput } from '../../../domain/contracts/input/create-instance-input.contract';
import { ICreateInstanceOutput } from '../../../domain/contracts/output/create-instance-output.contract';

export interface ICreateInstanceUseCase {
  create(createInstanceInput: ICreateInstanceInput): Promise<ICreateInstanceOutput>;
}
