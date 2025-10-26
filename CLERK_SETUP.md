# Configuración de Clerk - Guía de Instalación

### 1. Crear Cuenta en Clerk

1. Ve a [https://clerk.com](https://clerk.com) y crea una cuenta gratuita
2. Crea una nueva aplicación en el dashboard
3. Nombre sugerido: "UPE Program"

### 2. Configurar Aplicación en Clerk

#### Configuración de OAuth Providers

1. En el dashboard de Clerk, ve a **Configure** → **Social Connections**
2. Activa los providers que desees:
   - **Google** (recomendado para reemplazar tu auth actual)
   - GitHub
   - Microsoft
   - Otros según necesites

#### Configuración de Email/Password (Opcional)

1. Ve a **Configure** → **Email & SMS**
2. Activa **Email** si quieres login con email/contraseña además de OAuth

#### URLs permitidas

1. Ve a **Configure** → **Paths**
2. En **Allowed redirect URLs**, añade:
   - `http://localhost:3000/onboarding` (desarrollo)
   - `https://tu-dominio.com/onboarding` (producción)
3. En **Allowed origins**, añade:
   - `http://localhost:3000` (desarrollo)
   - `https://tu-dominio.com` (producción)

### 3. Obtener las API Keys

1. En el dashboard de Clerk, ve a **API Keys**
2. Encontrarás dos tipos de keys:
   - **Publishable key** (pk_test_...) - Para el frontend
   - **Secret key** (sk_test_...) - Para el backend

### 4. Configurar Variables de Entorno

#### Backend (.env)

Crea un archivo `.env` en `backend-nodejs/` basado en `.env.example`:

```bash
# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017
DB_NAME=upe_program

# Server Configuration
PORT=8000
NODE_ENV=development

# Frontend Configuration
FRONTEND_URL=http://localhost:3000

# Clerk Configuration
CLERK_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

#### Frontend (.env)

Crea un archivo `.env` en `frontend/` basado en `.env.example`:

```bash
# Clerk Configuration
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8000
```

### 5. Instalar Dependencias (Ya Instalado)

Las dependencias ya fueron instaladas:
- Backend: `@clerk/clerk-sdk-node`
- Frontend: `@clerk/clerk-react`

### 6. Iniciar el Proyecto

```bash
# Terminal 1 - Backend
cd backend-nodejs
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## Cambios Realizados

### Backend

1. **Middleware de Autenticación** (`src/middleware/auth.js`)
   - Reemplazado sistema de sesiones manual por verificación con Clerk
   - Mantiene la misma interfaz para compatibilidad
   - Soporte para roles (estudiante/empresa) mediante metadata

2. **Rutas de Autenticación** (`src/routes/auth.js`)
   - Eliminado endpoint `/complete` (ya no necesario)
   - Nuevo endpoint `/set-role` para configurar rol de usuario
   - Endpoints `/me`, `/logout`, `/check` actualizados para Clerk

3. **Variables de Entorno** (`.env.example`)
   - Removido `AUTH_SERVICE_URL`
   - Añadido `CLERK_SECRET_KEY` y `CLERK_PUBLISHABLE_KEY`

### Frontend

1. **Configuración de Clerk** (`src/index.js`)
   - Añadido `ClerkProvider` como wrapper principal

2. **Hook de Autenticación** (`src/hooks/useClerkAuth.js`)
   - Nuevo hook que reemplaza `useAuth` original
   - Sincroniza usuarios de Clerk con base de datos MongoDB
   - Mantiene la misma interfaz que el hook anterior

3. **App Component** (`src/App.js`)
   - Importa `useClerkAuth` en lugar del hook manual
   - No requiere cambios en componentes hijos (compatibilidad total)

## Funcionalidades

### Sistema de Roles

Los usuarios pueden tener dos roles:
- `estudiante` - Para estudiantes que buscan cursos/trabajos
- `empresa` - Para empresas que publican oportunidades

El rol se configura:
1. Usuario hace sign-up en Clerk
2. Usuario es redirigido a `/onboarding`
3. Usuario selecciona su rol (estudiante o empresa)
4. Se llama a `/api/auth/set-role` que actualiza:
   - `publicMetadata` en Clerk
   - Campo `role` en MongoDB

### Flujo de Autenticación

1. Usuario hace clic en "Crear Cuenta" o "Iniciar Sesión"
2. Se abre el modal de Clerk con opciones de login (Google, email, etc.)
3. Usuario se autentica
4. Clerk redirige a `/onboarding` (si es nuevo) o `/dashboard` (si ya tiene rol)
5. Backend sincroniza usuario automáticamente en MongoDB

### Sincronización de Datos

El hook `useClerkAuth` automáticamente:
- Detecta cuando un usuario de Clerk inicia sesión
- Obtiene el token de sesión de Clerk
- Llama a `/api/auth/me` para sincronizar con MongoDB
- Crea el usuario en MongoDB si no existe
- Actualiza el estado local de React

## Seguridad

### Ventajas de Clerk

- Gestión de sesiones automática y segura
- Tokens JWT seguros con rotación automática
- Protección contra XSS y CSRF
- Rate limiting integrado
- Verificación de email automática
- 2FA disponible (Two-Factor Authentication)

### Cookies

Clerk usa cookies seguras:
- `httpOnly: true` - No accesible desde JavaScript
- `secure: true` - Solo HTTPS en producción
- `sameSite: strict` - Protección CSRF

## Plan Gratuito

El plan gratuito de Clerk incluye:
- 10,000 usuarios activos mensuales (MAUs)
- OAuth ilimitado (Google, GitHub, etc.)
- Email/password authentication
- Componentes UI pre-construidos
- Webhooks
- Session management
- User metadata

## Personalización (Opcional)

### Personalizar UI de Clerk

1. Ve a **Customization** en el dashboard de Clerk
2. Puedes personalizar:
   - Colores y tema
   - Logo
   - Textos y traducciones
   - Posición del modal

### Traducir a Español

1. Ve a **Customization** → **Localization**
2. Selecciona **Spanish (es)** como idioma por defecto

## Troubleshooting

### Error: "Missing Publishable Key"

**Solución**: Verifica que creaste el archivo `.env` en `frontend/` con:
```
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Error: "Clerk: Invalid session token"

**Solución**: Verifica que la `CLERK_SECRET_KEY` en backend coincida con la aplicación de Clerk.

### Usuario no se sincroniza con MongoDB

**Solución**:
1. Revisa que MongoDB esté corriendo
2. Verifica la conexión en backend logs
3. Comprueba que `MONGO_URL` sea correcta en `.env`

### Modal de Clerk no aparece

**Solución**:
1. Verifica que `ClerkProvider` esté en `index.js`
2. Abre la consola del navegador para ver errores
3. Verifica que la publishable key sea válida

## Recursos

- [Documentación de Clerk](https://clerk.com/docs)
- [Dashboard de Clerk](https://dashboard.clerk.com)
- [React SDK de Clerk](https://clerk.com/docs/references/react/overview)
- [Node.js SDK de Clerk](https://clerk.com/docs/references/nodejs/overview)

## Próximos Pasos

1. Configurar cuenta en Clerk
2. Obtener API keys
3. Configurar archivos `.env`
4. Probar el flujo de autenticación
5. Personalizar UI de Clerk (opcional)
6. Configurar webhooks para eventos de usuario (opcional)
7. Activar 2FA para mayor seguridad (opcional)

## Preguntas Frecuentes

### ¿Puedo migrar usuarios existentes?

Sí, Clerk tiene una API para importar usuarios. Consulta la [documentación de migración](https://clerk.com/docs/users/importing-users).

### ¿Funciona offline?

No, Clerk requiere conexión a internet para verificar sesiones. Pero tiene sistema de cache para mejor rendimiento.

### ¿Puedo usar mi propio dominio para login?

Sí, en planes de pago puedes usar tu propio dominio personalizado.

### ¿Cómo elimino datos de prueba?

En el dashboard de Clerk:
1. Ve a **Users**
2. Selecciona usuarios de prueba
3. Click en "Delete"

---

**¡Listo!** Tu proyecto ahora usa Clerk como proveedor de autenticación.
