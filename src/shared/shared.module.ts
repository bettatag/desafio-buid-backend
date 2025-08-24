import { Module, Global } from '@nestjs/common';
import { PrismaService } from './infra/db/prisma.service';
import { IDbService } from './infra/db/interfaces/db-service.interface';
import { PRISMA_CLIENT_TOKEN } from './dependency-injection-constants/di-constants';

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
