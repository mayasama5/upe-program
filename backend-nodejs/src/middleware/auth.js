const { authenticateJWT, optionalJWT } = require('./jwtAuth');

/**
 * Get current user from JWT token
 * This is a wrapper around authenticateJWT for compatibility
 */
const getCurrentUser = optionalJWT;

/**
 * Require authentication using JWT
 */
const requireAuth = authenticateJWT;

/**
 * Require company role
 */
const requireCompany = async (req, res, next) => {
  // Allow OPTIONS requests to pass through for CORS preflight
  if (req.method === 'OPTIONS') {
    return next();
  }

  // First authenticate
  await authenticateJWT(req, res, () => {});

  if (res.headersSent) return;

  if (req.user.role !== 'empresa') {
    return res.status(403).json({
      error: 'Company account required',
      message: 'This resource is only available to company accounts'
    });
  }

  next();
};

/**
 * Require student role
 */
const requireStudent = async (req, res, next) => {
  // Allow OPTIONS requests to pass through for CORS preflight
  if (req.method === 'OPTIONS') {
    return next();
  }

  // First authenticate
  await authenticateJWT(req, res, () => {});

  if (res.headersSent) return;

  if (req.user.role !== 'estudiante') {
    return res.status(403).json({
      error: 'Student account required',
      message: 'This resource is only available to student accounts'
    });
  }

  next();
};

/**
 * Optional authentication (sets user if available, but doesn't require it)
 */
const optionalAuth = optionalJWT;

/**
 * Require admin role
 */
const requireAdmin = async (req, res, next) => {
  // Allow OPTIONS requests to pass through for CORS preflight
  if (req.method === 'OPTIONS') {
    return next();
  }

  // First authenticate
  await authenticateJWT(req, res, () => {});

  if (res.headersSent) return;

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Admin account required',
      message: 'This resource is only available to admin accounts'
    });
  }

  next();
};

module.exports = {
  getCurrentUser,
  requireAuth,
  requireCompany,
  requireStudent,
  requireAdmin,
  optionalAuth
};
