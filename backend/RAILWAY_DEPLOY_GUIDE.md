# 🚀 Guia de Deploy Railway - Backend

## Problema Identificado

Após reorganizar o projeto em duas pastas separadas (`backend` e `frontend`), o Railway não consegue mais fazer deploy porque:

1. O Dockerfile estava configurado para um monorepo
2. O Railway estava tentando executar comandos da pasta raiz
3. As referências de caminho estavam incorretas

## ✅ Correções Aplicadas

### 1. Dockerfile Corrigido

O Dockerfile foi atualizado para funcionar quando executado a partir da pasta `backend`:

```dockerfile
# Antes (para monorepo)
COPY backend/package*.json ./
COPY backend/prisma ./prisma/
COPY backend/ .

# Depois (para pasta backend)
COPY package*.json ./
COPY prisma ./prisma/
COPY . .
```

### 2. Estrutura de Arquivos Verificada

- ✅ `Dockerfile` - Corrigido para nova estrutura
- ✅ `railway.json` - Configuração mantida
- ✅ `.dockerignore` - Já estava correto
- ✅ `package.json` - Scripts de build funcionando

## 🔧 Como Configurar o Deploy no Railway

### Opção 1: Deploy Automático (Recomendado)

1. **Conectar Repositório**
   - Acesse [railway.app](https://railway.app)
   - Conecte seu repositório GitHub
   - Selecione a pasta `backend` como root directory

2. **Configurar Root Directory**
   - Nas configurações do projeto
   - Defina `Root Directory` como `backend`
   - O Railway automaticamente detectará o Dockerfile

3. **Variáveis de Ambiente**
   ```env
   DATABASE_URL=postgresql://...
   JWT_SECRET=seu-jwt-secret-aqui
   NODE_ENV=production
   PORT=3000
   ```

### Opção 2: Deploy Manual via CLI

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Navegar para pasta backend
cd backend

# 4. Inicializar projeto
railway init

# 5. Deploy
railway up
```

### Opção 3: Configuração via railway.toml (Se necessário)

Se o Railway não detectar automaticamente, crie um arquivo `railway.toml` na raiz do projeto:

```toml
[build]
builder = "dockerfile"
dockerfilePath = "backend/Dockerfile"

[deploy]
startCommand = "npm run start:prod"
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

## 🐳 Testando Localmente

Para testar o Dockerfile localmente:

```bash
# Na pasta backend
cd backend

# Build da imagem
docker build -t backend-test .

# Executar container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-db-url" \
  -e JWT_SECRET="your-jwt-secret" \
  -e NODE_ENV="production" \
  backend-test
```

## 📋 Checklist de Deploy

- [ ] Repositório conectado ao Railway
- [ ] Root directory configurado como `backend`
- [ ] Variáveis de ambiente configuradas
- [ ] Dockerfile na pasta backend (✅ já corrigido)
- [ ] railway.json configurado (✅ já está)
- [ ] Database URL configurada
- [ ] JWT_SECRET definido

## 🔍 Troubleshooting

### Erro: "No Dockerfile found"
- **Solução**: Certifique-se de que o root directory está definido como `backend`

### Erro: "Cannot find package.json"
- **Solução**: Verifique se o Dockerfile está copiando os arquivos corretamente

### Erro: "Prisma generate failed"
- **Solução**: Certifique-se de que `DATABASE_URL` está configurada

### Erro: "Health check failed"
- **Solução**: Verifique se o endpoint `/health` está funcionando

## 📞 Próximos Passos

1. **Configurar Railway**
   - Defina root directory como `backend`
   - Configure variáveis de ambiente

2. **Testar Deploy**
   - Faça um commit das mudanças
   - O Railway deve detectar e fazer deploy automaticamente

3. **Verificar Funcionamento**
   - Acesse a URL fornecida pelo Railway
   - Teste o endpoint `/health`
   - Verifique logs em caso de erro

O backend agora está configurado corretamente para deploy no Railway com a nova estrutura de pastas!
