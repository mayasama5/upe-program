#!/bin/bash

# ==============================================================================
# TECHHUBUPE - Script de Deploy Automatizado para Vercel
# ==============================================================================
# Este script realiza deploy directo sin vincular GitHub
# Commitea cambios automáticamente y despliega en Vercel
# ==============================================================================

set -e  # Salir si algún comando falla

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Banner de inicio
clear
echo -e "${CYAN}"
echo "████████╗███████╗ ██████╗██╗  ██╗██╗  ██╗██╗   ██╗██████╗ ██╗   ██╗██████╗ ███████╗"
echo "╚══██╔══╝██╔════╝██╔════╝██║  ██║██║  ██║██║   ██║██╔══██╗██║   ██║██╔══██╗██╔════╝"
echo "   ██║   █████╗  ██║     ███████║███████║██║   ██║██████╔╝██║   ██║██████╔╝█████╗  "
echo "   ██║   ██╔══╝  ██║     ██╔══██║██╔══██║██║   ██║██╔══██╗██║   ██║██╔═══╝ ██╔══╝  "
echo "   ██║   ███████╗╚██████╗██║  ██║██║  ██║╚██████╔╝██████╔╝╚██████╔╝██║     ███████╗"
echo "   ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝     ╚══════╝"
echo -e "${NC}"
echo -e "${GREEN}Deploy Automatizado para Vercel${NC}"
echo -e "${MAGENTA}Versión: 2.0.0 | $(date '+%Y-%m-%d %H:%M:%S')${NC}\n"

# Variables globales
BACKEND_URL=""
FRONTEND_URL=""
PROJECT_ROOT=$(pwd)

# Función para logging
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_header() {
    echo -e "\n${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║ $1${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}\n"
}

# Función para mostrar barra de progreso
show_progress() {
    local duration=$1
    local message=$2
    echo -ne "${BLUE}${message}${NC} ["
    for i in $(seq 1 20); do
        echo -ne "▓"
        sleep $(echo "scale=2; $duration/20" | bc)
    done
    echo -e "] ${GREEN}✓${NC}"
}

# Verificar dependencias
check_dependencies() {
    log_header "Verificando Dependencias"

    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js no está instalado"
        exit 1
    fi
    log_success "Node.js $(node --version)"

    # Verificar npm
    if ! command -v npm &> /dev/null; then
        log_error "npm no está instalado"
        exit 1
    fi
    log_success "npm $(npm --version)"

    # Verificar git
    if ! command -v git &> /dev/null; then
        log_error "git no está instalado"
        exit 1
    fi
    log_success "git $(git --version | cut -d' ' -f3)"

    # Verificar Vercel CLI; evitar instalación global para no requerir permisos
    if ! command -v vercel &> /dev/null; then
        log_warning "Vercel CLI no encontrado. Usaré 'npx vercel' temporalmente (sin instalación global)."
        VERCEL_CMD="npx vercel"
    else
        VERCEL_CMD="vercel"
        log_success "Vercel CLI $(vercel --version)"
    fi

    # Comprobar que el usuario está autenticado en Vercel antes de continuar
    if ! $VERCEL_CMD whoami >/dev/null 2>&1; then
        log_error "No estás autenticado en Vercel o el token no es válido. Ejecuta 'npx vercel login' o exporta 'VERCEL_TOKEN'."
        echo "Ejecuta: npx vercel login"
        exit 1
    else
        # Mostrar usuario autenticado (silencioso en caso de npx)
        AUTH_USER=$($VERCEL_CMD whoami 2>/dev/null || true)
        if [ -n "$AUTH_USER" ]; then
            log_success "Autenticado en Vercel como: ${CYAN}$AUTH_USER${NC}"
        fi
    fi

    echo ""
}

