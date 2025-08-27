# Frontend - WhatsApp AI Agent

Este é o frontend do projeto WhatsApp AI Agent.

## 🚧 Em Desenvolvimento

O frontend será implementado em breve com:

- **Next.js 14** com App Router
- **TypeScript** para tipagem estática
- **Tailwind CSS** para estilização
- **Shadcn/ui** para componentes
- **React Query** para gerenciamento de estado
- **Zod** para validação

## 📋 Funcionalidades Planejadas

- ✅ Dashboard de conversas
- ✅ Interface para gerenciar instâncias WhatsApp
- ✅ Configuração de bots OpenAI
- ✅ Visualização de estatísticas
- ✅ Histórico de mensagens
- ✅ Configurações avançadas

## 🏗️ Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/                 # App Router (Next.js 14)
│   ├── components/          # Componentes reutilizáveis
│   ├── lib/                 # Utilitários e configurações
│   ├── hooks/               # Custom hooks
│   ├── types/               # Definições TypeScript
│   └── styles/              # Estilos globais
├── public/                  # Arquivos estáticos
└── package.json
```

## 🚀 Como Executar

```bash
cd frontend
npm install
npm run dev
```

## 🔗 Integração com Backend

O frontend consumirá a API REST do backend localizada em `../backend/`.

Endpoints principais:
- `/auth/*` - Autenticação
- `/evolution/*` - Gerenciamento WhatsApp
- `/openai/*` - Configuração IA
- `/conversations/*` - Histórico de conversas
