# Dockerfile simples para Railway (executado da pasta backend)
FROM node:18

WORKDIR /app

# Copiar arquivos do diretório atual (backend)
COPY . .

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