const express = require('express');
const prisma = require('../config/prisma');
const { requireAuth, requireCompany } = require('../middleware/auth');
const { upload, handleMulterError, getFileUrl, verifyFileContent, uploadToSupabase } = require('../middleware/upload');
const { validateSingleFile, validateMultipleFiles } = require('../utils/fileValidator');
const Joi = require('joi');

const router = express.Router();

// Validation schemas
const updateProfileSchema = Joi.object({
  role: Joi.string().valid('estudiante', 'empresa'),
  github_url: Joi.alternatives().try(
    Joi.string().uri(),
    Joi.string().allow(''),
    Joi.allow(null)
  ),
  linkedin_url: Joi.alternatives().try(
    Joi.string().uri(),
    Joi.string().allow(''),
    Joi.allow(null)
  ),
  portfolio_url: Joi.alternatives().try(
    Joi.string().uri(),
    Joi.string().allow(''),
    Joi.allow(null)
  ),
  skills: Joi.array().items(Joi.string()),
  bio: Joi.string().max(1000).allow('', null),
  company_name: Joi.string().max(200).allow('', null),
  company_document: Joi.string().allow('', null)
});

// Get user profile
router.get('/profile', requireAuth, (req, res) => {
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
      certificate_files: req.user.certificate_files,
      degree_files: req.user.degree_files,
      created_at: req.user.created_at
    }
  });
});

// Update user profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        message: error.details[0].message
      });
    }

    // Development mode: handle mock user
    if (process.env.NODE_ENV === 'development' && req.user.id === 'dev-user-1') {
      // Simulate successful update for development user
      const mockUpdatedUser = {
        ...req.user,
        ...value,
        updated_at: new Date()
      };
      
      return res.json({
        message: 'Profile updated successfully',
        user: mockUpdatedUser
      });
    }

    // Update user with Prisma
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: value
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        picture: updatedUser.picture,
        role: updatedUser.role,
        is_verified: updatedUser.is_verified,
        github_url: updatedUser.github_url,
        linkedin_url: updatedUser.linkedin_url,
        portfolio_url: updatedUser.portfolio_url,
        skills: updatedUser.skills,
        bio: updatedUser.bio,
        company_name: updatedUser.company_name,
        cv_file_path: updatedUser.cv_file_path,
        created_at: updatedUser.created_at
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while updating profile'
    });
  }
});

// Upload profile picture
router.post('/picture', requireAuth, upload.single('picture'), verifyFileContent, validateSingleFile('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Picture file is required'
      });
    }

    const fileUrl = getFileUrl(req, req.file.path);

    // Update user's picture with Prisma
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { picture: fileUrl }
    });

    res.json({
      message: 'Profile picture uploaded successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        picture: updatedUser.picture,
        role: updatedUser.role,
        is_verified: updatedUser.is_verified,
        github_url: updatedUser.github_url,
        linkedin_url: updatedUser.linkedin_url,
        portfolio_url: updatedUser.portfolio_url,
        skills: updatedUser.skills,
        bio: updatedUser.bio,
        company_name: updatedUser.company_name,
        cv_file_path: updatedUser.cv_file_path,
        certificate_files: updatedUser.certificate_files,
        degree_files: updatedUser.degree_files,
        created_at: updatedUser.created_at
      }
    });

  } catch (error) {
    console.error('Picture upload error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while uploading picture'
    });
  }
});

// Upload CV
router.post('/cv', requireAuth, upload.single('cv'), verifyFileContent, validateSingleFile('pdf'), async (req, res) => {
  try {
    console.log('CV Upload attempt:', {
      hasFile: !!req.file,
      user: req.user?.id,
      file: req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : 'no file'
    });

    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'CV file is required'
      });
    }

    // Upload to Supabase Storage
    const { url: fileUrl, path: filePath } = await uploadToSupabase(
      req.file.buffer,
      req.file.originalname,
      req.user.id,
      req.file.mimetype
    );

    // Update user's CV path with Prisma
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { cv_file_path: fileUrl }
    });

    res.json({
      message: 'CV uploaded successfully',
      cv_url: fileUrl,
      file_info: {
        filename: filePath,
        originalname: req.file.originalname,
        size: req.file.size
      }
    });

  } catch (error) {
    console.error('CV upload error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'An error occurred while uploading CV'
    });
  }
});

// Upload certificates
router.post('/certificates', requireAuth, upload.array('certificate', 5), verifyFileContent, validateMultipleFiles('document', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No files uploaded',
        message: 'Certificate files are required'
      });
    }

    const certificates = req.files.map(file => ({
      id: require('uuid').v4(),
      filename: file.filename,
      originalname: file.originalname,
      url: getFileUrl(req, file.path),
      size: file.size,
      uploaded_at: new Date()
    }));

    // Get current user to append certificates
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    // Add certificates to user's certificate_files array with Prisma
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        certificate_files: [...(currentUser.certificate_files || []), ...certificates]
      }
    });

    res.json({
      message: 'Certificates uploaded successfully',
      certificates: certificates
    });

  } catch (error) {
    console.error('Certificate upload error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while uploading certificates'
    });
  }
});

