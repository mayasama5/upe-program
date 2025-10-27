const prisma = require('../config/prisma');

// Middleware para verificar el modo de mantenimiento
const checkMaintenance = async (req, res, next) => {
  try {
    // Permitir acceso a rutas de admin y auth sin restricción
    if (req.path.startsWith('/api/admin') || req.path.startsWith('/api/auth')) {
      return next();
    }

    // Verificar si el modo de mantenimiento está activado
    const settings = await prisma.systemSettings.findFirst();

    if (settings && settings.maintenance_mode) {
      return res.status(503).json({
        success: false,
        maintenance: true,
        message: settings.maintenance_message || 'El sistema está en mantenimiento. Volveremos pronto.'
      });
    }

    next();
  } catch (error) {
    console.error('Error checking maintenance mode:', error);
    // En caso de error, permitir acceso
    next();
  }
};

module.exports = { checkMaintenance };
