# Docker Setup - Backend

Este documento explica como usar o Dockerfile otimizado para o projeto backend com PostgreSQL externo no Railway.

## 🚀 Características do Dockerfile

- **Multi-stage build** para imagem otimizada
- **Usuário não-root** para segurança
- **Health check** configurado
- **SSL/TLS support** para conexões com PostgreSQL
- **Auto-migration** do Prisma na inicialização
- **Gerenciamento adequado de sinais** com dumb-init

## 📋 Pré-requisitos

1. Docker instalado
2. PostgreSQL rodando no Railway com variáveis de ambiente configuradas
3. Arquivo `.env` com as configurações necessárias

## 🔧 Configuração

1. **Copie o arquivo de exemplo das variáveis de ambiente:**
   ```bash
   cp env.example .env
   ```

2. **Configure as variáveis no arquivo `.env`:**
   - `DATABASE_URL`: URL de conexão do PostgreSQL do Railway
   - `JWT_SECRET`: Chave secreta para JWT
   - Outras variáveis conforme necessário

## 🐳 Build da Imagem

### Usando o script automatizado (Linux/Mac):
```bash
./docker-build.sh
```

### Manualmente:
```bash
docker build -t desafio-backend:latest .
```

## 🚀 Executando o Container

### Com arquivo .env:
```bash
docker run -p 3000:3000 --env-file .env desafio-backend:latest
```

### Com variáveis individuais:
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e JWT_SECRET="your-jwt-secret" \
  -e NODE_ENV="production" \
  desafio-backend:latest
```

### Em modo detached (background):
```bash
docker run -d -p 3000:3000 --env-file .env --name backend-app desafio-backend:latest
```

## 📊 Monitoramento

### Ver logs:
```bash
docker logs backend-app
```

### Ver logs em tempo real:
```bash
docker logs -f backend-app
```

### Verificar status do container:
```bash
docker ps
```

### Verificar health check:
```bash
docker inspect backend-app | grep Health -A 10
```

## 🔍 Debug

### Executar shell no container:
```bash
docker exec -it backend-app sh
```

### Verificar variáveis de ambiente:
```bash
docker exec backend-app env
```

## 🌐 Deploy no Railway

1. **Build e tag da imagem:**
   ```bash
   docker build -t your-registry/desafio-backend:latest .
   docker push your-registry/desafio-backend:latest
   ```

2. **Configure o Railway para usar a imagem Docker**

3. **Certifique-se de que as variáveis de ambiente estão configuradas no Railway**

## 📝 Variáveis de Ambiente Essenciais

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL do PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Chave JWT | `your-secret-key` |
| `PORT` | Porta do servidor | `3000` |
| `NODE_ENV` | Ambiente | `production` |

## 🛠️ Troubleshooting

### Container não inicia:
1. Verifique se a `DATABASE_URL` está correta
2. Confirme se o PostgreSQL está acessível
3. Verifique os logs: `docker logs backend-app`

### Erro de conexão com banco:
1. Teste a conexão manualmente
2. Verifique se o SSL está configurado corretamente
3. Confirme as credenciais do banco

### Health check falhando:
1. Verifique se a rota `/health` está implementada
2. Confirme se a aplicação está rodando na porta 3000
3. Verifique se não há bloqueios de firewall

## 🔒 Segurança

- Container roda com usuário não-root (`nestjs`)
- SSL/TLS habilitado para conexões com banco
- Health check configurado para monitoramento
- Imagem baseada em Alpine Linux (menor superfície de ataque)

## 📦 Otimizações

- Multi-stage build reduz tamanho da imagem
- `.dockerignore` exclui arquivos desnecessários
- Cache de dependências npm otimizado
- Prisma Client gerado durante o build
