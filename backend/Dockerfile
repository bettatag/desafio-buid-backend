# Multi-stage build para otimizar tamanho da imagem
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar dependências do sistema necessárias
RUN apk add --no-cache openssl

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas as dependências (incluindo dev)
RUN npm ci

# Gerar Prisma Client
RUN npx prisma generate

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage de produção
FROM node:18-alpine AS production

WORKDIR /app

# Instalar dependências do sistema necessárias
RUN apk add --no-cache openssl

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Gerar Prisma Client
RUN npx prisma generate

# Copiar build da aplicação
COPY --from=builder /app/dist ./dist

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
USER nestjs

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Comando para iniciar
CMD ["npm", "run", "start:prod"]