const express = require('express');
const { User } = require('../models');
const { requireAuth, requireCompany } = require('../middleware/auth');
const { upload, handleMulterError, getFileUrl } = require('../middleware/upload');
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

    // Update user
    const updatedUser = await User.findOneAndUpdate(
      { id: req.user.id },
      { $set: value },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found in database'
      });
    }

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

// Upload CV
router.post('/cv', requireAuth, upload.single('cv'), handleMulterError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'CV file is required'
      });
    }

    const fileUrl = getFileUrl(req, req.file.path);

    // Update user's CV path
    const updatedUser = await User.findOneAndUpdate(
      { id: req.user.id },
      { $set: { cv_file_path: fileUrl } },
      { new: true }
    );

    res.json({
      message: 'CV uploaded successfully',
      cv_url: fileUrl,
      file_info: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size
      }
    });

  } catch (error) {
    console.error('CV upload error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while uploading CV'
    });
  }
});

// Upload certificates
router.post('/certificates', requireAuth, upload.array('certificate', 5), handleMulterError, async (req, res) => {
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

    // Add certificates to user's certificate_files array
    const updatedUser = await User.findOneAndUpdate(
      { id: req.user.id },
      { $push: { certificate_files: { $each: certificates } } },
      { new: true }
    );

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
router.post('/degrees', requireAuth, upload.array('degree', 5), handleMulterError, async (req, res) => {
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

    // Add degrees to user's degree_files array
    const updatedUser = await User.findOneAndUpdate(
      { id: req.user.id },
      { $push: { degree_files: { $each: degrees } } },
      { new: true }
    );

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
router.post('/company-document', requireCompany, upload.single('company_document'), handleMulterError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Company document file is required'
      });
    }

    const fileUrl = getFileUrl(req, req.file.path);

    // Update user's company document
    const updatedUser = await User.findOneAndUpdate(
      { id: req.user.id },
      { $set: { company_document: fileUrl } },
      { new: true }
    );

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

    const updatedUser = await User.findOneAndUpdate(
      { id: req.user.id },
      { $pull: { certificate_files: { id: certificateId } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found in database'
      });
    }

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

    const updatedUser = await User.findOneAndUpdate(
      { id: req.user.id },
      { $pull: { degree_files: { id: degreeId } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found in database'
      });
    }

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

module.exports = router;
