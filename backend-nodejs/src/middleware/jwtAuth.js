const { verifyToken } = require('../config/jwt.config');
const prisma = require('../config/prisma');

/**
 * Middleware para verificar token JWT
 */
const authenticateJWT = async (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No se proporcionó token de autenticación'
      });
    }

    // El token debe venir en formato "Bearer <token>"
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación inválido'
      });
    }

    // Verificar y decodificar el token
    const decoded = verifyToken(token);

    // Verificar que el usuario existe en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        is_verified: true,
        picture: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Adjuntar usuario al request
    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    console.error('JWT Authentication Error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
        code: 'TOKEN_INVALID'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Error de autenticación'
    });
  }
};

/**
 * Middleware para verificar rol de administrador
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'No autenticado'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador.'
    });
  }

  next();
};

/**
 * Middleware para verificar que el usuario está verificado
 */
const requireVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'No autenticado'
    });
  }

  if (!req.user.is_verified) {
    return res.status(403).json({
      success: false,
      message: 'Usuario no verificado. Por favor verifica tu cuenta.'
    });
  }

  next();
};

/**
 * Middleware para verificar roles específicos
 * @param {Array<string>} allowedRoles - Roles permitidos
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Roles permitidos: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Middleware opcional de JWT (no falla si no hay token)
 */
const optionalJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    if (!token) {
      return next();
    }

    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        is_verified: true,
        picture: true
      }
    });

    if (user) {
      req.user = user;
      req.userId = user.id;
    }

    next();
  } catch (error) {
    // Si hay error, simplemente continuar sin usuario
    next();
  }
};

module.exports = {
  authenticateJWT,
  requireAdmin,
  requireVerified,
  requireRole,
  optionalJWT
};
