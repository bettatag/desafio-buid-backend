import { Module } from '@nestjs/common';
import { ConversationController } from './presentation/controllers/conversation.controller';
import { ConversationUseCase } from './application/use-cases/conversation-usecase';
import { ConversationRepository } from './infra/repositories/conversation.repository';
import { SharedModule } from '../../shared/shared.module';
import {
  CONVERSATION_USE_CASE_TOKEN,
  CONVERSATION_REPOSITORY_TOKEN,
} from '../../shared/constants/di-constants';

@Module({
  imports: [SharedModule],
  controllers: [ConversationController],
  providers: [
    {
      provide: CONVERSATION_USE_CASE_TOKEN,
      useClass: ConversationUseCase,
    },
    {
      provide: CONVERSATION_REPOSITORY_TOKEN,
      useClass: ConversationRepository,
    },
  ],
  exports: [
    CONVERSATION_USE_CASE_TOKEN,
    CONVERSATION_REPOSITORY_TOKEN,
  ],
})
export class ConversationModule {}
