const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Import configuration and middleware
const connectDB = require('./config/database');
const { preventInjection, securityLogger, apiLimiter } = require('./middleware/security');
const { handleMulterError } = require('./middleware/upload');
const { checkMaintenance } = require('./middleware/maintenance');
// Security middleware temporarily disabled for deployment
// const {
//   helmetConfig,
//   apiLimiter,
//   sanitizeInput,
//   securityLogger,
//   preventInjection
// } = require('./middleware/security');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const contentRoutes = require('./routes/content');
const savedItemsRoutes = require('./routes/saved-items');
const statsRoutes = require('./routes/stats');
const adminRoutes = require('./routes/admin');
const reportsRoutes = require('./routes/reports');
// const careerAdviceRoutes = require('./routes/career-advice'); // Temporarily disabled
const careerAdviceRoutes = require('./routes/career-advice');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Trust proxy - required for Vercel and rate limiting
app.set('trust proxy', true);

// Connect to database
connectDB();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Temporarily disabled security middleware
// app.use(helmetConfig);
// app.use(sanitizeInput);

// Prevención de inyecciones SQL/NoSQL
app.use(preventInjection);

// Security logging para operaciones críticas
app.use(securityLogger);

// CORS configuration (MUST be before rate limiter to handle preflight)
const corsOptions = {
  origin: function (origin, callback) {
    console.log(`🔍 CORS check for origin: ${origin}`);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('CORS allowed: No origin (server-to-server)');
      return callback(null, true);
    }
    
    // Development origins
    const developmentOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    ];
    
    // Check if it's a development origin
    if (developmentOrigins.includes(origin)) {
      console.log(`CORS allowed: Development origin - ${origin}`);
      return callback(null, true);
    }
    
    // Check if it's from environment variable
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      console.log(`CORS allowed: Environment variable - ${origin}`);
      return callback(null, true);
    }
    
    // Allow any Vercel deployment (dynamic pattern matching)
    const vercelPattern = /^https:\/\/.*\.vercel\.app$/;
    if (vercelPattern.test(origin)) {
      console.log(`CORS allowed: Vercel deployment - ${origin}`);
      return callback(null, true);
    }
    
    // Allow specific deployment URLs that might not match the pattern
    const allowedOrigins = [
      'https://techhubupe.com', // Custom domain
      'https://www.techhubupe.com', // Custom domain with www
      'https://upe-8gd0xyqyk-gustavogamarra95s-projects.vercel.app',
      'https://upe-program.vercel.app',
      'https://upe-program-git-main-gustavogamarra95s-projects.vercel.app',
      'https://upe-gpqkno1pr-gustavogamarra95s-projects.vercel.app',
      'https://upe-eight.vercel.app', // Production frontend
      'https://upe-kkr3lcp4t-gustavogamarra95s-projects.vercel.app', // Latest frontend deploy
      'https://upe-9cvj71k8t-gustavogamarra95s-projects.vercel.app',
      'https://upe-700y6st0s-gustavogamarra95s-projects.vercel.app',
      'https://upe-qwyv59pyt-gustavogamarra95s-projects.vercel.app',
      'https://upe-oqupv2udb-gustavogamarra95s-projects.vercel.app',
      'https://upe-glj0rn4as-gustavogamarra95s-projects.vercel.app',
      'https://upe-jay2tsfnx-gustavogamarra95s-projects.vercel.app',
      'https://upe-3b5kfh588-gustavogamarra95s-projects.vercel.app',
      'https://upe-dnm5f5s03-gustavogamarra95s-projects.vercel.app', // Frontend deploy 1
      'https://upe-gh6mq8r1v-gustavogamarra95s-projects.vercel.app'  // Frontend deploy 2
    ];
    
    if (allowedOrigins.includes(origin)) {
      console.log(`CORS allowed: Specific deployment - ${origin}`);
      return callback(null, true);
    }
    
    console.warn(`CORS blocked origin: ${origin}`);
    // In production, be more permissive to avoid deployment issues
    if (process.env.NODE_ENV === 'production') {
      console.log('Production mode: Allowing origin anyway');
      return callback(null, true);
    }
    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Session-ID',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: [
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials'
  ],
  preflightContinue: false,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Rate limiting para toda la API (AFTER CORS to not block preflight requests)
app.use('/api/', (req, res, next) => {
  // Skip rate limiting for OPTIONS requests (CORS preflight)
  if (req.method === 'OPTIONS') {
    return next();
  }
  return apiLimiter(req, res, next);
});

