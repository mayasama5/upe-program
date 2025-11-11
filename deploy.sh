#!/bin/bash

# ==============================================================================
# UPE Program - Deploy Script para Vercel
# ==============================================================================
# Este script automatiza el proceso completo de deploy en Vercel
# Incluye preparación, validación y deploy tanto del frontend como backend
# ==============================================================================

set -e  # Salir si algún comando falla

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función para logging
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_header() {
    echo -e "\n${CYAN}=== $1 ===${NC}\n"
}

# Banner de inicio
echo -e "${CYAN}"
echo "██╗   ██╗██████╗ ███████╗    ██████╗ ███████╗██████╗ ██╗      ██████╗ ██╗   ██╗"
echo "██║   ██║██╔══██╗██╔════╝    ██╔══██╗██╔════╝██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝"
echo "██║   ██║██████╔╝█████╗      ██║  ██║█████╗  ██████╔╝██║     ██║   ██║ ╚████╔╝ "
echo "██║   ██║██╔═══╝ ██╔══╝      ██║  ██║██╔══╝  ██╔═══╝ ██║     ██║   ██║  ╚██╔╝  "
echo "╚██████╔╝██║     ███████╗    ██████╔╝███████╗██║     ███████╗╚██████╔╝   ██║   "
echo " ╚═════╝ ╚═╝     ╚══════╝    ╚═════╝ ╚══════╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   "
echo -e "${NC}"
echo -e "${GREEN}Deploy Script para Vercel${NC}"
echo -e "Versión: 1.0.0 | $(date)\n"

# Función para verificar dependencias
check_dependencies() {
    log_header "Verificando Dependencias"
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js no está instalado"
        exit 1
    fi
    log_success "Node.js $(node --version) encontrado"
    
    # Verificar npm
    if ! command -v npm &> /dev/null; then
        log_error "npm no está instalado"
        exit 1
    fi
    log_success "npm $(npm --version) encontrado"
    
    # Verificar git
    if ! command -v git &> /dev/null; then
        log_error "git no está instalado"
        exit 1
    fi
    log_success "git encontrado"
    
    # Verificar/instalar Vercel CLI
    if ! command -v vercel &> /dev/null; then
        log_warning "Vercel CLI no encontrado. Instalando..."
        npm install -g vercel
        log_success "Vercel CLI instalado"
    else
        log_success "Vercel CLI encontrado"
    fi
}

# Función para verificar estado de Git
check_git_status() {
    log_header "Verificando Estado de Git"
    
    # Verificar que estamos en un repositorio git
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "No es un repositorio git"
        exit 1
    fi
    
    # Verificar rama actual
    CURRENT_BRANCH=$(git branch --show-current)
    log_info "Rama actual: $CURRENT_BRANCH"
    
    # Verificar cambios pendientes
    if [ -n "$(git status --porcelain)" ]; then
        log_warning "Hay cambios sin commitear"
        echo -e "\nCambios pendientes:"
        git status --short
        echo ""
        
        read -p "¿Deseas commitear automáticamente estos cambios? [y/N]: " -r
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git add .
            read -p "Mensaje del commit: " commit_message
            if [ -z "$commit_message" ]; then
                commit_message="chore: automated commit before deploy $(date '+%Y-%m-%d %H:%M:%S')"
            fi
            git commit -m "$commit_message"
            log_success "Cambios commiteados"
        else
            log_error "Deploy cancelado. Commitea los cambios manualmente."
            exit 1
        fi
    else
        log_success "No hay cambios pendientes"
    fi
}

# Función para hacer push a GitHub
push_to_github() {
    log_header "Subiendo Cambios a GitHub"
    
    # Verificar si hay remote origin
    if ! git remote | grep -q origin; then
        log_error "No hay remote 'origin' configurado"
        exit 1
    fi
    
    log_info "Subiendo cambios a GitHub..."
    if git push origin "$CURRENT_BRANCH"; then
        log_success "Cambios subidos exitosamente"
    else
        log_error "Error al subir cambios a GitHub"
        exit 1
    fi
}

# Función para preparar el backend
prepare_backend() {
    log_header "Preparando Backend"
    
    cd backend-nodejs
    
    # Verificar que existe package.json
    if [ ! -f "package.json" ]; then
        log_error "No se encuentra package.json en backend-nodejs"
        exit 1
    fi
    
    # Crear/actualizar vercel.json para backend
    log_info "Configurando vercel.json para backend..."
    cat > vercel.json << 'EOF'
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
  },
  "functions": {
    "src/app.js": {
      "maxDuration": 30
    }
  }
}
EOF
    
    log_success "Backend preparado"
    cd ..
}

# Función para preparar el frontend
prepare_frontend() {
    log_header "Preparando Frontend"
    
    cd frontend
    
    # Verificar que existe package.json
    if [ ! -f "package.json" ]; then
        log_error "No se encuentra package.json en frontend"
        exit 1
    fi
    
    # Verificar archivo de configuración
    if [ ! -f "src/config.js" ]; then
        log_warning "No se encuentra src/config.js"
    else
        log_success "Configuración encontrada"
    fi
    
    log_success "Frontend preparado"
    cd ..
}

