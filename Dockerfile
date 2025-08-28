# Dockerfile ultra-simplificado para Railway
FROM node:18-alpine

WORKDIR /app

# Instalar dependências básicas
RUN apk add --no-cache openssl

# Copiar tudo do backend
COPY backend/ .

# Instalar dependências de forma mais robusta
RUN npm install --production

# Gerar Prisma Client
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# Expor porta
EXPOSE 3000

# Comando para iniciar
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
