---
sidebar_position: 1
---

# Deployment en Vercel

Esta guía completa te mostrará cómo desplegar el UPE Program en Vercel, tanto el frontend como el backend.

## Prerrequisitos

- Cuenta en [Vercel](https://vercel.com)
- Repositorio Git configurado (GitHub, GitLab, o Bitbucket)
- Variables de entorno configuradas
- Base de datos PostgreSQL (Railway recomendado)

## Estructura de Deployment

El proyecto UPE Program se despliega en dos proyectos separados en Vercel:

1. **Frontend**: React SPA
2. **Backend**: Node.js API con Express

## 1. Configuración del Frontend

### Paso 1: Preparar el proyecto

Asegúrate de que tu frontend tenga un archivo `vercel.json` en la raíz:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "devCommand": "npm start",
  "installCommand": "npm install",
  "framework": "create-react-app",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Paso 2: Variables de Entorno

Configura las siguientes variables en Vercel Dashboard:

```bash
# Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# API Backend URL
REACT_APP_API_URL=https://tu-backend.vercel.app/api
```

### Paso 3: Deploy desde CLI

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

### Paso 4: Deploy desde Dashboard

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en "New Project"
3. Importa tu repositorio
4. Configura:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Agrega las variables de entorno
6. Click "Deploy"

## 2. Configuración del Backend

### Paso 1: Preparar el proyecto

Crea un archivo `vercel.json` en `backend-nodejs/`:

```json
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
      "src": "/api/(.*)",
      "dest": "src/app.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Paso 2: Variables de Entorno del Backend

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Clerk
CLERK_SECRET_KEY=sk_live_xxx
CLERK_PUBLISHABLE_KEY=pk_live_xxx

# CORS
ALLOWED_ORIGINS=https://techhubupe.com,https://www.techhubupe.com

# Node
NODE_ENV=production
PORT=3000
```

### Paso 3: Deploy del Backend

```bash
cd backend-nodejs
vercel --prod
```

## 3. Configuración de Dominio Personalizado

### Agregar Dominio en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Domains
3. Agrega tu dominio: `techhubupe.com`
4. Vercel te proporcionará registros DNS

### Configurar DNS

Agrega estos registros en tu proveedor de DNS:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Configurar Subdominios

Para el backend:

```
Type: CNAME
Name: api
Value: cname.vercel-dns.com
```

URLs finales:
- Frontend: `https://techhubupe.com`
- Backend: `https://api.techhubupe.com`

## 4. Variables de Entorno Completas

### Frontend (.env.production)

```bash
# Clerk
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_live_xxx

# API
REACT_APP_API_URL=https://api.techhubupe.com/api

# Environment
REACT_APP_ENV=production
```

### Backend (.env.production)

```bash
# Database (Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres

# JWT y Google OAuth
JWT_SECRET=your-super-secret-jwt-key-change-in-production
SESSION_SECRET=your-session-secret-key
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://api.techhubupe.com/api/auth/google/callback

# CORS
ALLOWED_ORIGINS=https://techhubupe.com,https://www.techhubupe.com
FRONTEND_URL=https://techhubupe.com

# Server
NODE_ENV=production
PORT=8000

# Prisma
PRISMA_CLI_BINARY_TARGETS=native,rhel-openssl-1.0.x
```

## 5. Scripts de Deployment

### package.json del Frontend

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "deploy": "vercel --prod",
    "deploy:preview": "vercel"
  }
}
```

### package.json del Backend

```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "deploy": "vercel --prod",
    "postinstall": "prisma generate"
  }
}
```

## 6. CI/CD con GitHub Actions

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Frontend
        run: |
          cd frontend
          npm install -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Backend
        run: |
          cd backend-nodejs
          npm install -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 7. Monitoreo y Logs

### Ver Logs en Tiempo Real

```bash
vercel logs [deployment-url] --follow
```

### Inspeccionar Deployment

```bash
vercel inspect [deployment-url]
```

### Ver Deployments Recientes

```bash
vercel ls
```

## 8. Rollback

Si necesitas volver a una versión anterior:

```bash
# Listar deployments
vercel ls

# Promover un deployment anterior
vercel alias [deployment-url] techhubupe.com
```

## 9. Troubleshooting

### Error: "Module not found"

Solución: Verifica que todas las dependencias estén en `dependencies` (no en `devDependencies`):

```bash
npm install --save missing-package
```

### Error: Database connection timeout

Solución: Agrega la siguiente configuración en `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DATABASE_URL")
}
```

### Error: CORS

Solución: Verifica las variables `ALLOWED_ORIGINS` en el backend.

## 10. Mejores Prácticas

1. **Variables de Entorno**: Nunca commitees archivos `.env` al repositorio
2. **Build Previews**: Usa deployment previews para testing antes de producción
3. **Logs**: Monitorea regularmente los logs de producción
4. **Performance**: Activa Vercel Analytics para métricas de rendimiento
5. **Security**: Usa variables de entorno para todos los secrets
6. **Database**: Configura connection pooling para evitar límites de conexiones

## Recursos Adicionales

- [Documentación oficial de Vercel](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Vercel GitHub Integration](https://vercel.com/docs/git)

---

**Próximos pasos**: Configura [monitoreo y analytics](./monitoring.md) para tu aplicación en producción.
