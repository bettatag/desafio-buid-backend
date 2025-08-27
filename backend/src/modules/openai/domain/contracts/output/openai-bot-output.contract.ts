import { OpenAIBotEntity } from '../../entities/openai-bot.entity';

export interface IOpenAIBotOutput extends OpenAIBotEntity {}

export interface IOpenAIBotListOutput {
  bots: OpenAIBotEntity[];
  total: number;
}

export interface IOpenAIBotDeleteOutput {
  message: string;
  deletedId: string;
}

export interface IOpenAIBotStatusOutput {
  id: string;
  enabled: boolean;
  message: string;
}
