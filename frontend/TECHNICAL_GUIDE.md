# Guia Técnico de Implementação - Frontend

## Visão Geral do Backend

Este documento fornece orientações técnicas detalhadas para implementar o frontend baseado na análise completa dos endpoints do backend.

## Endpoints Disponíveis

### 1. Autenticação (`/auth`)

#### POST `/auth/login`
- **Descrição**: Autentica o usuário e define cookies httpOnly com tokens JWT
- **Público**: Sim (`@IsPublic()`)
- **Input** (LoginDto):
  ```typescript
  {
    email: string;        // Email válido
    password: string;     // Mínimo 6 caracteres
    rememberMe?: boolean; // Opcional
  }
  ```
- **Output** (AuthResponseDto):
  ```typescript
  {
    user: {
      id: string;
      email: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
      isActive: boolean;
    };
    accessToken: string;
    refreshToken: string;
  }
  ```

#### POST `/auth/register`
- **Descrição**: Registra novo usuário no sistema
- **Público**: Sim
- **Input** (RegisterDto):
  ```typescript
  {
    email: string;    // Email válido
    password: string; // 6-100 caracteres
    name: string;     // 2-100 caracteres
  }
  ```
- **Output**: Mesmo que login

#### POST `/auth/logout`
- **Descrição**: Remove cookies de autenticação
- **Autenticado**: Sim
- **Output**: Mensagem de confirmação

#### POST `/auth/refresh`
- **Descrição**: Renova tokens usando refresh token
- **Público**: Sim (usa decorator especial `@UseRefreshToken()`)

#### GET `/auth/me`
- **Descrição**: Retorna dados do usuário autenticado
- **Autenticado**: Sim
- **Output**: UserResponseDto

### 2. Evolution API (`/evolution`)

#### POST `/evolution/create-instance`
- **Descrição**: Cria nova instância do Evolution API
- **Público**: Sim
- **Input** (CreateEvolutionInstanceDto):
  ```typescript
  {
    instanceName: string;           // 3-50 caracteres
    token: string;                  // 10-500 caracteres
    qrcode: boolean;               // Gerar QR Code
    number: string;                // 8-20 caracteres (com código país)
    integration: 'WHATSAPP-BAILEYS';
    webhook: string;               // URL válida
    webhook_by_events: boolean;
    events: string[];              // Lista de eventos
    reject_call: boolean;
    msg_call?: string;             // Mensagem para chamadas rejeitadas
    groups_ignore: boolean;
    always_online: boolean;
    read_messages: boolean;
    read_status: boolean;
    websocket_enabled: boolean;
    websocket_events: string[];
    proxy?: {                      // Configuração proxy opcional
      host: string;
      port: string;
      protocol: string;
      username: string;
      password: string;
    };
  }
  ```
- **Output**: Dados da instância criada com hash/apikey

#### GET `/evolution/fetch/:instanceName`
- **Descrição**: Busca dados de uma instância específica
- **Público**: Sim

#### PUT `/evolution/:instanceName/settings`
- **Descrição**: Atualiza configurações da instância

#### DELETE `/evolution/:instanceName/logout`
- **Descrição**: Desconecta instância do WhatsApp

#### POST `/evolution/:instanceName/connect`
- **Descrição**: Conecta instância ao WhatsApp

#### POST `/evolution/:instanceName/restart`
- **Descrição**: Reinicia instância

#### GET `/evolution/:instanceName/connectionState`
- **Descrição**: Verifica estado da conexão

#### Endpoints de Mensagens:
- `POST /:instanceName/sendText` - Enviar mensagem de texto
- `POST /:instanceName/sendMedia` - Enviar mídia
- `GET /:instanceName/fetchMessages` - Buscar histórico

#### Endpoints de Webhook:
- `POST /:instanceName/webhook` - Processar eventos de webhook

### 3. OpenAI (`/openai`)

#### POST `/openai/create/:instanceName`
- **Descrição**: Cria bot OpenAI para instância
- **Público**: Sim
- **Input** (CreateOpenAIBotDto):
  ```typescript
  {
    name: string;                    // Nome do bot
    enabled: boolean;                // Status ativo/inativo
    openaiCredsId: string;          // ID das credenciais OpenAI
    botType: 'assistant' | 'chatCompletion';
    assistantId?: string;           // Para tipo 'assistant'
    functionUrl?: string;           // URL função personalizada
    model?: string;                 // Modelo OpenAI (ex: gpt-3.5-turbo)
    systemMessages?: string[];      // Mensagens do sistema
    assistantMessages?: string[];   // Mensagens do assistente
    userMessages?: string[];        // Mensagens do usuário
    maxTokens?: number;             // Limite de tokens
    triggerType?: 'keyword' | 'all' | 'none';
    triggerOperator?: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'regex' | 'none';
    triggerValue?: string;          // Valor do trigger
    temperature?: number;           // 0-2 (criatividade)
    topP?: number;                  // 0-1 (diversidade)
    presencePenalty?: number;       // -2 a 2
    frequencyPenalty?: number;      // -2 a 2
    ignoreJids?: string[];          // JIDs para ignorar
  }
  ```

