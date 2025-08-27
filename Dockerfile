# Dockerfile corrigido para Railway
FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de dependências primeiro
COPY package*.json ./
COPY prisma ./prisma/

# Instalar TODAS as dependências (dev + prod) para poder fazer build
RUN npm install

# Gerar Prisma Client
RUN npx prisma generate

# Copiar código fonte
COPY . .

# Build da aplicação (precisa das deps de dev)
RUN npm run build

# Limpar dependências de dev após o build (opcional)
RUN npm prune --production

# Expor porta
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "run", "start:prod"]