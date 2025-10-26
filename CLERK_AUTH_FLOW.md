# Flujo de Autenticación con Clerk - Registro Diferenciado por Rol

## 📋 Resumen

Se han implementado páginas de registro **completamente separadas** para **Estudiantes** y **Empresas** usando Clerk, cada una con:
- ✅ Formularios específicos de onboarding
- ✅ Campos personalizados según el tipo de usuario
- ✅ Autenticación mediante Google y Email/Password
- ✅ Experiencia de usuario diferenciada

## 🎯 Componentes Creados

### 1. `/registro-estudiante` - StudentSignUp
- Página de registro exclusiva para estudiantes
- Integración con Clerk SignUp
- Color theme: Cyan/Blue
- Beneficios destacados para estudiantes
- Opción de registro con Google o Email/Password
- Redirige a `/onboarding-estudiante`

### 2. `/registro-empresa` - CompanySignUp
- Página de registro exclusiva para empresas
- Integración con Clerk SignUp
- Color theme: Orange/Red
- Beneficios destacados para empresas
- Opción de registro con Google o Email/Password
- Redirige a `/onboarding-empresa`

### 3. `/login` - Login
- Página de inicio de sesión unificada
- Integración con Clerk SignIn
- Enlaces a ambos tipos de registro
- Soporte para Google y Email/Password

### 4. `/onboarding-estudiante` - StudentOnboarding
- Formulario específico para estudiantes
- Campos: carrera, educación, habilidades, bio, redes sociales
- Pre-configura rol como "estudiante"
- Diseño en colores cyan

### 5. `/onboarding-empresa` - CompanyOnboarding
- Formulario específico para empresas
- Campos: nombre empresa, RUC, industria, tamaño, ubicación, beneficios
- Pre-configura rol como "empresa"
- Diseño en colores orange

## 🔄 Flujo de Usuario

### Para Estudiantes:
1. Usuario hace clic en "Crear Cuenta Estudiante" en landing page
2. Se redirige a `/registro-estudiante`
3. Se guarda `intended_role = 'estudiante'` en sessionStorage
4. Usuario completa registro con Clerk (Google o Email)
5. Clerk redirige a `/onboarding-estudiante`
6. Usuario completa formulario específico de estudiante:
   - Carrera o área de estudio
   - Institución educativa (opcional)
   - Biografía
   - Habilidades
   - Redes sociales (GitHub, LinkedIn, Portfolio)
   - Teléfono (opcional)
7. Al guardar, se crea usuario con rol "estudiante" en BD
8. Se redirige a `/dashboard`

### Para Empresas:
1. Usuario hace clic en "Registrar Empresa" en landing page
2. Se redirige a `/registro-empresa`
3. Se guarda `intended_role = 'empresa'` en sessionStorage
4. Usuario completa registro con Clerk (Google o Email)
5. Clerk redirige a `/onboarding-empresa`
6. Usuario completa formulario específico de empresa:
   - Nombre de la empresa *
   - RUC o documento *
   - Industria/Sector
   - Tamaño de la empresa
   - Descripción de la empresa
   - Beneficios para empleados
   - Información de contacto (teléfono, web, LinkedIn)
   - Ubicación (dirección, ciudad, país)
7. Al guardar, se crea usuario con rol "empresa" en BD
8. Se redirige a `/dashboard`

### Para Login:
1. Usuario hace clic en "Iniciar Sesión" en landing page
2. Se redirige a `/login`
3. Usuario inicia sesión con Clerk
4. Se redirige automáticamente a `/dashboard`

## 📝 Campos de Base de Datos

### Campos Compartidos:
- `id` - UUID único
- `email` - Email del usuario (desde Clerk)
- `name` - Nombre completo (desde Clerk)
- `picture` - URL de foto de perfil
- `role` - "estudiante" o "empresa"
- `is_verified` - Estado de verificación
- `created_at` - Fecha de creación
- `updated_at` - Última actualización

### Campos Específicos de Estudiante:
- `career` - Carrera o área de estudio
- `education` - Institución educativa
- `phone` - Teléfono de contacto
- `skills` - Array de habilidades
- `bio` - Biografía personal
- `github_url` - Perfil de GitHub
- `linkedin_url` - Perfil de LinkedIn
- `portfolio_url` - Sitio web personal
- `cv_file_path` - Ruta del CV
- `certificate_files` - Archivos de certificados
- `degree_files` - Archivos de títulos

