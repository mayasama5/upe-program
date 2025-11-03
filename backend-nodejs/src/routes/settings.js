const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

/**
 * GET /api/settings/public
 * Get public system settings (logos, etc.)
 * No authentication required
 */
router.get('/public', async (req, res) => {
  try {
    let settings = await prisma.systemSettings.findFirst({
      select: {
        university_logo: true,
        faculty_logo: true,
        techhub_logo: true,
        updated_at: true
      }
    });

    // If no settings exist, create default
    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          maintenance_mode: false,
          maintenance_message: 'El sistema está en mantenimiento. Volveremos pronto.'
        },
        select: {
          university_logo: true,
          faculty_logo: true,
          techhub_logo: true,
          updated_at: true
        }
      });
    }

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener configuración pública',
      error: error.message
    });
  }
});

module.exports = router;