#### GET `/openai/find/:instanceName`
- **Descrição**: Lista todos os bots da instância

#### GET `/openai/find/:instanceName/:id`
- **Descrição**: Busca bot específico por ID

#### PUT `/openai/update/:instanceName/:id`
- **Descrição**: Atualiza bot OpenAI

#### DELETE `/openai/delete/:instanceName/:id`
- **Descrição**: Remove bot OpenAI

#### PUT `/openai/changeStatus/:instanceName/:id`
- **Descrição**: Altera status do bot (ativo/inativo)

#### Endpoints de Credenciais OpenAI:
- `POST /openai/creds/create/:instanceName` - Criar credenciais
- `GET /openai/creds/find/:instanceName` - Listar credenciais
- `DELETE /openai/creds/delete/:instanceName/:id` - Remover credenciais

#### Endpoints de Configurações:
- `POST /openai/settings/create/:instanceName` - Criar configurações
- `GET /openai/settings/find/:instanceName` - Buscar configurações
- `DELETE /openai/settings/delete/:instanceName/:id` - Remover configurações

### 4. Conversações (`/conversations`)

#### POST `/conversations`
- **Descrição**: Cria nova conversa
- **Autenticado**: Sim
- **Input**:
  ```typescript
  {
    title: string;
    model?: string;        // Modelo OpenAI
    temperature?: number;  // 0-2
    maxTokens?: number;    // Limite de tokens
    systemPrompt?: string; // Prompt do sistema
  }
  ```

#### GET `/conversations`
- **Descrição**: Lista conversas do usuário
- **Autenticado**: Sim
- **Query Parameters**:
  ```typescript
  {
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'updatedAt' | 'title';
    sortOrder?: 'asc' | 'desc';
    search?: string;
  }
  ```

#### GET `/conversations/:id`
- **Descrição**: Busca conversa específica
- **Autenticado**: Sim

#### PUT `/conversations/:id`
- **Descrição**: Atualiza conversa
- **Autenticado**: Sim

#### DELETE `/conversations/:id`
- **Descrição**: Remove conversa
- **Autenticado**: Sim

#### GET `/conversations/:conversationId/messages`
- **Descrição**: Lista mensagens da conversa
- **Autenticado**: Sim

#### POST `/conversations/:conversationId/messages`
- **Descrição**: Envia mensagem para OpenAI
- **Autenticado**: Sim
- **Input**:
  ```typescript
  {
    message: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
  ```

#### GET `/conversations/stats`
- **Descrição**: Estatísticas das conversas do usuário
- **Autenticado**: Sim

## Arquitetura Recomendada para o Frontend

### 1. Estrutura de Pastas
```
src/
├── app/                    # App Router do Next.js 13+
│   ├── (auth)/            # Grupo de rotas de autenticação
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/         # Dashboard principal
│   │   ├── page.tsx
│   │   ├── instances/     # Gerenciamento de instâncias
│   │   ├── ai-agents/     # Configuração de agentes IA
│   │   └── conversations/ # Interface de chat
│   ├── api/              # API Routes (se necessário)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx          # Home page
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes base (shadcn/ui)
│   ├── forms/           # Formulários específicos
│   ├── layouts/         # Layouts da aplicação
│   └── features/        # Componentes por feature
├── lib/                 # Utilitários e configurações
│   ├── api.ts          # Cliente HTTP (axios/fetch)
│   ├── auth.ts         # Lógica de autenticação
│   ├── utils.ts        # Funções utilitárias
│   └── validations.ts  # Schemas de validação (Zod)
├── hooks/              # Custom hooks
├── store/              # Estado global (Zustand/Redux)
├── types/              # Definições TypeScript
└── styles/             # Estilos globais
```

### 2. Stack Tecnológica Recomendada

#### Core
- **Next.js 14+** com App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes base

#### Estado e Dados
- **Zustand** ou **Redux Toolkit** para estado global
- **React Query/TanStack Query** para cache e sincronização de dados
- **Zod** para validação de schemas

#### Formulários
- **React Hook Form** com **Zod** resolver
- **Hookform/resolvers** para integração

#### Autenticação
- **NextAuth.js** ou implementação custom com JWT
- **js-cookie** para manipulação de cookies

#### HTTP Client
- **Axios** com interceptors para tokens
- **SWR** ou **React Query** para cache

### 3. Implementação da Autenticação

#### Context de Autenticação
```typescript
// lib/auth-context.tsx
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  isLoading: boolean;
}
```

