import { z } from 'zod';

// Auth validations
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').max(100, 'Senha muito longa'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

// Evolution API validations
export const createInstanceSchema = z.object({
  instanceName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(50, 'Nome muito longo'),
  token: z.string().min(10, 'Token deve ter pelo menos 10 caracteres').max(500, 'Token muito longo'),
  qrcode: z.boolean(),
  number: z.string().min(8, 'Número inválido').max(20, 'Número muito longo'),
  integration: z.literal('WHATSAPP-BAILEYS'),
  webhook: z.string().url('URL do webhook inválida'),
  webhook_by_events: z.boolean(),
  events: z.array(z.string()),
  reject_call: z.boolean(),
  msg_call: z.string().optional(),
  groups_ignore: z.boolean(),
  always_online: z.boolean(),
  read_messages: z.boolean(),
  read_status: z.boolean(),
  websocket_enabled: z.boolean(),
  websocket_events: z.array(z.string()),
  proxy: z.object({
    host: z.string(),
    port: z.string(),
    protocol: z.string(),
    username: z.string(),
    password: z.string(),
  }).optional(),
});

// OpenAI Bot validations
export const createOpenAIBotSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  enabled: z.boolean(),
  openaiCredsId: z.string().min(1, 'ID das credenciais é obrigatório'),
  botType: z.enum(['assistant', 'chatCompletion']),
  assistantId: z.string().optional(),
  functionUrl: z.string().url('URL inválida').optional(),
  model: z.string().optional(),
  systemMessages: z.array(z.string()).optional(),
  assistantMessages: z.array(z.string()).optional(),
  userMessages: z.array(z.string()).optional(),
  maxTokens: z.number().min(1).max(4000).optional(),
  temperature: z.number().min(0).max(2).optional(),
  topP: z.number().min(0).max(1).optional(),
  presencePenalty: z.number().min(-2).max(2).optional(),
  frequencyPenalty: z.number().min(-2).max(2).optional(),
  triggerType: z.enum(['keyword', 'all', 'none']).optional(),
  triggerOperator: z.enum(['contains', 'equals', 'startsWith', 'endsWith', 'regex', 'none']).optional(),
  triggerValue: z.string().optional(),
  ignoreJids: z.array(z.string()).optional(),
});

// Conversation validations
export const createConversationSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(4000).optional(),
  systemPrompt: z.string().optional(),
});

export const sendMessageSchema = z.object({
  message: z.string().min(1, 'Mensagem é obrigatória'),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(4000).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreateInstanceFormData = z.infer<typeof createInstanceSchema>;
export type CreateOpenAIBotFormData = z.infer<typeof createOpenAIBotSchema>;
export type CreateConversationFormData = z.infer<typeof createConversationSchema>;
export type SendMessageFormData = z.infer<typeof sendMessageSchema>;
