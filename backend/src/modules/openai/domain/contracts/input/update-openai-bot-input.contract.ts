import { BotType, TriggerType, TriggerOperator } from '../../entities/openai-bot.entity';

export interface IUpdateOpenAIBotInput {
  id: string;
  name?: string;
  enabled?: boolean;
  openaiCredsId?: string;
  botType?: BotType;
  assistantId?: string;
  functionUrl?: string;
  model?: string;
  systemMessages?: string[];
  assistantMessages?: string[];
  userMessages?: string[];
  maxTokens?: number;
  triggerType?: TriggerType;
  triggerOperator?: TriggerOperator;
  triggerValue?: string;
  expire?: number;
  keywordFinish?: string;
  delayMessage?: number;
  unknownMessage?: string;
  listeningFromMe?: boolean;
  stopBotFromMe?: boolean;
  keepOpen?: boolean;
  debounceTime?: number;
  ignoreJids?: string[];
}