# Función para hacer deploy del backend
deploy_backend() {
    log_header "Desplegando Backend"
    
    cd backend-nodejs
    
    log_info "Iniciando deploy del backend en Vercel..."
    
    # Hacer deploy con Vercel CLI
    if vercel --prod --yes; then
        log_success "Backend desplegado exitosamente"
        
        # Obtener URL del backend
        BACKEND_URL=$(vercel --prod --yes 2>/dev/null | grep -o 'https://[^[:space:]]*' | head -1)
        if [ -n "$BACKEND_URL" ]; then
            log_success "Backend URL: $BACKEND_URL"
            echo "$BACKEND_URL" > ../.backend-url
        fi
    else
        log_error "Error al desplegar backend"
        exit 1
    fi
    
    cd ..
}

# Función para hacer deploy del frontend
deploy_frontend() {
    log_header "Desplegando Frontend"
    
    cd frontend
    
    # Actualizar variable de entorno si tenemos la URL del backend
    if [ -f "../.backend-url" ]; then
        BACKEND_URL=$(cat ../.backend-url)
        log_info "Configurando REACT_APP_BACKEND_URL: $BACKEND_URL"
        
        # Crear/actualizar .env.production
        cat > .env.production << EOF
REACT_APP_BACKEND_URL=$BACKEND_URL
NODE_ENV=production
EOF
    fi
    
    log_info "Iniciando deploy del frontend en Vercel..."
    
    # Hacer deploy con Vercel CLI
    if vercel --prod --yes; then
        log_success "Frontend desplegado exitosamente"
        
        # Obtener URL del frontend
        FRONTEND_URL=$(vercel --prod --yes 2>/dev/null | grep -o 'https://[^[:space:]]*' | head -1)
        if [ -n "$FRONTEND_URL" ]; then
            log_success "Frontend URL: $FRONTEND_URL"
        fi
    else
        log_error "Error al desplegar frontend"
        exit 1
    fi
    
    cd ..
}

# Función para limpiar archivos temporales
cleanup() {
    log_header "Limpieza"
    
    if [ -f ".backend-url" ]; then
        rm .backend-url
        log_info "Archivos temporales eliminados"
    fi
}

# Función para mostrar resumen final
show_summary() {
    log_header "Resumen del Deploy"
    
    echo -e "${GREEN}Deploy completado exitosamente${NC}\n"
    
    if [ -n "$BACKEND_URL" ]; then
        echo -e "${CYAN}Backend:${NC} $BACKEND_URL"
    fi
    
    if [ -n "$FRONTEND_URL" ]; then
        echo -e "${CYAN} Frontend:${NC} $FRONTEND_URL"
    fi
    
    echo -e "\n${YELLOW} Pasos siguientes:${NC}"
    echo "1. Verifica que ambas URLs funcionen correctamente"
    echo "2. Configura las variables de entorno en Vercel Dashboard si es necesario"
    echo "3. Actualiza los DNS si usas dominio personalizado"
    echo "4. Monitorea los logs en Vercel Dashboard"
    
    echo -e "\n${CYAN}Enlaces útiles:${NC}"
    echo "• Vercel Dashboard: https://vercel.com/dashboard"
    echo "• Documentación: https://vercel.com/docs"
    echo "• GitHub Repository: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\/[^/]*\).*/\1/' | sed 's/\.git$//')"
}

# Función principal
main() {
    # Mostrar opciones
    echo -e "${YELLOW}Selecciona el tipo de deploy:${NC}"
    echo "1. Deploy completo (Backend + Frontend)"
    echo "2. Solo Backend"
    echo "3. Solo Frontend" 
    echo "4. Solo preparar archivos"
    echo "5. Cancelar"
    echo ""
    
    read -p "Opción [1-5]: " -r option
    
    case $option in
        1)
            log_info "Deploy completo seleccionado"
            check_dependencies
            check_git_status
            push_to_github
            prepare_backend
            prepare_frontend
            deploy_backend
            deploy_frontend
            cleanup
            show_summary
            ;;
        2)
            log_info "Deploy solo Backend seleccionado"
            check_dependencies
            check_git_status
            push_to_github
            prepare_backend
            deploy_backend
            cleanup
            log_success "Backend desplegado exitosamente"
            ;;
        3)
            log_info "Deploy solo Frontend seleccionado"
            check_dependencies
            check_git_status
            push_to_github
            prepare_frontend
            deploy_frontend
            cleanup
            log_success "Frontend desplegado exitosamente"
            ;;
        4)
            log_info "Solo preparar archivos"
            prepare_backend
            prepare_frontend
            log_success "Archivos preparados. Usa 'vercel --prod' manualmente en cada directorio."
            ;;
        5)
            log_info "Deploy cancelado"
            exit 0
            ;;
        *)
            log_error "Opción inválida"
            exit 1
            ;;
    esac
}

# Manejar interrupciones
trap 'log_error "Deploy interrumpido"; cleanup; exit 1' INT TERM

# Ejecutar función principal
main

exit 0