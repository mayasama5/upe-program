const { body, validationResult } = require('express-validator');

/**
 * DTO para crear notificación
 */
const createNotificationDTO = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('El título debe tener entre 3 y 200 caracteres'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('El mensaje debe tener entre 10 y 1000 caracteres'),
  body('type')
    .isIn(['info', 'success', 'warning', 'error'])
    .withMessage('Tipo de notificación inválido'),
  body('target_users')
    .isIn(['all', 'estudiante', 'empresa', 'admin'])
    .withMessage('Destinatarios inválidos')
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
  createNotificationDTO,
  validate
};
