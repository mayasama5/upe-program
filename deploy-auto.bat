@echo off
REM ==============================================================================
REM TECHHUBUPE - Script de Deploy Automatizado para Vercel
REM ==============================================================================
REM Este script realiza deploy directo sin vincular GitHub
REM Commitea cambios automáticamente y despliega en Vercel
REM ==============================================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

REM Variables globales
set "BACKEND_URL="
set "FRONTEND_URL="
set "PROJECT_ROOT=%CD%"
set "VERCEL_CMD=npx vercel"

REM ==============================================================================
REM FUNCIONES DE LOGGING
REM ==============================================================================

:log_info
echo [INFO] %*
exit /b 0

:log_success
echo [✓] %*
exit /b 0

:log_warning
echo [⚠] %*
exit /b 0

:log_error
echo [✗] %*
exit /b 0

:log_header
echo.
echo ===============================================================================
echo  %*
echo ===============================================================================
echo.
exit /b 0

REM ==============================================================================
REM VERIFICAR DEPENDENCIAS
REM ==============================================================================

:check_dependencies
cls
echo.
echo ████████╗███████╗ ██████╗██╗  ██╗██╗  ██╗██╗   ██╗██████╗ ██╗   ██╗██████╗ ███████╗
echo ╚══██╔══╝██╔════╝██╔════╝██║  ██║██║  ██║██║   ██║██╔══██╗██║   ██║██╔══██╗██╔════╝
echo    ██║   █████╗  ██║     ███████║███████║██║   ██║██████╔╝██║   ██║██████╔╝█████╗  
echo    ██║   ██╔══╝  ██║     ██╔══██║██╔══██║██║   ██║██╔══██╗██║   ██║██╔═══╝ ██╔══╝  
echo    ██║   ███████╗╚██████╗██║  ██║██║  ██║╚██████╔╝██████╔╝╚██████╔╝██║     ███████╗
echo    ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝     ╚══════╝
echo.
echo Deploy Automatizado para Vercel
echo Versión: 2.0.0 - %date% %time%
echo.

call :log_header "Verificando Dependencias"

