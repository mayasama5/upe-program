const { body, param, query, validationResult } = require('express-validator');

/**
 * DTO para crear usuario
 */
const createUserDTO = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('role')
    .optional()
    .isIn(['estudiante', 'empresa', 'admin'])
    .withMessage('Rol inválido'),
  body('picture')
    .optional()
    .isURL()
    .withMessage('URL de imagen inválida')
];

/**
 * DTO para actualizar usuario
 */
const updateUserDTO = [
  param('id')
    .isString()
    .withMessage('ID de usuario inválido'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('role')
    .optional()
    .isIn(['estudiante', 'empresa', 'admin'])
    .withMessage('Rol inválido'),
  body('is_verified')
    .optional()
    .isBoolean()
    .withMessage('is_verified debe ser booleano')
];

/**
 * DTO para listar usuarios (query params)
 */
const listUsersDTO = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página debe ser un número mayor a 0'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Límite debe ser entre 1 y 100'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Búsqueda demasiado larga'),
  query('role')
    .optional()
    .isIn(['estudiante', 'empresa', 'admin'])
    .withMessage('Rol inválido')
];

/**
 * DTO para ID de usuario
 */
const userIdDTO = [
  param('id')
    .isString()
    .withMessage('ID de usuario inválido')
];

/**
 * Middleware para validar resultados
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }

  next();
};

module.exports = {
  createUserDTO,
  updateUserDTO,
  listUsersDTO,
  userIdDTO,
  validate
};
