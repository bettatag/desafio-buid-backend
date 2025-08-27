# 🚀 Deploy Guide - Railway

## 📋 **Pré-requisitos**

1. ✅ Conta no Railway (https://railway.app)
2. ✅ CLI do Railway instalado: `npm install -g @railway/cli`
3. ✅ Repositório Git configurado
4. ✅ Todos os arquivos de configuração criados

## 🎯 **Passo a Passo do Deploy**

### **1️⃣ Preparar o Projeto**
```bash
# Verificar se tudo está funcionando localmente
npm run build
npm run test

# Fazer commit de todas as mudanças
git add .
git commit -m "feat: prepare for Railway deployment"
git push origin main
```

### **2️⃣ Login no Railway**
```bash
railway login
```

### **3️⃣ Criar Projeto no Railway**
```bash
# Criar novo projeto
railway init

# Ou conectar a um projeto existente
railway link [project-id]
```

### **4️⃣ Adicionar PostgreSQL**
```bash
# Adicionar banco de dados PostgreSQL
railway add postgresql

# Verificar variáveis de ambiente
railway variables
```

### **5️⃣ Configurar Variáveis de Ambiente**

No dashboard do Railway ou via CLI:

```bash
# Configurar variáveis essenciais
railway variables set NODE_ENV=production
railway variables set JWT_SECRET="your-super-secure-jwt-secret-32-chars"
railway variables set CORS_ORIGIN="https://your-frontend.com"
railway variables set OPENAI_API_KEY="sk-proj-your-key"
railway variables set EVOLUTION_API_KEY="your-evolution-key"
railway variables set WEBHOOK_SECRET="your-webhook-secret"
railway variables set RATE_LIMIT_TTL=60000
railway variables set RATE_LIMIT_LIMIT=100
```

### **6️⃣ Deploy**
```bash
# Deploy da aplicação
railway up

# Ou usar deployment automático via Git
railway connect  # Conecta ao repositório GitHub
```

### **7️⃣ Executar Migrações**
```bash
# Executar migrações do Prisma
railway run npx prisma migrate deploy

# Executar seed (opcional)
railway run npm run db:seed
```

### **8️⃣ Verificar Deploy**
```bash
# Ver logs em tempo real
railway logs

# Verificar status
railway status

# Abrir aplicação no browser
railway open
```

## 🔧 **Configurações Importantes**

### **Domínio Customizado**
1. Vá para o dashboard do Railway
2. Clique em "Settings" > "Domains"
3. Adicione seu domínio customizado
4. Configure DNS CNAME para `railway.app`

### **Variáveis de Ambiente Críticas**
```bash
# OBRIGATÓRIAS
DATABASE_URL=postgresql://... (auto-gerada)
JWT_SECRET=sua-chave-secreta-32-chars
NODE_ENV=production

# RECOMENDADAS
CORS_ORIGIN=https://seu-frontend.com
OPENAI_API_KEY=sua-chave-openai
EVOLUTION_API_KEY=sua-chave-evolution
WEBHOOK_BASE_URL=https://sua-api.railway.app
```

## 📊 **Monitoramento**

### **Health Check**
- Endpoint: `https://sua-api.railway.app/health`
- Railway monitora automaticamente
- Restart automático em caso de falha

### **Logs**
```bash
# Ver logs em tempo real
railway logs --tail

# Ver logs de um serviço específico
railway logs --service=web
```

### **Métricas**
- CPU, Memória, Rede disponíveis no dashboard
- Alertas automáticos configuráveis

## 🚨 **Troubleshooting**

### **Deploy Falha**
```bash
# Verificar logs de build
railway logs --deployment

# Verificar configurações
railway variables

# Redeployar
railway redeploy
```

### **Database Issues**
```bash
# Verificar conexão com DB
railway run npx prisma db push

# Reset database (CUIDADO!)
railway run npx prisma migrate reset
```

### **Environment Issues**
```bash
# Listar todas as variáveis
railway variables

# Testar localmente com variáveis do Railway
railway run npm start
```

## ✅ **Checklist Final**

- [ ] ✅ Aplicação builda sem erros
- [ ] ✅ Testes passando
- [ ] ✅ PostgreSQL configurado
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ Deploy realizado com sucesso
- [ ] ✅ Migrações executadas
- [ ] ✅ Health check respondendo
- [ ] ✅ Endpoints funcionando
- [ ] ✅ Rate limiting ativo
- [ ] ✅ CORS configurado
- [ ] ✅ Logs funcionando

## 🎉 **Próximos Passos**

1. **Monitoramento**: Configure alertas no Railway
2. **Backup**: Configure backup automático do banco
3. **CI/CD**: Configure deploy automático via GitHub
4. **SSL**: Certificado SSL automático (incluído)
5. **Scaling**: Configure auto-scaling se necessário

## 📞 **URLs Importantes**

- **API Base**: `https://sua-api.railway.app`
- **Health Check**: `https://sua-api.railway.app/health`
- **Swagger Docs**: `https://sua-api.railway.app/api/swagger`
- **Railway Dashboard**: `https://railway.app/project/[project-id]`

---

🚀 **Sua API estará pronta para produção no Railway!** 🎯
