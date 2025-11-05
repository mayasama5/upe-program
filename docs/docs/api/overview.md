---
sidebar_position: 1
---

# API Reference

La API REST del UPE Program proporciona endpoints para gestionar estudiantes, empresas, prácticas y reportes.

## Base URL

```
Producción: https://api.techhubupe.com/api
Desarrollo: http://localhost:3000/api
```

## Autenticación

Todos los endpoints requieren autenticación mediante JWT. Incluye el token en el header:

```http
Authorization: Bearer <jwt-token>
```

### Obtener Token

El token JWT se obtiene al hacer login exitoso. Los usuarios pueden autenticarse con:
- **Email y contraseña**: Login tradicional
- **Google OAuth 2.0**: Sign in con Google

## Endpoints Principales

### Estudiantes

#### GET /api/students
Obtiene la lista de todos los estudiantes.

**Parámetros de Query:**
- `search` (opcional): Buscar por nombre o cédula
- `status` (opcional): Filtrar por estado
- `page` (opcional): Número de página
- `limit` (opcional): Resultados por página

**Respuesta:**
```json
{
  "students": [
    {
      "id": "uuid",
      "nombre": "Juan Pérez",
      "cedula": "1234567890",
      "email": "juan@ejemplo.com",
      "promedio": 8.5,
      "estado": "activo"
    }
  ],
  "total": 100,
  "page": 1,
  "totalPages": 10
}
```

#### POST /api/students
Crea un nuevo estudiante.

**Body:**
```json
{
  "nombre": "María García",
  "cedula": "0987654321",
  "email": "maria@ejemplo.com",
  "carrera": "Ingeniería en Software",
  "promedio": 9.0
}
```

#### PUT /api/students/:id
Actualiza información del estudiante.

#### DELETE /api/students/:id
Elimina un estudiante.

### Empresas

#### GET /api/companies
Lista todas las empresas registradas.

**Respuesta:**
```json
{
  "companies": [
    {
      "id": "uuid",
      "nombre": "Tech Corp",
      "ruc": "1234567890001",
      "sector": "Tecnología",
      "contacto": "contacto@techcorp.com"
    }
  ]
}
```

#### POST /api/companies
Registra una nueva empresa.

#### GET /api/companies/:id/opportunities
Obtiene oportunidades de práctica de una empresa.

### Prácticas

#### GET /api/internships
Lista todas las prácticas.

**Parámetros:**
- `studentId`: Filtrar por estudiante
- `companyId`: Filtrar por empresa
- `status`: Filtrar por estado (pendiente, activa, finalizada)

**Respuesta:**
```json
{
  "internships": [
    {
      "id": "uuid",
      "studentId": "uuid",
      "companyId": "uuid",
      "startDate": "2025-01-15",
      "endDate": "2025-06-15",
      "status": "activa",
      "horasCumplidas": 120,
      "horasRequeridas": 240
    }
  ]
}
```

#### POST /api/internships
Crea una nueva práctica.

**Body:**
```json
{
  "studentId": "uuid",
  "companyId": "uuid",
  "position": "Desarrollador Frontend",
  "startDate": "2025-01-15",
  "endDate": "2025-06-15",
  "horasRequeridas": 240
}
```

#### PUT /api/internships/:id/status
Actualiza el estado de una práctica.

#### POST /api/internships/:id/report-hours
Reportar horas trabajadas.

**Body:**
```json
{
  "fecha": "2025-01-20",
  "horas": 8,
  "actividades": "Desarrollo de componentes UI"
}
```

### Reportes

#### GET /api/reports/students
Genera reporte de estudiantes.

**Respuesta:**
```json
{
  "totalStudents": 150,
  "activeInternships": 45,
  "completedInternships": 80,
  "averageGPA": 8.3,
  "byCareer": [
    {
      "carrera": "Ingeniería en Software",
      "count": 60
    }
  ]
}
```

#### GET /api/reports/companies
Reporte de empresas y oportunidades.

#### GET /api/reports/export
Exporta datos en formato Excel.

**Parámetros:**
- `type`: students | companies | internships
- `format`: xlsx | csv | pdf

### Administración

#### GET /api/admin/users
Lista todos los usuarios del sistema.

#### PUT /api/admin/users/:id/role
Actualiza el rol de un usuario.

**Body:**
```json
{
  "role": "admin" | "company" | "student"
}
```

#### GET /api/admin/system-settings
Obtiene configuración del sistema.

## Códigos de Estado

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

- **Límite**: 100 requests por minuto
- **Header de respuesta**: `X-RateLimit-Remaining`

## Manejo de Errores

Formato de error estándar:

```json
{
  "error": {
    "message": "Descripción del error",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## Ejemplos de Uso

### JavaScript (Fetch)

```javascript
const response = await fetch('https://api.techhubupe.com/api/students', {
  headers: {
    'Authorization': `Bearer ${clerkToken}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

### Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.techhubupe.com/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const students = await api.get('/students');
```

## Autenticación OAuth

### GET /api/auth/google
Inicia el flujo de autenticación con Google OAuth 2.0.

**Respuesta**: Redirección a Google consent screen.

### GET /api/auth/google/callback
Callback de Google OAuth que procesa el código de autorización.

**Respuesta**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "uuid",
    "email": "usuario@gmail.com",
    "name": "Usuario"
  }
}
```

### POST /api/auth/refresh
Renueva el access token usando el refresh token.

**Body**:
```json
{
  "refreshToken": "refresh_token_here"
}
```

## Paginación

Todos los endpoints de lista soportan paginación:

```
GET /api/students?page=2&limit=20
```

**Respuesta incluye:**
- `total`: Total de registros
- `page`: Página actual
- `totalPages`: Total de páginas
- `hasNext`: Si hay página siguiente
- `hasPrev`: Si hay página anterior

---

Para más detalles sobre cada endpoint, consulta el [código fuente del backend](https://github.com/tu-usuario/upe-program/tree/main/backend-nodejs/src/routes).
