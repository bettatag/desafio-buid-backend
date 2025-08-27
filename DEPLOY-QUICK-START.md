# ⚡ Quick Start - Deploy Railway

## 🚀 **Deploy em 5 Minutos**

### **1️⃣ Instalar Railway CLI**
```bash
npm install -g @railway/cli
```

### **2️⃣ Login e Setup**
```bash
railway login
railway init
railway add postgresql
```

### **3️⃣ Configurar Variáveis Essenciais**
```bash
# Ambiente e Porta
railway variables set NODE_ENV=production
railway variables set PORT=3000

# Database (será configurado automaticamente pelo Railway PostgreSQL)
# DATABASE_URL será criado automaticamente quando você adicionar PostgreSQL

# Evolution API (suas configurações específicas)
railway variables set EVOLUTION_API_URL="https://evolution.pramimavagaedele.com.br/"
railway variables set EVOLUTION_API_INSTANCE_NUMBER="551151960238"
railway variables set EVOLUTION_API_INSTANCE_KEY="999C6245C026-4BE9-811B-585931220FC6"
railway variables set EVOLUTION_API_INSTANCE_NAME="pramimavagaedele"

# OpenAI
railway variables set OPENAI_API_KEY="sk-proj-vxzixTRvq7a8SIRE03Qa7E2m8OBAUHFvb7YHs519To_h1qZJk"

# JWT (CRÍTICO - MUDE EM PRODUÇÃO!)
railway variables set JWT_SECRET="mecontratem-MUDE-ESTA-CHAVE-PARA-ALGO-MAIS-SEGURO-32-CHARS"

# Rate Limiting
railway variables set RATE_LIMIT_TTL=60000
railway variables set RATE_LIMIT_LIMIT=100

# CORS (configure com seus domínios reais)
railway variables set CORS_ORIGIN="*"
```

### **4️⃣ Deploy**
```bash
railway up
railway run npx prisma migrate deploy
```

### **5️⃣ Testar**
```bash
railway open  # Abre a URL da sua API
# Acesse: https://sua-api.railway.app/health
# Acesse: https://sua-api.railway.app/api/swagger
```

## ✅ **Pronto!**

Sua API está no ar com:
- ✅ Rate limiting (100 req/min)
- ✅ Autenticação JWT
- ✅ PostgreSQL
- ✅ Swagger docs
- ✅ Health checks
- ✅ Segurança configurada

## 🔑 **URLs Importantes**
- **API**: `https://[seu-projeto].railway.app`
- **Health**: `https://[seu-projeto].railway.app/health`
- **Docs**: `https://[seu-projeto].railway.app/api/swagger`

## ⚙️ **Configurações Opcionais**

Para configurações adicionais e segurança:
```bash
# Webhook (configure com sua URL do Railway)
railway variables set WEBHOOK_BASE_URL="https://[seu-projeto].railway.app"
railway variables set WEBHOOK_SECRET="sua-chave-webhook-secreta-aleatoria"

# CORS específico (RECOMENDADO para produção)
railway variables set CORS_ORIGIN="https://seu-frontend.com,https://www.seu-frontend.com"

# Logs
railway variables set LOG_LEVEL="info"

# Segurança adicional
railway variables set BCRYPT_ROUNDS="12"
railway variables set SESSION_SECRET="sua-chave-sessao-secreta-aleatoria"
```

## ⚠️ **IMPORTANTE - SEGURANÇA**

**ANTES DE FAZER DEPLOY EM PRODUÇÃO:**

1. **JWT_SECRET**: Mude "mecontratem" para uma chave forte de 32+ caracteres
2. **API Keys**: Suas chaves estão expostas no exemplo acima - considere rotacioná-las
3. **CORS**: Mude de "*" para seus domínios específicos
4. **Database**: Use uma senha forte para o PostgreSQL

```bash
# Exemplo de JWT_SECRET seguro
railway variables set JWT_SECRET="$(openssl rand -base64 32)"

# Ou gere manualmente uma chave de 32+ caracteres aleatórios
railway variables set JWT_SECRET="Kj8#mP9$nQ2&rT5%wE7!aS4@dF6*gH1^jL3+vB8-cX0="
```

## 📊 **Monitoramento**
```bash
railway logs        # Ver logs
railway status      # Ver status
railway variables   # Ver variáveis
```

---
**🎯 Para instruções detalhadas, consulte `deploy-railway.md`**
