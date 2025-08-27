# 🤖 WhatsApp AI Agent - Monorepo

Solução completa para criação de agentes de IA integrados ao WhatsApp, desenvolvida com arquitetura moderna e escalável.

## 📁 Estrutura do Projeto

```
desafio-buid/
├── backend/                 # API REST (NestJS + TypeScript)
├── frontend/                # Interface Web (Next.js + TypeScript)
└── README.md               # Este arquivo
```

## 🏗️ Arquitetura

### Backend (`/backend/`)
- **Framework**: NestJS com TypeScript
- **Arquitetura**: Clean Architecture + SOLID
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: JWT (Access + Refresh Tokens)
- **Testes**: Jest com cobertura completa
- **Deploy**: Railway com Docker

### Frontend (`/frontend/`)
- **Framework**: Next.js 14 com App Router
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS + Shadcn/ui
- **Estado**: React Query + Zustand
- **Deploy**: Vercel/Netlify

## 🚀 Funcionalidades

### ✅ Implementadas (Backend)
- **Autenticação completa** com JWT
- **Gerenciamento de instâncias WhatsApp** via Evolution API
- **Integração com OpenAI** para bots inteligentes
- **Sistema de conversas** com persistência
- **Rate limiting** (100 req/min)
- **Testes unitários** completos (383 testes)
- **Deploy automatizado** no Railway

### 🚧 Em Desenvolvimento (Frontend)
- Dashboard de conversas
- Interface para gerenciar instâncias
- Configuração de bots IA
- Visualização de estatísticas
- Histórico de mensagens

## 🛠️ Como Executar

### Backend
```bash
cd backend
npm install
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📊 Status dos Testes

```
Test Suites: 16 passed, 16 total
Tests:       383 passed, 383 total
Snapshots:   0 total
Time:        ~30s
```

## 🌐 APIs Disponíveis

### Autenticação
- `POST /auth/register` - Registro de usuário
- `POST /auth/login` - Login
- `POST /auth/refresh` - Renovar token
- `GET /auth/me` - Dados do usuário

### WhatsApp (Evolution API)
- `POST /evolution/create-instance` - Criar instância
- `GET /evolution/connect/:instanceName` - Obter QR Code
- `POST /evolution/message/text/:instanceName` - Enviar mensagem
- `GET /evolution/sessions/:instanceName` - Listar sessões

### OpenAI
- `POST /openai/create/:instanceName` - Criar bot IA
- `POST /openai/creds/:instanceName` - Configurar credenciais
- `POST /openai/settings/:instanceName` - Configurar bot

### Conversas
- `POST /conversations` - Criar conversa
- `GET /conversations` - Listar conversas
- `POST /conversations/:id/messages` - Adicionar mensagem
- `GET /conversations/stats` - Estatísticas

## 🚀 Deploy

### Backend (Railway)
```bash
# Conectar ao Railway
railway login
railway link

# Deploy automático via Git
git push origin main
```

### Frontend (Vercel)
```bash
# Conectar ao Vercel
vercel login
vercel link

# Deploy
vercel --prod
```

## 📚 Documentação

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Guia de Deploy](./backend/DEPLOY-QUICK-START.md)
- [Desafio Técnico](./backend/desafio_fullstack.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ usando as melhores práticas de desenvolvimento**