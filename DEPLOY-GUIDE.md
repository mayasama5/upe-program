# Guía de Deploy para Desarrolladores

## 🚀 Deploy Rápido para Cualquier Usuario

Este proyecto está configurado para ser deployado fácilmente por cualquier desarrollador sin necesidad de hardcodear URLs específicas.

### ✅ Configuración Automática

**CORS Dinámico**: El backend acepta automáticamente cualquier dominio `*.vercel.app`
**Auto-detección de URLs**: El frontend detecta automáticamente la URL del backend

# Guía de Deploy para Desarrolladores

## � Deploy Paso a Paso

### 📋 Orden de Deploy

#### 1. Preparar MongoDB Atlas (Una sola vez)
```bash
# 1. Crear cuenta en https://cloud.mongodb.com/
# 2. Crear cluster gratuito
# 3. Obtener connection string
```

#### 2. Deploy Backend PRIMERO
```bash
cd backend-nodejs
npx vercel --prod
```
**📝 Anota la URL del backend que aparece (ej: https://upe-xxx.vercel.app)**

**Variables de entorno requeridas en Vercel Dashboard:**
```
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net
DB_NAME=techhub_upe_prod
NODE_ENV=production
SESSION_SECRET=tu-clave-super-secreta-aqui
```

#### 3. Actualizar Frontend con URL del Backend
Edita `frontend/.env.production`:
```bash
REACT_APP_BACKEND_URL=https://tu-backend-url-aqui.vercel.app
```

#### 4. Deploy Frontend
```bash
cd frontend
npx vercel --prod
```

#### 5. Poblar Base de Datos
```bash
cd backend-nodejs
vercel env pull
node scripts/populate_nodejs.js
```

### 🔧 Para tu amiga (o cualquier desarrollador)

1. **Fork el repositorio**
2. **Deploy backend** → Obtener URL
3. **Actualizar** `frontend/.env.production` con la URL del backend
4. **Deploy frontend**
5. **Configurar MongoDB Atlas** en Vercel
6. **Poblar datos**

### ✅ URLs de Ejemplo (Actuales)

- **Frontend**: `https://upe-fu8l4n3eu-gustavogamarra95s-projects.vercel.app`
- **Backend**: `https://upe-8gd0xyqyk-gustavogamarra95s-projects.vercel.app`

### 🔄 URLs Dinámicas en Vercel

⚠️ **Importante**: Cada deploy en Vercel genera una URL nueva. Para usar URLs fijas:

1. **Configurar dominio personalizado** en Vercel Dashboard
2. **O usar alias** con `vercel --prod --alias my-app.vercel.app`

### 🆘 Troubleshooting

**Error "Network Error"**: 
- Verificar que `REACT_APP_BACKEND_URL` esté correctamente configurado
- Asegurarse de que el backend esté deployado y funcionando

**Error de CORS**: 
- El backend acepta automáticamente dominios `*.vercel.app`
- Verificar en logs del backend que el origin sea reconocido

**Cookies SameSite Error**:
- Normal en producción con dominios separados
- La autenticación funcionará correctamente pese al warning

**Base de datos vacía**: 
- Ejecutar `node scripts/populate_nodejs.js` después del deploy

---

🎉 **¡Configuración completa!**

---

🎉 **¡Listo para compartir con cualquier desarrollador!**