# Gestión de Git
handle_git() {
    log_header "Gestionando Repositorio Git"

    # Verificar que estamos en un repositorio git
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "No es un repositorio git"
        exit 1
    fi

    # Verificar rama actual
    CURRENT_BRANCH=$(git branch --show-current)
    log_info "Rama actual: ${CYAN}$CURRENT_BRANCH${NC}"

    # Mostrar cambios pendientes
    if [ -n "$(git status --porcelain)" ]; then
        log_warning "Cambios pendientes detectados:"
        echo ""
        git status --short | while read line; do
            echo "  ${YELLOW}→${NC} $line"
        done
        echo ""

        # Commitear automáticamente
        log_info "Commiteando cambios automáticamente..."
        git add .

        COMMIT_MSG="deploy: automated deployment $(date '+%a %d %b %Y %I:%M:%S %p %z')"
        git commit -m "$COMMIT_MSG"

        log_success "Commit creado: ${COMMIT_MSG}"

        # Preguntar si hacer push a GitHub
        echo ""
        read -p "$(echo -e ${YELLOW}¿Deseas hacer push a GitHub? [y/N]:${NC} )" -r
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            if git remote | grep -q origin; then
                log_info "Subiendo cambios a GitHub..."
                git push origin "$CURRENT_BRANCH"
                log_success "Cambios subidos a GitHub"
            else
                log_warning "No hay remote 'origin' configurado"
            fi
        else
            log_info "Push a GitHub omitido"
        fi
    else
        log_success "No hay cambios pendientes"
    fi

    echo ""
}

# Preparar Backend
prepare_backend() {
    log_header "Preparando Backend"

    cd "$PROJECT_ROOT/backend-nodejs"

    if [ ! -f "package.json" ]; then
        log_error "No se encuentra package.json en backend-nodejs"
        exit 1
    fi

    log_info "Verificando configuración de Vercel..."

    # Verificar si existe vercel.json
    if [ -f "vercel.json" ]; then
        log_success "vercel.json encontrado"
    else
        log_warning "Creando vercel.json..."
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
        log_success "vercel.json creado"
    fi

    log_success "Backend preparado"
    cd "$PROJECT_ROOT"
}

# Preparar Frontend
prepare_frontend() {
    log_header "Preparando Frontend"

    cd "$PROJECT_ROOT/frontend"

    if [ ! -f "package.json" ]; then
        log_error "No se encuentra package.json en frontend"
        exit 1
    fi

    # Verificar configuración
    if [ -f "src/config.js" ]; then
        log_success "Configuración encontrada"
    else
        log_warning "src/config.js no encontrado"
    fi

    # Verificar .env.production
    if [ -f ".env.production" ]; then
        log_success ".env.production encontrado"
    else
        log_warning ".env.production no encontrado"
    fi

    log_success "Frontend preparado"
    cd "$PROJECT_ROOT"
}

# Deploy Backend
deploy_backend() {
    log_header "Desplegando Backend en Vercel"

    cd "$PROJECT_ROOT/backend-nodejs"

    log_info "Iniciando deploy del backend..."
    echo ""

    # Hacer deploy con Vercel CLI (usa $VERCEL_CMD, que puede ser 'vercel' o 'npx vercel')
    if $VERCEL_CMD --prod --yes; then
        echo ""
        log_success "Backend desplegado exitosamente"

        # Intentar obtener URL del último deployment
        BACKEND_URL=$($VERCEL_CMD ls --prod 2>/dev/null | grep "backend" | head -1 | awk '{print $2}')
        if [ -n "$BACKEND_URL" ]; then
            log_success "Backend URL: ${CYAN}https://$BACKEND_URL${NC}"
            echo "https://$BACKEND_URL" > "$PROJECT_ROOT/.backend-url"
        fi
    else
        log_error "Error al desplegar backend"
        cd "$PROJECT_ROOT"
        exit 1
    fi

    cd "$PROJECT_ROOT"
}

# Deploy Frontend
deploy_frontend() {
    log_header "Desplegando Frontend en Vercel"

    cd "$PROJECT_ROOT/frontend"

    # Actualizar variable de entorno si tenemos la URL del backend
    if [ -f "$PROJECT_ROOT/.backend-url" ]; then
        BACKEND_URL=$(cat "$PROJECT_ROOT/.backend-url")
        log_info "Configurando REACT_APP_BACKEND_URL: ${CYAN}$BACKEND_URL${NC}"

        # Actualizar .env.production
        if [ -f ".env.production" ]; then
            # Hacer backup
            cp .env.production .env.production.backup
        fi

        cat > .env.production << EOF
REACT_APP_BACKEND_URL=$BACKEND_URL
NODE_ENV=production
EOF
        log_success "Variables de entorno actualizadas"
    fi

    log_info "Iniciando deploy del frontend..."
    echo ""

    # Hacer deploy con Vercel CLI (usa $VERCEL_CMD, que puede ser 'vercel' o 'npx vercel')
    if $VERCEL_CMD --prod --yes; then
        echo ""
        log_success "Frontend desplegado exitosamente"

        # Intentar obtener URL del último deployment
        FRONTEND_URL=$($VERCEL_CMD ls --prod 2>/dev/null | grep "frontend" | head -1 | awk '{print $2}')
        if [ -n "$FRONTEND_URL" ]; then
            log_success "Frontend URL: ${CYAN}https://$FRONTEND_URL${NC}"
        fi
    else
        log_error "Error al desplegar frontend"
        cd "$PROJECT_ROOT"
        exit 1
    fi

    cd "$PROJECT_ROOT"
}

