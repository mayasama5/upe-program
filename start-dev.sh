#!/bin/bash

# Script para iniciar el entorno de desarrollo completo
echo "🚀 Iniciando UPE Program - Entorno de Desarrollo"
echo "================================================"

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está corriendo. Por favor inicia Docker primero."
    exit 1
fi

# Verificar si el contenedor de MongoDB existe
if [ ! "$(docker ps -q -f name=mongodb-dev)" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=mongodb-dev)" ]; then
        echo "🔄 Iniciando contenedor MongoDB existente..."
        docker start mongodb-dev
    else
        echo "🆕 Creando nuevo contenedor MongoDB..."
        docker run -d --name mongodb-dev -p 27017:27017 -e MONGO_INITDB_DATABASE=techhub_upe mongo:7
    fi
else
    echo "✅ MongoDB ya está corriendo"
fi

# Esperar un momento para que MongoDB esté listo
echo "⏳ Esperando que MongoDB esté listo..."
sleep 3

# Verificar que MongoDB responde
until docker exec mongodb-dev mongosh --eval "db.stats()" > /dev/null 2>&1; do
    echo "⏳ Esperando que MongoDB responda..."
    sleep 2
done

echo "✅ MongoDB está listo"
echo "🎯 Iniciando Frontend y Backend..."
echo ""

# Ejecutar el comando npm start que iniciará ambos servicios
npm start
