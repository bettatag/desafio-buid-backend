import { PrismaClient } from '@prisma/client';

export interface IDbService {
  user: PrismaClient['user'];
  // Métodos de lifecycle
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  // Add other models as needed (e.g., company, customer, order)
}
