#!/bin/bash

# Script de deploy para Railway
echo "🚀 Iniciando deploy do backend..."

# Verificar se estamos na pasta backend
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script a partir da pasta backend"
    exit 1
fi

# Verificar se o Dockerfile existe
if [ ! -f "Dockerfile" ]; then
    echo "❌ Erro: Dockerfile não encontrado"
    exit 1
fi

echo "✅ Arquivos necessários encontrados"
echo "📦 Estrutura do projeto:"
echo "- package.json: $([ -f package.json ] && echo '✅' || echo '❌')"
echo "- Dockerfile: $([ -f Dockerfile ] && echo '✅' || echo '❌')"
echo "- railway.json: $([ -f railway.json ] && echo '✅' || echo '❌')"
echo "- prisma/schema.prisma: $([ -f prisma/schema.prisma ] && echo '✅' || echo '❌')"

echo ""
echo "🔧 Para fazer deploy no Railway:"
echo "1. Certifique-se de que você está na pasta backend"
echo "2. Conecte o repositório ao Railway"
echo "3. Configure as variáveis de ambiente necessárias"
echo "4. O Railway usará automaticamente o Dockerfile desta pasta"

echo ""
echo "📋 Variáveis de ambiente necessárias no Railway:"
echo "- DATABASE_URL"
echo "- JWT_SECRET"
echo "- NODE_ENV=production"
echo "- PORT=3000"

echo ""
echo "✅ Script concluído. O backend está pronto para deploy!"
