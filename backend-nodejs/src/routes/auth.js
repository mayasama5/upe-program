const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { generateToken } = require('../config/jwt.config');
const { authenticateJWT } = require('../middleware/jwtAuth');
const { v4: uuidv4 } = require('uuid');
const { getAuthUrl, getTokensFromCode, getUserInfo } = require('../config/google.config');

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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email',
        message: 'Por favor proporciona un correo electrónico válido'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        error: 'Weak password',
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
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
        email: email.toLowerCase(),
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

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: userWithoutPassword
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

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: userWithoutPassword
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

    res.json({
      user
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

/**
 * GET /api/auth/check
 * Check if current session is valid
 */
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

    const authUrl = getAuthUrl(role);
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
    const { code, state } = req.query;

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`);
    }

    // Get role from state parameter (default to 'estudiante')
    const role = state && ['estudiante', 'empresa'].includes(state) ? state : 'estudiante';

    // Exchange code for tokens
    const tokens = await getTokensFromCode(code);

    // Get user info from Google
    const googleUser = await getUserInfo(tokens.access_token);

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email.toLowerCase() }
    });

    if (!user) {
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
    } else {
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
    }

    // Generate JWT token
    const token = generateToken(user);

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);

  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
});

module.exports = router;
