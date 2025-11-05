# Seguridad del Proyecto UPE Program

## Medidas de Seguridad Implementadas

### 1. Validación de Email Mejorada

#### ✅ Validación de Formato
- Regex estricto para validar formato de email
- Normalización automática (lowercase, trim)

#### ✅ Verificación de Dominio Real
- Validación de registros MX DNS
- Verifica que el dominio puede recibir correos electrónicos
- Rechaza dominios inexistentes

#### ✅ Bloqueo de Emails Desechables
- Lista de 40+ dominios de emails temporales bloqueados
- Incluye: tempmail.com, guerrillamail.com, mailinator.com, etc.
- Protege contra cuentas fraudulentas y spam

**Ejemplo de uso:**
```javascript
const { validateEmail } = require('./utils/emailValidator');

const result = await validateEmail('user@example.com');
if (!result.valid) {
  console.log(result.error);
}
```

### 2. Validación de Contraseñas Fortalecida

#### ✅ Requisitos de Complejidad
- Mínimo 8 caracteres (configurable)
- Al menos una letra mayúscula (A-Z)
- Al menos una letra minúscula (a-z)
- Al menos un número (0-9)
- Al menos un carácter especial (!@#$%^&*)

#### ✅ Protección contra Contraseñas Débiles
- Bloquea 50+ contraseñas comunes (password, 123456, etc.)
- Detecta secuencias obvias (123456, abcdef, qwerty)
- Detecta caracteres excesivamente repetidos (aaaaaaa)
- Calcula entropía y fortaleza de la contraseña

#### ✅ Niveles de Fortaleza
- **Weak**: Contraseña muy débil, fácil de adivinar
- **Medium**: Contraseña moderada
- **Strong**: Contraseña fuerte
- **Very Strong**: Contraseña muy fuerte

**Ejemplo de uso:**
```javascript
const { validatePassword } = require('./utils/passwordValidator');

const result = validatePassword('MyP@ssw0rd123');
console.log(result.valid); // true/false
console.log(result.strength); // 'strong'
console.log(result.suggestions); // ['Usa más caracteres...']
```

### 3. Rate Limiting (Limitación de Peticiones)

#### API General
- **Límite**: 100 peticiones por 15 minutos
- **Alcance**: Todas las rutas `/api/*`

#### Autenticación
- **Límite**: 5 intentos por 15 minutos
- **Alcance**: Rutas de login y registro
- **Protege contra**: Ataques de fuerza bruta

#### Creación de Contenido
- **Límite**: 50 creaciones por hora
- **Protege contra**: Spam y abuso

### 4. Protección contra Inyecciones

#### SQL Injection
Bloquea patrones sospechosos:
- Comandos SQL: SELECT, INSERT, UPDATE, DELETE, DROP, etc.
- Caracteres especiales: --, /*, */, ;

#### NoSQL Injection
Bloquea operadores de MongoDB:
- $where, $ne, $gt, $lt, $regex, etc.

#### Sanitización de Entrada
- Elimina campos peligrosos: __proto__, constructor, prototype
- Sanitiza body, query y params

### 5. Seguridad HTTP (Helmet)

#### Content Security Policy (CSP)
- Bloquea scripts inline no autorizados
- Controla fuentes de recursos (imágenes, scripts, estilos)

#### HSTS (HTTP Strict Transport Security)
- Fuerza uso de HTTPS
- Max-age: 1 año
- Include subdomains

#### Otras Protecciones
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection

### 6. Autenticación Segura

#### JWT Tokens
- Tokens firmados con HS256
- Expiración configurable (24h por defecto)
- Refresh tokens (7 días)

#### Passwords
- Hasheadas con bcrypt (10 rounds)
- Nunca se almacenan en texto plano
- Nunca se retornan en las respuestas

#### OAuth con Google
- Integración oficial de Google OAuth 2.0
- Tokens validados en el servidor
- Usuarios verificados automáticamente

### 7. Encriptación de Datos Sensibles

#### Encriptación AES-256
- Clave de encriptación en variable de entorno
- Campos sensibles encriptados en respuestas (opcional)

### 8. Logging de Seguridad

#### Operaciones Críticas
Se registran:
- Timestamp
- Método HTTP
- Path
- IP del usuario
- User Agent
- User ID (si está autenticado)

Solo para: POST, PUT, DELETE

### 9. CORS (Cross-Origin Resource Sharing)

#### Orígenes Permitidos
- Frontend en producción (techhubupe.com)
- Localhost para desarrollo
- Deployments de Vercel

#### Configuración
- Credentials: true (permite cookies)
- Métodos permitidos: GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH
- Headers permitidos: Authorization, Content-Type, etc.

## Recomendaciones de Seguridad

### Para Usuarios
1. Usa contraseñas únicas y fuertes
2. No compartas tus credenciales
3. Cierra sesión en computadoras públicas
4. Reporta actividad sospechosa

### Para Desarrolladores
1. Mantén las dependencias actualizadas
2. Nunca hagas commit de secretos o claves
3. Usa variables de entorno para configuración
4. Revisa los logs de seguridad regularmente
5. Implementa 2FA cuando sea posible

## Próximas Mejoras

- [ ] Verificación de email por código/link
- [ ] Autenticación de dos factores (2FA)
- [ ] Detección de inicios de sesión sospechosos
- [ ] Notificaciones de seguridad por email
- [ ] Historial de sesiones activas
- [ ] CAPTCHA en formularios críticos
- [ ] Monitoreo de intentos de acceso fallidos

## Reportar Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad, por favor:

1. **NO** la publiques públicamente
2. Contacta al equipo de desarrollo
3. Proporciona detalles del problema
4. Espera confirmación antes de divulgar

## Recursos Adicionales

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Última actualización**: 2025-11-05
**Versión**: 2.0
