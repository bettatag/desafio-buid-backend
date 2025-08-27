import { OpenAICredsEntity } from '../../entities/openai-creds.entity';

export interface IOpenAICredsOutput extends OpenAICredsEntity {}

export interface IOpenAICredsListOutput {
  creds: OpenAICredsEntity[];
  total: number;
}

export interface IOpenAICredsDeleteOutput {
  message: string;
  deletedId: string;
}
