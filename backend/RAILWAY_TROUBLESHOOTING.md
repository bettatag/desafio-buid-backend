# 🚨 Railway Deploy Troubleshooting

## Problema Atual: "Railpack could not determine how to build the app"

### ❌ O que estava acontecendo:
- Railway estava usando **Railpack** em vez do **Dockerfile**
- O sistema não conseguia detectar automaticamente como fazer o build
- A configuração do `railway.json` não estava sendo respeitada

### ✅ Soluções Aplicadas:

#### 1. Corrigir railway.json
```json
{
  "build": {
    "builder": "dockerfile"  // Mudou de "DOCKERFILE" para "dockerfile"
  }
}
```

#### 2. Adicionar arquivos de configuração alternativos:
- `.railwayignore` - Para ignorar arquivos desnecessários
- `nixpacks.toml` - Configuração alternativa caso Railway use Nixpacks
- `Dockerfile.simple` - Versão simplificada do Dockerfile

#### 3. Dockerfile otimizado com multi-stage build
- Build mais eficiente
- Imagem menor
- Health check integrado
- Usuário não-root para segurança

## 🔧 Passos para Resolver:

### 1. Verificar Configuração no Railway Dashboard

1. **Acesse o projeto no Railway**
2. **Vá para Settings > General**
3. **Verifique se:**
   - Root Directory está definido como `backend` (se necessário)
   - Build Command está vazio (deixe o Dockerfile gerenciar)
   - Start Command está como `npm run start:prod`

### 2. Forçar Uso do Dockerfile

Se ainda não funcionar, adicione estas variáveis de ambiente no Railway:

```env
RAILWAY_DOCKERFILE_PATH=Dockerfile
NIXPACKS_BUILD_CMD=echo "Using Dockerfile instead"
```

### 3. Alternativa: Usar Dockerfile Simples

Se o multi-stage build causar problemas, renomeie os arquivos:

```bash
mv Dockerfile Dockerfile.multi-stage
mv Dockerfile.simple Dockerfile
```

### 4. Verificar Logs de Build

No Railway Dashboard:
1. Clique no deploy que falhou
2. Vá para "Build Logs"
3. Procure por erros específicos

## 🐛 Problemas Comuns e Soluções:

### Problema: "No Dockerfile found"
**Solução:** Certifique-se de que o arquivo `Dockerfile` está na raiz da pasta backend

### Problema: "Prisma generate failed"
**Solução:** Verifique se `DATABASE_URL` está configurada nas variáveis de ambiente

### Problema: "npm run start:prod failed"
**Solução:** Verifique se o build foi concluído com sucesso

### Problema: "Health check failed"
**Solução:** Certifique-se de que a aplicação está rodando na porta 3000

## 📋 Checklist de Deploy:

- [ ] `Dockerfile` existe na pasta backend
- [ ] `railway.json` configurado corretamente
- [ ] Variáveis de ambiente configuradas:
  - [ ] `DATABASE_URL`
  - [ ] `JWT_SECRET`
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3000`
- [ ] Root directory configurado (se necessário)
- [ ] Build command vazio
- [ ] Start command: `npm run start:prod`

## 🔄 Comandos para Testar Localmente:

```bash
# Verificar se tudo está correto
node check-deploy-ready.js

# Se tiver Docker instalado, testar build
docker build -t backend-test .
docker run -p 3000:3000 \
  -e DATABASE_URL="your-db-url" \
  -e JWT_SECRET="your-jwt-secret" \
  -e NODE_ENV="production" \
  backend-test
```

## 🆘 Se Nada Funcionar:

### Opção 1: Deploy Manual via CLI
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Opção 2: Usar Buildpack Nixpacks
Remova o `Dockerfile` temporariamente e deixe o Railway detectar automaticamente:
- Renomeie `Dockerfile` para `Dockerfile.backup`
- O Railway usará o `nixpacks.toml` automaticamente

### Opção 3: Configuração Manual no Dashboard
1. Vá para Settings > General
2. Configure manualmente:
   - Build Command: `npm ci && npx prisma generate && npm run build`
   - Start Command: `npm run start:prod`
   - Install Command: `npm ci`

## 📞 Próximos Passos:

1. **Commit e Push** das mudanças atuais
2. **Aguardar** o novo deploy no Railway
3. **Verificar logs** se falhar novamente
4. **Testar endpoint** `/health` quando funcionar

## 🔗 Links Úteis:

- [Railway Docs - Dockerfile](https://docs.railway.app/deploy/dockerfiles)
- [Railway Docs - Nixpacks](https://docs.railway.app/deploy/builds)
- [Railway Community](https://discord.gg/railway)
