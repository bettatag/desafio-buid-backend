# Dockerfile simplificado para Railway
FROM node:18

WORKDIR /app

# Copiar tudo de uma vez para evitar problemas de checksum
COPY backend/ .

# Instalar dependências
RUN npm install

# Gerar Prisma Client
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
