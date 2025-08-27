import { OpenAICredsEntity } from '../entities/openai-creds.entity';
import { ICreateOpenAICredsInput } from '../contracts/input/create-openai-creds-input.contract';

export interface IOpenAICredsRepository {
  create(instanceName: string, input: ICreateOpenAICredsInput): Promise<OpenAICredsEntity>;
  findAll(instanceName: string): Promise<OpenAICredsEntity[]>;
  findById(instanceName: string, id: string): Promise<OpenAICredsEntity | null>;
  findByName(instanceName: string, name: string): Promise<OpenAICredsEntity | null>;
  delete(instanceName: string, id: string): Promise<void>;
}
