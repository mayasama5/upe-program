const path = require('path');
const fs = require('fs');

/**
 * Tipos MIME permitidos por categoría
 */
const ALLOWED_MIME_TYPES = {
  // Documentos
  pdf: ['application/pdf'],
  word: [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  excel: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],

  // Imágenes
  image: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ],

  // Documentos e imágenes (para certificados y títulos)
  document: [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ],

  // Archivos comprimidos
  archive: [
    'application/zip',
    'application/x-zip-compressed',
    'application/x-rar-compressed',
    'application/x-7z-compressed'
  ]
};

/**
 * Extensiones permitidas por categoría
 */
const ALLOWED_EXTENSIONS = {
  pdf: ['.pdf'],
  word: ['.doc', '.docx'],
  excel: ['.xls', '.xlsx'],
  image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
  document: ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.webp'],
  archive: ['.zip', '.rar', '.7z']
};

/**
 * Tamaños máximos por tipo de archivo (en bytes)
 */
const MAX_FILE_SIZES = {
  pdf: 10 * 1024 * 1024,      // 10 MB
  word: 10 * 1024 * 1024,     // 10 MB
  excel: 10 * 1024 * 1024,    // 10 MB
  image: 5 * 1024 * 1024,     // 5 MB
  document: 10 * 1024 * 1024, // 10 MB (PDFs e imágenes)
  archive: 50 * 1024 * 1024,  // 50 MB
  default: 10 * 1024 * 1024   // 10 MB por defecto
};

/**
 * Valida si un archivo tiene una extensión permitida
 * @param {string} filename - Nombre del archivo
 * @param {string} category - Categoría de archivo (pdf, image, etc.)
 * @returns {boolean}
 */
const isValidExtension = (filename, category) => {
  const ext = path.extname(filename).toLowerCase();
  const allowedExts = ALLOWED_EXTENSIONS[category] || [];
  return allowedExts.includes(ext);
};

/**
 * Valida si un archivo tiene un tipo MIME permitido
 * @param {string} mimetype - Tipo MIME del archivo
 * @param {string} category - Categoría de archivo
 * @returns {boolean}
 */
const isValidMimeType = (mimetype, category) => {
  const allowedTypes = ALLOWED_MIME_TYPES[category] || [];
  return allowedTypes.includes(mimetype);
};

/**
 * Valida el tamaño del archivo
 * @param {number} size - Tamaño en bytes
 * @param {string} category - Categoría de archivo
 * @returns {boolean}
 */
const isValidSize = (size, category) => {
  const maxSize = MAX_FILE_SIZES[category] || MAX_FILE_SIZES.default;
  return size <= maxSize;
};

/**
 * Valida completamente un archivo
 * @param {Object} file - Objeto file de multer
 * @param {string} category - Categoría de archivo
 * @returns {Object} { valid: boolean, error: string }
 */
