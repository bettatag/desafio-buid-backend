import { PrismaClient } from '@prisma/client';

export interface IDbService {
  user: PrismaClient['user'];
  evolutionInstance: PrismaClient['evolutionInstance'];
  instance: PrismaClient['instance'];
  hash: PrismaClient['hash'];
  settings: PrismaClient['settings'];
  // Métodos de lifecycle
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
