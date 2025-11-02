const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const fsSync = require('fs');
const {
  generateSafeFilename,
  verifyFileSignature,
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS
} = require('../utils/fileValidator');

// Configure storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const userId = req.user?.id || 'anonymous';
      const uploadDir = path.join(__dirname, '../../uploads', userId);
      
      // Create directory if it doesn't exist
      await fs.mkdir(uploadDir, { recursive: true });
      
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Generate safe unique filename
    const safeName = generateSafeFilename(file.originalname);
    cb(null, safeName);
  }
});

// Mapeo de campos a categorías de archivo
const FIELD_CATEGORIES = {
  'cv': 'pdf',
  'certificate': 'pdf',
  'degree': 'pdf',
  'company_document': 'pdf',
  'picture': 'image',
  'certificates': 'image', // múltiples certificados pueden ser imágenes
  'degrees': 'image',
  'university_logo': 'image',
  'faculty_logo': 'image',
  'techhub_logo': 'image'
};

// File filter mejorado con validación estricta
const fileFilter = (req, file, cb) => {
  const fieldName = file.fieldname;
  const category = FIELD_CATEGORIES[fieldName];

  if (!category) {
    return cb(new Error(`Campo de archivo no reconocido: ${fieldName}`), false);
  }

  const fileExt = path.extname(file.originalname).toLowerCase();
  const allowedExts = ALLOWED_EXTENSIONS[category] || [];
  const allowedMimes = ALLOWED_MIME_TYPES[category] || [];

  // Validar extensión
  if (!allowedExts.includes(fileExt)) {
    return cb(
      new Error(
        `Extensión no permitida para ${fieldName}. Permitidas: ${allowedExts.join(', ')}`
      ),
      false
    );
  }

  // Validar tipo MIME
  if (!allowedMimes.includes(file.mimetype)) {
    return cb(
      new Error(
        `Tipo de archivo no permitido para ${fieldName}. Tipo detectado: ${file.mimetype}`
      ),
      false
    );
  }

  cb(null, true);
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files
  }
});

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'File size must be less than 10MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files',
        message: 'Maximum 10 files allowed'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Unexpected file field',
        message: 'Invalid file field name'
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      error: 'Invalid file type',
      message: error.message
    });
  }
  
  next(error);
};

// Helper function to get file URL
const getFileUrl = (req, filePath) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const relativePath = path.relative(path.join(__dirname, '../../'), filePath);
  return `${baseUrl}/${relativePath.replace(/\\/g, '/')}`;
};

// Helper function to delete file
const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Middleware adicional para verificar magic numbers del archivo
 * Esto previene que archivos maliciosos se disfracen con extensiones falsas
 */
const verifyFileContent = async (req, res, next) => {
  if (!req.file && !req.files) {
    return next();
  }

  try {
    const filesToVerify = req.file ? [req.file] : (req.files || []);

    for (const file of filesToVerify) {
      // Leer los primeros bytes del archivo
      const buffer = fsSync.readFileSync(file.path);
      const isValid = verifyFileSignature(buffer, file.mimetype);

      if (!isValid) {
        // Eliminar archivo no válido
        fsSync.unlinkSync(file.path);

        return res.status(400).json({
          success: false,
          error: 'Archivo corrupto o tipo incorrecto',
          message: `El archivo ${file.originalname} no corresponde al tipo declarado`
        });
      }
    }

    next();
  } catch (error) {
    console.error('Error verifying file content:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al verificar archivo',
      message: error.message
    });
  }
};

module.exports = {
  upload,
  handleMulterError,
  getFileUrl,
  deleteFile,
  verifyFileContent,
  FIELD_CATEGORIES
};
