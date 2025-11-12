#!/bin/bash

# Script de Deploy para Vercel - UPE Program
echo "UPE Program - Deploy a Vercel"
echo "================================"

# Verificar que estemos en la rama main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "No estás en la rama main. Cambiando a main..."
    git checkout main
fi

# Verificar que no haya cambios sin commitear
if [ -n "$(git status --porcelain)" ]; then
    echo "Hay cambios sin commitear. Commiteando automáticamente..."
    git add .
    git commit -m "chore: automated commit before deploy $(date)"
fi

# Push a GitHub
echo "Subiendo cambios a GitHub..."
git push origin main

echo ""
echo "Opciones de Deploy:"
echo "1. Deploy automático (recomendado)"
echo "2. Deploy manual con Vercel CLI"
echo "3. Solo preparar archivos para deploy manual"
echo ""

read -p "Selecciona una opción (1-3): " option

case $option in
    1)
        echo ""
        echo "Deploy automático seleccionado"
        echo ""
        echo "Pasos a seguir:"
        echo "1. Ve a https://vercel.com/dashboard"
        echo "2. Conecta tu repositorio GitHub"
        echo "3. Configura dos proyectos:"
        echo "   - Backend: Root Directory = 'backend-nodejs'"
        echo "   - Frontend: Root Directory = 'frontend'"
        echo "4. Configura las variables de entorno (ver VERCEL-DEPLOY-GUIDE.md)"
        echo "5. Deploy automáticamente desde GitHub"
        echo ""
        echo "Lee VERCEL-DEPLOY-GUIDE.md para instrucciones detalladas"
        ;;
    2)
        echo ""
        echo "Deploy manual con Vercel CLI"
        echo ""
        
        # Verificar si Vercel CLI está instalado
        if ! command -v vercel &> /dev/null; then
            echo "Instalando Vercel CLI..."
            npm install -g vercel
        fi
        
        echo "Haciendo login a Vercel..."
        vercel login
        
        echo ""
        echo "Desplegando Backend..."
        cd backend-nodejs
        vercel --prod
        
        echo ""
        echo "Desplegando Frontend..."
        cd ../frontend
        vercel --prod
        
        echo ""
        echo "Deploy completado!"
        echo "No olvides configurar las variables de entorno en Vercel Dashboard"
        ;;
    3)
        echo ""
        echo "Preparando archivos para deploy manual..."
        
        # Crear archivos de configuración si no existen
        if [ ! -f "backend-nodejs/vercel.json" ]; then
            echo "Creando vercel.json para backend..."
            cat > backend-nodejs/vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "src/app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/app.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
EOF
        fi
        
        if [ ! -f "frontend/.env.production" ]; then
            echo "Creando .env.production para frontend..."
            cat > frontend/.env.production << EOF
# Actualiza esta URL con la URL de tu backend desplegado
REACT_APP_API_URL=https://tu-backend.vercel.app
EOF
        fi
        
        echo ""
        echo "Archivos preparados!"
        echo "Lee VERCEL-DEPLOY-GUIDE.md para continuar con el deploy manual"
        ;;
    *)
        echo "Opción inválida"
        exit 1
        ;;
esac

echo ""
echo "¡Proceso completado!"
echo "Consulta VERCEL-DEPLOY-GUIDE.md para más detalles"