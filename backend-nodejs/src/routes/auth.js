const express = require('express');
const axios = require('axios');
const { User, Session } = require('../models');
const { getCurrentUser, requireAuth } = require('../middleware/auth');

const router = express.Router();

// Complete authentication endpoint
router.post('/complete', async (req, res) => {
  try {
    console.log(`🔐 Auth complete request from origin: ${req.headers.origin}`);
    console.log(`📋 Headers: ${JSON.stringify(req.headers, null, 2)}`);
    
    const sessionId = req.headers['x-session-id'];
    
    if (!sessionId) {
      return res.status(400).json({
        error: 'Session ID required',
        message: 'X-Session-ID header is required'
      });
    }

    // Get authentication data from external service
    const authResponse = await axios.get(
      'https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data',
      {
        headers: {
          'X-Session-ID': sessionId
        }
      }
    );

    const authData = authResponse.data;

    // Check if user exists
    let user = await User.findOne({ email: authData.email });
    
    if (!user) {
      // Create new user
      user = new User({
        email: authData.email,
        name: authData.name,
        picture: authData.picture || null
      });
      await user.save();
    }

    // Create or update session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    // Remove any existing sessions for this user
    await Session.deleteMany({ user_id: user.id });

    const session = new Session({
      user_id: user.id,
      session_token: authData.session_token,
      expires_at: expiresAt
    });
    await session.save();

    // Set cookie with environment-specific settings
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.cookie('session_token', session.session_token, {
      path: '/',
      httpOnly: true,
      secure: isProduction, // HTTPS in production, HTTP in development
      sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-origin in production
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });

    console.log(`🍪 Cookie set for ${isProduction ? 'production' : 'development'} mode`);
    console.log(`🔒 Secure: ${isProduction}, SameSite: ${isProduction ? 'none' : 'lax'}`);

    res.json({
      message: 'Authentication completed successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
        is_verified: user.is_verified
      }
    });

  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.response) {
      // External API error
      return res.status(error.response.status).json({
        error: 'Authentication failed',
        message: 'Failed to validate session with authentication service'
      });
    }
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred during authentication'
    });
  }
});

// Get current user
router.get('/me', getCurrentUser, (req, res) => {
  // Development mode: return mock user if no real user is authenticated
  if (!req.user && process.env.NODE_ENV === 'development') {
    const mockUser = {
      id: 'dev-user-1',
      email: 'developer@test.com',
      name: 'Usuario de Desarrollo',
      picture: null,
      role: 'estudiante',
      is_verified: true,
      github_url: '',
      linkedin_url: '',
      portfolio_url: '',
      skills: [],
      bio: '',
      company_name: '',
      company_document: '',
      cv_file_path: null,
      certificate_files: [],
      degree_files: [],
      created_at: new Date(),
      updated_at: new Date()
    };
    
    return res.json({ user: mockUser });
  }
  
  if (!req.user) {
    return res.status(401).json({
      error: 'Not authenticated',
      message: 'No active session found'
    });
  }

  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      picture: req.user.picture,
      role: req.user.role,
      is_verified: req.user.is_verified,
      github_url: req.user.github_url,
      linkedin_url: req.user.linkedin_url,
      portfolio_url: req.user.portfolio_url,
      skills: req.user.skills,
      bio: req.user.bio,
      company_name: req.user.company_name,
      cv_file_path: req.user.cv_file_path,
      created_at: req.user.created_at
    }
  });
});

// Logout endpoint
router.post('/logout', requireAuth, async (req, res) => {
  try {
    // Delete the current session
    if (req.session) {
      await Session.deleteOne({ _id: req.session._id });
    }

    // Clear the cookie
    res.clearCookie('session_token', {
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'lax'
    });

    res.json({
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred during logout'
    });
  }
});

// Check session validity
router.get('/check', getCurrentUser, (req, res) => {
  res.json({
    authenticated: !!req.user,
    user: req.user ? {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role
    } : null
  });
});

module.exports = router;
