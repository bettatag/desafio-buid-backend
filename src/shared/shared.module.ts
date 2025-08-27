import { Module, Global } from '@nestjs/common';
import { PRISMA_CLIENT_TOKEN } from './constants/di-constants';
import { PrismaService } from './db/prisma.service';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: PRISMA_CLIENT_TOKEN,
      useClass: PrismaService,
    },
  ],
  exports: [PrismaService, PRISMA_CLIENT_TOKEN],
})
export class SharedModule {}
