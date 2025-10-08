const { User, Session } = require('../models');

// Authentication middleware
const getCurrentUser = async (req, res, next) => {
  try {
    let sessionToken = req.cookies.session_token;
    
    // Check Authorization header if cookie is not present
    if (!sessionToken) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        sessionToken = authHeader.split(' ')[1];
      }
    }
    
    if (!sessionToken) {
      req.user = null;
      return next();
    }
    
    // Find session in database
    const session = await Session.findOne({ session_token: sessionToken });
    if (!session) {
      req.user = null;
      return next();
    }
    
    // Check if session has expired
    const now = new Date();
    if (session.expires_at < now) {
      // Clean up expired session
      await Session.deleteOne({ _id: session._id });
      req.user = null;
      return next();
    }
    
    // Find user
    const user = await User.findOne({ id: session.user_id });
    if (!user) {
      // Clean up orphaned session
      await Session.deleteOne({ _id: session._id });
      req.user = null;
      return next();
    }
    
    req.user = user;
    req.session = session;
    next();
    
  } catch (error) {
    console.error('Authentication error:', error);
    req.user = null;
    next();
  }
};

// Require authentication
const requireAuth = async (req, res, next) => {
  await getCurrentUser(req, res, () => {});
  
  // Development mode: allow requests without authentication
  if (process.env.NODE_ENV === 'development' && !req.user) {
    // Create a mock development user
    req.user = {
      id: 'dev-user-1',
      email: 'developer@test.com',
      name: 'Usuario de Desarrollo',
      role: 'estudiante',
      is_verified: true,
      github_url: '',
      linkedin_url: '',
      portfolio_url: '',
      skills: [],
      bio: '',
      company_name: '',
      company_document: '',
      created_at: new Date(),
      updated_at: new Date()
    };
    return next();
  }
  
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'You must be logged in to access this resource'
    });
  }
  
  next();
};

// Require company role
const requireCompany = async (req, res, next) => {
  await requireAuth(req, res, () => {});
  
  if (res.headersSent) return; // If requireAuth already sent a response
  
  if (req.user.role !== 'empresa') {
    return res.status(403).json({ 
      error: 'Company account required',
      message: 'This resource is only available to company accounts'
    });
  }
  
  next();
};

// Require student role
const requireStudent = async (req, res, next) => {
  await requireAuth(req, res, () => {});
  
  if (res.headersSent) return; // If requireAuth already sent a response
  
  if (req.user.role !== 'estudiante') {
    return res.status(403).json({ 
      error: 'Student account required',
      message: 'This resource is only available to student accounts'
    });
  }
  
  next();
};

// Optional authentication (sets user if available, but doesn't require it)
const optionalAuth = async (req, res, next) => {
  await getCurrentUser(req, res, next);
};

module.exports = {
  getCurrentUser,
  requireAuth,
  requireCompany,
  requireStudent,
  optionalAuth
};
