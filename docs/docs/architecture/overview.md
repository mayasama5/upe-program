---
sidebar_position: 1
---

# Arquitectura del Sistema

Esta sección describe la arquitectura técnica del UPE Program, incluyendo decisiones de diseño, patrones utilizados y justificaciones.

## Visión General

UPE Program sigue una arquitectura de tres capas con separación clara entre frontend, backend y base de datos.

```
┌──────────────────────────────────────────────────────────┐
│                      Frontend (React)                    │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │   Pages    │  │ Components │  │   Hooks    │        │
│  └────────────┘  └────────────┘  └────────────┘        │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTP/REST
┌────────────────────────▼─────────────────────────────────┐
│                    Backend (Express)                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │   Routes   │  │ Middleware │  │ Controllers│        │
│  └────────────┘  └────────────┘  └────────────┘        │
└────────────────────────┬─────────────────────────────────┘
                         │ Prisma ORM
┌────────────────────────▼─────────────────────────────────┐
│                Database (PostgreSQL)                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │  Students  │  │ Companies  │  │ Internships│        │
│  └────────────┘  └────────────┘  └────────────┘        │
└──────────────────────────────────────────────────────────┘
```

## Decisiones de Arquitectura

### 1. Separación Frontend/Backend

**Decisión**: Monorepo con proyectos separados

**Justificación**:
- Escalabilidad independiente
- Deploy separado en Vercel
- Equipos pueden trabajar en paralelo
- Reutilización del backend para futuras apps móviles

**Alternativas consideradas**:
- ❌ Monolito (Next.js fullstack) - Menos flexible
- ❌ Microservicios - Overhead innecesario para el tamaño actual

### 2. React como Framework Frontend

**Decisión**: React con Create React App

**Justificación**:
- Ecosistema maduro y amplio
- Gran cantidad de librerías (Radix UI, React Hook Form)
- Familiaridad del equipo
- Excelente documentación

**Alternativas consideradas**:
- ❌ Vue.js - Menos librerías para UI enterprise
- ❌ Angular - Curva de aprendizaje más pronunciada
- ❌ Next.js - No se requiere SSR para este caso de uso

### 3. Express.js para Backend

**Decisión**: Express.js como framework web

**Justificación**:
- Minimalista y flexible
- Gran ecosistema de middleware
- Fácil integración con Prisma
- Excelente para APIs REST

**Alternativas consideradas**:
- ❌ NestJS - Overhead para el scope actual
- ❌ Fastify - Menos documentación y ejemplos
- ❌ Serverless Functions sin framework - Más código boilerplate

### 4. PostgreSQL con Supabase y Prisma ORM

**Decisión**: PostgreSQL alojado en Supabase + Prisma ORM

**Justificación**:
- PostgreSQL es robusto, confiable y open source
- Supabase ofrece hosting gestionado con dashboard visual
- Backups automáticos y escalabilidad sin configuración
- Prisma ofrece type-safety y migraciones automáticas
- Excelente developer experience con auto-completion
- Supabase incluye API REST y Realtime opcional

**Alternativas consideradas**:
- ❌ Railway/Render - Menos features que Supabase
- ❌ MySQL - PostgreSQL tiene mejores features (JSON, arrays, full-text)
- ❌ TypeORM - Menos type-safe que Prisma
- ❌ Firebase/Firestore - Lock-in con Google, queries limitados

### 5. JWT + Google OAuth para Autenticación

**Decisión**: Autenticación custom con JWT y Google OAuth 2.0

**Justificación**:
- Control total sobre el flujo de autenticación
- JWT estándar de la industria (RFC 7519)
- Google OAuth como opción conveniente para usuarios
- Sesiones sin estado (stateless) para escalabilidad
- Almacenamiento seguro con httpOnly cookies
- Refresh tokens para mayor seguridad

**Implementación**:
- **JWT Tokens**: Generados con jsonwebtoken
- **Google OAuth 2.0**: Usando Passport.js strategy
- **Cookies**: httpOnly, secure, sameSite para prevenir XSS/CSRF
- **Refresh Tokens**: Rotación automática cada 7 días