// Upload degrees
router.post('/degrees', requireAuth, upload.array('degree', 5), verifyFileContent, validateMultipleFiles('document', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No files uploaded',
        message: 'Degree files are required'
      });
    }

    const degrees = req.files.map(file => ({
      id: require('uuid').v4(),
      filename: file.filename,
      originalname: file.originalname,
      url: getFileUrl(req, file.path),
      size: file.size,
      uploaded_at: new Date()
    }));

    // Get current user to append degrees
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    // Add degrees to user's degree_files array with Prisma
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        degree_files: [...(currentUser.degree_files || []), ...degrees]
      }
    });

    res.json({
      message: 'Degrees uploaded successfully',
      degrees: degrees
    });

  } catch (error) {
    console.error('Degree upload error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while uploading degrees'
    });
  }
});

// Upload company document
router.post('/company-document', requireCompany, upload.single('company_document'), verifyFileContent, validateSingleFile('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Company document file is required'
      });
    }

    const fileUrl = getFileUrl(req, req.file.path);

    // Update user's company document with Prisma
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { company_document: fileUrl }
    });

    res.json({
      message: 'Company document uploaded successfully',
      document_url: fileUrl,
      file_info: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size
      }
    });

  } catch (error) {
    console.error('Company document upload error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while uploading company document'
    });
  }
});

// Delete certificate
router.delete('/certificates/:certificateId', requireAuth, async (req, res) => {
  try {
    const { certificateId } = req.params;

    // Get current user and filter out the certificate
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    const updatedCertificates = (currentUser.certificate_files || []).filter(
      cert => cert.id !== certificateId
    );

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { certificate_files: updatedCertificates }
    });

    res.json({
      message: 'Certificate deleted successfully'
    });

  } catch (error) {
    console.error('Certificate deletion error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while deleting certificate'
    });
  }
});

// Delete degree
router.delete('/degrees/:degreeId', requireAuth, async (req, res) => {
  try {
    const { degreeId } = req.params;

    // Get current user and filter out the degree
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    const updatedDegrees = (currentUser.degree_files || []).filter(
      degree => degree.id !== degreeId
    );

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { degree_files: updatedDegrees }
    });

    res.json({
      message: 'Degree deleted successfully'
    });

  } catch (error) {
    console.error('Degree deletion error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while deleting degree'
    });
  }
});

// Complete profile endpoint (used by frontend after signup/onboarding)
// This updates only allowed fields and avoids using any non-existent Prisma fields
router.post('/complete-profile', requireAuth, async (req, res) => {
  try {
    const schema = Joi.object({
      role: Joi.string().valid('estudiante', 'empresa').required(),
      display_name: Joi.string().max(200).required(),
      company_name: Joi.string().max(200).allow('', null),
      bio: Joi.string().max(1000).allow('', null)
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: 'Validation error', message: error.details[0].message });
    }

    const { role, display_name, company_name, bio } = value;

    // Development mock
    if (process.env.NODE_ENV === 'development' && req.user.id === 'dev-user-1') {
      const mock = { ...req.user, role, name: display_name, company_name, bio, updated_at: new Date() };
      return res.json({ user: mock });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        role,
        name: display_name,
        company_name: role === 'empresa' ? company_name : null,
        bio,
        updated_at: new Date()
      }
    });

    res.json({ user: {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      picture: updatedUser.picture,
      role: updatedUser.role,
      is_verified: updatedUser.is_verified,
      github_url: updatedUser.github_url,
      linkedin_url: updatedUser.linkedin_url,
      portfolio_url: updatedUser.portfolio_url,
      skills: updatedUser.skills,
      bio: updatedUser.bio,
      company_name: updatedUser.company_name,
      cv_file_path: updatedUser.cv_file_path,
      certificate_files: updatedUser.certificate_files,
      degree_files: updatedUser.degree_files,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at
    }});

  } catch (error) {
    console.error('Complete profile error:', error);
    res.status(500).json({ error: 'Internal server error', message: 'Could not complete profile' });
  }
});

// Change password endpoint
router.put('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere contraseña actual y nueva contraseña'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user || !user.password) {
      return res.status(400).json({
        success: false,
        message: 'No se puede cambiar la contraseña para este usuario'
      });
    }

    // Verify current password
    const bcrypt = require('bcrypt');
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'La contraseña actual es incorrecta'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    res.json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'No se pudo cambiar la contraseña'
    });
  }
});

// Verify email endpoint - Step 1: Check if email exists
router.post('/verify-email', async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona un correo electrónico válido'
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró una cuenta con este correo electrónico'
      });
    }

    res.json({
      success: true,
      message: 'Email verificado correctamente'
    });

  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'No se pudo verificar el correo electrónico'
    });
  }
});

// Reset password endpoint - Step 2: Update password directly
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Validation
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona un correo electrónico válido'
      });
    }

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 8 caracteres'
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró una cuenta con este correo electrónico'
      });
    }

    // Hash new password
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword
      }
    });

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'No se pudo actualizar la contraseña'
    });
  }
});

module.exports = router;