#### Middleware para Proteção de Rotas
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken');
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (token && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
}
```

### 4. Componentes Principais

#### 1. Formulário de Login
```typescript
// components/forms/LoginForm.tsx
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  rememberMe: z.boolean().optional(),
});
```

#### 2. Formulário de Cadastro
```typescript
// components/forms/RegisterForm.tsx
interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').max(100),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});
```

#### 3. Formulário de Criação de Instância Evolution
```typescript
// components/forms/CreateInstanceForm.tsx
interface CreateInstanceFormData {
  instanceName: string;
  token: string;
  qrcode: boolean;
  number: string;
  integration: 'WHATSAPP-BAILEYS';
  webhook: string;
  webhook_by_events: boolean;
  events: string[];
  reject_call: boolean;
  msg_call?: string;
  groups_ignore: boolean;
  always_online: boolean;
  read_messages: boolean;
  read_status: boolean;
  websocket_enabled: boolean;
  websocket_events: string[];
  proxy?: ProxyConfig;
}
```

#### 4. Interface de Chat com IA
```typescript
// components/features/ChatInterface.tsx
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  createdAt: Date;
  tokensUsed?: number;
  model?: string;
}

interface ChatInterfaceProps {
  conversationId: string;
  messages: Message[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}
```

### 5. Hooks Customizados

#### useAuth
```typescript
// hooks/useAuth.ts
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string, rememberMe?: boolean) => {
    // Implementação do login
  };

  const logout = async () => {
    // Implementação do logout
  };

  return { user, login, logout, isLoading };
}
```

#### useEvolutionInstances
```typescript
// hooks/useEvolutionInstances.ts
export function useEvolutionInstances() {
  const {
    data: instances,
    error,
    isLoading,
    mutate
  } = useSWR('/evolution/instances', fetcher);

  const createInstance = async (data: CreateInstanceFormData) => {
    // Implementação
  };

  return { instances, createInstance, isLoading, error };
}
```

#### useConversations
```typescript
// hooks/useConversations.ts
export function useConversations() {
  const {
    data: conversations,
    error,
    isLoading
  } = useSWR('/conversations', fetcher);

  const sendMessage = async (conversationId: string, message: string) => {
    // Implementação
  };

  return { conversations, sendMessage, isLoading, error };
}
```

### 6. Tipos TypeScript

```typescript
// types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface EvolutionInstance {
  instanceName: string;
  instanceId: string;
  status: string;
  webhook_wa_business: string | null;
  access_token_wa_business: string;
}

export interface OpenAIBot {
  id: string;
  name: string;
  enabled: boolean;
  openaiCredsId: string;
  botType: 'assistant' | 'chatCompletion';
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface Conversation {
  id: string;
  title: string;
  userId: number;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
  isActive: boolean;
  messageCount: number;
  totalTokensUsed: number;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt?: Date;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  tokensUsed?: number;
  model?: string;
  finishReason?: string;
  createdAt: Date;
}
```

### 7. Fluxo de Navegação

#### 1. Home Page (`/`)
- Landing page clean e moderna
- Botões para Login e Cadastro
- Informações sobre o sistema

#### 2. Login (`/login`)
- Formulário de login
- Opção "Lembrar-me"
- Link para cadastro
- Redirecionamento para dashboard após login

#### 3. Cadastro (`/register`)
- Formulário de cadastro
- Validação em tempo real
- Link para login
- Redirecionamento para dashboard após cadastro

#### 4. Dashboard (`/dashboard`)
- Visão geral das instâncias
- Cards com estatísticas
- Acesso rápido às funcionalidades principais

#### 5. Gerenciamento de Instâncias (`/dashboard/instances`)
- Lista de instâncias Evolution
- Formulário para criar nova instância
- Status de conexão
- Ações (conectar, desconectar, configurar)

#### 6. Agentes IA (`/dashboard/ai-agents`)
- Lista de bots OpenAI
- Formulário para criar/editar bots
- Configurações avançadas (temperatura, tokens, prompts)

#### 7. Conversações (`/dashboard/conversations`)
- Interface de chat
- Lista de conversas anteriores
- Criação de nova conversa
- Histórico de mensagens

### 8. Considerações de UX/UI

#### Design System
- Use **shadcn/ui** como base
- Paleta de cores consistente
- Tipografia hierárquica
- Espaçamentos padronizados

#### Responsividade
- Mobile-first approach
- Breakpoints consistentes
- Navegação adaptativa

#### Estados de Loading
- Skeletons para listas
- Spinners para ações
- Estados de erro informativos

#### Feedback Visual
- Toasts para notificações
- Validação em tempo real
- Estados de sucesso/erro claros

### 9. Configurações Importantes

#### Variáveis de Ambiente
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3001
```

#### API Client Configuration
```typescript
// lib/api.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Para cookies httpOnly
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Tentar refresh token
      try {
        await api.post('/auth/refresh');
        return api.request(error.config);
      } catch {
        // Redirecionar para login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

Este guia fornece uma base sólida para implementar o frontend seguindo as melhores práticas de desenvolvimento React/Next.js e integração com o backend analisado.