const validateFile = (file, category) => {
  if (!file) {
    return { valid: false, error: 'No se proporcionó ningún archivo' };
  }

  // Validar extensión
  if (!isValidExtension(file.originalname, category)) {
    const allowedExts = ALLOWED_EXTENSIONS[category]?.join(', ') || 'ninguna';
    return {
      valid: false,
      error: `Extensión de archivo no permitida. Extensiones permitidas: ${allowedExts}`
    };
  }

  // Validar tipo MIME
  if (!isValidMimeType(file.mimetype, category)) {
    return {
      valid: false,
      error: 'Tipo de archivo no permitido'
    };
  }

  // Validar tamaño
  if (!isValidSize(file.size, category)) {
    const maxSize = MAX_FILE_SIZES[category] || MAX_FILE_SIZES.default;
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB} MB`
    };
  }

  return { valid: true, error: null };
};

/**
 * Middleware de validación para archivos únicos
 * @param {string} category - Categoría de archivo
 * @returns {Function} Middleware de Express
 */
const validateSingleFile = (category) => {
  return (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo'
      });
    }

    const validation = validateFile(req.file, category);

    if (!validation.valid) {
      // With memory storage, no file cleanup needed
      return res.status(400).json({
        success: false,
        message: validation.error
      });
    }

    next();
  };
};

/**
 * Middleware de validación para múltiples archivos
 * @param {string} category - Categoría de archivo
 * @param {number} maxFiles - Número máximo de archivos
 * @returns {Function} Middleware de Express
 */
const validateMultipleFiles = (category, maxFiles = 10) => {
  return (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron archivos'
      });
    }

    if (req.files.length > maxFiles) {
      // With memory storage, no file cleanup needed
      return res.status(400).json({
        success: false,
        message: `Máximo ${maxFiles} archivos permitidos`
      });
    }

    // Validar cada archivo
    const invalidFiles = [];
    req.files.forEach(file => {
      const validation = validateFile(file, category);
      if (!validation.valid) {
        invalidFiles.push({
          filename: file.originalname,
          error: validation.error
        });
      }
    });

    if (invalidFiles.length > 0) {
      // With memory storage, no file cleanup needed
      return res.status(400).json({
        success: false,
        message: 'Algunos archivos no son válidos',
        invalidFiles
      });
    }

    next();
  };
};

/**
 * Obtiene información sobre los tipos de archivo permitidos
 * @param {string} category - Categoría de archivo
 * @returns {Object}
 */
const getAllowedFileInfo = (category) => {
  return {
    category,
    allowedExtensions: ALLOWED_EXTENSIONS[category] || [],
    allowedMimeTypes: ALLOWED_MIME_TYPES[category] || [],
    maxSize: MAX_FILE_SIZES[category] || MAX_FILE_SIZES.default,
    maxSizeMB: ((MAX_FILE_SIZES[category] || MAX_FILE_SIZES.default) / (1024 * 1024)).toFixed(2)
  };
};

/**
 * Genera un nombre de archivo seguro
 * @param {string} originalName - Nombre original del archivo
 * @returns {string}
 */
const generateSafeFilename = (originalName) => {
  const ext = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, ext);

  // Sanitizar nombre: solo letras, números, guiones y guiones bajos
  const safeName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);

  // Agregar timestamp para unicidad
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);

  return `${safeName}-${timestamp}-${randomStr}${ext}`;
};

/**
 * Verifica si un archivo es realmente del tipo que dice ser
 * mediante la lectura de sus magic numbers (primeros bytes)
 * @param {Buffer} buffer - Buffer del archivo
 * @param {string} expectedMimeType - Tipo MIME esperado
 * @returns {boolean}
 */
const verifyFileSignature = (buffer, expectedMimeType) => {
  if (!buffer || buffer.length < 4) {
    return false;
  }

  // Magic numbers para diferentes tipos de archivo
  const signatures = {
    'application/pdf': [0x25, 0x50, 0x44, 0x46],        // %PDF
    'image/jpeg': [0xFF, 0xD8, 0xFF],                    // JPEG
    'image/png': [0x89, 0x50, 0x4E, 0x47],              // PNG
    'image/gif': [0x47, 0x49, 0x46, 0x38],              // GIF8
    'application/zip': [0x50, 0x4B, 0x03, 0x04],        // ZIP
    'application/x-rar-compressed': [0x52, 0x61, 0x72, 0x21], // RAR
    // Documentos de Office (todos son ZIP en realidad)
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [0x50, 0x4B, 0x03, 0x04],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [0x50, 0x4B, 0x03, 0x04]
  };

  const signature = signatures[expectedMimeType];
  if (!signature) {
    return true; // No podemos verificar, permitimos
  }

  // Verificar que los primeros bytes coincidan
  for (let i = 0; i < signature.length; i++) {
    if (buffer[i] !== signature[i]) {
      return false;
    }
  }

  return true;
};

module.exports = {
  validateFile,
  validateSingleFile,
  validateMultipleFiles,
  isValidExtension,
  isValidMimeType,
  isValidSize,
  getAllowedFileInfo,
  generateSafeFilename,
  verifyFileSignature,
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZES
};
