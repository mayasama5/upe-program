#!/bin/bash

# Script para configurar variables de entorno en Vercel
# Este script te guiará paso a paso

echo "🚀 Configuración de Variables de Entorno para Vercel"
echo "=================================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Claves generadas automáticamente
SESSION_SECRET="21d2d607269886e4c9358ed070e1d1e35f75a649d4c6281cb712d039908c1737"
JWT_SECRET="baccc2e700ad15e8d1b5dc01e055cf550b31cce2a578b4406ef5c528f09a95ff"
ENCRYPTION_KEY="1c216c99e4d43ba3ce5f6b4ddcb6bc51"

echo -e "${GREEN}✓ Claves de seguridad generadas automáticamente${NC}"
echo ""

# Función para leer input con valor por defecto
read_with_default() {
    local prompt="$1"
    local default="$2"
    local value

    if [ -n "$default" ]; then
        read -p "$prompt [$default]: " value
        echo "${value:-$default}"
    else
        read -p "$prompt: " value
        echo "$value"
    fi
}

echo -e "${BLUE}📋 Por favor proporciona la siguiente información:${NC}"
echo ""

# DATABASE_URL
echo -e "${YELLOW}1. DATABASE_URL (PostgreSQL/Supabase)${NC}"
echo "   Ejemplo: postgresql://user:password@host:5432/database?schema=public"
DATABASE_URL=$(read_with_default "   DATABASE_URL" "")

# URLs
BACKEND_URL="https://upe-m89ktwybr-gustavogamarra95s-projects.vercel.app"
FRONTEND_URL="https://upe-9cvj71k8t-gustavogamarra95s-projects.vercel.app"

echo ""
echo -e "${GREEN}URLs detectadas automáticamente:${NC}"
echo "   Backend:  $BACKEND_URL"
echo "   Frontend: $FRONTEND_URL"
echo ""

# Confirmación
echo -e "${BLUE}📝 Resumen de configuración:${NC}"
echo "   DATABASE_URL: ${DATABASE_URL:0:50}..."
echo "   SESSION_SECRET: ${SESSION_SECRET:0:20}..."
echo "   JWT_SECRET: ${JWT_SECRET:0:20}..."
echo "   ENCRYPTION_KEY: $ENCRYPTION_KEY"
echo "   BACKEND_URL: $BACKEND_URL"
echo "   FRONTEND_URL: $FRONTEND_URL"
echo ""

read -p "¿Continuar con la configuración? (y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "Cancelado."
    exit 1
fi

echo ""
echo -e "${GREEN}⚙️  Configurando variables del BACKEND...${NC}"
cd backend-nodejs

# Backend environment variables
echo "$DATABASE_URL" | vercel env add DATABASE_URL production --yes
echo "production" | vercel env add NODE_ENV production --yes
echo "$FRONTEND_URL" | vercel env add FRONTEND_URL production --yes
echo "$SESSION_SECRET" | vercel env add SESSION_SECRET production --yes
echo "$JWT_SECRET" | vercel env add JWT_SECRET production --yes
echo "24h" | vercel env add JWT_EXPIRES_IN production --yes
echo "7d" | vercel env add JWT_REFRESH_EXPIRES_IN production --yes
echo "$ENCRYPTION_KEY" | vercel env add ENCRYPTION_KEY production --yes
echo "10485760" | vercel env add MAX_FILE_SIZE production --yes
echo "./uploads" | vercel env add UPLOAD_DIR production --yes
echo "8000" | vercel env add PORT production --yes

echo -e "${GREEN}✓ Variables del backend configuradas${NC}"
echo ""

cd ..

echo -e "${GREEN}⚙️  Configurando variables del FRONTEND...${NC}"
cd frontend

# Frontend environment variables
echo "$BACKEND_URL" | vercel env add REACT_APP_BACKEND_URL production --yes

echo -e "${GREEN}✓ Variables del frontend configuradas${NC}"
echo ""

cd ..

echo ""
echo -e "${GREEN}✅ ¡Configuración completada!${NC}"
echo ""
echo -e "${BLUE}📋 Próximos pasos:${NC}"
echo "   1. Ejecutar migración de base de datos"
echo "   2. Re-deploy del backend: cd backend-nodejs && vercel --prod --yes"
echo "   3. Re-deploy del frontend: cd frontend && vercel --prod --yes"
echo ""
echo -e "${YELLOW}⚠️  Importante: Guarda estas claves en un lugar seguro${NC}"
echo ""
