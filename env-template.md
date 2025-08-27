# 📋 Environment Variables Template

## 🔧 **Para Desenvolvimento Local (.env)**

Crie um arquivo `.env` na raiz do projeto com:

```bash
# Database
DATABASE_URL="postgresql://postgres:3abcd8ae2feffdf26d81fc09c7dbadf7@31.9"

# Evolution API
EVOLUTION_API_URL="https://evolution.pramimavagaedele.com.br/"
EVOLUTION_API_INSTANCE_NUMBER="551151960238"
EVOLUTION_API_INSTANCE_KEY="999C6245C026-4BE9-811B-585931220FC6"
EVOLUTION_API_INSTANCE_NAME="pramimavagaedele"

# OpenAI
OPENAI_API_KEY="sk-proj-vxzixTRvq7a8SIRE03Qa7E2m8OBAUHFvb7YHs519To_h1qZJk"

# Auth
JWT_SECRET="mecontratem"

# Server Configuration (opcional)
NODE_ENV="development"
PORT=3000

# Rate Limiting (opcional)
RATE_LIMIT_TTL=60000
RATE_LIMIT_LIMIT=100

# CORS (opcional)
CORS_ORIGIN="*"

# Webhook (opcional)
WEBHOOK_BASE_URL="http://localhost:3000"
WEBHOOK_SECRET="your-webhook-secret"

# Logging (opcional)
LOG_LEVEL="info"

# Security (opcional)
BCRYPT_ROUNDS=10
SESSION_SECRET="your-session-secret"
```

## 🚀 **Para Produção (Railway)**

Use os comandos do `DEPLOY-QUICK-START.md` para configurar no Railway.

## ⚠️ **Notas de Segurança**

1. **JWT_SECRET**: "mecontratem" é muito simples - use algo mais seguro em produção
2. **API Keys**: Considere rotacionar as chaves expostas antes do deploy
3. **Database**: URL completa não mostrada por segurança
4. **CORS**: Use domínios específicos em produção, não "*"
