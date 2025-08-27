import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { GlobalGuard } from './modules/auth/presentation/guards/global.guard';
import { EvolutionModule } from './modules/evolution/evolution.module';
import { OpenAIModule } from './modules/openai/openai.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { SharedModule } from './shared/shared.module';
import { CustomThrottlerGuard } from './shared/guards/throttler.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: parseInt(process.env.RATE_LIMIT_TTL || '60000'), // 60 segundos (1 minuto)
        limit: parseInt(process.env.RATE_LIMIT_LIMIT || '100'), // 100 requests por minuto
      },
    ]),
    SharedModule,
    AuthModule,
    EvolutionModule,
    OpenAIModule,
    ConversationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GlobalGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}