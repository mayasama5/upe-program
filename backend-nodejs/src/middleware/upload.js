const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;

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
    // Generate unique filename
    const uniqueName = `${file.fieldname}_${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedTypes = {
    'cv': ['.pdf', '.doc', '.docx'],
    'certificate': ['.pdf', '.jpg', '.jpeg', '.png'],
    'degree': ['.pdf', '.jpg', '.jpeg', '.png'],
    'company_document': ['.pdf', '.jpg', '.jpeg', '.png']
  };
  
  const fileExt = path.extname(file.originalname).toLowerCase();
  const fieldName = file.fieldname;
  
  if (allowedTypes[fieldName] && allowedTypes[fieldName].includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${fieldName}. Allowed types: ${allowedTypes[fieldName]?.join(', ') || 'none'}`), false);
  }
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

module.exports = {
  upload,
  handleMulterError,
  getFileUrl,
  deleteFile
};
