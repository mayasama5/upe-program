# 📑 Índice de Documentación - UPE Program

**Guía rápida para encontrar cualquier información sobre el proyecto**

---

## 🚀 Inicio Rápido

¿Primera vez usando el proyecto? **Empieza aquí**:

1. 📖 **[README.md](./README.md)** - Descripción general del proyecto
2. ⚡ **[QUICK_START_DOCS.md](./QUICK_START_DOCS.md)** - Comandos rápidos de documentación
3. 🎓 **[TESIS_GUIDE.md](./TESIS_GUIDE.md)** - Si vas a usar esto para tesis

---

## 📚 Documentación Principal

### Guías Generales

| Archivo | Descripción | Cuándo Leerlo |
|---------|-------------|---------------|
| **[README.md](./README.md)** | Descripción completa del proyecto, instalación, arquitectura | Siempre primero |
| **[DOCUMENTATION.md](./DOCUMENTATION.md)** | Guía completa de los 3 sistemas de documentación (4,000+ palabras) | Para entender la documentación |
| **[TESIS_GUIDE.md](./TESIS_GUIDE.md)** | Justificación académica, objetivos, decisiones técnicas (5,000+ palabras) | Para tesis de grado |
| **[QUICK_START_DOCS.md](./QUICK_START_DOCS.md)** | Comandos rápidos y troubleshooting (2,500+ palabras) | Referencia rápida |
| **[RESUMEN_FINAL.md](./RESUMEN_FINAL.md)** | Resumen de todo lo implementado | Ver lo que se logró |
| **[CHANGELOG_DOCS.md](./CHANGELOG_DOCS.md)** | Historial de cambios de la documentación | Ver versiones |

### Guías de Deployment

| Archivo | Descripción | Cuándo Leerlo |
|---------|-------------|---------------|
| **[DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md)** | Guía general de deployment | Deploy a producción |
| **[VERCEL-DEPLOY-GUIDE.md](./VERCEL-DEPLOY-GUIDE.md)** | Deployment específico en Vercel | Deploy en Vercel |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | Documentación adicional de deployment | Referencia extra |
| **[docs/docs/deployment/vercel.md](./docs/docs/deployment/vercel.md)** | Guía paso a paso en Docusaurus | Tutorial completo |

### Seguridad y Configuración

| Archivo | Descripción | Cuándo Leerlo |
|---------|-------------|---------------|
| **[SECURITY.md](./SECURITY.md)** | Políticas de seguridad del proyecto | Antes de producción |
| **[backend-nodejs/.env.example](./backend-nodejs/.env.example)** | Variables de entorno del backend | Configuración inicial |
| **[frontend/.env.example](./frontend/.env.example)** | Variables de entorno del frontend | Configuración inicial |

---

## 🎨 Documentación de Componentes

### Storybook (Visual)

**Ubicación**: `frontend/src/components/ui/*.stories.jsx`

**Comando**: `npm run docs:storybook`

**URL**: http://localhost:6006

| Componente | Archivo Story | Variantes |
|------------|---------------|-----------|
| Button | `button.stories.jsx` | 6 variantes |
| Card | `card.stories.jsx` | 5+ layouts |
| Input | `input.stories.jsx` | Con validación |
| Table | `table.stories.jsx` | Con datos |
| Badge | `badge.stories.jsx` | 4 variantes |
| Alert | `alert.stories.jsx` | 3 tipos |

### Styleguidist (Técnica)

**Ubicación**: `frontend/src/components/ui/*.jsx`

**Comando**: `npm run docs:styleguide`

**URL**: http://localhost:6060

**Componentes con JSDoc**:
- `button.jsx` - Documentación completa con ejemplos

---

## 🦕 Documentación Docusaurus

### Estructura de Páginas

**Ubicación**: `docs/docs/`

**Comando**: `npm run docs:docusaurus`

**URL**: http://localhost:3000

| Página | Ruta | Contenido |
|--------|------|-----------|
| Introducción | `intro.md` | Overview del proyecto, stack tecnológico, arquitectura |
| API Reference | `api/overview.md` | Todos los endpoints, autenticación, ejemplos |
| Arquitectura | `architecture/overview.md` | Decisiones técnicas, patrones, seguridad |
| Deployment | `deployment/vercel.md` | Guía paso a paso de Vercel |

---

## 🗂️ Estructura de Carpetas

### Raíz del Proyecto

```
upe-program/
├── 📄 README.md                    # ⭐ Empezar aquí
├── 📄 DOCUMENTATION.md             # Guía de documentación
├── 📄 TESIS_GUIDE.md               # Para tesis
├── 📄 QUICK_START_DOCS.md          # Comandos rápidos
├── 📄 RESUMEN_FINAL.md             # Resumen completo
├── 📄 CHANGELOG_DOCS.md            # Historial
├── 📄 INDICE_DOCUMENTACION.md      # Este archivo
├── 📄 DEPLOY-GUIDE.md              # Deploy general
├── 📄 VERCEL-DEPLOY-GUIDE.md       # Deploy Vercel
├── 📄 SECURITY.md                  # Seguridad
└── 📄 package.json                 # Scripts principales
```

