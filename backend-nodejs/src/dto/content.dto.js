const { body, param, validationResult } = require('express-validator');

/**
 * DTO para crear curso
 */
const createCourseDTO = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('El título debe tener entre 3 y 200 caracteres'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('La descripción debe tener entre 10 y 2000 caracteres'),
  body('provider')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El proveedor debe tener entre 2 y 100 caracteres'),
  body('url')
    .isURL()
    .withMessage('URL inválida'),
  body('language')
    .isIn(['es', 'en', 'pt'])
    .withMessage('Idioma inválido'),
  body('has_spanish_subtitles')
    .optional()
    .isBoolean()
    .withMessage('has_spanish_subtitles debe ser booleano'),
  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La categoría debe tener entre 2 y 50 caracteres'),
  body('is_free')
    .isBoolean()
    .withMessage('is_free debe ser booleano'),
  body('image_url')
    .optional()
    .isURL()
    .withMessage('URL de imagen inválida')
];

/**
 * DTO para actualizar curso
 */
const updateCourseDTO = [
  param('id')
    .isString()
    .withMessage('ID de curso inválido'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('El título debe tener entre 3 y 200 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('La descripción debe tener entre 10 y 2000 caracteres'),
  body('provider')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El proveedor debe tener entre 2 y 100 caracteres'),
  body('url')
    .optional()
    .isURL()
    .withMessage('URL inválida'),
  body('language')
    .optional()
    .isIn(['es', 'en', 'pt'])
    .withMessage('Idioma inválido'),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La categoría debe tener entre 2 y 50 caracteres')
];

/**
 * DTO para crear evento
 */
const createEventDTO = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('El título debe tener entre 3 y 200 caracteres'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('La descripción debe tener entre 10 y 2000 caracteres'),
  body('organizer')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El organizador debe tener entre 2 y 100 caracteres'),
  body('url')
    .optional()
    .isURL()
    .withMessage('URL inválida'),
  body('event_date')
    .isISO8601()
    .withMessage('Fecha de evento inválida'),
  body('location')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('La ubicación debe tener entre 2 y 200 caracteres'),
  body('is_online')
    .isBoolean()
    .withMessage('is_online debe ser booleano'),
  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La categoría debe tener entre 2 y 50 caracteres'),
  body('image_url')
    .optional()
    .isURL()
    .withMessage('URL de imagen inválida')
];

/**
 * DTO para actualizar evento
 */
const updateEventDTO = [
  param('id')
    .isString()
    .withMessage('ID de evento inválido'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('El título debe tener entre 3 y 200 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('La descripción debe tener entre 10 y 2000 caracteres'),
  body('event_date')
    .optional()
    .isISO8601()
    .withMessage('Fecha de evento inválida')
];

/**
 * DTO para crear vacante
 */
const createJobDTO = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('El título debe tener entre 3 y 200 caracteres'),
  body('company')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('La empresa debe tener entre 2 y 100 caracteres'),
  body('location')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('La ubicación debe tener entre 2 y 200 caracteres'),
  body('salary_range')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El rango salarial es demasiado largo'),
  body('job_type')
    .isIn(['practica', 'pasantia', 'junior', 'medio', 'senior'])
    .withMessage('Tipo de trabajo inválido'),
  body('modality')
    .isIn(['presencial', 'remoto', 'hibrido'])
    .withMessage('Modalidad inválida'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('La descripción debe tener entre 10 y 5000 caracteres'),
  body('requirements')
    .optional()
    .isArray()
    .withMessage('Los requisitos deben ser un array'),
  body('responsibilities')
    .optional()
    .isArray()
    .withMessage('Las responsabilidades deben ser un array'),
  body('benefits')
    .optional()
    .isArray()
    .withMessage('Los beneficios deben ser un array'),
  body('apply_type')
    .isIn(['interno', 'externo'])
    .withMessage('Tipo de aplicación inválido'),
  body('external_url')
    .optional()
    .isURL()
    .withMessage('URL externa inválida'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active debe ser booleano'),
  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La categoría debe tener entre 2 y 50 caracteres')
];

/**
 * DTO para actualizar vacante
 */
const updateJobDTO = [
  param('id')
    .isString()
    .withMessage('ID de vacante inválido'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('El título debe tener entre 3 y 200 caracteres'),
  body('job_type')
    .optional()
    .isIn(['practica', 'pasantia', 'junior', 'medio', 'senior'])
    .withMessage('Tipo de trabajo inválido'),
  body('modality')
    .optional()
    .isIn(['presencial', 'remoto', 'hibrido'])
    .withMessage('Modalidad inválida'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active debe ser booleano')
];

/**
 * DTO para ID genérico
 */
const contentIdDTO = [
  param('id')
    .isString()
    .withMessage('ID inválido')
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
  createCourseDTO,
  updateCourseDTO,
  createEventDTO,
  updateEventDTO,
  createJobDTO,
  updateJobDTO,
  contentIdDTO,
  validate
};
