#!/bin/bash

# ==============================================
# SCRIPT PARA CONFIGURAR VARIABLES EN VERCEL
# ==============================================
# Ejecuta este script para configurar todas las variables automáticamente

echo "🚀 Configurando variables de entorno en Vercel..."

# Variables del servidor
vercel env add NODE_ENV production --force
vercel env add PORT 8000 --force

# URL del frontend
vercel env add FRONTEND_URL https://upe-program-43ibnwqdg-gustavogamarra95s-projects.vercel.app --force

# Seguridad y autenticación
vercel env add SESSION_SECRET 5e258624421477511cc03bfe0c64ad84b21d36b8dfd6baa1e53fcecedfa6c3b4 --force
vercel env add JWT_SECRET 15d7b2e210d3c86a8bba5e34ac8aed836afac8e09010fecdd19e02741de9d425 --force
vercel env add JWT_EXPIRES_IN 24h --force
vercel env add JWT_REFRESH_EXPIRES_IN 7d --force
vercel env add ENCRYPTION_KEY 4fc33ca3277942a52591527e6a0ec2d5bebee3686ec81a21a2a3d4883b7130df --force

# Base de datos Supabase
vercel env add DATABASE_URL "postgresql://postgres.sisrhnrbjckqfydjpajx:postgres*123@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=10&pool_timeout=20" --force

# Google OAuth
vercel env add GOOGLE_CLIENT_ID 464553454735-biknj79cjshpa4reegf95osiauah3scm.apps.googleusercontent.com --force
vercel env add GOOGLE_CLIENT_SECRET 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 --force
vercel env add GOOGLE_REDIRECT_URI https://upe-program-43ibnwqdg-gustavogamarra95s-projects.vercel.app/api/auth/google/callback --force

# Configuración de archivos
vercel env add MAX_FILE_SIZE 10485760 --force
vercel env add UPLOAD_DIR ./uploads --force

echo "✅ Todas las variables de entorno han sido configuradas!"
echo "🚀 Ahora ejecuta: vercel --prod"
echo "🌐 Tu aplicación estará lista en: https://upe-program-43ibnwqdg-gustavogamarra95s-projects.vercel.app"