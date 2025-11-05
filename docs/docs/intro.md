---
sidebar_position: 1
---

# Introducción al UPE Program

Bienvenido a la documentación completa del **UPE Program** (Unidad de Prácticas Empresariales), un sistema integral de gestión de prácticas profesionales desarrollado para instituciones educativas.

## ¿Qué es UPE Program?

UPE Program es una plataforma web fullstack que facilita la gestión, seguimiento y evaluación de prácticas profesionales, conectando a estudiantes, empresas y administradores en un ecosistema digital eficiente.

## Características Principales

### Para Estudiantes
- 📝 Registro y gestión de perfil académico
- 🏢 Búsqueda y postulación a ofertas de práctica
- 📊 Seguimiento del progreso de práctica
- 📄 Generación de reportes y documentos
- 🔔 Notificaciones en tiempo real

### Para Empresas
- 🎯 Publicación de ofertas de práctica
- 👥 Gestión de candidatos y selección
- 📈 Evaluación de practicantes
- 📋 Reportes de desempeño
- 🤝 Comunicación directa con la institución

### Para Administradores
- 👨‍💼 Gestión completa de usuarios
- 📊 Reportes y estadísticas detalladas
- ✅ Aprobación de prácticas y documentos
- 🔧 Configuración del sistema
- 📥 Exportación de datos

## Stack Tecnológico

### Frontend
- **Framework**: React 18.2
- **Enrutamiento**: React Router DOM v6
- **UI Components**: Radix UI
- **Estilos**: Tailwind CSS
- **Gráficos**: Chart.js, Recharts
- **Formularios**: React Hook Form + Zod
- **Autenticación**: JWT Tokens + Google OAuth

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Validación**: Zod + Express Validator
- **Autenticación**: JWT + Google OAuth 2.0
- **API**: RESTful

### Infraestructura
- **Hosting Frontend**: Vercel
- **Hosting Backend**: Vercel Serverless Functions
- **Base de Datos**: PostgreSQL (Supabase)
- **Dominio**: techhubupe.com
- **CI/CD**: GitHub Actions + Vercel

## Arquitectura del Sistema

```
┌─────────────────┐         ┌─────────────────┐
│   React SPA     │────────▶│   Express API   │
│   (Vercel)      │  HTTP   │   (Vercel)      │
└─────────────────┘         └─────────────────┘
        │                            │
        │                            │
        ▼                            ▼
┌─────────────────┐         ┌─────────────────┐
│  Google OAuth   │         │   PostgreSQL    │
│  + JWT Tokens   │         │   (Supabase)    │
└─────────────────┘         └─────────────────┘
```

## Estructura del Proyecto

```
upe-program/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilidades y helpers
│   │   └── styles/          # Estilos globales
│   ├── public/              # Archivos estáticos
│   └── package.json
│
├── backend-nodejs/          # API REST con Express
│   ├── src/
│   │   ├── routes/          # Endpoints de la API
│   │   ├── middleware/      # Middlewares personalizados
│   │   └── app.js           # Configuración principal
│   ├── prisma/
│   │   └── schema.prisma    # Esquema de base de datos
│   └── package.json
│
└── docs/                    # Documentación con Docusaurus
    ├── docs/                # Documentos markdown
    ├── blog/                # Blog de cambios
    └── docusaurus.config.ts
```

## Próximos Pasos

Explora la documentación para aprender más sobre:

1. **Guía de Instalación** - Configura el entorno de desarrollo
2. **Arquitectura** - Comprende la estructura del sistema
3. **API Reference** - Documentación de endpoints
4. **Componentes UI** - Biblioteca de componentes
5. **Deployment** - Guías de despliegue

## Recursos Adicionales

- **Storybook**: Documentación visual de componentes
- **Styleguidist**: Referencia técnica de componentes
- **Repositorio**: GitHub
- **Demo**: [https://techhubupe.com](https://techhubupe.com)

## Soporte

Si encuentras algún problema o necesitas ayuda:

- 📧 Contacta al equipo de desarrollo
- 🐛 Reporta bugs en GitHub Issues
- 📖 Revisa las FAQs

---

**Versión**: 1.0.0
**Última actualización**: Noviembre 2025
**Licencia**: MIT
