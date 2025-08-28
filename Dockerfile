# Multi-stage build para otimizar tamanho da imagem
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar dependências do sistema necessárias (incluindo ca-certificates para conexões SSL)
RUN apk add --no-cache openssl ca-certificates

# Copiar arquivos de dependências
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Instalar todas as dependências (incluindo dev)
RUN npm ci

# Gerar Prisma Client
RUN npx prisma generate

# Copiar código fonte
COPY backend/ .

# Build da aplicação
RUN npm run build

# Stage de produção
FROM node:18-alpine AS production

WORKDIR /app

# Instalar dependências do sistema necessárias
RUN apk add --no-cache openssl ca-certificates dumb-init

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nestjs -u 1001

# Copiar arquivos de dependências
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Gerar Prisma Client
RUN npx prisma generate

# Copiar build da aplicação
COPY --from=builder /app/dist ./dist

# Alterar propriedade dos arquivos para o usuário não-root
RUN chown -R nestjs:nodejs /app

# Mudar para usuário não-root
USER nestjs

# Expor porta
EXPOSE 3000

# Health check otimizado para Railway
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Usar dumb-init para melhor gerenciamento de sinais
ENTRYPOINT ["dumb-init", "--"]

# Comando para iniciar (aguarda conexão com banco antes de iniciar)
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
