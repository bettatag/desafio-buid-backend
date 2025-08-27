import { ICreateOpenAISettingsInput } from '../../../domain/contracts/input/create-openai-settings-input.contract';
import {
  IOpenAISettingsOutput,
  IOpenAISettingsDeleteOutput,
} from '../../../domain/contracts/output/openai-settings-output.contract';

export interface IOpenAISettingsUseCase {
  create(instanceName: string, input: ICreateOpenAISettingsInput): Promise<IOpenAISettingsOutput>;
  find(instanceName: string): Promise<IOpenAISettingsOutput | null>;
  update(instanceName: string, input: ICreateOpenAISettingsInput): Promise<IOpenAISettingsOutput>;
  delete(instanceName: string): Promise<IOpenAISettingsDeleteOutput>;
}
