# Dockerfile para Railway - Versão Final
FROM node:18-alpine

WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache openssl ca-certificates

# Copiar arquivos específicos primeiro
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Instalar dependências
RUN npm install

# Copiar resto do código
COPY backend/src ./src/
COPY backend/nest-cli.json ./
COPY backend/tsconfig*.json ./

# Gerar Prisma Client
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# Limpar cache npm
RUN npm cache clean --force

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
