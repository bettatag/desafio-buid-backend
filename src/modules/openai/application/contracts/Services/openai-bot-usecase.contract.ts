import { OpenAIBotEntity } from '../../../domain/entities/openai-bot.entity';
import { ICreateOpenAIBotInput } from '../../../domain/contracts/input/create-openai-bot-input.contract';
import { IUpdateOpenAIBotInput } from '../../../domain/contracts/input/update-openai-bot-input.contract';
import { IChangeStatusInput } from '../../../domain/contracts/input/change-status-input.contract';
import {
  IOpenAIBotOutput,
  IOpenAIBotListOutput,
  IOpenAIBotDeleteOutput,
  IOpenAIBotStatusOutput,
} from '../../../domain/contracts/output/openai-bot-output.contract';

export interface IOpenAIBotUseCase {
  create(instanceName: string, input: ICreateOpenAIBotInput): Promise<IOpenAIBotOutput>;
  findAll(instanceName: string): Promise<IOpenAIBotListOutput>;
  findById(instanceName: string, id: string): Promise<IOpenAIBotOutput | null>;
  update(instanceName: string, input: IUpdateOpenAIBotInput): Promise<IOpenAIBotOutput>;
  delete(instanceName: string, id: string): Promise<IOpenAIBotDeleteOutput>;
  changeStatus(instanceName: string, input: IChangeStatusInput): Promise<IOpenAIBotStatusOutput>;
}
