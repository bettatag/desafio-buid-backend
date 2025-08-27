import { ICreateOpenAICredsInput } from '../../../domain/contracts/input/create-openai-creds-input.contract';
import {
  IOpenAICredsOutput,
  IOpenAICredsListOutput,
  IOpenAICredsDeleteOutput,
} from '../../../domain/contracts/output/openai-creds-output.contract';

export interface IOpenAICredsUseCase {
  create(instanceName: string, input: ICreateOpenAICredsInput): Promise<IOpenAICredsOutput>;
  findAll(instanceName: string): Promise<IOpenAICredsListOutput>;
  findById(instanceName: string, id: string): Promise<IOpenAICredsOutput | null>;
  delete(instanceName: string, id: string): Promise<IOpenAICredsDeleteOutput>;
}
