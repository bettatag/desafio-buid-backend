# Evolution AI Frontend

Uma aplicação moderna e profissional para integrar WhatsApp com Inteligência Artificial usando Evolution API e OpenAI.

## 🚀 Funcionalidades

- **Autenticação Completa**: Login e cadastro com JWT e cookies httpOnly
- **Dashboard Intuitivo**: Interface limpa e moderna para gerenciar recursos
- **Gerenciamento de Instâncias**: Criar e configurar instâncias da Evolution API
- **Agentes de IA**: Configurar bots inteligentes com OpenAI
- **Chat Interface**: Conversar diretamente com agentes de IA
- **Design Responsivo**: Funciona perfeitamente em desktop e mobile

## 🛠️ Tecnologias Utilizadas

### Core
- **Next.js 15** com App Router
- **React 19** com TypeScript
- **Tailwind CSS** para estilização
- **shadcn/ui** componentes base

### Formulários e Validação
- **React Hook Form** para gerenciamento de formulários
- **Zod** para validação de schemas
- **@hookform/resolvers** para integração

### HTTP e Estado
- **Axios** para requisições HTTP
- **js-cookie** para manipulação de cookies
- Context API para estado global

### UI/UX
- **Radix UI** componentes acessíveis
- **Lucide React** ícones
- **class-variance-authority** para variantes de componentes

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── (auth)/            # Grupo de rotas de autenticação
│   │   ├── login/         # Página de login
│   │   └── register/      # Página de cadastro
│   ├── dashboard/         # Dashboard principal
│   │   ├── instances/     # Gerenciamento de instâncias
│   │   ├── ai-agents/     # Configuração de agentes IA
│   │   └── conversations/ # Interface de chat
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Home page
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── forms/            # Formulários específicos
│   ├── layouts/          # Layouts da aplicação
│   └── features/         # Componentes por feature
├── lib/                  # Utilitários e configurações
│   ├── api.ts           # Cliente HTTP (axios)
│   ├── utils.ts         # Funções utilitárias
│   └── validations.ts   # Schemas de validação (Zod)
├── hooks/               # Custom hooks
├── types/               # Definições TypeScript
└── middleware.ts        # Middleware de autenticação
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ instalado
- Backend da aplicação rodando na porta 3000

### Instalação

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   ```bash
   # Copie o arquivo de exemplo
   cp env.example .env.local
   
   # Edite o arquivo .env.local com suas configurações
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXT_PUBLIC_APP_URL=http://localhost:3001
   ```

3. **Executar em desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acessar a aplicação:**
   Abra [http://localhost:3001](http://localhost:3001) no seu navegador

### Build para Produção

```bash
# Gerar build otimizado
npm run build

# Executar em produção
npm start
```

## 📖 Como Usar

### 1. Primeiro Acesso

1. Acesse a home page em `/`
2. Clique em "Cadastrar" para criar uma conta
3. Preencha seus dados e crie a conta
4. Você será redirecionado automaticamente para o dashboard

### 2. Gerenciar Instâncias Evolution API

1. No dashboard, clique em "Instâncias" no menu lateral
2. Clique em "Nova Instância"
3. Preencha os dados:
   - **Nome da Instância**: Um nome descritivo
   - **Token**: Token de acesso (mínimo 10 caracteres)
   - **Número**: Seu número do WhatsApp com código do país
   - **Webhook**: URL para receber eventos
4. Configure as opções desejadas
5. Clique em "Criar Instância"

### 3. Configurar Agentes de IA

1. Vá para "Agentes IA" no menu
2. Selecione a instância desejada
3. Clique em "Novo Agente"
4. Configure o agente:
   - **Nome**: Nome do agente
   - **Credenciais OpenAI**: ID das suas credenciais
   - **Modelo**: gpt-3.5-turbo, gpt-4, etc.
   - **Temperatura**: Controla criatividade (0-2)
   - **Mensagens do Sistema**: Instruções para o agente
5. Clique em "Criar Agente"

### 4. Testar com Chat

1. Acesse "Conversações" no menu
2. Clique em "Nova Conversa"
3. Digite suas mensagens para testar o agente
4. Veja as respostas em tempo real

## 🎨 Design System

### Cores Principais

- **Primary**: Azul (#3B82F6)
- **Secondary**: Cinza claro
- **Success**: Verde
- **Warning**: Amarelo
- **Error**: Vermelho

### Componentes Base

Todos os componentes seguem o padrão do shadcn/ui:

- `Button`: Botões com variantes (default, outline, ghost, etc.)
- `Input`: Campos de entrada
- `Card`: Containers de conteúdo
- `Label`: Rótulos de formulário

### Responsividade

- **Mobile First**: Design otimizado para mobile
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navigation**: Menu lateral colapsa em tela pequena

## 🔒 Segurança

### Autenticação

- **JWT Tokens**: Access token e refresh token
- **HTTP-Only Cookies**: Tokens armazenados de forma segura
- **Auto Refresh**: Renovação automática de tokens
- **Route Protection**: Middleware protege rotas privadas

### Validação

- **Client-side**: Validação em tempo real com Zod
- **Server-side**: Validação adicional no backend
- **Type Safety**: TypeScript garante tipos corretos

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Docker

```bash
# Build da imagem
docker build -t evolution-frontend .

# Executar container
docker run -p 3001:3001 evolution-frontend
```

## 📝 Próximos Passos

### Melhorias Sugeridas

1. **Testes**: Adicionar testes unitários e E2E
2. **PWA**: Transformar em Progressive Web App
3. **Real-time**: WebSocket para atualizações em tempo real
4. **Analytics**: Dashboard com métricas de uso
5. **Themes**: Suporte a tema escuro
6. **Internationalization**: Suporte a múltiplos idiomas

### Otimizações

1. **Performance**: Lazy loading e code splitting
2. **SEO**: Melhorar meta tags e estrutura
3. **Accessibility**: Melhorar acessibilidade
4. **Caching**: Implementar estratégias de cache

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

---

**Desenvolvido com ❤️ usando as melhores práticas de desenvolvimento frontend**