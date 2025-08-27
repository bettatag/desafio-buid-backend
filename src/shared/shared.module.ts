import { Module, Global } from '@nestjs/common';
import { PRISMA_CLIENT_TOKEN, DB_SERVICE_TOKEN } from './constants/di-constants';
import { PrismaService } from './db/prisma.service';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: PRISMA_CLIENT_TOKEN,
      useClass: PrismaService,
    },
    {
      provide: DB_SERVICE_TOKEN,
      useClass: PrismaService,
    },
  ],
  exports: [PrismaService, PRISMA_CLIENT_TOKEN, DB_SERVICE_TOKEN],
})
export class SharedModule {}
