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

// Auth Module
export const AUTH_USE_CASE_TOKEN = Symbol('AuthUseCase');
export const AUTH_REPOSITORY_TOKEN = Symbol('AuthRepository');
export const PASSWORD_SERVICE_TOKEN = Symbol('PasswordService');
export const TOKEN_SERVICE_TOKEN = Symbol('TokenService');
export const LOGGER_SERVICE_TOKEN = Symbol('LoggerService');
export const AUTH_CONFIG_TOKEN = Symbol('AuthConfig');

// Message Management
export const MESSAGE_USE_CASE_TOKEN = Symbol('MessageUseCase');
export const MESSAGE_REPOSITORY_TOKEN = Symbol('MessageRepository');

// Session Management
export const SESSION_USE_CASE_TOKEN = Symbol('SessionUseCase');
export const SESSION_REPOSITORY_TOKEN = Symbol('SessionRepository');

// OpenAI Module
export const OPENAI_BOT_USE_CASE_TOKEN = Symbol('OpenAIBotUseCase');
export const OPENAI_BOT_REPOSITORY_TOKEN = Symbol('OpenAIBotRepository');
export const OPENAI_CREDS_USE_CASE_TOKEN = Symbol('OpenAICredsUseCase');
export const OPENAI_CREDS_REPOSITORY_TOKEN = Symbol('OpenAICredsRepository');
export const OPENAI_SETTINGS_USE_CASE_TOKEN = Symbol('OpenAISettingsUseCase');
export const OPENAI_SETTINGS_REPOSITORY_TOKEN = Symbol('OpenAISettingsRepository');
