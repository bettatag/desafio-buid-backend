# Dockerfile simplificado para Railway
FROM node:18

WORKDIR /app

# Copiar tudo do backend de uma vez
COPY backend/ .

# Instalar dependências
RUN npm install

# Gerar Prisma Client
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# Expor porta
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "run", "start:prod"]