### Frontend

```
frontend/
├── 📁 .storybook/                  # Configuración Storybook
│   ├── main.js
│   └── preview.js
├── 📁 docs/                        # Docs de Styleguidist
│   └── introduction.md
├── 📁 src/
│   └── 📁 components/ui/           # Componentes UI
│       ├── button.jsx              # Con JSDoc
│       ├── button.stories.jsx      # Historia de Storybook
│       └── ...
├── 📄 styleguide.config.js         # Config Styleguidist
└── 📄 package.json                 # Scripts del frontend
```

### Backend

```
backend-nodejs/
├── 📁 prisma/
│   └── schema.prisma               # Schema de base de datos
├── 📁 src/
│   ├── 📁 routes/                  # Rutas de API
│   └── app.js                      # Servidor principal
└── 📄 .env.example                 # Variables de entorno
```

### Documentación

```
docs/
├── 📁 docs/                        # Páginas de documentación
│   ├── intro.md
│   ├── 📁 api/
│   ├── 📁 architecture/
│   └── 📁 deployment/
├── 📄 docusaurus.config.ts         # Configuración
└── 📄 package.json                 # Scripts de Docusaurus
```

---

## 🎯 Casos de Uso

### "Quiero entender el proyecto"
1. Leer **[README.md](./README.md)**
2. Explorar **[docs/docs/intro.md](./docs/docs/intro.md)**
3. Ver **[docs/docs/architecture/overview.md](./docs/docs/architecture/overview.md)**

### "Voy a usar esto para mi tesis"
1. Leer **[TESIS_GUIDE.md](./TESIS_GUIDE.md)** completo
2. Ejecutar `npm run docs:dev`
3. Tomar screenshots de los 3 sistemas
4. Usar justificaciones técnicas del TESIS_GUIDE

### "Quiero ver los componentes"
1. Ejecutar `npm run docs:storybook`
2. Abrir http://localhost:6006
3. Explorar componentes interactivos

### "Necesito la documentación técnica"
1. Ejecutar `npm run docs:styleguide`
2. Abrir http://localhost:6060
3. Ver JSDoc y props

### "Quiero deployar el proyecto"
1. Leer **[docs/docs/deployment/vercel.md](./docs/docs/deployment/vercel.md)**
2. Configurar Supabase
3. Seguir pasos de deployment

### "Solo quiero comandos rápidos"
1. Leer **[QUICK_START_DOCS.md](./QUICK_START_DOCS.md)**
2. Usar los scripts npm

### "Necesito entender la API"
1. Leer **[docs/docs/api/overview.md](./docs/docs/api/overview.md)**
2. Ver ejemplos de requests/responses

---

## 📋 Comandos Más Usados

### Documentación

```bash
# Ejecutar toda la documentación
npm run docs:dev

# Solo Storybook
npm run docs:storybook

# Solo Styleguidist
npm run docs:styleguide

# Solo Docusaurus
npm run docs:docusaurus

# Generar builds
npm run docs:build
```

### Desarrollo

```bash
# Instalar todo
npm run install:all

# Ejecutar frontend y backend
npm run dev

# Solo frontend
npm run start:frontend

# Solo backend
npm run start:backend
```

### Base de Datos

```bash
# Migraciones
npm run db:migrate

# Prisma Studio
npm run db:studio

# Regenerar cliente
npm run db:generate
```

---

## 🔍 Buscar Información Específica

### Arquitectura y Decisiones Técnicas
- **Archivo**: [TESIS_GUIDE.md](./TESIS_GUIDE.md) - Sección 3
- **Archivo**: [docs/docs/architecture/overview.md](./docs/docs/architecture/overview.md)

### API Endpoints
- **Archivo**: [README.md](./README.md) - Sección "API Endpoints"
- **Archivo**: [docs/docs/api/overview.md](./docs/docs/api/overview.md)

### Variables de Entorno
- **Backend**: [backend-nodejs/.env.example](./backend-nodejs/.env.example)
- **Frontend**: [frontend/.env.example](./frontend/.env.example)
- **Guía**: [QUICK_START_DOCS.md](./QUICK_START_DOCS.md) - Sección "Configuración de URLs"

### Configuración de Base de Datos
- **Supabase**: [README.md](./README.md) - Sección "Configuración de Variables de Entorno"
- **Prisma**: [backend-nodejs/prisma/schema.prisma](./backend-nodejs/prisma/schema.prisma)
- **Guía**: [QUICK_START_DOCS.md](./QUICK_START_DOCS.md) - Sección 1.5

### Deployment
- **Vercel**: [docs/docs/deployment/vercel.md](./docs/docs/deployment/vercel.md)
- **General**: [DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md)
- **Scripts**: [VERCEL-DEPLOY-GUIDE.md](./VERCEL-DEPLOY-GUIDE.md)