**Alternativas consideradas**:
- ❌ Clerk - Solución SaaS con costo y vendor lock-in
- ❌ Auth0 - Costoso para proyectos pequeños
- ❌ Firebase Auth - Lock-in con Google ecosystem
- ❌ Sessions con express-session - No escalable horizontalmente

### 6. Vercel para Hosting

**Decisión**: Vercel para frontend y backend

**Justificación**:
- CI/CD automático con GitHub
- Edge network global
- Excelente DX
- Gratis para proyectos pequeños

**Alternativas consideradas**:
- ❌ AWS - Mayor complejidad
- ❌ Heroku - Menos features, más caro
- ❌ Netlify - Backend functions menos robustas

## Patrones de Diseño

### Frontend

#### Component Composition
```javascript
// Uso de Radix UI con composición
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    {children}
  </CardContent>
</Card>
```

#### Custom Hooks
```javascript
// Encapsulación de lógica reutilizable
const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  return { students, loading };
};
```

#### Container/Presenter Pattern
```javascript
// Separación de lógica y presentación
const StudentsContainer = () => {
  const { students, loading } = useStudents();
  return <StudentsList students={students} loading={loading} />;
};
```

### Backend

#### Middleware Chain
```javascript
app.use(cors());
app.use(express.json());
app.use(requireAuth);
app.use(errorHandler);
```

#### Repository Pattern (via Prisma)
```javascript
// Abstracción de acceso a datos
const studentRepository = {
  findAll: () => prisma.student.findMany(),
  findById: (id) => prisma.student.findUnique({ where: { id } }),
  create: (data) => prisma.student.create({ data }),
};
```

#### Controller Pattern
```javascript
const StudentController = {
  async list(req, res) {
    const students = await studentRepository.findAll();
    res.json({ students });
  },

  async create(req, res) {
    const student = await studentRepository.create(req.body);
    res.status(201).json({ student });
  },
};
```

## Seguridad

### Autenticación
- Tokens JWT via Clerk
- Refresh tokens automáticos
- Session management seguro

### Autorización
- Role-based access control (RBAC)
- Verificación en cada endpoint
- Permisos granulares por recurso

### Validación
- Zod schemas en frontend y backend
- Sanitización de inputs
- Prevención de SQL injection via Prisma

### CORS
- Whitelist de origins permitidos
- Credentials habilitados para cookies
- Headers permitidos específicos

### Rate Limiting
- 100 requests por minuto por IP
- Throttling para endpoints críticos

## Escalabilidad

### Horizontal Scaling
- Frontend: Edge functions en Vercel
- Backend: Serverless auto-scaling
- Database: Connection pooling con Prisma

### Caching
- React Query para cache de cliente
- Redis (futuro) para cache de servidor

### Database Optimization
- Índices en campos frecuentemente buscados
- Lazy loading de relaciones
- Paginación en todas las listas

## Monitoreo

### Logs
- Console logs en desarrollo
- Structured logging en producción
- Vercel logs dashboard

### Métricas
- Vercel Analytics para frontend
- Custom metrics para backend
- Database query performance

### Alertas
- Error tracking (futuro: Sentry)
- Uptime monitoring
- Performance budgets

## Testing (Planeado)

### Frontend
- Unit tests: Jest + React Testing Library
- Integration tests: Testing Library
- E2E tests: Playwright

### Backend
- Unit tests: Jest
- Integration tests: Supertest
- Database tests: Jest + Prisma

## CI/CD Pipeline

```yaml
1. Push to GitHub
   ↓
2. Vercel detects change
   ↓
3. Run build
   ↓
4. Run tests (futuro)
   ↓
5. Deploy to preview
   ↓
6. Merge to main → Deploy to production
```

## Diagrama de Flujo de Datos

```
Usuario → React App → Clerk (Auth) → Express API → Prisma → PostgreSQL
                           ↓
                      Validación
                           ↓
                      Cache (futuro)
                           ↓
                      Response
```

## Próximos Pasos

- Implementar caching con Redis
- Agregar testing automatizado
- Implementar Sentry para error tracking
- Agregar GraphQL API opcional
- Implementar notificaciones en tiempo real con WebSockets

---

Para más detalles sobre componentes específicos, consulta las secciones de [Frontend](./frontend.md) y [Backend](./backend.md).
