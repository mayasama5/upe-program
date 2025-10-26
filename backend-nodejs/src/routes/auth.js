const express = require('express');
const { clerkClient } = require('@clerk/clerk-sdk-node');
const prisma = require('../config/prisma');
const { getCurrentUser, requireAuth } = require('../middleware/auth');

const router = express.Router();

// Set user role endpoint (called after sign-up from frontend)
router.post('/set-role', requireAuth, async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['estudiante', 'empresa'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid role',
        message: 'Role must be either "estudiante" or "empresa"'
      });
    }

    // Update role in Clerk metadata
    await clerkClient.users.updateUser(req.user.id, {
      publicMetadata: {
        role: role
      }
    });

    // Update role in Supabase (via Prisma)
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { role: role }
    });

    res.json({
      message: 'Role updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        picture: updatedUser.picture,
        role: updatedUser.role,
        is_verified: updatedUser.is_verified
      }
    });

  } catch (error) {
    console.error('Set role error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while setting the role'
    });
  }
});

// Get current user
router.get('/me', getCurrentUser, (req, res) => {
  
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

// Logout endpoint (sign out from Clerk)
router.post('/logout', requireAuth, async (req, res) => {
  try {
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
