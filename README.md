# 🎓 TechHub UPE - Plataforma Educativa Integral

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-blue.svg)](https://postgresql.org/)

## 📋 Descripción

TechHub UPE es una plataforma educativa integral diseñada para estudiantes y empresas de la Universidad Privada del Este (UPE). La plataforma centraliza recursos educativos, oportunidades laborales, eventos académicos y herramientas de networking en un solo lugar.

### 🌟 Características Principales

- **🎯 Portal Unificado**: Cursos, eventos, vacantes laborales y becas en una sola plataforma
- **👥 Tres Tipos de Usuario**: Estudiantes, empresas y administradores
- **📊 Panel Administrativo**: Gestión completa de usuarios, contenido y analytics
- **💾 Sistema de Guardados**: Los usuarios pueden guardar y organizar contenido de interés
- **🔐 Autenticación Segura**: Sistema de autenticación robusto con roles y permisos
- **📱 Diseño Responsive**: Optimizado para móviles, tablets y desktop
- **🌙 Tema Oscuro**: Interfaz moderna con esquema de colores oscuros

## 🏗️ Arquitectura del Sistema

### Frontend (React 18.2)
- **Framework**: React con Create React App
- **Routing**: React Router DOM
- **UI Framework**: Radix UI + Tailwind CSS
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Axios
- **Charts**: Chart.js + React Chart.js 2
- **Icons**: Lucide React

### Backend (Node.js + Express)
- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: PostgreSQL con Prisma ORM
- **Authentication**: JWT + Cookies
- **File Upload**: Multer
- **Security**: Helmet, CORS, Rate Limiting...
- **Validation**: Express Validator + Joi

### Base de Datos (PostgreSQL + Supabase + Prisma)
- **Database**: PostgreSQL 15+ alojado en Supabase
- **ORM**: Prisma Client para type-safety
- **Migrations**: Prisma Migrate para versionado
- **Schema**: Definido en `schema.prisma`
- **Dashboard**: Supabase Studio para administración visual
- **Backups**: Automáticos con Supabase

## 📁 Estructura del Proyecto

```
upe-program/
├── 📁 frontend/                    # Aplicación React
│   ├── 📁 public/                  # Archivos públicos
│   ├── 📁 src/
│   │   ├── 📁 components/          # Componentes reutilizables
│   │   │   ├── 📁 ui/             # Componentes UI base (Radix)
│   │   │   ├── 📁 admin/          # Componentes del panel admin
│   │   │   ├── Header.jsx         # Navegación principal
│   │   │   ├── Footer.jsx         # Pie de página
│   │   │   └── ...
│   │   ├── 📁 pages/              # Páginas principales
│   │   │   ├── AdminDashboard.jsx # Panel de administración
│   │   │   └── ...
│   │   ├── 📁 hooks/              # Custom React Hooks
│   │   │   ├── useAuth.js         # Hook de autenticación
│   │   │   └── useSystemSettings.js
│   │   ├── 📁 utils/              # Utilidades
│   │   ├── 📁 styles/             # Estilos globales
│   │   ├── App.js                 # Componente principal
│   │   └── index.js              # Punto de entrada
│   ├── package.json
│   └── tailwind.config.js
├── 📁 backend-nodejs/              # API REST
│   ├── 📁 src/
│   │   ├── 📁 routes/             # Rutas de la API
│   │   │   ├── admin.js           # Rutas administrativas
│   │   │   ├── auth.js            # Autenticación
│   │   │   ├── users.js           # Gestión de usuarios
│   │   │   ├── content.js         # Contenido (cursos, eventos, jobs)
│   │   │   └── ...
│   │   ├── 📁 middleware/         # Middlewares
│   │   │   ├── auth.js            # Validación de autenticación
│   │   │   ├── security.js        # Seguridad y rate limiting
│   │   │   └── upload.js          # Subida de archivos
│   │   ├── 📁 config/             # Configuraciones
│   │   │   ├── database.js        # Configuración DB
│   │   │   ├── prisma.js          # Cliente Prisma
│   │   │   └── jwt.config.js      # Configuración JWT
│   │   ├── 📁 dto/                # Data Transfer Objects
│   │   ├── 📁 utils/              # Utilidades del backend
│   │   └── app.js                 # Servidor Express
│   ├── 📁 prisma/
│   │   ├── schema.prisma          # Schema de la base de datos
│   │   └── 📁 migrations/         # Migraciones de DB
│   ├── 📁 uploads/                # Archivos subidos
│   ├── package.json
│   └── SUPABASE_SETUP.sql        # Script de inicialización
├── 📁 scripts/                    # Scripts de automatización
├── package.json                   # Configuración del workspace
├── start-dev.sh                   # Script de desarrollo
├── deploy-vercel.sh              # Script de deploy
└── README.md                     # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** 16+ y npm 8+
- **PostgreSQL** 15+ o cuenta gratuita en [Supabase](https://supabase.com) (recomendado)
- **Git**

### 1. Clonar el Repositorio

```bash
git clone https://github.com/mayasama5/upe-program.git
cd upe-program
```

### 2. Instalar Dependencias

```bash
# Instalar dependencias de todo el proyecto
npm run install:all

# O instalar por separado:
npm install                    # Dependencias raíz
cd backend-nodejs && npm install
cd ../frontend && npm install
```

### 3. Configuración de Variables de Entorno

#### Backend (`.env` en `/backend-nodejs/`)

```env
# Base de datos (obtén la URL desde Supabase Dashboard > Settings > Database)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres"

# JWT
JWT_SECRET="tu-clave-super-secreta-aqui"
SESSION_SECRET="otra-clave-secreta-para-sesiones"

# Entorno
NODE_ENV="development"
PORT=8000

# CORS (opcional en desarrollo)
FRONTEND_URL="http://localhost:3000"
```

#### Frontend (`.env` en `/frontend/`)

```env
# URL del backend
REACT_APP_BACKEND_URL="http://localhost:8000"

# Entorno
NODE_ENV="development"
```

### 4. Configurar Base de Datos

```bash
cd backend-nodejs

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Poblar con datos de ejemplo
npm run populate
```

### 5. Ejecutar en Desarrollo

```bash
# Desde la raíz del proyecto
npm run dev

# O ejecutar por separado:
npm run start:backend    # Backend en puerto 8000
npm run start:frontend   # Frontend en puerto 3000
```

La aplicación estará disponible en:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

## 👥 Tipos de Usuario y Funcionalidades

### 🎓 Estudiantes
- **Dashboard personalizado** con estadísticas
- **Explorar contenido**: Cursos, eventos y vacantes laborales
- **Sistema de guardados**: Organizar contenido de interés
- **Perfil de usuario**: Gestionar información personal y académica
- **Aplicaciones**: Aplicar a vacantes y eventos

### 🏢 Empresas
- **Panel empresarial** para gestión de vacantes
- **Publicar ofertas laborales**: Crear y administrar vacantes
- **Ver candidatos**: Revisar aplicaciones de estudiantes
- **Perfil empresarial**: Información de la empresa

### 👨‍💼 Administradores
- **Panel administrativo completo**
- **Gestión de usuarios**: CRUD de usuarios con roles
- **Gestión de contenido**: Administrar cursos, eventos y vacantes
- **Analytics y reportes**: Estadísticas y métricas del sistema
- **Sistema de notificaciones**: Enviar comunicados masivos
- **Configuración del sistema**: Mantenimiento y ajustes
- **Logs del sistema**: Monitoreo de actividad

## 🔧 API Endpoints Principales

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/verify` - Verificar token

### Contenido Público
- `GET /api/courses` - Listar cursos
- `GET /api/events` - Listar eventos
- `GET /api/jobs` - Listar vacantes laborales

### Administración (Requiere rol admin)
- `GET /api/admin/users` - Gestión de usuarios
- `GET /api/admin/dashboard-stats` - Estadísticas del dashboard
- `POST /api/admin/content/courses` - Crear curso
- `PUT /api/admin/users/:id` - Actualizar usuario
- `DELETE /api/admin/users/:id` - Eliminar usuario

### Usuarios Autenticados
- `GET /api/users/saved-items` - Items guardados
- `POST /api/users/save-item` - Guardar item
- `PUT /api/users/profile` - Actualizar perfil

## 🗃️ Esquema de Base de Datos

### Modelos Principales

```sql
-- Usuarios del sistema
User {
  id          String    @id @default(uuid())
  email       String    @unique
  name        String
  role        UserRole  // estudiante, empresa, admin
  is_verified Boolean
  created_at  DateTime
  // ... más campos
}

-- Cursos educativos
Course {
  id          String    @id @default(uuid())
  title       String
  description String
  provider    String
  url         String
  category    String
  is_free     Boolean
  // ... más campos
}

-- Eventos académicos
Event {
  id          String    @id @default(uuid())
  title       String
  description String
  event_date  DateTime
  location    String
  is_virtual  Boolean
  // ... más campos
}

-- Vacantes laborales
JobVacancy {
  id          String    @id @default(uuid())
  title       String
  company     String
  location    String
  job_type    JobType   // practica, pasantia, junior, etc.
  salary_min  Int?
  is_active   Boolean
  // ... más campos
}

-- Items guardados por usuarios
SavedItem {
  id          String    @id @default(uuid())
  user_id     String
  item_type   String    // course, event, job
  item_id     String
  created_at  DateTime
}
```

## 🛠️ Scripts Disponibles

### Desarrollo
```bash
npm run dev                 # Ejecutar frontend y backend
npm run start:frontend      # Solo frontend
npm run start:backend       # Solo backend
```

### Construcción y Deploy
```bash
npm run build              # Construir frontend para producción
npm run build:frontend     # Construir solo frontend
npm run populate:db        # Poblar base de datos
```

### Base de Datos
```bash
# Desde la raíz
npm run db:migrate         # Ejecutar migraciones
npm run db:studio          # Abrir Prisma Studio
npm run db:generate        # Regenerar cliente Prisma

# O desde backend-nodejs:
cd backend-nodejs
npx prisma studio          # Interfaz visual de la DB
npx prisma migrate dev      # Crear nueva migración
npx prisma generate         # Regenerar cliente Prisma
npx prisma db seed          # Poblar con datos de ejemplo
```

### Documentación
```bash
# Ejecutar todos los sistemas de documentación
npm run docs:dev

# Ejecutar solo uno:
npm run docs:storybook     # Componentes UI visuales (puerto 6006)
npm run docs:styleguide    # Documentación técnica (puerto 6060)
npm run docs:docusaurus    # Docs generales (puerto 3000)

# Generar builds estáticos:
npm run docs:build         # Toda la documentación
```

## 🚀 Deploy en Producción

### Opción 1: Vercel (Recomendado)

1. **Crear proyecto en Supabase** (si aún no lo tienes):
   - Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto
   - Copia la `DATABASE_URL` desde Settings > Database > Connection string
   - Formato: `postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres`

2. **Deploy del Backend**:
```bash
cd backend-nodejs
npx vercel --prod
```

3. **Configurar variables de entorno en Vercel**:
   - `DATABASE_URL`: URL de PostgreSQL desde Supabase
   - `JWT_SECRET`: Clave secreta para JWT
   - `SESSION_SECRET`: Clave secreta para sesiones
   - `NODE_ENV=production`

4. **Deploy del Frontend**:
```bash
# Actualizar .env.production con URL del backend
cd frontend
npx vercel --prod
```

5. **Deploy de la Documentación** (Opcional):
```bash
cd docs
npx vercel --prod
```

### Opción 2: Docker

```bash
# Construir y ejecutar con Docker Compose
docker-compose up --build
```

Ver [DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md) para instrucciones detalladas.

## 🧪 Testing

```bash
# Ejecutar tests del backend
cd backend-nodejs
npm test

# Ejecutar tests del frontend
cd frontend
npm test

# Ejecutar todos los tests
npm run test
```

## 📈 Características Avanzadas

### Panel Administrativo
- **Gestión de usuarios completa** con roles y permisos
- **Sistema de confirmación** para acciones críticas (eliminar usuarios)
- **Modal de detalles de usuario** con información completa
- **Analytics en tiempo real** con gráficos interactivos
- **Sistema de logs** para monitoreo de actividad
- **Reportes exportables** en Excel/PDF

### Seguridad
- **Autenticación JWT** con refresh tokens
- **Rate limiting** para prevenir abuso de API
- **Validación de datos** en frontend y backend
- **Sanitización de inputs** para prevenir XSS
- **CORS configurado** para producción
- **Headers de seguridad** con Helmet

### Performance
- **Lazy loading** de componentes
- **Optimización de imágenes** automática
- **Cacheo de API** responses
- **Minificación** de assets en producción
- **Code splitting** automático

## 🐛 Debugging y Logs

### Logs del Sistema
- Los logs se almacenan en la base de datos
- Accesibles desde el panel administrativo
- Diferentes niveles: INFO, WARN, ERROR

### Debugging en Desarrollo
```bash
# Backend con nodemon
cd backend-nodejs
npm run dev

# Frontend con hot reload
cd frontend
npm start

# Ver logs de base de datos
npx prisma studio
```

## 🤝 Contribuir

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

### Estándares de Código
- **JavaScript**: ES6+ con async/await
- **CSS**: Tailwind CSS para estilos
- **Componentes**: Functional components con hooks
- **Naming**: camelCase para variables, PascalCase para componentes

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autores

- **Equipo UPE** - *Desarrollo inicial* - [GitHub](https://github.com/mayasama5)

## 📞 Soporte

Para soporte técnico o consultas:

- **Email**: techhub@upe.edu.do
- **Issues**: [GitHub Issues](https://github.com/mayasama5/upe-program/issues)
- **Documentación**: Ver archivos de documentación en el repositorio

## 📚 Documentación Completa

Este proyecto cuenta con **tres sistemas de documentación profesional**, ideal para tesis de grado o presentaciones académicas:

### 📖 1. Storybook - Documentación Visual de Componentes

Documentación interactiva de todos los componentes UI con ejemplos en vivo.

```bash
npm run docs:storybook
# Abre http://localhost:6006
```

**Incluye**:
- ✅ 25+ historias de componentes UI
- ✅ Controles interactivos para props
- ✅ Ejemplos visuales de todas las variantes
- ✅ Casos de uso prácticos
- ✅ Dark/Light mode

**Componentes documentados**: Button, Card, Input, Table, Badge, Alert, y más.

### 📝 2. React Styleguidist - Documentación Técnica

Documentación técnica detallada con JSDoc, props y código fuente.

```bash
npm run docs:styleguide
# Abre http://localhost:6060
```

**Incluye**:
- ✅ PropTypes y TypeScript types
- ✅ Comentarios JSDoc completos
- ✅ Ejemplos de código con sintaxis highlighting
- ✅ Código fuente navegable
- ✅ Hooks personalizados documentados

### 🦕 3. Docusaurus - Documentación General

Documentación completa del proyecto: arquitectura, API, deployment y guías.

```bash
npm run docs:docusaurus
# Abre http://localhost:3000
```

**Incluye**:
- ✅ Introducción y características del proyecto
- ✅ Arquitectura del sistema con diagramas
- ✅ Decisiones técnicas justificadas
- ✅ API Reference completo con ejemplos
- ✅ Guía de deployment paso a paso
- ✅ Troubleshooting y mejores prácticas

### 🚀 Ejecutar Toda la Documentación

```bash
# Instalar dependencias (solo primera vez)
npm run install:all

# Ejecutar los 3 sistemas simultáneamente
npm run docs:dev
```

Esto abrirá:
- **Storybook**: http://localhost:6006
- **Styleguidist**: http://localhost:6060
- **Docusaurus**: http://localhost:3000

### 📦 Generar Documentación Estática

```bash
# Generar builds de producción
npm run docs:build
```

Salida:
- `/frontend/storybook-static/` - Storybook listo para deploy
- `/frontend/styleguide-build/` - Styleguidist estático
- `/docs/build/` - Docusaurus estático

### 📖 Guías Detalladas

Para información completa sobre la documentación y uso para tesis:

- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Guía completa de documentación
- **[TESIS_GUIDE.md](./TESIS_GUIDE.md)** - Justificación académica y uso para tesis
- **[QUICK_START_DOCS.md](./QUICK_START_DOCS.md)** - Inicio rápido y comandos

### 🎓 Valor para Tesis

La documentación incluye:
- ✅ Justificación de todas las decisiones técnicas
- ✅ Diagramas de arquitectura
- ✅ Patrones de diseño implementados
- ✅ Métricas del proyecto
- ✅ Evidencias visuales (screenshots)
- ✅ Código documentado con JSDoc
- ✅ Guías de deployment completas

## 📚 Recursos Adicionales

### Documentación del Proyecto
- [DOCUMENTATION.md](./DOCUMENTATION.md) - Guía completa de documentación
- [TESIS_GUIDE.md](./TESIS_GUIDE.md) - Guía para uso en tesis de grado
- [QUICK_START_DOCS.md](./QUICK_START_DOCS.md) - Inicio rápido
- [DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md) - Instrucciones de deployment
- [SECURITY.md](./SECURITY.md) - Políticas de seguridad

### Documentación Externa
- [Prisma Docs](https://www.prisma.io/docs/) - Documentación de Prisma ORM
- [Supabase Docs](https://supabase.com/docs) - Documentación de Supabase
- [React Docs](https://react.dev/) - Documentación de React
- [Tailwind CSS](https://tailwindcss.com/docs) - Documentación de Tailwind
- [Radix UI](https://www.radix-ui.com/) - Componentes accesibles

---

<div align="center">
  <p>Hecho con ❤️ para la comunidad de UPE</p>
  <img src="https://img.shields.io/badge/UPE-TechHub-blue?style=for-the-badge&logo=education" alt="UPE TechHub" />
</div>