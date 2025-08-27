import { OpenAISettingsEntity } from '../entities/openai-settings.entity';
import { ICreateOpenAISettingsInput } from '../contracts/input/create-openai-settings-input.contract';

export interface IOpenAISettingsRepository {
  create(instanceName: string, input: ICreateOpenAISettingsInput): Promise<OpenAISettingsEntity>;
  find(instanceName: string): Promise<OpenAISettingsEntity | null>;
  update(instanceName: string, input: ICreateOpenAISettingsInput): Promise<OpenAISettingsEntity>;
  delete(instanceName: string): Promise<void>;
}
