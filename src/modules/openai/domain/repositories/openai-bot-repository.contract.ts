import { OpenAIBotEntity } from '../entities/openai-bot.entity';
import { ICreateOpenAIBotInput } from '../contracts/input/create-openai-bot-input.contract';
import { IUpdateOpenAIBotInput } from '../contracts/input/update-openai-bot-input.contract';
import { IChangeStatusInput } from '../contracts/input/change-status-input.contract';

export interface IOpenAIBotRepository {
  create(instanceName: string, input: ICreateOpenAIBotInput): Promise<OpenAIBotEntity>;
  findAll(instanceName: string): Promise<OpenAIBotEntity[]>;
  findById(instanceName: string, id: string): Promise<OpenAIBotEntity | null>;
  update(instanceName: string, input: IUpdateOpenAIBotInput): Promise<OpenAIBotEntity>;
  delete(instanceName: string, id: string): Promise<void>;
  changeStatus(instanceName: string, input: IChangeStatusInput): Promise<OpenAIBotEntity>;
}
