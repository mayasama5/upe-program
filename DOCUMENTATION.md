# UPE Program - Guía Completa de Documentación

Este archivo describe la documentación completa del proyecto UPE Program, desarrollado como base para una tesis de grado.

## 📚 Sistemas de Documentación

El proyecto utiliza **tres sistemas de documentación complementarios**:

### 1. 📖 Storybook - Documentación Visual de Componentes

**Propósito**: Documentación interactiva y visual de componentes UI

**Ubicación**: `/frontend/storybook-static` (después del build)

**Comandos**:
```bash
# Desarrollo (live reload)
npm run docs:storybook
# o desde frontend:
cd frontend && npm run storybook

# Build para producción
npm run docs:build:storybook
```

**URL local**: http://localhost:6006

**Contenido**:
- Ejemplos visuales de todos los componentes UI
- Controles interactivos para experimentar con props
- Variantes de cada componente
- Casos de uso prácticos

**Componentes documentados**:
- Button (6 variantes)
- Card (múltiples layouts)
- Input (con validación)
- Table (con paginación)
- Badge (estados)
- Alert (notificaciones)
- Y más...

### 2. 📝 React Styleguidist - Documentación Técnica

**Propósito**: Documentación técnica de componentes con props, tipos y ejemplos de código

**Ubicación**: `/frontend/styleguide-build` (después del build)

**Comandos**:
```bash
# Desarrollo (live reload)
npm run docs:styleguide
# o desde frontend:
cd frontend && npm run styleguide

# Build para producción
npm run docs:build:styleguide
```

**URL local**: http://localhost:6060

**Contenido**:
- Documentación JSDoc de componentes
- PropTypes y TypeScript types
- Código fuente navegable
- Ejemplos de uso con código
- Hooks personalizados documentados

### 3. 🦕 Docusaurus - Documentación General

**Propósito**: Documentación completa del proyecto (arquitectura, API, guías)

**Ubicación**: `/docs/build` (después del build)

**Comandos**:
```bash
# Desarrollo (live reload)
npm run docs:docusaurus
# o desde docs:
cd docs && npm start

# Build para producción
npm run docs:build:docusaurus
```

**URL local**: http://localhost:3000

**Contenido**:
- Introducción al proyecto
- Arquitectura del sistema
- Decisiones técnicas justificadas
- API Reference completo
- Guías de deployment
- Tutoriales paso a paso

## 🚀 Comandos Rápidos

### Desarrollo (ejecutar todas las documentaciones)

```bash
# Instalar todas las dependencias primero
npm run install:all

# Ejecutar todos los sistemas de documentación en paralelo
npm run docs:dev
```

Esto abrirá:
- Storybook en http://localhost:6006
- Styleguidist en http://localhost:6060
- Docusaurus en http://localhost:3000

### Build de Producción

```bash
# Generar toda la documentación estática
npm run docs:build
```

Esto creará:
- `/frontend/storybook-static/` - Storybook estático
- `/frontend/styleguide-build/` - Styleguidist estático
- `/docs/build/` - Docusaurus estático

### Servir documentación estática localmente

```bash
# Después de hacer build
npm run docs:serve
```

## 📂 Estructura de Documentación

```
upe-program/
├── frontend/
│   ├── .storybook/              # Configuración de Storybook
│   │   ├── main.js
│   │   └── preview.js
│   ├── src/
│   │   ├── components/ui/
│   │   │   ├── button.jsx       # Con JSDoc
│   │   │   ├── button.stories.jsx
│   │   │   ├── card.jsx
│   │   │   ├── card.stories.jsx
│   │   │   └── ...
│   │   └── stories/             # Historias de Storybook
│   ├── docs/
│   │   └── introduction.md      # Intro para Styleguidist
│   ├── styleguide.config.js     # Config de Styleguidist
│   ├── storybook-static/        # Build de Storybook
│   └── styleguide-build/        # Build de Styleguidist
│
├── docs/                        # Docusaurus
│   ├── docs/
│   │   ├── intro.md             # Introducción
│   │   ├── api/
│   │   │   └── overview.md      # API Reference
│   │   ├── architecture/
│   │   │   └── overview.md      # Arquitectura
│   │   └── deployment/
│   │       └── vercel.md        # Guía de deploy
│   ├── docusaurus.config.ts    # Configuración
│   └── build/                   # Build de Docusaurus
│
└── DOCUMENTATION.md             # Este archivo
```

## 🌐 Deploy en Vercel

### Opción 1: Deploy Automático (Recomendado)

1. Conecta tu repositorio a Vercel
2. Crea 3 proyectos:
   - **upe-frontend**: Root Directory = `frontend`
   - **upe-backend**: Root Directory = `backend-nodejs`
   - **upe-docs**: Root Directory = `docs`