REM Verificar Node.js
where node >nul 2>&1
if errorlevel 1 (
    call :log_error "Node.js no está instalado"
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set "NODE_VERSION=%%i"
call :log_success "Node.js %NODE_VERSION%"

REM Verificar npm
where npm >nul 2>&1
if errorlevel 1 (
    call :log_error "npm no está instalado"
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set "NPM_VERSION=%%i"
call :log_success "npm %NPM_VERSION%"

REM Verificar git
where git >nul 2>&1
if errorlevel 1 (
    call :log_error "git no está instalado"
    exit /b 1
)
for /f "tokens=*" %%i in ('git --version') do set "GIT_VERSION=%%i"
call :log_success "%GIT_VERSION%"

REM Verificar Vercel CLI
where vercel >nul 2>&1
if errorlevel 1 (
    call :log_warning "Vercel CLI no encontrado. Usaré 'npx vercel' temporalmente"
    set "VERCEL_CMD=npx vercel"
) else (
    set "VERCEL_CMD=vercel"
    for /f "tokens=*" %%i in ('vercel --version') do set "VERCEL_VERSION=%%i"
    call :log_success "Vercel CLI %VERCEL_VERSION%"
)

REM Comprobar autenticación en Vercel
%VERCEL_CMD% whoami >nul 2>&1
if errorlevel 1 (
    call :log_error "No estás autenticado en Vercel o el token no es válido"
    echo Ejecuta: npx vercel login
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('%VERCEL_CMD% whoami 2^>nul') do set "AUTH_USER=%%i"
    if not "!AUTH_USER!"=="" (
        call :log_success "Autenticado en Vercel como: !AUTH_USER!"
    )
)
echo.
exit /b 0

REM ==============================================================================
REM GESTIÓN DE GIT
REM ==============================================================================

:handle_git
call :log_header "Gestionando Repositorio Git"

REM Verificar que estamos en un repositorio git
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    call :log_error "No es un repositorio git"
    exit /b 1
)

REM Verificar rama actual
for /f "tokens=*" %%i in ('git branch --show-current') do set "CURRENT_BRANCH=%%i"
call :log_info "Rama actual: !CURRENT_BRANCH!"

REM Mostrar cambios pendientes
git status --porcelain >nul 2>&1
if not errorlevel 1 (
    for /f "tokens=*" %%i in ('git status --porcelain') do set "HAS_CHANGES=1"
)

if defined HAS_CHANGES (
    call :log_warning "Cambios pendientes detectados:"
    echo.
    git status --short
    echo.

    REM Commitear automáticamente
    call :log_info "Commiteando cambios automáticamente..."
    git add .

    for /f "tokens=*" %%i in ('powershell -NoProfile -Command "Get-Date -Format 'ddd dd MMM yyyy HH:mm:ss zzz'"') do set "COMMIT_DATE=%%i"
    set "COMMIT_MSG=deploy: automated deployment !COMMIT_DATE!"
    git commit -m "!COMMIT_MSG!"

    call :log_success "Commit creado: !COMMIT_MSG!"

    REM Preguntar si hacer push a GitHub
    echo.
    set /p "PUSH_GITHUB=¿Deseas hacer push a GitHub? [y/N]: "
    
    if /i "!PUSH_GITHUB!"=="y" (
        git remote | find "origin" >nul
        if not errorlevel 1 (
            call :log_info "Subiendo cambios a GitHub..."
            git push origin !CURRENT_BRANCH!
            call :log_success "Cambios subidos a GitHub"
        ) else (
            call :log_warning "No hay remote 'origin' configurado"
        )
    ) else (
        call :log_info "Push a GitHub omitido"
    )
) else (
    call :log_success "No hay cambios pendientes"
)

echo.
exit /b 0

REM ==============================================================================
REM PREPARAR BACKEND
REM ==============================================================================

:prepare_backend
call :log_header "Preparando Backend"

cd /d "!PROJECT_ROOT!\backend-nodejs"

if not exist "package.json" (
    call :log_error "No se encuentra package.json en backend-nodejs"
    exit /b 1
)

call :log_info "Verificando configuración de Vercel..."

if exist "vercel.json" (
    call :log_success "vercel.json encontrado"
) else (
    call :log_warning "Creando vercel.json..."
    (
        echo {
        echo   "version": 2,
        echo   "builds": [
        echo     {
        echo       "src": "src/app.js",
        echo       "use": "@vercel/node"
        echo     }
        echo   ],
        echo   "routes": [
        echo     {
        echo       "src": "/(.*)",
        echo       "dest": "src/app.js"
        echo     }
        echo   ],
        echo   "env": {
        echo     "NODE_ENV": "production"
        echo   },
        echo   "functions": {
        echo     "src/app.js": {
        echo       "maxDuration": 30
        echo     }
        echo   }
        echo }
    ) > vercel.json
    call :log_success "vercel.json creado"
)

call :log_success "Backend preparado"
cd /d "!PROJECT_ROOT!"
exit /b 0

REM ==============================================================================
REM PREPARAR FRONTEND
REM ==============================================================================

:prepare_frontend
call :log_header "Preparando Frontend"

cd /d "!PROJECT_ROOT!\frontend"

if not exist "package.json" (
    call :log_error "No se encuentra package.json en frontend"
    exit /b 1
)

if exist "src\config.js" (
    call :log_success "Configuración encontrada"
) else (
    call :log_warning "src\config.js no encontrado"
)

if exist ".env.production" (
    call :log_success ".env.production encontrado"
) else (
    call :log_warning ".env.production no encontrado"
)

call :log_success "Frontend preparado"
cd /d "!PROJECT_ROOT!"
exit /b 0

REM ==============================================================================
REM DEPLOY BACKEND
REM ==============================================================================

:deploy_backend
call :log_header "Desplegando Backend en Vercel"

cd /d "!PROJECT_ROOT!\backend-nodejs"

call :log_info "Iniciando deploy del backend..."
echo.

if defined VERCEL_PROJECT_BACKEND (
    call :log_info "Enlazando backend al proyecto Vercel: !VERCEL_PROJECT_BACKEND!"
    %VERCEL_CMD% link --project !VERCEL_PROJECT_BACKEND! --yes
) else if defined VERCEL_PROJECT (
    call :log_info "Usando VERCEL_PROJECT para backend: !VERCEL_PROJECT!"
    %VERCEL_CMD% link --project !VERCEL_PROJECT! --yes
)

%VERCEL_CMD% --prod --yes
if not errorlevel 1 (
    echo.
    call :log_success "Backend desplegado exitosamente"
    
    REM Intentar obtener URL del último deployment
    if defined VERCEL_PROJECT_BACKEND (
        for /f "tokens=2" %%i in ('%VERCEL_CMD% ls --prod 2^>nul ^| find "!VERCEL_PROJECT_BACKEND!"') do set "BACKEND_URL=%%i"
    ) else if defined VERCEL_PROJECT (
        for /f "tokens=2" %%i in ('%VERCEL_CMD% ls --prod 2^>nul ^| find "!VERCEL_PROJECT!"') do set "BACKEND_URL=%%i"
    ) else (
        for /f "tokens=2" %%i in ('%VERCEL_CMD% ls --prod 2^>nul ^| find "backend"') do set "BACKEND_URL=%%i"
    )
    
    if defined BACKEND_URL (
        call :log_success "Backend URL: https://!BACKEND_URL!"
        echo https://!BACKEND_URL! > "!PROJECT_ROOT!\.backend-url"
    )
) else (
    call :log_error "Error al desplegar backend"
    cd /d "!PROJECT_ROOT!"
    exit /b 1
)

cd /d "!PROJECT_ROOT!"
exit /b 0

REM ==============================================================================
REM DEPLOY FRONTEND
REM ==============================================================================

:deploy_frontend
call :log_header "Desplegando Frontend en Vercel"

cd /d "!PROJECT_ROOT!\frontend"

REM Actualizar variable de entorno si tenemos la URL del backend
if exist "!PROJECT_ROOT!\.backend-url" (
    for /f "tokens=*" %%i in ('type "!PROJECT_ROOT!\.backend-url"') do set "BACKEND_URL=%%i"
    call :log_info "Configurando REACT_APP_BACKEND_URL: !BACKEND_URL!"

    if exist ".env.production" (
        copy ".env.production" ".env.production.backup" >nul
    )

    (
        echo REACT_APP_BACKEND_URL=!BACKEND_URL!
        echo NODE_ENV=production
    ) > .env.production
    call :log_success "Variables de entorno actualizadas"
)

call :log_info "Iniciando deploy del frontend..."
echo.

if defined VERCEL_PROJECT_FRONTEND (
    call :log_info "Enlazando frontend al proyecto Vercel: !VERCEL_PROJECT_FRONTEND!"
    %VERCEL_CMD% link --project !VERCEL_PROJECT_FRONTEND! --yes
) else if defined VERCEL_PROJECT (
    call :log_info "Usando VERCEL_PROJECT para frontend: !VERCEL_PROJECT!"
    %VERCEL_CMD% link --project !VERCEL_PROJECT! --yes
)

%VERCEL_CMD% --prod --yes
if not errorlevel 1 (
    echo.
    call :log_success "Frontend desplegado exitosamente"

    REM Intentar obtener URL del último deployment
    if defined VERCEL_PROJECT_FRONTEND (
        for /f "tokens=2" %%i in ('%VERCEL_CMD% ls --prod 2^>nul ^| find "!VERCEL_PROJECT_FRONTEND!"') do set "FRONTEND_URL=%%i"
    ) else if defined VERCEL_PROJECT (
        for /f "tokens=2" %%i in ('%VERCEL_CMD% ls --prod 2^>nul ^| find "!VERCEL_PROJECT!"') do set "FRONTEND_URL=%%i"
    ) else (
        for /f "tokens=2" %%i in ('%VERCEL_CMD% ls --prod 2^>nul ^| find "frontend"') do set "FRONTEND_URL=%%i"
    )
    
    if defined FRONTEND_URL (
        call :log_success "Frontend URL: https://!FRONTEND_URL!"
    )
) else (
    call :log_error "Error al desplegar frontend"
    cd /d "!PROJECT_ROOT!"
    exit /b 1
)

cd /d "!PROJECT_ROOT!"
exit /b 0

REM ==============================================================================
REM LIMPIAR ARCHIVOS TEMPORALES
REM ==============================================================================

:cleanup
call :log_header "Limpieza"

if exist "!PROJECT_ROOT!\.backend-url" (
    del "!PROJECT_ROOT!\.backend-url"
)

if exist "!PROJECT_ROOT!\frontend\.env.production.backup" (
    del "!PROJECT_ROOT!\frontend\.env.production.backup"
)

call :log_success "Archivos temporales eliminados"
exit /b 0

REM ==============================================================================
REM MOSTRAR RESUMEN FINAL
REM ==============================================================================

:show_summary
echo.
echo ===============================================================================
echo                       DEPLOY COMPLETADO
echo ===============================================================================
echo.

if defined BACKEND_URL (
    echo [Backend]  https://!BACKEND_URL!
)

if defined FRONTEND_URL (
    echo [Frontend] https://!FRONTEND_URL!
)

echo.
echo Próximos Pasos:
echo    1. Verifica que las URLs funcionen correctamente
echo    2. Revisa las variables de entorno en Vercel Dashboard
echo    3. Monitorea los logs en tiempo real
echo    4. Configura dominios personalizados si es necesario
echo.
echo Enlaces Útiles:
echo    - Vercel Dashboard: https://vercel.com/dashboard
echo    - Documentación:    https://vercel.com/docs
echo.
echo ¡Gracias por usar TECHHUBUPE Deploy!
echo.
exit /b 0

REM ==============================================================================
REM MENÚ PRINCIPAL
REM ==============================================================================

:main
echo.
echo Selecciona el tipo de deploy:
echo.
echo   1. Deploy Completo (Backend + Frontend)
echo   2. Solo Backend
echo   3. Solo Frontend
echo   4. Solo Preparar Archivos
echo   5. Cancelar
echo.

set /p "OPTION=Opción [1-5]: "
echo.

if "!OPTION!"=="1" (
    call :log_info "Deploy completo seleccionado"
    if not defined VERCEL_PROJECT_FRONTEND set "VERCEL_PROJECT_FRONTEND=prj_vUcRfPGTIi52ibIGKlQWemjpobTC"
    if not defined VERCEL_PROJECT_BACKEND set "VERCEL_PROJECT_BACKEND=prj_vUcRfPGTIi52ibIGKlQWemjpobTC"
    call :log_info "VERCEL_PROJECT_FRONTEND=!VERCEL_PROJECT_FRONTEND!"
    call :log_info "VERCEL_PROJECT_BACKEND=!VERCEL_PROJECT_BACKEND!"
    call :check_dependencies
    if errorlevel 1 exit /b 1
    call :handle_git
    if errorlevel 1 exit /b 1
    call :prepare_backend
    if errorlevel 1 exit /b 1
    call :prepare_frontend
    if errorlevel 1 exit /b 1
    call :deploy_backend
    if errorlevel 1 exit /b 1
    call :deploy_frontend
    if errorlevel 1 exit /b 1
    call :cleanup
    call :show_summary
) else if "!OPTION!"=="2" (
    call :log_info "Deploy solo Backend seleccionado"
    call :check_dependencies
    if errorlevel 1 exit /b 1
    call :handle_git
    if errorlevel 1 exit /b 1
    call :prepare_backend
    if errorlevel 1 exit /b 1
    call :deploy_backend
    if errorlevel 1 exit /b 1
    call :cleanup
    echo.
    call :log_success "Backend desplegado exitosamente"
    echo.
) else if "!OPTION!"=="3" (
    call :log_info "Deploy solo Frontend seleccionado"
    call :check_dependencies
    if errorlevel 1 exit /b 1
    call :handle_git
    if errorlevel 1 exit /b 1
    call :prepare_frontend
    if errorlevel 1 exit /b 1
    call :deploy_frontend
    if errorlevel 1 exit /b 1
    call :cleanup
    echo.
    call :log_success "Frontend desplegado exitosamente"
    echo.
) else if "!OPTION!"=="4" (
    call :log_info "Preparando archivos solamente"
    call :prepare_backend
    if errorlevel 1 exit /b 1
    call :prepare_frontend
    if errorlevel 1 exit /b 1
    echo.
    call :log_success "Archivos preparados. Ejecuta 'vercel --prod' en cada directorio."
    echo.
) else if "!OPTION!"=="5" (
    call :log_info "Deploy cancelado por el usuario"
    echo.
    exit /b 0
) else (
    call :log_error "Opción inválida"
    echo.
    exit /b 1
)

exit /b 0

REM ==============================================================================
REM PUNTO DE ENTRADA
REM ==============================================================================

call :main
exit /b %errorlevel%
