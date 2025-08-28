# Dockerfile simplificado para Railway
FROM node:18-alpine

WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache openssl ca-certificates

# Copiar arquivos de dependências
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Instalar dependências com retry em caso de falha de rede
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 5 && \
    npm ci --production --no-audit --no-fund

# Gerar Prisma Client
RUN npx prisma generate

# Copiar código fonte
COPY backend/src ./src
COPY backend/nest-cli.json ./
COPY backend/tsconfig*.json ./

# Build da aplicação
RUN npm run build

# Remover dependências de desenvolvimento para reduzir tamanho
RUN npm prune --production

# Expor porta
EXPOSE 3000

# Health check simples
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Comando para iniciar
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
