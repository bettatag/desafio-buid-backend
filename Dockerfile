# Dockerfile super simples para Railway
FROM node:18-alpine

WORKDIR /app

# Copiar tudo
COPY . .

# Instalar dependências e gerar Prisma
RUN npm install
RUN npx prisma generate
RUN npm run build

# Expor porta
EXPOSE 3000

# Iniciar aplicação
CMD ["npm", "run", "start:prod"]