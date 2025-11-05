# UPE Program - Documentación de Componentes

Bienvenido a la documentación técnica de componentes del **UPE Program** (Unidad de Prácticas Empresariales).

## Acerca del Proyecto

Este proyecto es una plataforma web completa para la gestión de prácticas profesionales, desarrollada con:

- **Frontend**: React con Vite
- **Backend**: Node.js con Express
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: JWT + Google OAuth 2.0
- **UI Components**: Radix UI + Tailwind CSS
- **Deploy**: Vercel

## Componentes UI

Esta documentación cubre todos los componentes de interfaz de usuario reutilizables del proyecto. Cada componente incluye:

- **Props**: Descripción completa de todas las propiedades disponibles
- **Ejemplos**: Casos de uso prácticos
- **Código fuente**: Implementación detallada

## Estructura de Componentes

Los componentes están organizados en:

### Componentes Base (ui/)
- **Button**: Botones con diferentes variantes y tamaños
- **Input**: Campos de entrada de texto
- **Card**: Tarjetas para agrupar contenido
- **Table**: Tablas para mostrar datos
- **Badge**: Etiquetas para estados y categorías
- **Alert**: Mensajes de alerta e información
- Y más...

### Hooks Personalizados
- `useToast`: Para notificaciones
- `useMediaQuery`: Para responsive design
- `useMobile`: Para detectar dispositivos móviles

## Guía de Estilo

Todos los componentes siguen las siguientes convenciones:

1. **TypeScript/JavaScript**: Uso de PropTypes o TypeScript para validación
2. **Accesibilidad**: Cumplimiento de estándares WCAG
3. **Responsive**: Diseño adaptable a todos los tamaños de pantalla
4. **Tematización**: Soporte para modo claro y oscuro
5. **Modularidad**: Componentes pequeños y reutilizables

## Cómo Usar Esta Documentación

1. Navega por las secciones en el menú lateral
2. Explora los ejemplos interactivos
3. Copia el código de ejemplo para usar en tu proyecto
4. Revisa las props disponibles para cada componente
