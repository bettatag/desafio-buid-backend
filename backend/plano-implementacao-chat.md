# 📋 Plano de Implementação do Chat - Frontend Next.js

## 🎯 Visão Geral

Este documento detalha a implementação completa de um frontend Next.js para o sistema de chat WhatsApp AI Agent, incluindo autenticação, gerenciamento de instâncias e interface de chat.

## 🏗️ Arquitetura do Frontend

```
frontend/
├── src/
│   ├── app/                    # App Router (Next.js 14+)
│   │   ├── (auth)/            # Grupo de rotas de autenticação
│   │   │   ├── login/         # Página de login
│   │   │   └── register/      # Página de cadastro
│   │   ├── dashboard/         # Área protegida
│   │   │   ├── page.tsx       # Dashboard principal
│   │   │   ├── instance/      # Gerenciamento de instâncias
│   │   │   └── chat/          # Interface de chat
│   │   ├── globals.css        # Estilos globais
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Página inicial
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/               # Componentes base (shadcn/ui)
│   │   ├── auth/             # Componentes de autenticação
│   │   ├── dashboard/        # Componentes do dashboard
│   │   └── chat/             # Componentes do chat
│   ├── lib/                  # Utilitários e configurações
│   │   ├── api.ts            # Cliente API
│   │   ├── auth.ts           # Configuração de autenticação
│   │   ├── utils.ts          # Utilitários gerais
│   │   └── validations.ts    # Esquemas de validação
│   ├── hooks/                # Custom hooks
│   │   ├── useAuth.ts        # Hook de autenticação
│   │   ├── useApi.ts         # Hook para chamadas API
│   │   └── useWebSocket.ts   # Hook para WebSocket
│   ├── types/                # Definições TypeScript
│   │   ├── api.ts            # Tipos da API
│   │   ├── auth.ts           # Tipos de autenticação
│   │   └── chat.ts           # Tipos do chat
│   └── store/                # Gerenciamento de estado
│       ├── auth.ts           # Estado de autenticação
│       ├── instance.ts       # Estado da instância
│       └── chat.ts           # Estado do chat
```

## 🔐 Módulo de Autenticação

### Endpoints Disponíveis

#### 1. **POST** `/auth/register` - Cadastro de Usuário
```typescript
interface RegisterRequest {
  name: string;      // Nome completo
  email: string;     // Email único
  password: string;  // Mínimo 6 caracteres
}

interface RegisterResponse {
  user: {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
```

#### 2. **POST** `/auth/login` - Login
```typescript
interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean; // Token de longa duração
}

interface LoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
```

#### 3. **POST** `/auth/refresh` - Renovar Token
```typescript
interface RefreshRequest {
  refreshToken: string;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}
```

#### 4. **POST** `/auth/logout` - Logout
```typescript
interface LogoutRequest {
  userId: number;
}
```

