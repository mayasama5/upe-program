const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { generateToken } = require('../config/jwt.config');
const { authenticateJWT } = require('../middleware/jwtAuth');
const { v4: uuidv4 } = require('uuid');
const { getAuthUrl, getTokensFromCode, getUserInfo } = require('../config/google.config');
const { normalizeObjectUrls } = require('../utils/urlHelper');
const { validateEmail, normalizeEmail } = require('../utils/emailValidator');
const { validatePassword } = require('../utils/passwordValidator');

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user (estudiante or empresa)
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, contact_name } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Por favor completa todos los campos requeridos'
      });
    }

    // Validate role
    if (!['estudiante', 'empresa'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid role',
        message: 'El rol debe ser "estudiante" o "empresa"'
      });
    }

    // Normalize and validate email
    const normalizedEmail = normalizeEmail(email);
    const emailValidation = await validateEmail(normalizedEmail, {
      checkMX: true,
      blockDisposable: true
    });

    if (!emailValidation.valid) {
      return res.status(400).json({
        error: 'Invalid email',
        message: emailValidation.error
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        error: 'Weak password',
        message: passwordValidation.errors[0],
        details: {
          errors: passwordValidation.errors,
          suggestions: passwordValidation.suggestions,
          strength: passwordValidation.strength
        }
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'Ya existe una cuenta con este correo electrónico'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        email: normalizedEmail,
        name: name.trim(),
        password: hashedPassword,
        role: role,
        is_verified: false,
        contact_name: role === 'empresa' ? contact_name : null,
        company_name: role === 'empresa' ? name : null,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    // Generate JWT token
    const token = generateToken(user);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    const normalizedUser = normalizeObjectUrls(userWithoutPassword, req);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: normalizedUser
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Ocurrió un error durante el registro'
    });
  }
});

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Correo electrónico y contraseña son requeridos'
      });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Correo electrónico o contraseña incorrectos'
      });
    }

    // Check if user has a password (might not have if registered with OAuth)
    if (!user.password) {
      return res.status(401).json({
        error: 'Invalid login method',
        message: 'Esta cuenta fue creada con un método de inicio de sesión diferente (Google)'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Correo electrónico o contraseña incorrectos'
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { updated_at: new Date() }
    });

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    const normalizedUser = normalizeObjectUrls(userWithoutPassword, req);

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: normalizedUser
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Ocurrió un error durante el inicio de sesión'
    });
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get('/me', authenticateJWT, async (req, res) => {
  try {
    // Get full user data from database
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        picture: true,
        role: true,
        is_verified: true,
        github_url: true,
        linkedin_url: true,
        portfolio_url: true,
        skills: true,
        bio: true,
        company_name: true,
        contact_name: true,
        cv_file_path: true,
        degree_files: true,
        created_at: true,
        updated_at: true
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account not found'
      });
    }

    // Normalize image URLs to use production URL instead of localhost
    const normalizedUser = normalizeObjectUrls(user, req);

    res.json({
      user: normalizedUser
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching user data'
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout (client should remove token from localStorage)
 */
router.post('/logout', authenticateJWT, async (req, res) => {
  try {
    // In JWT, logout is typically handled client-side by removing the token
    // But we can log this event or invalidate refresh tokens if we implement them

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

/**
 * POST /api/auth/set-role
 * Set/update user role (for onboarding process)
 */
router.post('/set-role', authenticateJWT, async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['estudiante', 'empresa', 'admin'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid role',
        message: 'Role must be either "estudiante", "empresa", or "admin"'
      });
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        role: role,
        updated_at: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        picture: true,
        role: true,
        is_verified: true
      }
    });

    res.json({
      message: 'Role updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Set role error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while setting the role'
    });
  }
});

router.get('/check', authenticateJWT, (req, res) => {
  res.json({
    authenticated: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role
    }
  });
});

/**
 * POST /api/auth/change-password
 * Change user password
 */
router.post('/change-password', authenticateJWT, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Missing fields',
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'Weak password',
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user || !user.password) {
      return res.status(400).json({
        error: 'Cannot change password',
        message: 'This account does not have a password set'
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid password',
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        updated_at: new Date()
      }
    });

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while changing password'
    });
  }
});

/**
 * GET /api/auth/google
 * Initiate Google OAuth flow
 */
router.get('/google', (req, res) => {
  try {
    const { role = 'estudiante' } = req.query;

    // Validate role
    if (!['estudiante', 'empresa'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid role',
        message: 'Role must be "estudiante" or "empresa"'
      });
    }

    // Build a redirectUri fallback using the current host if env var is not set
    const computedRedirect = process.env.GOOGLE_REDIRECT_URI || `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
    const authUrl = getAuthUrl(role, computedRedirect);
    res.json({ url: authUrl });
  } catch (error) {
    console.error('Google auth initiation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to initiate Google authentication'
    });
  }
});

/**
 * GET /api/auth/google/callback
 * Handle Google OAuth callback
 */
router.get('/google/callback', async (req, res) => {
  try {
    // Log key values and provide fallbacks for missing envs
    const computedFrontend = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
    const computedRedirect = process.env.GOOGLE_REDIRECT_URI || `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
    console.log('Google callback received:', {
      code: req.query.code ? 'present' : 'missing',
      state: req.query.state,
      frontendUrl: process.env.FRONTEND_URL ? process.env.FRONTEND_URL : '(computed)',
      redirectUri: process.env.GOOGLE_REDIRECT_URI ? process.env.GOOGLE_REDIRECT_URI : '(computed)'
    });

    const { code, state } = req.query;

    if (!code) {
      console.error('No code received from Google');
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`);
    }

    // Get role from state parameter (default to 'estudiante')
    const role = state && ['estudiante', 'empresa'].includes(state) ? state : 'estudiante';

    console.log('Exchanging code for tokens...');
    // Exchange code for tokens
    const tokens = await getTokensFromCode(code);
    console.log('Tokens received successfully');

    // Get user info from Google
    console.log('Fetching user info from Google...');
    const googleUser = await getUserInfo(tokens.access_token);
    console.log('User info received:', { email: googleUser.email, name: googleUser.name });

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email.toLowerCase() }
    });

    if (!user) {
      console.log('Creating new user...');
      // Create new user with specified role
      user = await prisma.user.create({
        data: {
          id: uuidv4(),
          email: googleUser.email.toLowerCase(),
          name: googleUser.name,
          picture: googleUser.picture,
          role: role,
          is_verified: googleUser.verified_email || false,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      console.log('New user created:', user.id);
    } else {
      console.log('Updating existing user...');
      // Update user info if changed
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: googleUser.name,
          picture: googleUser.picture,
          is_verified: googleUser.verified_email || user.is_verified,
          updated_at: new Date()
        }
      });
      console.log('User updated:', user.id);
    }

    // Generate JWT token
    const token = generateToken(user);
    console.log('JWT token generated, redirecting to frontend...');

    // Use meta refresh for instant redirect (avoids serverless redirect issues with long URLs)
    // Use FRONTEND_URL env var if set, otherwise fallback to request origin
    const redirectBase = process.env.FRONTEND_URL || computedFrontend;
    const redirectUrl = `${redirectBase.replace(/\/$/, '')}/auth/callback?token=${encodeURIComponent(token)}`;
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta http-equiv="refresh" content="0;url=${redirectUrl}"></head><body></body></html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);

  } catch (error) {
    console.error('Google callback error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed&message=${encodeURIComponent(error.message)}`);
  }
});

module.exports = router;
