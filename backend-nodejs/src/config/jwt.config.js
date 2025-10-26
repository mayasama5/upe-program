const jwt = require('jsonwebtoken');

const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  issuer: 'upe-platform',
  audience: 'upe-users'
};

/**
 * Genera un token JWT para un usuario
 * @param {Object} user - Objeto usuario
 * @returns {string} Token JWT
 */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    is_verified: user.is_verified
  };

  return jwt.sign(payload, JWT_CONFIG.secret, {
    expiresIn: JWT_CONFIG.expiresIn,
    issuer: JWT_CONFIG.issuer,
    audience: JWT_CONFIG.audience
  });
};

/**
 * Genera un refresh token
 * @param {Object} user - Objeto usuario
 * @returns {string} Refresh token
 */
const generateRefreshToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email
  };

  return jwt.sign(payload, JWT_CONFIG.secret, {
    expiresIn: JWT_CONFIG.refreshExpiresIn,
    issuer: JWT_CONFIG.issuer,
    audience: JWT_CONFIG.audience
  });
};

/**
 * Verifica y decodifica un token JWT
 * @param {string} token - Token a verificar
 * @returns {Object} Payload decodificado
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_CONFIG.secret, {
      issuer: JWT_CONFIG.issuer,
      audience: JWT_CONFIG.audience
    });
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};

/**
 * Decodifica un token sin verificarlo (útil para debug)
 * @param {string} token - Token a decodificar
 * @returns {Object} Payload decodificado
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  JWT_CONFIG,
  generateToken,
  generateRefreshToken,
  verifyToken,
  decodeToken
};
