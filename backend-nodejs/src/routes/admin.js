const express = require('express');
const router = express.Router();
const { Course, Event, JobVacancy, User } = require('../models');

// Endpoint para poblar la base de datos en producción
router.post('/populate', async (req, res) => {
  try {
    console.log('📡 Iniciando población de base de datos...');

    // Solo permitir en production o con un token específico
    if (process.env.NODE_ENV !== 'production' && !req.headers['x-admin-token']) {
      return res.status(403).json({ 
        error: 'No autorizado',
        message: 'Este endpoint solo está disponible en producción o con token de admin'
      });
    }

    // Limpiar datos existentes
    console.log('🗑️ Limpiando datos existentes...');
    await Course.deleteMany({});
    await Event.deleteMany({});
    await JobVacancy.deleteMany({});

    // Cursos de ejemplo (datos reducidos para el endpoint)
    const courses = [
      {
        title: "Desarrollo Web Full Stack con JavaScript",
        description: "Aprende HTML, CSS, JavaScript, React y Node.js desde cero hasta convertirte en desarrollador full stack.",
        provider: "freeCodeCamp Español",
        url: "https://www.freecodecamp.org/espanol/learn/responsive-web-design/",
        language: "es",
        has_spanish_subtitles: true,
        category: "Tecnología",
        is_free: true,
        image_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop"
      },
      {
        title: "Google Cloud Platform Fundamentals",
        description: "Fundamentos de computación en la nube con Google Cloud Platform.",
        provider: "Google Actívate",
        url: "https://grow.google/intl/es/courses-and-tools/",
        language: "es",
        has_spanish_subtitles: true,
        category: "Tecnología",
        is_free: true,
        image_url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=250&fit=crop"
      },
      {
        title: "Inteligencia Artificial para Todos",
        description: "Introducción práctica a la IA y Machine Learning con Python.",
        provider: "IBM SkillsBuild",
        url: "https://skillsbuild.org/es/",
        language: "es",
        has_spanish_subtitles: true,
        category: "Tecnología",
        is_free: true,
        image_url: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&h=250&fit=crop"
      }
    ];

    // Eventos de ejemplo
    const events = [
      {
        title: "Tech Talk: Futuro de la IA",
        description: "Conferencia sobre las últimas tendencias en inteligencia artificial.",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        location: "Virtual",
        organizer: "Tech Community",
        is_free: true,
        registration_url: "https://example.com/register",
        image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop"
      },
      {
        title: "Workshop: Desarrollo Web Moderno",
        description: "Taller práctico de desarrollo web con React y Node.js.",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        location: "USAC, Guatemala",
        organizer: "Departamento de Ciencias de la Computación",
        is_free: true,
        registration_url: "https://example.com/workshop",
        image_url: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=250&fit=crop"
      }
    ];

    // Vacantes de ejemplo
    const jobs = [
      {
        title: "Desarrollador Full Stack",
        company: "TechCorp",
        location: "Guatemala City",
        salary_range: "Q15,000 - Q25,000",
        job_type: "full-time",
        description: "Buscamos desarrollador full stack con experiencia en React y Node.js.",
        requirements: ["JavaScript", "React", "Node.js", "MongoDB"],
        is_remote: false,
        application_url: "https://example.com/apply",
        image_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop"
      },
      {
        title: "Analista de Datos",
        company: "DataCorp",
        location: "Remoto",
        salary_range: "Q18,000 - Q30,000",
        job_type: "full-time",
        description: "Analista de datos con experiencia en Python y machine learning.",
        requirements: ["Python", "SQL", "Machine Learning", "Tableau"],
        is_remote: true,
        application_url: "https://example.com/data-analyst",
        image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop"
      }
    ];

    // Insertar datos
    console.log('📚 Insertando cursos...');
    await Course.insertMany(courses);
    
    console.log('📅 Insertando eventos...');
    await Event.insertMany(events);
    
    console.log('💼 Insertando vacantes...');
    await JobVacancy.insertMany(jobs);

    const stats = {
      courses: await Course.countDocuments(),
      events: await Event.countDocuments(),
      jobs: await JobVacancy.countDocuments()
    };

    console.log('✅ Base de datos poblada exitosamente:', stats);

    res.status(200).json({
      success: true,
      message: 'Base de datos poblada exitosamente',
      stats
    });

  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// Endpoint para obtener estadísticas
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      courses: await Course.countDocuments(),
      events: await Event.countDocuments(),
      jobs: await JobVacancy.countDocuments(),
      users: await User.countDocuments()
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
