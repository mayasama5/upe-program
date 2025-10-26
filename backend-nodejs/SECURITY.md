# Documentación de Seguridad - UPE Backend

## Resumen

Este backend implementa múltiples capas de seguridad para proteger los datos y las operaciones del sistema UPE.

## Características de Seguridad Implementadas

### 1. Autenticación JWT (JSON Web Tokens)

**Ubicación:** `src/config/jwt.config.js`, `src/middleware/jwtAuth.js`

- **Tokens de acceso**: Válidos por 24 horas (configurable)
- **Refresh tokens**: Válidos por 7 días (configurable)
- **Firma HMAC**: Utiliza algoritmo HS256
- **Claims incluidos**: id, email, role, is_verified

#### Uso:

```javascript
const { generateToken } = require('./config/jwt.config');
const token = generateToken(user);
```

#### Middleware de autenticación:

```javascript
// Proteger ruta
router.get('/protected', authenticateJWT, (req, res) => {
  // req.user contiene datos del usuario autenticado
});

// Requerir rol admin
router.get('/admin', authenticateJWT, requireAdmin, (req, res) => {
  // Solo admins pueden acceder
});
```

### 2. Encriptación de Datos

**Ubicación:** `src/utils/encryption.js`

Implementa dos métodos de encriptación:

#### AES-256 con CryptoJS:
```javascript
const { encrypt, decrypt } = require('./utils/encryption');

// Encriptar datos sensibles
const encrypted = encrypt('dato-sensible');

// Desencriptar
const decrypted = decrypt(encrypted);
```

#### AES-256 con Node.js Crypto (alternativa):
```javascript
const { encryptNode, decryptNode } = require('./utils/encryption');
```

#### Hash de contraseñas con bcrypt:
```javascript
const { hashPassword, comparePassword } = require('./utils/encryption');

// Hash
const hashed = await hashPassword('password123');

// Verificar
const isValid = await comparePassword('password123', hashed);
```

### 3. DTOs y Validación de Datos

**Ubicación:** `src/dto/`

Utiliza `express-validator` para validación robusta:

#### Ejemplo de DTO para usuarios:
```javascript
const { createUserDTO, validate } = require('./dto/user.dto');

router.post('/users', createUserDTO, validate, async (req, res) => {
  // req.body ya está validado
});
```

#### Validaciones implementadas:
- **Email**: Formato válido, normalizado
- **Strings**: Longitud mínima/máxima, trim
- **Enums**: Valores permitidos (roles, tipos)
- **URLs**: Formato válido
- **Booleanos**: Tipo correcto
- **Arrays**: Validación de elementos

### 4. Middlewares de Seguridad

**Ubicación:** `src/middleware/security.js`

#### 4.1 Helmet - Protección HTTP
```javascript
app.use(helmetConfig);
```
- Content Security Policy
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options
- X-Content-Type-Options

#### 4.2 Rate Limiting
```javascript
// Límite general API: 100 req/15min
app.use('/api/', apiLimiter);

// Límite autenticación: 5 req/15min
app.use('/api/auth', authLimiter);

// Límite creación: 50 req/hora
router.post('/create', createLimiter, handler);
```

#### 4.3 Sanitización de Entrada
```javascript
app.use(sanitizeInput);
```
- Elimina campos peligrosos (`__proto__`, `constructor`, `prototype`)
- Previene prototype pollution

#### 4.4 Prevención de Inyecciones
```javascript
app.use(preventInjection);
```
- Detecta patrones de inyección SQL
- Detecta operadores NoSQL maliciosos
- Bloquea peticiones sospechosas

#### 4.5 Security Logger
```javascript
app.use(securityLogger);
```
- Registra operaciones POST, PUT, DELETE
- Incluye: timestamp, método, ruta, IP, user agent, userId

### 5. Protección de Rutas Admin

Todas las rutas `/api/admin/*` están protegidas con:

```javascript
router.use(authenticateJWT);  // Requiere token JWT válido
router.use(requireAdmin);     // Requiere role === 'admin'
```

## Variables de Entorno Requeridas

```env
# JWT
JWT_SECRET=tu-clave-secreta-minimo-32-caracteres
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Encriptación
ENCRYPTION_KEY=tu-clave-de-32-caracteres
```

## Mejores Prácticas

### 1. Tokens JWT
- **NUNCA** guardes tokens en localStorage (usar httpOnly cookies)
- Implementa refresh token rotation
- Invalida tokens en logout

### 2. Encriptación
- Usa `encrypt()` para datos sensibles en DB
- Nunca almacenes claves en el código
- Rota claves periódicamente

### 3. Validación
- Siempre usa DTOs en endpoints
- Valida ANTES de procesar datos
- Sanitiza entrada del usuario

### 4. Rate Limiting
- Ajusta límites según tu tráfico
- Usa límites más estrictos para auth
- Considera IP whitelisting para servicios internos

### 5. Logging
- No registres datos sensibles
- Monitorea intentos de acceso fallidos
- Implementa alertas para actividad sospechosa

## Endpoints Protegidos

### Admin (`/api/admin/*`)
- ✅ Autenticación JWT requerida
- ✅ Rol admin requerido
- ✅ Rate limiting activo
- ✅ DTOs implementados
- ✅ Logging de seguridad

### Usuarios (`/api/users/*`)
- ✅ Autenticación JWT requerida
- ✅ Validación de datos
- ⚠️ Considerar rate limiting adicional

### Contenido Público (`/api/courses`, `/api/events`, `/api/jobs`)
- ⚠️ JWT opcional
- ✅ Rate limiting general
- ✅ Validación de queries

## Matriz de Amenazas y Mitigaciones

| Amenaza | Mitigación | Estado |
|---------|-----------|--------|
| Inyección SQL | preventInjection middleware | ✅ |
| NoSQL Injection | Sanitización + Prisma ORM | ✅ |
| XSS | Helmet CSP + sanitización | ✅ |
| CSRF | CORS estricto + tokens | ✅ |
| Brute Force | Rate limiting | ✅ |
| Session Hijacking | JWT con expiración | ✅ |
| Prototype Pollution | sanitizeInput | ✅ |
| Data Exposure | Encriptación AES-256 | ✅ |
| MITM | HTTPS + HSTS | ⚠️ (Configurar en producción) |

## Checklist de Despliegue a Producción

- [ ] Cambiar `JWT_SECRET` a valor seguro aleatorio
- [ ] Cambiar `ENCRYPTION_KEY` a valor seguro aleatorio
- [ ] Configurar HTTPS/SSL
- [ ] Habilitar HSTS
- [ ] Configurar CORS solo para dominios permitidos
- [ ] Ajustar rate limits según tráfico esperado
- [ ] Configurar logging a servicio externo
- [ ] Implementar monitoreo de seguridad
- [ ] Configurar backups encriptados
- [ ] Revisar y actualizar dependencias
- [ ] Implementar Web Application Firewall (WAF)

## Reporte de Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad, por favor NO la hagas pública. Contacta al equipo de desarrollo directamente.

## Auditoría de Dependencias

```bash
# Revisar vulnerabilidades
npm audit

# Corregir vulnerabilidades automáticas
npm audit fix

# Ver reporte detallado
npm audit --json
```

## Testing de Seguridad

```bash
# Escaneo de dependencias
npm audit

# Testing manual de inyecciones
# Usar herramientas como OWASP ZAP, Burp Suite

# Verificar headers de seguridad
# https://securityheaders.com/
```

## Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
