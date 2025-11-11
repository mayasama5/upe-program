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
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (!value || value === '') return true;
      return /^https?:\/\/.+/.test(value);
    })
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
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (!value || value === '') return true;
      return /^https?:\/\/.+/.test(value);
    })
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
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (!value || value === '') return true;
      return /^https?:\/\/.+/.test(value);
    })
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
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (!value || value === '') return true;
      return /^https?:\/\/.+/.test(value);
    })
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
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (!value || value === '') return true;
      return /^https?:\/\/.+/.test(value);
    })
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
 * DTO para crear noticia
 */
const createNewsDTO = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('El título debe tener entre 3 y 200 caracteres'),
  body('excerpt')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('El extracto debe tener entre 10 y 500 caracteres'),
  body('content')
    .trim()
    .isLength({ min: 20, max: 10000 })
    .withMessage('El contenido debe tener entre 20 y 10000 caracteres'),
  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La categoría debe tener entre 2 y 50 caracteres'),
  body('image_url')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (!value || value === '') return true;
      return /^https?:\/\/.+/.test(value);
    })
    .withMessage('URL de imagen inválida'),
  body('author')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El autor debe tener entre 2 y 100 caracteres'),
  body('is_published')
    .optional()
    .isBoolean()
    .withMessage('is_published debe ser booleano')
];

/**
 * DTO para actualizar noticia
 */
const updateNewsDTO = [
  param('id')
    .isString()
    .withMessage('ID de noticia inválido'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('El título debe tener entre 3 y 200 caracteres'),
  body('excerpt')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('El extracto debe tener entre 10 y 500 caracteres'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 20, max: 10000 })
    .withMessage('El contenido debe tener entre 20 y 10000 caracteres'),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La categoría debe tener entre 2 y 50 caracteres'),
  body('is_published')
    .optional()
    .isBoolean()
    .withMessage('is_published debe ser booleano')
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
    const errorDetails = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
      value: err.value
    }));

    console.log('❌ Validation errors:', JSON.stringify(errorDetails, null, 2));
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));

    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errorDetails
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
  createNewsDTO,
  updateNewsDTO,
  contentIdDTO,
  validate
};
