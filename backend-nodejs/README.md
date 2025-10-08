# UPE Program Backend - Node.js

Backend API del programa UPE desarrollado con Node.js, Express y MongoDB.

## 🚀 Características

- **Autenticación**: Sistema de sesiones con cookies seguras
- **Base de datos**: MongoDB con Mongoose ODM
- **Subida de archivos**: Manejo de CVs, certificados y documentos
- **APIs RESTful**: Endpoints para cursos, eventos, vacantes y aplicaciones
- **Seguridad**: Helmet, CORS, rate limiting
- **Validación**: Joi para validación de datos
- **Logging**: Morgan para logs de desarrollo y producción

## 📋 Prerequisitos

- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB >= 4.4

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   cd backend-nodejs
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Configurar MongoDB**
   - Asegúrate de que MongoDB esté ejecutándose
   - Actualiza `MONGO_URL` en el archivo `.env`

## 🏃‍♂️ Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## 📊 Health Check

Verifica que el servidor esté funcionando:
```bash
curl http://localhost:8000/health
```

## 🛣️ Endpoints Principales

### Autenticación
- `POST /api/auth/complete` - Completar autenticación
- `GET /api/auth/me` - Obtener usuario actual
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/check` - Verificar estado de sesión

### Usuarios
- `GET /api/users/profile` - Obtener perfil
- `PUT /api/users/profile` - Actualizar perfil
- `POST /api/users/cv` - Subir CV
- `POST /api/users/certificates` - Subir certificados
- `POST /api/users/degrees` - Subir títulos
- `POST /api/users/company-document` - Subir documento de empresa

### Contenido
- `GET /api/courses` - Listar cursos
- `GET /api/events` - Listar eventos
- `GET /api/jobs` - Listar vacantes
- `POST /api/jobs` - Crear vacante (solo empresas)
- `GET /api/jobs/:jobId` - Obtener vacante específica
- `POST /api/jobs/:jobId/apply` - Aplicar a vacante (solo estudiantes)

### Aplicaciones (Empresas)
- `GET /api/company/applications` - Listar aplicaciones recibidas
- `PUT /api/company/applications/:id/status` - Actualizar estado de aplicación

### Items Guardados
- `GET /api/saved-items` - Listar items guardados
- `POST /api/saved-items` - Guardar item
- `DELETE /api/saved-items/:itemId` - Eliminar item guardado
- `GET /api/saved-items/check/:itemId` - Verificar si item está guardado

### Estadísticas
- `GET /api/stats` - Estadísticas generales de la plataforma
- `GET /api/stats/personal` - Estadísticas personales del usuario

## 🗂️ Estructura del Proyecto

```
src/
├── app.js                 # Aplicación principal
├── config/
│   └── database.js        # Configuración de MongoDB
├── models/
│   └── index.js          # Modelos de Mongoose
├── middleware/
│   ├── auth.js           # Middleware de autenticación
│   └── upload.js         # Middleware de subida de archivos
└── routes/
    ├── auth.js           # Rutas de autenticación
    ├── users.js          # Rutas de usuarios
    ├── content.js        # Rutas de contenido
    ├── saved-items.js    # Rutas de items guardados
    └── stats.js          # Rutas de estadísticas
```

## 🔧 Configuración

### Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `MONGO_URL` | URL de conexión a MongoDB | `mongodb://localhost:27017` |
| `DB_NAME` | Nombre de la base de datos | `upe_program` |
| `PORT` | Puerto del servidor | `8000` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `FRONTEND_URL` | URL del frontend para CORS | `http://localhost:3000` |

### CORS

El servidor está configurado para aceptar requests desde:
- `http://localhost:3000`
- `http://localhost:3001`
- URL definida en `FRONTEND_URL`

## 📝 Logging

- **Desarrollo**: Logs detallados con `morgan('dev')`
- **Producción**: Logs en formato combinado con `morgan('combined')`

## 🔒 Seguridad

- **Helmet**: Headers de seguridad HTTP
- **Rate Limiting**: 1000 requests por IP cada 15 minutos
- **CORS**: Configurado para orígenes específicos
- **Input Validation**: Joi para validación de datos
- **File Upload**: Restricciones de tipo y tamaño de archivo

## 🧪 Testing

```bash
npm test
```

## 📦 Deployment

1. **Configurar variables de entorno de producción**
2. **Instalar dependencias**
   ```bash
   npm ci --only=production
   ```
3. **Ejecutar**
   ```bash
   NODE_ENV=production npm start
   ```

## 🤝 Migración desde Python

Este backend reemplaza el servidor FastAPI original con funcionalidad equivalente:

- ✅ Autenticación con sesiones
- ✅ CRUD de usuarios y perfiles
- ✅ Subida de archivos
- ✅ APIs de cursos, eventos y vacantes
- ✅ Sistema de aplicaciones a trabajos
- ✅ Items guardados
- ✅ Estadísticas de la plataforma
- ✅ Middleware de seguridad
- ✅ Validación de datos

## 📄 Licencia

MIT