// Explicit OPTIONS handler for preflight requests
app.options('*', (req, res) => {
  console.log(`OPTIONS request for: ${req.path} from origin: ${req.headers.origin}`);
  const origin = req.headers.origin;
  // Reutiliza la lógica de CORS para determinar si el origen está permitido
  const developmentOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ];
  const vercelPattern = /^https:\/\/.*\.vercel\.app$/;
  const allowedOrigins = [
    'https://techhubupe.com', // Custom domain
    'https://www.techhubupe.com', // Custom domain with www
    'https://upe-8gd0xyqyk-gustavogamarra95s-projects.vercel.app',
    'https://upe-program.vercel.app',
    'https://upe-program-git-main-gustavogamarra95s-projects.vercel.app',
    'https://upe-gpqkno1pr-gustavogamarra95s-projects.vercel.app',
    'https://upe-eight.vercel.app',
    'https://upe-kkr3lcp4t-gustavogamarra95s-projects.vercel.app',
    'https://upe-9cvj71k8t-gustavogamarra95s-projects.vercel.app',
    'https://upe-700y6st0s-gustavogamarra95s-projects.vercel.app',
    'https://upe-qwyv59pyt-gustavogamarra95s-projects.vercel.app',
    'https://upe-oqupv2udb-gustavogamarra95s-projects.vercel.app',
    'https://upe-glj0rn4as-gustavogamarra95s-projects.vercel.app',
    'https://upe-jay2tsfnx-gustavogamarra95s-projects.vercel.app',
    'https://upe-3b5kfh588-gustavogamarra95s-projects.vercel.app',
    'https://upe-dnm5f5s03-gustavogamarra95s-projects.vercel.app',
    'https://upe-gh6mq8r1v-gustavogamarra95s-projects.vercel.app'
  ];
  let allowedOrigin = '';
  if (!origin) {
    allowedOrigin = '';
  } else if (developmentOrigins.includes(origin)) {
    allowedOrigin = origin;
  } else if (vercelPattern.test(origin)) {
    allowedOrigin = origin;
  } else if (allowedOrigins.includes(origin)) {
    allowedOrigin = origin;
  } else if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
    allowedOrigin = origin;
  } else if (process.env.NODE_ENV === 'production') {
    allowedOrigin = origin;
  }
  if (allowedOrigin) {
    res.header('Access-Control-Allow-Origin', allowedOrigin);
  }
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,HEAD,PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Session-ID, Cache-Control, Pragma');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
});

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({
        error: 'Invalid JSON',
        message: 'Request body contains invalid JSON'
      });
      throw new Error('Invalid JSON');
    }
  }
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// Cookie parser middleware
app.use(cookieParser());

// Static files middleware for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  maxAge: '1d',
  etag: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Maintenance mode middleware (debe ir antes de las rutas API)
app.use(checkMaintenance);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', contentRoutes);
app.use('/api/saved-items', savedItemsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/career-advice', careerAdviceRoutes);

// File upload error handling middleware
app.use(handleMulterError);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    available_routes: [
      'GET /health',
      'POST /api/auth/complete',
      'GET /api/auth/me',
      'POST /api/auth/logout',
      'GET /api/auth/check',
      'GET /api/users/profile',
      'PUT /api/users/profile',
      'POST /api/users/cv',
      'POST /api/users/certificates',
      'POST /api/users/degrees',
      'POST /api/users/company-document',
      'GET /api/courses',
      'GET /api/events',
      'GET /api/jobs',
      'POST /api/jobs',
      'GET /api/jobs/:jobId',
      'POST /api/jobs/:jobId/apply',
      'GET /api/company/applications',
      'PUT /api/company/applications/:applicationId/status',
      'GET /api/saved-items',
      'POST /api/saved-items',
      'DELETE /api/saved-items/:itemId',
      'GET /api/saved-items/check/:itemId',
      'GET /api/stats',
      'GET /api/stats/personal'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      error: 'Validation Error',
      message: errors.join(', ')
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(409).json({
      error: 'Duplicate Entry',
      message: `${field} already exists`
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid Token',
      message: 'Invalid authentication token'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token Expired',
      message: 'Authentication token has expired'
    });
  }

  // CORS errors
  if (error.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Cross-origin request blocked by CORS policy'
    });
  }

  // Default error
  res.status(error.status || 500).json({
    error: error.name || 'Internal Server Error',
    message: error.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start server only if not running in serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Health check: http://localhost:${PORT}/health`);

    if (process.env.NODE_ENV === 'development') {
      console.log(`API Documentation available at: http://localhost:${PORT}/api`);
      console.log(`File uploads served from: http://localhost:${PORT}/uploads`);
    }
  });
}

module.exports = app;