### Seguridad
- **Políticas**: [SECURITY.md](./SECURITY.md)
- **Implementación**: [TESIS_GUIDE.md](./TESIS_GUIDE.md) - Sección 5
- **Arquitectura**: [docs/docs/architecture/overview.md](./docs/docs/architecture/overview.md) - Sección "Seguridad"

### Patrones de Diseño
- **Guía**: [TESIS_GUIDE.md](./TESIS_GUIDE.md) - Sección 4
- **Arquitectura**: [docs/docs/architecture/overview.md](./docs/docs/architecture/overview.md) - Sección "Patrones"

### Justificación de Tecnologías
- **Completa**: [TESIS_GUIDE.md](./TESIS_GUIDE.md) - Sección 3
- **Resumen**: [docs/docs/intro.md](./docs/docs/intro.md) - "Stack Tecnológico"

---

## 📊 Estadísticas

### Documentación Escrita
- **Total de palabras**: 15,000+
- **Archivos de guías**: 7
- **Páginas de Docusaurus**: 5+
- **Componentes documentados**: 6+
- **Historias de Storybook**: 25+

### Código
- **Componentes UI**: 57+
- **Endpoints API**: 30+
- **Modelos de datos**: 15+
- **Líneas de código**: 20,000+

---

## 🎓 Para Presentaciones Académicas

### Evidencias Visuales
- Screenshots de **Storybook** (http://localhost:6006)
- Capturas de **Styleguidist** (http://localhost:6060)
- Páginas de **Docusaurus** (http://localhost:3000)

### Justificaciones Técnicas
- **[TESIS_GUIDE.md](./TESIS_GUIDE.md)** - Secciones 3 y 4

### Arquitectura
- **[docs/docs/architecture/overview.md](./docs/docs/architecture/overview.md)**
- Diagramas en **[docs/docs/intro.md](./docs/docs/intro.md)**

### Métricas
- **[RESUMEN_FINAL.md](./RESUMEN_FINAL.md)** - Sección "Estadísticas"
- **[TESIS_GUIDE.md](./TESIS_GUIDE.md)** - Sección 10

---

## 📞 Ayuda y Soporte

### No Encuentras Algo?

1. **Buscar en este índice** primero
2. **Revisar README.md** para visión general
3. **Leer QUICK_START_DOCS.md** para comandos rápidos
4. **Consultar TESIS_GUIDE.md** para detalles técnicos

### Problemas Comunes

| Problema | Solución | Archivo |
|----------|----------|---------|
| No funcionan los comandos npm | Ejecutar `npm run install:all` | [QUICK_START_DOCS.md](./QUICK_START_DOCS.md) |
| Error de base de datos | Configurar DATABASE_URL en .env | [README.md](./README.md) |
| Puerto ocupado | Cambiar puerto en comando | [QUICK_START_DOCS.md](./QUICK_START_DOCS.md) |
| Build falla | Ver logs con --verbose | [QUICK_START_DOCS.md](./QUICK_START_DOCS.md) |

---

## ✅ Checklist de Lectura

Para dominar completamente el proyecto:

- [ ] Leer **[README.md](./README.md)** completo
- [ ] Ejecutar `npm run docs:dev` y explorar las 3 documentaciones
- [ ] Leer **[TESIS_GUIDE.md](./TESIS_GUIDE.md)** si es para tesis
- [ ] Revisar **[docs/docs/architecture/overview.md](./docs/docs/architecture/overview.md)**
- [ ] Explorar Storybook (http://localhost:6006)
- [ ] Revisar API Reference en Docusaurus
- [ ] Leer guía de deployment si vas a producción

---

## 🎯 Resumen Ejecutivo

### 3 Sistemas de Documentación

1. **Storybook** → Componentes visuales
2. **Styleguidist** → Documentación técnica
3. **Docusaurus** → Docs generales

### 7 Guías Principales

1. **README.md** → Inicio
2. **DOCUMENTATION.md** → Guía completa
3. **TESIS_GUIDE.md** → Académico
4. **QUICK_START_DOCS.md** → Rápido
5. **RESUMEN_FINAL.md** → Logros
6. **CHANGELOG_DOCS.md** → Cambios
7. **INDICE_DOCUMENTACION.md** → Este archivo

### Base de Datos

- **PostgreSQL 15+** en **Supabase**
- **Prisma** como ORM
- Sin MongoDB (eliminado completamente)

---

**Última actualización**: 2025-11-05
**Versión**: 1.0.0
**Estado**: ✅ Completo y listo para usar

---

<div align="center">

**¿Perdido? Empieza con [README.md](./README.md)**

**¿Para tesis? Lee [TESIS_GUIDE.md](./TESIS_GUIDE.md)**

**¿Comandos rápidos? Usa [QUICK_START_DOCS.md](./QUICK_START_DOCS.md)**

</div>
