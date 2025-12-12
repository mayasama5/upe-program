const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { encrypt, decrypt } = require('../utils/encryption');

/**
 * Configuración de Helmet para seguridad HTTP
 */
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

/**
 * Rate limiting para API
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 500, // límite de 500 requests por ventana (aumentado para admin dashboard)
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Configuración para desarrollo con trust proxy
  validate: { trustProxy: false },
  // En desarrollo, usar una clave única basada en sessionID o IP
  keyGenerator: (req) => {
    return req.headers['x-session-id'] || req.ip || 'default-key';
  }
});

/**
 * Rate limiting estricto para rutas de autenticación
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // límite de 5 requests por ventana
  message: {
    success: false,
    message: 'Demasiados intentos de autenticación, por favor intenta de nuevo más tarde.'
  },
  skipSuccessfulRequests: true,
  validate: { trustProxy: false },
  keyGenerator: (req) => {
    return req.headers['x-session-id'] || req.ip || 'default-key';
  }
});

/**
 * Rate limiting para creación de contenido
 */
const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 50, // límite de 50 creaciones por hora
  message: {
    success: false,
    message: 'Límite de creación alcanzado, por favor intenta de nuevo más tarde.'
  },
  validate: { trustProxy: false },
  keyGenerator: (req) => {
    return req.headers['x-session-id'] || req.ip || 'default-key';
  }
});

/**
 * Sanitización de entrada de datos
 */
const sanitizeInput = (req, res, next) => {
  // Remover campos potencialmente peligrosos
  const dangerousFields = ['__proto__', 'constructor', 'prototype'];

  const sanitize = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;

    for (const field of dangerousFields) {
      delete obj[field];
    }

    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }

    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }

  if (req.query) {
    req.query = sanitize(req.query);
  }

  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
};

/**
 * Middleware para encriptar campos sensibles en la respuesta
 */
const encryptSensitiveFields = (fields = []) => {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = function (data) {
      if (data && typeof data === 'object') {
        const encryptFields = (obj) => {
          if (Array.isArray(obj)) {
            return obj.map(item => encryptFields(item));
          }

          if (typeof obj === 'object' && obj !== null) {
            const newObj = { ...obj };

            for (const field of fields) {
              if (newObj[field]) {
                try {
                  newObj[`${field}_encrypted`] = encrypt(String(newObj[field]));
                  // Opcional: eliminar el campo original
                  // delete newObj[field];
                } catch (error) {
                  console.error(`Error encrypting field ${field}:`, error);
                }
              }
            }

            // Recursivamente encriptar objetos anidados
            for (const key in newObj) {
              if (typeof newObj[key] === 'object' && newObj[key] !== null) {
                newObj[key] = encryptFields(newObj[key]);
              }
            }

            return newObj;
          }

          return obj;
        };

        data = encryptFields(data);
      }

      return originalJson(data);
    };

    next();
  };
};

/**
 * Middleware para logging de seguridad
 */
const securityLogger = (req, res, next) => {
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    userId: req.user?.id || 'anonymous'
  };

  // Log solo en operaciones críticas
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    console.log('Security Log:', JSON.stringify(logData));
  }

  next();
};

/**
 * Middleware para validar origen de peticiones (CORS personalizado)
 */
const validateOrigin = (req, res, next) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:3001'
  ].filter(Boolean);

  const origin = req.get('origin');

  if (!origin || allowedOrigins.includes(origin)) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Origen no permitido'
    });
  }
};

/**
 * Middleware para prevenir inyección SQL/NoSQL
 */
const preventInjection = (req, res, next) => {
  // Excluir rutas de OAuth que contienen códigos seguros
  const excludedPaths = [
    '/api/auth/google/callback',
    '/api/auth/google'
  ];

  if (excludedPaths.some(path => req.path.startsWith(path))) {
    return next();
  }

  const checkInjection = (value) => {
    if (typeof value !== 'string') return false;

    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
      /(--|\*|;|\/\*|\*\/)/g,
      /(\bOR\b|\bAND\b).*=.*\b/gi
    ];

    const noSqlPatterns = [
      /\$where/gi,
      /\$ne/gi,
      /\$gt/gi,
      /\$lt/gi,
      /\$regex/gi
    ];

    return [...sqlPatterns, ...noSqlPatterns].some(pattern => pattern.test(value));
  };

  const validate = (obj) => {
    for (const key in obj) {
      if (checkInjection(obj[key])) {
        return true;
      }

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (validate(obj[key])) {
          return true;
        }
      }
    }
    return false;
  };

  if (validate(req.body) || validate(req.query) || validate(req.params)) {
    return res.status(400).json({
      success: false,
      message: 'Petición bloqueada por seguridad'
    });
  }

  next();
};

module.exports = {
  helmetConfig,
  apiLimiter,
  authLimiter,
  createLimiter,
  sanitizeInput,
  encryptSensitiveFields,
  securityLogger,
  validateOrigin,
  preventInjection
};
