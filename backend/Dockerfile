# Dockerfile para Monorepo - Backend
FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de dependências do backend
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Instalar dependências
RUN npm install

# Gerar Prisma Client
RUN npx prisma generate

# Copiar código fonte do backend
COPY backend/ .

# Build da aplicação
RUN npm run build

# Limpar dependências de dev após o build
RUN npm prune --production

# Expor porta
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "run", "start:prod"]