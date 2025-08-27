import { OpenAISettingsEntity } from '../../entities/openai-settings.entity';

export interface IOpenAISettingsOutput extends OpenAISettingsEntity {}

export interface IOpenAISettingsDeleteOutput {
  message: string;
  deletedId: string;
}
