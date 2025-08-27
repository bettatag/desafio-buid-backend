export interface ICreateOpenAISettingsInput {
  expire?: number;
  keywordFinish?: string;
  delayMessage?: number;
  unknownMessage?: string;
  listeningFromMe?: boolean;
  stopBotFromMe?: boolean;
  keepOpen?: boolean;
  debounceTime?: number;
  webhookConfig?: {
    url?: string;
    events?: string[];
    enabled?: boolean;
  };
}