### Campos Específicos de Empresa:
- `company_name` - Nombre de la empresa *
- `company_document` - RUC o documento fiscal *
- `industry` - Industria/Sector
- `company_size` - Tamaño (1-10, 11-50, etc.)
- `website` - Sitio web corporativo
- `phone` - Teléfono de contacto
- `linkedin_url` - LinkedIn corporativo
- `address` - Dirección física
- `city` - Ciudad
- `country` - País (default: Paraguay)
- `bio` - Descripción de la empresa
- `benefits` - Beneficios para empleados

## 🎨 Diseño Visual

### StudentSignUp (Estudiante):
- **Color Principal**: Cyan (#06B6D4)
- **Ícono**: UserCheck
- **Gradiente**: Cyan a Blue
- **Beneficios Mostrados**:
  - ✓ Acceso ilimitado a cursos
  - ✓ Eventos y capacitaciones
  - ✓ Oportunidades laborales
  - ✓ Perfil profesional

### CompanySignUp (Empresa):
- **Color Principal**: Orange (#F97316)
- **Ícono**: Building
- **Gradiente**: Orange a Red
- **Beneficios Mostrados**:
  - ✓ Publicación de vacantes
  - ✓ Acceso a talento calificado
  - ✓ Eventos de reclutamiento
  - ✓ Perfil corporativo

### Login (Inicio de Sesión):
- **Color Principal**: Cyan (#06B6D4)
- **Diseño Minimalista**: Foco en la acción principal
- **Enlaces Cruzados**: A ambos tipos de registro

## 🔧 Configuración de Clerk

### Clerk Dashboard:
1. Habilitar **Google OAuth** en Social Connections
2. Habilitar **Email/Password** authentication
3. Configurar URLs permitidas:
   ```
   Desarrollo:
   - http://localhost:3000
   - http://localhost:3000/onboarding
   - http://localhost:3000/dashboard
   - http://localhost:3000/registro-estudiante
   - http://localhost:3000/registro-empresa
   - http://localhost:3000/login

   Producción:
   - https://tu-dominio.com
   - https://tu-dominio.com/onboarding
   - https://tu-dominio.com/dashboard
   - https://tu-dominio.com/registro-estudiante
   - https://tu-dominio.com/registro-empresa
   - https://tu-dominio.com/login
   ```

### Variables de Entorno:

**Frontend (.env)**:
```bash
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXX
REACT_APP_BACKEND_URL=http://localhost:8000
```

**Backend (.env)**:
```bash
CLERK_SECRET_KEY=sk_test_XXXXXXX
CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXX
```

## 📱 Personalización de Clerk UI

Los componentes usan el sistema de `appearance` de Clerk para mantener consistencia visual:

```javascript
appearance={{
  elements: {
    card: "bg-slate-800 border-slate-700",
    formButtonPrimary: "bg-cyan-500 hover:bg-cyan-600",
    formFieldInput: "bg-slate-700 border-slate-600 text-white",
    // ... más estilos personalizados
  }
}}
```

## 🛣️ Rutas Agregadas

```javascript
// Rutas de autenticación
<Route path="/registro-estudiante" element={<StudentSignUp />} />
<Route path="/registro-empresa" element={<CompanySignUp />} />
<Route path="/login" element={<Login />} />
```

## 🔐 Seguridad y Metadata

### Almacenamiento de Rol:
1. **sessionStorage**: `intended_role` (temporal durante registro)
2. **Clerk publicMetadata**: `role` (persistente después de onboarding)
3. **MongoDB**: campo `role` en colección de usuarios

### Sincronización:
- El hook `useClerkAuth` sincroniza automáticamente con el backend
- El backend verifica el token de Clerk en cada request
- Los roles se propagan desde Clerk → Backend → Frontend

## 🎯 Características Principales

### ✅ Múltiples Métodos de Autenticación:
- Google OAuth
- Email + Password
- Más providers disponibles (GitHub, Microsoft, etc.)

### ✅ Experiencia Separada por Rol:
- Páginas específicas para cada tipo de usuario
- Mensajes y beneficios personalizados
- Color themes diferenciados

### ✅ Responsive Design:
- Funciona en móvil, tablet y desktop
- Header fijo con navegación
- Cards adaptables

### ✅ Navegación Intuitiva:
- Enlaces cruzados entre páginas de auth
- Botón "Volver" en todas las páginas
- Mensajes claros de estado

## 🧪 Testing

### Para Probar el Flujo:

1. **Registro de Estudiante**:
   ```
   1. Ir a http://localhost:3000
   2. Click en "Crear Cuenta Estudiante"
   3. Registrarse con Google o Email
   4. Completar onboarding
   5. Verificar dashboard
   ```

2. **Registro de Empresa**:
   ```
   1. Ir a http://localhost:3000
   2. Click en "Registrar Empresa"
   3. Registrarse con Google o Email
   4. Completar información empresarial
   5. Verificar dashboard
   ```

3. **Login Existente**:
   ```
   1. Ir a http://localhost:3000
   2. Click en "Iniciar Sesión"
   3. Login con credenciales existentes
   4. Verificar redirección a dashboard
   ```

## 🐛 Troubleshooting

### Problema: Modal de Clerk no aparece
**Solución**: Verificar que `REACT_APP_CLERK_PUBLISHABLE_KEY` esté correctamente configurada

### Problema: Redirección no funciona
**Solución**: Verificar las URLs permitidas en Clerk Dashboard

### Problema: Rol no se guarda
**Solución**: Verificar que sessionStorage.intended_role se esté guardando correctamente

### Problema: Error de CORS
**Solución**: Verificar que el backend tenga configurado CORS para el frontend URL

## 📚 Recursos Adicionales

- [Documentación de Clerk](https://clerk.com/docs)
- [Clerk React Components](https://clerk.com/docs/components/overview)
- [Clerk Appearance Customization](https://clerk.com/docs/components/customization/overview)

## 🗄️ Migración de Base de Datos

### Paso 1: Ejecutar Migración SQL

Ejecuta el archivo SQL para agregar los nuevos campos:

```bash
cd backend-nodejs
psql $DATABASE_URL -f add_onboarding_fields.sql
```

O si estás usando Supabase, ejecuta el SQL directamente en el SQL Editor:

```sql
-- Ver el contenido de add_onboarding_fields.sql
```

### Paso 2: Generar Cliente Prisma

Después de modificar el schema, genera el cliente de Prisma:

```bash
cd backend-nodejs
npx prisma generate
```

### Paso 3: (Opcional) Crear Migración con Prisma

Si prefieres usar las migraciones de Prisma:

```bash
cd backend-nodejs
npx prisma migrate dev --name add_onboarding_fields
```

## 📦 Archivos Creados/Modificados

### Nuevos Archivos:
- `frontend/src/pages/StudentSignUp.jsx` - Registro de estudiantes
- `frontend/src/pages/CompanySignUp.jsx` - Registro de empresas
- `frontend/src/pages/Login.jsx` - Inicio de sesión
- `frontend/src/pages/StudentOnboarding.jsx` - Onboarding de estudiantes
- `frontend/src/pages/CompanyOnboarding.jsx` - Onboarding de empresas
- `backend-nodejs/add_onboarding_fields.sql` - Migración SQL

### Archivos Modificados:
- `frontend/src/App.js` - Rutas actualizadas
- `frontend/src/hooks/useClerkAuth.js` - Redirecciones mejoradas
- `backend-nodejs/prisma/schema.prisma` - Campos adicionales
- `CLERK_AUTH_FLOW.md` - Esta documentación

## ✨ Próximos Pasos Opcionales

1. **Configurar webhooks de Clerk** para sincronización en tiempo real
2. **Habilitar 2FA** para mayor seguridad
3. **Personalizar emails** de verificación
4. **Agregar más OAuth providers** (GitHub, Microsoft, etc.)
5. **Implementar verificación de documentos** para empresas
6. **Agregar validación de RUC** para empresas paraguayas

---

**Nota**: Todo el código está listo para producción. Solo necesitas:
1. Configurar las API keys de Clerk
2. Ejecutar la migración de base de datos
3. Generar el cliente de Prisma
