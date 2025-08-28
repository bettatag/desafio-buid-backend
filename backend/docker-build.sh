#!/bin/bash

# Script para build da imagem Docker do backend

# Configurações
IMAGE_NAME="desafio-backend"
TAG=${1:-"latest"}
FULL_IMAGE_NAME="$IMAGE_NAME:$TAG"

echo "🐳 Iniciando build da imagem Docker..."
echo "📦 Imagem: $FULL_IMAGE_NAME"
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Este script deve ser executado no diretório backend/"
    exit 1
fi

# Verificar se o Dockerfile existe
if [ ! -f "Dockerfile" ]; then
    echo "❌ Erro: Dockerfile não encontrado no diretório atual"
    exit 1
fi

# Build da imagem
echo "🔨 Construindo imagem Docker..."
docker build -t "$FULL_IMAGE_NAME" .

# Verificar se o build foi bem-sucedido
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build concluído com sucesso!"
    echo "🏷️  Imagem criada: $FULL_IMAGE_NAME"
    echo ""
    echo "📋 Comandos úteis:"
    echo "   Para executar: docker run -p 3000:3000 --env-file .env $FULL_IMAGE_NAME"
    echo "   Para ver logs: docker logs <container_id>"
    echo "   Para listar imagens: docker images | grep $IMAGE_NAME"
    echo ""
    echo "🚀 Para fazer deploy no Railway:"
    echo "   1. Faça push da imagem para um registry (Docker Hub, etc.)"
    echo "   2. Configure o Railway para usar a imagem"
    echo "   3. Certifique-se de que as variáveis de ambiente estão configuradas"
else
    echo ""
    echo "❌ Erro durante o build da imagem Docker"
    exit 1
fi
