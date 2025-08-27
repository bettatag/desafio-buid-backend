import { Module } from '@nestjs/common';
import {
  OPENAI_BOT_USE_CASE_TOKEN,
  OPENAI_BOT_REPOSITORY_TOKEN,
  OPENAI_CREDS_USE_CASE_TOKEN,
  OPENAI_CREDS_REPOSITORY_TOKEN,
  OPENAI_SETTINGS_USE_CASE_TOKEN,
  OPENAI_SETTINGS_REPOSITORY_TOKEN,
} from '../../shared/constants/di-constants';
import { OpenAIBotUseCase } from './application/use-cases/openai-bot-usecase';
import { OpenAICredsUseCase } from './application/use-cases/openai-creds-usecase';
import { OpenAISettingsUseCase } from './application/use-cases/openai-settings-usecase';
import { OpenAIBotRepository } from './infra/repositories/openai-bot.repository';
import { OpenAICredsRepository } from './infra/repositories/openai-creds.repository';
import { OpenAISettingsRepository } from './infra/repositories/openai-settings.repository';
import { OpenAIController } from './presentation/controllers/openai.controller';

@Module({
  controllers: [OpenAIController],
  providers: [
    {
      provide: OPENAI_BOT_USE_CASE_TOKEN,
      useClass: OpenAIBotUseCase,
    },
    {
      provide: OPENAI_BOT_REPOSITORY_TOKEN,
      useClass: OpenAIBotRepository,
    },
    {
      provide: OPENAI_CREDS_USE_CASE_TOKEN,
      useClass: OpenAICredsUseCase,
    },
    {
      provide: OPENAI_CREDS_REPOSITORY_TOKEN,
      useClass: OpenAICredsRepository,
    },
    {
      provide: OPENAI_SETTINGS_USE_CASE_TOKEN,
      useClass: OpenAISettingsUseCase,
    },
    {
      provide: OPENAI_SETTINGS_REPOSITORY_TOKEN,
      useClass: OpenAISettingsRepository,
    },
  ],
  exports: [
    OPENAI_BOT_USE_CASE_TOKEN,
    OPENAI_BOT_REPOSITORY_TOKEN,
    OPENAI_CREDS_USE_CASE_TOKEN,
    OPENAI_CREDS_REPOSITORY_TOKEN,
    OPENAI_SETTINGS_USE_CASE_TOKEN,
    OPENAI_SETTINGS_REPOSITORY_TOKEN,
  ],
})
export class OpenAIModule {}