# Limpiar archivos temporales
cleanup() {
    log_header "Limpieza"

    if [ -f "$PROJECT_ROOT/.backend-url" ]; then
        rm "$PROJECT_ROOT/.backend-url"
    fi

    if [ -f "$PROJECT_ROOT/frontend/.env.production.backup" ]; then
        rm "$PROJECT_ROOT/frontend/.env.production.backup"
    fi

    log_success "Archivos temporales eliminados"
}

# Mostrar resumen final
show_summary() {
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                    DEPLOY COMPLETADO                          ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""

    if [ -n "$BACKEND_URL" ]; then
        echo -e "${CYAN}🚀 Backend:${NC}  $BACKEND_URL"
    fi

    if [ -n "$FRONTEND_URL" ]; then
        echo -e "${CYAN}🌐 Frontend:${NC} $FRONTEND_URL"
    fi

    echo ""
    echo -e "${YELLOW}📋 Próximos Pasos:${NC}"
    echo "   1. Verifica que las URLs funcionen correctamente"
    echo "   2. Revisa las variables de entorno en Vercel Dashboard"
    echo "   3. Monitorea los logs en tiempo real"
    echo "   4. Configura dominios personalizados si es necesario"

    echo ""
    echo -e "${CYAN}🔗 Enlaces Útiles:${NC}"
    echo "   • Vercel Dashboard: ${BLUE}https://vercel.com/dashboard${NC}"
    echo "   • Documentación:    ${BLUE}https://vercel.com/docs${NC}"

    echo ""
    echo -e "${GREEN}¡Gracias por usar TECHHUBUPE Deploy!${NC}"
    echo ""
}

# Menú principal
main() {
    echo -e "${YELLOW}Selecciona el tipo de deploy:${NC}\n"
    echo "  ${CYAN}1.${NC} 🚀 Deploy Completo (Backend + Frontend)"
    echo "  ${CYAN}2.${NC} 🔧 Solo Backend"
    echo "  ${CYAN}3.${NC} 🎨 Solo Frontend"
    echo "  ${CYAN}4.${NC} ⚙️  Solo Preparar Archivos"
    echo "  ${CYAN}5.${NC} ❌ Cancelar"
    echo ""

    read -p "$(echo -e ${YELLOW}Opción [1-5]:${NC} )" -r option
    echo ""

    case $option in
        1)
            log_info "Deploy completo seleccionado"
            check_dependencies
            handle_git
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
            handle_git
            prepare_backend
            deploy_backend
            cleanup
            echo ""
            log_success "Backend desplegado exitosamente"
            echo ""
            ;;
        3)
            log_info "Deploy solo Frontend seleccionado"
            check_dependencies
            handle_git
            prepare_frontend
            deploy_frontend
            cleanup
            echo ""
            log_success "Frontend desplegado exitosamente"
            echo ""
            ;;
        4)
            log_info "Preparando archivos solamente"
            prepare_backend
            prepare_frontend
            echo ""
            log_success "Archivos preparados. Ejecuta 'vercel --prod' en cada directorio."
            echo ""
            ;;
        5)
            log_info "Deploy cancelado por el usuario"
            echo ""
            exit 0
            ;;
        *)
            log_error "Opción inválida"
            echo ""
            exit 1
            ;;
    esac
}

# Manejar interrupciones (Ctrl+C)
trap 'echo ""; log_error "Deploy interrumpido por el usuario"; cleanup; exit 1' INT TERM

# Ejecutar función principal
main

exit 0
