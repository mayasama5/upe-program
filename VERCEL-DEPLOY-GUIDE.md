# 🚀 Guía de Deploy en Vercel - UPE Program

## 📋 Preparación antes del Deploy

### 1. Variables de Entorno para Producción

Necesitas configurar estas variables en Vercel:

```bash
# MongoDB Atlas (Requerido)
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net
DB_NAME=techhub_upe_prod

# Server Configuration
PORT=8000
NODE_ENV=production

# Session Configuration (Genera una clave fuerte)
SESSION_SECRET=tu-clave-super-secreta-para-produccion-aqui

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# External Services
AUTH_SERVICE_URL=https://demobackend.emergentagent.com
```

### 2. MongoDB Atlas Setup (CRÍTICO)

1. **Crear cuenta en MongoDB Atlas**: https://cloud.mongodb.com/
2. **Crear un cluster gratuito**
3. **Configurar acceso**:
   - Agregar tu IP a la whitelist (o usar 0.0.0.0/0 para acceso desde cualquier lugar)
   - Crear un usuario de base de datos
4. **Obtener connection string**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net
   ```

## 🎯 Deploy del Backend

### Opción 1: Deploy Automático desde GitHub

1. **Conecta tu repositorio a Vercel**:
   ```bash
   # Asegúrate de que todos los cambios estén en GitHub
   git add .
   git commit -m "feat: configured for production deployment"
   git push origin main
   ```

2. **Configurar en Vercel Dashboard**:
   - Project Name: `upe-program-backend`
   - Root Directory: `backend-nodejs`
   - Build Command: `npm install`
   - Output Directory: `.`
   - Install Command: `npm install`

### Opción 2: Deploy con Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login a Vercel
vercel login

# Deploy del Backend
cd backend-nodejs
vercel --prod

# Configurar variables de entorno
vercel env add MONGO_URL
vercel env add DB_NAME
vercel env add NODE_ENV
vercel env add SESSION_SECRET
vercel env add AUTH_SERVICE_URL
```

## 🎨 Deploy del Frontend

### Configurar variables de entorno del Frontend

Crear `.env.production` en la carpeta `frontend`:

```bash
# URL del backend desplegado
REACT_APP_API_URL=https://tu-backend.vercel.app

# O si usas el mismo dominio
REACT_APP_API_URL=/api
```

### Deploy del Frontend

```bash
# Deploy del Frontend
cd frontend
vercel --prod

# O configurar en Vercel Dashboard:
# - Project Name: upe-program-frontend
# - Root Directory: frontend
# - Build Command: npm run build
# - Output Directory: build
```

## 🗄️ Poblar la Base de Datos en Producción

Una vez desplegado el backend, poblar la base de datos:

```bash
# Ejecutar script de población
curl -X POST https://tu-backend.vercel.app/api/admin/populate
```

O crear un endpoint específico para esto en el backend.

## 📁 Estructura de Variables en Vercel

### Variables del Backend:
- `MONGO_URL`
- `DB_NAME` 
- `NODE_ENV=production`
- `SESSION_SECRET`
- `AUTH_SERVICE_URL`

### Variables del Frontend:
- `REACT_APP_API_URL`

## 🔧 Configuración de Dominios

Si quieres usar un dominio personalizado:

1. **Backend**: `api.tudominio.com`
2. **Frontend**: `tudominio.com`

Y actualizar las variables CORS en el backend para incluir tu dominio.

## 🚨 Troubleshooting

### Error: "Cannot connect to database"
- ✅ Verifica que MONGO_URL esté correctamente configurado
- ✅ Revisa que la IP esté en la whitelist de MongoDB Atlas
- ✅ Confirma que el usuario de BD tenga permisos

### Error: "CORS blocked"
- ✅ Actualiza las URLs permitidas en `backend-nodejs/src/app.js`
- ✅ Agrega tu dominio de producción a la lista de orígenes permitidos

### Error: "Build failed"
- ✅ Verifica que todas las dependencias estén en `package.json`
- ✅ Revisa que no haya errores de sintaxis
- ✅ Confirma que las rutas de archivos sean correctas

## 🔄 Flujo de Deploy Recomendado

1. **Desarrollo Local**: `npm run start:full`
2. **Testing**: Verifica que todo funcione localmente
3. **Commit**: `git add . && git commit -m "ready for deploy"`
4. **Push**: `git push origin main`
5. **Deploy Backend**: Automático desde GitHub o manual con Vercel CLI
6. **Configurar Variables**: En Vercel Dashboard
7. **Deploy Frontend**: Configurar URL del backend y desplegar
8. **Poblar BD**: Ejecutar script de población en producción
9. **Testing Producción**: Verificar que todo funcione

## 📞 Comandos Útiles Post-Deploy

```bash
# Ver logs del backend
vercel logs tu-backend.vercel.app

# Ver logs del frontend  
vercel logs tu-frontend.vercel.app

# Actualizar variables de entorno
vercel env add VARIABLE_NAME

# Re-deploy
vercel --prod
```

¡Listo para el deploy! 🚀