3. Configura build commands:
   ```
   # Frontend
   Build Command: npm run build && npm run build-storybook && npm run styleguide:build
   Output Directory: build

   # Docs
   Build Command: npm run build
   Output Directory: build
   ```

### Opción 2: Deploy Manual

```bash
# Frontend con documentación
cd frontend
vercel --prod

# Docs
cd docs
vercel --prod
```

### URLs de Documentación

Una vez desplegado:
- Frontend: `https://techhubupe.com`
- Storybook: `https://techhubupe.com/storybook`
- Styleguidist: `https://techhubupe.com/styleguide`
- Docs: `https://docs.techhubupe.com` (subdomain)

## 📋 Checklist para Tesis

### ✅ Documentación Técnica

- [x] Arquitectura del sistema documentada
- [x] Justificación de tecnologías utilizadas
- [x] Diagramas de arquitectura
- [x] Decisiones de diseño explicadas
- [x] Patrones de diseño implementados

### ✅ Documentación de Componentes

- [x] Storybook con ejemplos visuales
- [x] JSDoc en componentes clave
- [x] Props documentadas
- [x] Casos de uso de cada componente

### ✅ Documentación de API

- [x] Endpoints documentados
- [x] Ejemplos de requests/responses
- [x] Códigos de error
- [x] Autenticación y autorización

### ✅ Guías de Deployment

- [x] Paso a paso para Vercel
- [x] Variables de entorno
- [x] Configuración de dominios
- [x] Troubleshooting común

### ✅ Herramientas

- [x] Storybook configurado
- [x] Styleguidist configurado
- [x] Docusaurus configurado
- [x] Scripts npm unificados

## 🎓 Uso para Tesis

### Capítulos Sugeridos

1. **Introducción**
   - Problemática
   - Solución propuesta
   - Objetivos

2. **Marco Teórico**
   - React y ecosistema
   - Node.js y Express
   - Prisma ORM
   - Arquitecturas modernas

3. **Análisis y Diseño**
   - Requerimientos funcionales
   - Requerimientos no funcionales
   - Casos de uso
   - Diagramas (ver `/docs/docs/architecture`)

4. **Implementación**
   - Estructura del proyecto
   - Componentes desarrollados (ver Storybook)
   - API desarrollada (ver `/docs/docs/api`)
   - Integración con servicios externos

5. **Pruebas y Deployment**
   - Estrategia de testing
   - Proceso de deployment (ver `/docs/docs/deployment`)
   - Resultados

6. **Conclusiones**
   - Objetivos alcanzados
   - Lecciones aprendidas
   - Trabajo futuro

### Evidencias para Anexos

- Screenshots de Storybook
- Capturas de la aplicación funcionando
- Diagramas de arquitectura
- Código fuente relevante
- Resultados de pruebas

## 📊 Métricas del Proyecto

### Frontend
- **Componentes UI**: 57+ componentes
- **Páginas**: 10+ páginas principales
- **Líneas de código**: ~15,000
- **Dependencias**: 60+

### Backend
- **Endpoints**: 30+ endpoints REST
- **Modelos de datos**: 15+ modelos
- **Líneas de código**: ~5,000
- **Middleware**: 10+ middleware

### Documentación
- **Historias de Storybook**: 25+ historias
- **Componentes documentados**: 15+
- **Páginas de docs**: 10+ páginas
- **Ejemplos de código**: 50+

## 🔧 Mantenimiento

### Actualizar Storybook

```bash
cd frontend
npx storybook@latest upgrade
```

### Actualizar Docusaurus

```bash
cd docs
npm update @docusaurus/core @docusaurus/preset-classic
```

### Agregar nuevo componente a la documentación

1. Crear el componente en `/frontend/src/components/ui/`
2. Agregar JSDoc comments
3. Crear archivo `.stories.jsx`
4. Verificar en Storybook: `npm run docs:storybook`

## 📖 Recursos Adicionales

### Documentación de Herramientas
- [Storybook Docs](https://storybook.js.org/docs)
- [React Styleguidist](https://react-styleguidist.js.org/)
- [Docusaurus](https://docusaurus.io/)

### Repositorio
- GitHub: (agregar URL)
- Issues: (agregar URL)

### Contacto
- Email: (agregar email)
- Autor: (agregar nombre)

---

**Última actualización**: Noviembre 2025
**Versión de documentación**: 1.0.0

## 💡 Tips para la Tesis

1. **Screenshots**: Toma capturas de pantalla de Storybook mostrando componentes interactivos
2. **Código**: Usa los ejemplos de Styleguidist para mostrar código limpio y documentado
3. **Arquitectura**: Los diagramas en Docusaurus son perfectos para el capítulo de diseño
4. **Deploy**: La guía de deployment muestra profesionalismo y aplicación práctica
5. **Justificaciones**: Usa las decisiones de arquitectura documentadas para defender tus elecciones tecnológicas

¡Buena suerte con tu tesis! 🎓