#### 5. **GET** `/auth/me` - Dados do Usuário
```typescript
interface UserResponse {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Implementação da Autenticação

#### 1. **Configuração do Cliente API** (`lib/api.ts`)
```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para renovar token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          return api.request(error.config);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### 2. **Hook de Autenticação** (`hooks/useAuth.ts`)
```typescript
'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import api from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    setLoading(false);
  };

  const login = async (email: string, password: string, rememberMe = false) => {
    const response = await api.post('/auth/login', { email, password, rememberMe });
    const { user, tokens } = response.data;
    
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    setUser(user);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { user, tokens } = response.data;
    
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    setUser(user);
  };

  const logout = async () => {
    if (user) {
      await api.post('/auth/logout', { userId: user.id });
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

#### 3. **Componente de Login** (`app/(auth)/login/page.tsx`)
```typescript
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password, rememberMe);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            WhatsApp AI Agent
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Faça login na sua conta
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Email"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Senha"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Lembrar de mim
              </label>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          <div className="text-center">
            <Link href="/register" className="text-indigo-600 hover:text-indigo-500">
              Não tem conta? Cadastre-se
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
```

#### 4. **Componente de Cadastro** (`app/(auth)/register/page.tsx`)
```typescript
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      await register(name, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Criar Conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Cadastre-se no WhatsApp AI Agent
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Nome completo"
            />
          </div>
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Email"
            />
          </div>
          <div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Senha (mín. 6 caracteres)"
            />
          </div>
          <div>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Confirmar senha"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </div>

          <div className="text-center">
            <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
              Já tem conta? Faça login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
```

## 🏠 Módulo Dashboard

### Endpoints de Instância WhatsApp

#### 1. **POST** `/evolution/create-instance` - Criar Instância
```typescript
interface CreateInstanceRequest {
  instanceName: string;        // Nome único da instância
  token: string;              // Token de acesso
  qrcode: boolean;            // Gerar QR code
  number: string;             // Número do WhatsApp
  webhook?: string;           // URL do webhook
  integration: string;        // Tipo de integração
  webhook_by_events: boolean; // Webhook por eventos
  events: string[];           // Lista de eventos
  websocket_enabled: boolean; // WebSocket habilitado
  websocket_events: string[]; // Eventos WebSocket
  proxy?: {
    enabled: boolean;
    host?: string;
    port?: number;
    protocol?: string;
    username?: string;
    password?: string;
  };
}

interface CreateInstanceResponse {
  instance: {
    instanceName: string;
    status: 'ACTIVE' | 'INACTIVE';
    serverUrl: string;
    webhook: string;
  };
  hash: {
    apikey: string;
  };
  settings: {
    reject_call: boolean;
    msg_call: string;
    groups_ignore: boolean;
    always_online: boolean;
    read_messages: boolean;
    read_status: boolean;
  };
}
```

#### 2. **GET** `/evolution/connect/:instanceName` - Obter QR Code
```typescript
interface QRCodeResponse {
  base64: string;    // QR code em base64
  code: string;      // Código do QR
  count: number;     // Tentativas
}
```

#### 3. **GET** `/evolution/connectionState/:instanceName` - Estado da Conexão
```typescript
interface ConnectionStateResponse {
  instance: {
    instanceName: string;
    state: 'open' | 'connecting' | 'close';
  };
}
```

### Implementação do Dashboard

#### 1. **Página Principal do Dashboard** (`app/dashboard/page.tsx`)
```typescript
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import CreateInstanceForm from '@/components/dashboard/CreateInstanceForm';
import QRCodeDisplay from '@/components/dashboard/QRCodeDisplay';
import InstanceStatus from '@/components/dashboard/InstanceStatus';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [instance, setInstance] = useState(null);
  const [qrCode, setQRCode] = useState('');
  const [connectionState, setConnectionState] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">WhatsApp AI Agent</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Olá, {user?.name}</span>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Criar Instância WhatsApp
                </h3>
                <div className="mt-5">
                  <CreateInstanceForm 
                    onInstanceCreated={setInstance}
                    onQRCodeGenerated={setQRCode}
                  />
                </div>
              </div>
            </div>

            {qrCode && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Conectar WhatsApp
                  </h3>
                  <div className="mt-5">
                    <QRCodeDisplay qrCode={qrCode} />
                  </div>
                </div>
              </div>
            )}

            {instance && (
              <div className="bg-white overflow-hidden shadow rounded-lg md:col-span-2">
                <div className="px-4 py-5 sm:p-6">
                  <InstanceStatus 
                    instance={instance} 
                    connectionState={connectionState}
                    onStateChange={setConnectionState}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
```

#### 2. **Formulário de Criação de Instância** (`components/dashboard/CreateInstanceForm.tsx`)
```typescript
'use client';
import { useState } from 'react';
import api from '@/lib/api';

interface Props {
  onInstanceCreated: (instance: any) => void;
  onQRCodeGenerated: (qrCode: string) => void;
}

export default function CreateInstanceForm({ onInstanceCreated, onQRCodeGenerated }: Props) {
  const [formData, setFormData] = useState({
    instanceName: '',
    token: '',
    number: '',
    webhook: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Criar instância
      const instanceResponse = await api.post('/evolution/create-instance', {
        instanceName: formData.instanceName,
        token: formData.token,
        qrcode: true,
        number: formData.number,
        webhook: formData.webhook || undefined,
        integration: 'WHATSAPP-BAILEYS',
        webhook_by_events: true,
        events: ['MESSAGES_UPSERT', 'CONNECTION_UPDATE'],
        websocket_enabled: true,
        websocket_events: ['MESSAGES_UPSERT'],
      });

      const instance = instanceResponse.data;
      onInstanceCreated(instance);

      // 2. Obter QR Code
      const qrResponse = await api.get(`/evolution/connect/${formData.instanceName}`);
      onQRCodeGenerated(qrResponse.data.base64);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar instância');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nome da Instância
        </label>
        <input
          type="text"
          required
          value={formData.instanceName}
          onChange={(e) => setFormData({ ...formData, instanceName: e.target.value })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Ex: minha-instancia"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Token de Acesso
        </label>
        <input
          type="text"
          required
          value={formData.token}
          onChange={(e) => setFormData({ ...formData, token: e.target.value })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Token único para esta instância"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Número WhatsApp
        </label>
        <input
          type="tel"
          required
          value={formData.number}
          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="5511999999999"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Webhook URL (Opcional)
        </label>
        <input
          type="url"
          value={formData.webhook}
          onChange={(e) => setFormData({ ...formData, webhook: e.target.value })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="https://seu-webhook.com/endpoint"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Criando...' : 'Criar Instância'}
      </button>
    </form>
  );
}
```

#### 3. **Display do QR Code** (`components/dashboard/QRCodeDisplay.tsx`)
```typescript
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Props {
  qrCode: string;
}

export default function QRCodeDisplay({ qrCode }: Props) {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center">
      <div className="mb-4">
        <Image
          src={`data:image/png;base64,${qrCode}`}
          alt="QR Code WhatsApp"
          width={300}
          height={300}
          className="mx-auto border rounded-lg"
        />
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          1. Abra o WhatsApp no seu celular
        </p>
        <p className="text-sm text-gray-600">
          2. Vá em Menu → Aparelhos conectados
        </p>
        <p className="text-sm text-gray-600">
          3. Escaneie este QR code
        </p>
      </div>

      {countdown > 0 && (
        <div className="mt-4">
          <p className="text-xs text-gray-500">
            QR Code expira em {countdown}s
          </p>
        </div>
      )}
    </div>
  );
}
```

## 💬 Módulo de Chat

### Endpoints de Mensagens

#### 1. **POST** `/evolution/message/text/:instanceName` - Enviar Mensagem
```typescript
interface SendTextMessageRequest {
  number: string;           // Número de destino
  text: string;            // Texto da mensagem
  options?: {
    delay?: number;        // Delay em ms
    presence?: string;     // Status de presença
  };
}
```

#### 2. **GET** `/evolution/message/history/:instanceName/:contactNumber` - Histórico
```typescript
interface MessageHistoryResponse {
  messages: Array<{
    id: string;
    from: string;
    to: string;
    text: string;
    timestamp: number;
    fromMe: boolean;
    type: string;
  }>;
}
```

### Endpoints de Conversas

#### 1. **POST** `/conversations` - Criar Conversa
```typescript
interface CreateConversationRequest {
  userId: number;
  title?: string;
  context?: any;
  isActive?: boolean;
}
```

#### 2. **POST** `/conversations/:conversationId/messages` - Adicionar Mensagem
```typescript
interface AddMessageRequest {
  conversationId: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  metadata?: any;
}
```

## 🔄 Gerenciamento de Estado

### Estado Global com Zustand

```typescript
// store/auth.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));
```

## 🚀 Implementação Rápida

### Ordem de Implementação

1. **Configuração Base**
   - Instalar dependências: `npm install axios zustand`
   - Configurar Tailwind CSS
   - Configurar variáveis de ambiente

2. **Autenticação** (1-2 horas)
   - Cliente API (`lib/api.ts`)
   - Hook de autenticação (`hooks/useAuth.ts`)
   - Páginas de login e cadastro
   - Middleware de proteção de rotas

3. **Dashboard** (2-3 horas)
   - Layout principal
   - Formulário de criação de instância
   - Display do QR Code
   - Status da conexão

4. **Chat Interface** (2-3 horas)
   - Interface de chat básica
   - Envio e recebimento de mensagens
   - Histórico de conversas

### Variáveis de Ambiente

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

### Scripts Package.json

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

## 📱 Interface Responsiva

O design será responsivo usando Tailwind CSS com:
- Mobile-first approach
- Breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Componentes adaptáveis para diferentes tamanhos de tela

## 🔒 Segurança

- Tokens JWT armazenados em localStorage
- Interceptors para renovação automática de tokens
- Validação de formulários no frontend e backend
- Sanitização de dados de entrada

Este plano fornece uma base sólida para implementar rapidamente o frontend do chat WhatsApp AI Agent com todas as funcionalidades essenciais.

