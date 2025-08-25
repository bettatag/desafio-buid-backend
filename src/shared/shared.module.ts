import { Module, Global } from '@nestjs/common';
import { IDbService } from '../infra/db/interfaces/db-service.interface';
import { PrismaService } from '../infra/db/prisma.service';
import { PRISMA_CLIENT_TOKEN, CREATE_INSTANCE_USE_CASE_TOKEN } from './constants/di-constants';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: PRISMA_CLIENT_TOKEN,
      useClass: PrismaService,
    },
  ],
  exports: [PrismaService, PRISMA_CLIENT_TOKEN, CREATE_INSTANCE_USE_CASE_TOKEN],
})
export class SharedModule {}
