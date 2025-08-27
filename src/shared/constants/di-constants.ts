//Prisma
export const PRISMA_CLIENT_TOKEN = Symbol('PrismaClient');

// Database Service
export const DB_SERVICE_TOKEN = Symbol('DbService');

// Evolution Module
export const CREATE_INSTANCE_USE_CASE_TOKEN = Symbol('CreateEvolutionInstanceUseCase');
export const CREATE_EVOLUTION_INSTANCE_REPOSITORY_TOKEN = Symbol(
  'CreateEvolutionInstanceRepository',
);

// Instance Management
export const FETCH_INSTANCES_USE_CASE_TOKEN = Symbol('FetchInstancesUseCase');
export const INSTANCE_MANAGEMENT_USE_CASE_TOKEN = Symbol('InstanceManagementUseCase');
export const INSTANCE_MANAGEMENT_REPOSITORY_TOKEN = Symbol('InstanceManagementRepository');
