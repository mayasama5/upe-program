const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { createLimiter } = require('../middleware/security');
const {
  createUserDTO,
  updateUserDTO,
  listUsersDTO,
  userIdDTO,
  validate
} = require('../dto/user.dto');
const {
  createCourseDTO,
  updateCourseDTO,
  createEventDTO,
  updateEventDTO,
  createJobDTO,
  updateJobDTO,
  createNewsDTO,
  updateNewsDTO,
  contentIdDTO
} = require('../dto/content.dto');
const {
  createNotificationDTO
} = require('../dto/notification.dto');

// Aplicar autenticación y permisos de admin a todas las rutas
router.use(requireAdmin);

// Endpoint para poblar la base de datos en producción
router.post('/populate', async (req, res) => {
  try {
    console.log('Iniciando población de base de datos...');

    // Solo permitir en production o con un token específico
    if (process.env.NODE_ENV !== 'production' && !req.headers['x-admin-token']) {
      return res.status(403).json({
        error: 'No autorizado',
        message: 'Este endpoint solo está disponible en producción o con token de admin'
      });
    }

    // Limpiar datos existentes
    console.log('Limpiando datos existentes...');
    await prisma.course.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.jobVacancy.deleteMany({});

    // Cursos de ejemplo
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
    const futureDate1 = new Date();
    futureDate1.setDate(futureDate1.getDate() + 7);

    const futureDate2 = new Date();
    futureDate2.setDate(futureDate2.getDate() + 14);

    const events = [
      {
        title: "Tech Talk: Futuro de la IA",
        description: "Conferencia sobre las últimas tendencias en inteligencia artificial.",
        organizer: "Tech Community",
        url: "https://example.com/register",
        event_date: futureDate1,
        location: "Virtual",
        is_online: true,
        category: "Tecnología",
        image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop"
      },
      {
        title: "Workshop: Desarrollo Web Moderno",
        description: "Taller práctico de desarrollo web con React y Node.js.",
        organizer: "Departamento de Ciencias de la Computación",
        url: "https://example.com/workshop",
        event_date: futureDate2,
        location: "Asunción, Paraguay",
        is_online: false,
        category: "Tecnología",
        image_url: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=250&fit=crop"
      }
    ];

    // Vacantes de ejemplo
    const jobs = [
      {
        title: "Desarrollador Full Stack",
        company: "TechCorp",
        location: "Asunción, Paraguay",
        salary_range: "Gs. 5.000.000 - 8.000.000",
        job_type: "junior",
        modality: "presencial",
        description: "Buscamos desarrollador full stack con experiencia en React y Node.js.",
        requirements: ["JavaScript", "React", "Node.js", "PostgreSQL"],
        responsibilities: ["Desarrollo de aplicaciones web", "Mantenimiento de código"],
        benefits: ["Seguro médico", "Vacaciones pagadas"],
        apply_type: "externo",
        external_url: "https://example.com/apply",
        is_active: true,
        category: "Tecnología"
      },
      {
        title: "Analista de Datos",
        company: "DataCorp",
        location: "Remoto",
        salary_range: "Gs. 6.000.000 - 10.000.000",
        job_type: "medio",
        modality: "remoto",
        description: "Analista de datos con experiencia en Python y machine learning.",
        requirements: ["Python", "SQL", "Machine Learning", "Tableau"],
        responsibilities: ["Análisis de datos", "Creación de reportes"],
        benefits: ["Trabajo remoto", "Horarios flexibles"],
        apply_type: "externo",
        external_url: "https://example.com/data-analyst",
        is_active: true,
        category: "Tecnología"
      }
    ];

    // Insertar datos
    console.log('Insertando cursos...');
    await prisma.course.createMany({ data: courses });

    console.log('Insertando eventos...');
    await prisma.event.createMany({ data: events });

    console.log('Insertando vacantes...');
    await prisma.jobVacancy.createMany({ data: jobs });

    const stats = {
      courses: await prisma.course.count(),
      events: await prisma.event.count(),
      jobs: await prisma.jobVacancy.count()
    };

    console.log('Base de datos poblada exitosamente:', stats);

    res.status(200).json({
      success: true,
      message: 'Base de datos poblada exitosamente',
      stats
    });

  } catch (error) {
    console.error('Error poblando la base de datos:', error);
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
      courses: await prisma.course.count(),
      events: await prisma.event.count(),
      jobs: await prisma.jobVacancy.count(),
      users: await prisma.user.count()
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

// ============================================
// GESTIÓN DE USUARIOS
// ============================================

// GET /api/admin/users - Listar todos los usuarios
router.get('/users', listUsersDTO, validate, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', role = '' } = req.query;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          is_verified: true,
          created_at: true,
          picture: true
        }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
  }
});

// PUT /api/admin/users/:id - Actualizar usuario
router.put('/users/:id', updateUserDTO, validate, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, is_verified } = req.body;

    const updateData = {};
    if (role) updateData.role = role;
    if (typeof is_verified !== 'undefined') updateData.is_verified = is_verified;
    updateData.updated_at = new Date();

    const user = await prisma.user.update({
      where: { id },
      data: updateData
    });

    res.json({ success: true, message: 'Usuario actualizado correctamente', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar usuario' });
  }
});

// DELETE /api/admin/users/:id - Eliminar usuario
router.delete('/users/:id', userIdDTO, validate, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar usuario' });
  }
});

// ============================================
// GESTIÓN DE CONTENIDO - CURSOS
// ============================================

router.get('/content/courses', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener cursos' });
  }
});

router.post('/content/courses', createLimiter, createCourseDTO, validate, async (req, res) => {
  try {
    const course = await prisma.course.create({
      data: req.body
    });
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear curso' });
  }
});

router.put('/content/courses/:id', updateCourseDTO, validate, async (req, res) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.update({
      where: { id },
      data: { ...req.body, updated_at: new Date() }
    });
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar curso' });
  }
});

router.delete('/content/courses/:id', contentIdDTO, validate, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.course.delete({ where: { id } });
    res.json({ success: true, message: 'Curso eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar curso' });
  }
});

// ============================================
// GESTIÓN DE CONTENIDO - EVENTOS
// ============================================

router.get('/content/events', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { event_date: 'desc' }
    });
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener eventos' });
  }
});

router.post('/content/events', createLimiter, createEventDTO, validate, async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      event_date: new Date(req.body.event_date)
    };

    const event = await prisma.event.create({
      data: eventData
    });
    res.json({ success: true, event });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ success: false, message: 'Error al crear evento', error: error.message });
  }
});

router.put('/content/events/:id', updateEventDTO, validate, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Convert event_date to Date if it exists
    if (updateData.event_date) {
      updateData.event_date = new Date(updateData.event_date);
    }

    const event = await prisma.event.update({
      where: { id },
      data: updateData
    });
    res.json({ success: true, event });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar evento', error: error.message });
  }
});

router.delete('/content/events/:id', contentIdDTO, validate, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.event.delete({ where: { id } });
    res.json({ success: true, message: 'Evento eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar evento' });
  }
});

// ============================================
// GESTIÓN DE CONTENIDO - VACANTES
// ============================================

router.get('/content/jobs', async (req, res) => {
  try {
    const jobs = await prisma.jobVacancy.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener vacantes' });
  }
});

router.post('/content/jobs', createLimiter, createJobDTO, validate, async (req, res) => {
  try {
    const job = await prisma.jobVacancy.create({
      data: req.body
    });
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear vacante' });
  }
});

router.put('/content/jobs/:id', updateJobDTO, validate, async (req, res) => {
  try {
    const { id } = req.params;
    const job = await prisma.jobVacancy.update({
      where: { id },
      data: { ...req.body, updated_at: new Date() }
    });
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar vacante' });
  }
});

router.delete('/content/jobs/:id', contentIdDTO, validate, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.jobVacancy.delete({ where: { id } });
    res.json({ success: true, message: 'Vacante eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar vacante' });
  }
});

// ============================================
// GESTIÓN DE CONTENIDO - NOTICIAS
// ============================================

router.get('/content/news', async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { published_at: 'desc' }
    });
    res.json({ success: true, news });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener noticias' });
  }
});

router.post('/content/news', createLimiter, createNewsDTO, validate, async (req, res) => {
  try {
    console.log('📰 Creating news with data:', JSON.stringify(req.body, null, 2));

    const news = await prisma.news.create({
      data: req.body
    });

    console.log('✅ News created successfully:', news.id);
    res.json({ success: true, news });
  } catch (error) {
    console.error('❌ Error creating news:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear noticia',
      error: error.message
    });
  }
});

router.put('/content/news/:id', updateNewsDTO, validate, async (req, res) => {
  try {
    const { id } = req.params;
    const news = await prisma.news.update({
      where: { id },
      data: { ...req.body, updated_at: new Date() }
    });
    res.json({ success: true, news });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar noticia' });
  }
});

router.delete('/content/news/:id', contentIdDTO, validate, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.news.delete({ where: { id } });
    res.json({ success: true, message: 'Noticia eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar noticia' });
  }
});

// ============================================
// ANALYTICS
// ============================================

router.get('/analytics', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Usuarios por rol
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: true
    });

    // Actividad de guardados por tipo
    const savedItemsActivity = await prisma.savedItem.groupBy({
      by: ['item_type'],
      _count: true
    });

    // Crecimiento de usuarios (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const userGrowth = await prisma.user.groupBy({
      by: ['created_at'],
      where: {
        created_at: {
          gte: sixMonthsAgo
        }
      },
      _count: true
    });

    // ===== NUEVOS DATOS PARA RESUMEN DE ACTIVIDAD (30 días) =====

    // Nuevos usuarios en últimos 30 días
    const newUsersLast30Days = await prisma.user.count({
      where: {
        created_at: {
          gte: thirtyDaysAgo
        }
      }
    });

    // Nuevos usuarios en 30 días anteriores (para calcular porcentaje)
    const newUsersPrevious30Days = await prisma.user.count({
      where: {
        created_at: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo
        }
      }
    });

    // Cursos guardados en últimos 30 días
    const coursesLast30Days = await prisma.savedItem.count({
      where: {
        item_type: 'course',
        created_at: {
          gte: thirtyDaysAgo
        }
      }
    });

    const coursesPrevious30Days = await prisma.savedItem.count({
      where: {
        item_type: 'course',
        created_at: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo
        }
      }
    });

    // Eventos registrados en últimos 30 días
    const eventsLast30Days = await prisma.savedItem.count({
      where: {
        item_type: 'event',
        created_at: {
          gte: thirtyDaysAgo
        }
      }
    });

    const eventsPrevious30Days = await prisma.savedItem.count({
      where: {
        item_type: 'event',
        created_at: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo
        }
      }
    });

    // Aplicaciones enviadas en últimos 30 días
    const applicationsLast30Days = await prisma.jobApplication.count({
      where: {
        created_at: {
          gte: thirtyDaysAgo
        }
      }
    });

    const applicationsPrevious30Days = await prisma.jobApplication.count({
      where: {
        created_at: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo
        }
      }
    });

    // Calcular porcentajes de crecimiento
    const calculateGrowthPercentage = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const activitySummary = {
      newUsers: {
        count: newUsersLast30Days,
        percentage: calculateGrowthPercentage(newUsersLast30Days, newUsersPrevious30Days)
      },
      savedCourses: {
        count: coursesLast30Days,
        percentage: calculateGrowthPercentage(coursesLast30Days, coursesPrevious30Days)
      },
      registeredEvents: {
        count: eventsLast30Days,
        percentage: calculateGrowthPercentage(eventsLast30Days, eventsPrevious30Days)
      },
      applications: {
        count: applicationsLast30Days,
        percentage: calculateGrowthPercentage(applicationsLast30Days, applicationsPrevious30Days)
      }
    };

    res.json({
      success: true,
      analytics: {
        usersByRole,
        savedItemsActivity,
        userGrowth,
        activitySummary
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, message: 'Error al obtener analytics' });
  }
});

// ============================================
// REPORTES
// ============================================

router.get('/reports/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_verified: true,
        created_at: true
      }
    });

    const reportData = users.map(u => ({
      ID: u.id,
      Nombre: u.name,
      Email: u.email,
      Rol: u.role,
      Verificado: u.is_verified ? 'Sí' : 'No',
      'Fecha de Registro': u.created_at.toISOString().split('T')[0]
    }));

    res.json({ success: true, data: reportData });
  } catch (error) {
    console.error('Error generating users report:', error);
    res.status(500).json({ success: false, message: 'Error al generar reporte', error: error.message });
  }
});

router.get('/reports/courses', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: { saved_items: true }
        }
      }
    });

    const reportData = courses.map(c => ({
      ID: c.id,
      Título: c.title,
      Proveedor: c.provider,
      Categoría: c.category,
      Gratis: c.is_free ? 'Sí' : 'No',
      'Veces Guardado': c._count.saved_items,
      'Fecha Creación': c.created_at.toISOString().split('T')[0]
    }));

    res.json({ success: true, data: reportData });
  } catch (error) {
    console.error('Error generating courses report:', error);
    res.status(500).json({ success: false, message: 'Error al generar reporte', error: error.message });
  }
});

router.get('/reports/events', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        _count: {
          select: { saved_items: true }
        }
      }
    });

    const reportData = events.map(e => ({
      ID: e.id,
      Título: e.title,
      Organizador: e.organizer,
      Fecha: e.event_date.toISOString().split('T')[0],
      Ubicación: e.location,
      Tipo: e.is_online ? 'Virtual' : 'Presencial',
      Registrados: e._count.saved_items
    }));

    res.json({ success: true, data: reportData });
  } catch (error) {
    console.error('Error generating events report:', error);
    res.status(500).json({ success: false, message: 'Error al generar reporte', error: error.message });
  }
});

router.get('/reports/jobs', async (req, res) => {
  try {
    const jobs = await prisma.jobVacancy.findMany({
      include: {
        _count: {
          select: { saved_items: true }
        }
      }
    });

    const reportData = jobs.map(j => ({
      ID: j.id,
      Título: j.title,
      Empresa: j.company,
      Ubicación: j.location,
      Tipo: j.job_type,
      Modalidad: j.modality,
      Aplicaciones: j._count.saved_items,
      Estado: j.is_active ? 'Activa' : 'Inactiva'
    }));

    res.json({ success: true, data: reportData });
  } catch (error) {
    console.error('Error generating jobs report:', error);
    res.status(500).json({ success: false, message: 'Error al generar reporte', error: error.message });
  }
});

router.get('/reports/activity', async (req, res) => {
  try {
    // Obtener actividad de los últimos 30 días
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Agrupar por fecha
    const savedItems = await prisma.savedItem.findMany({
      where: {
        created_at: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        created_at: true,
        item_type: true
      }
    });

    // Procesar datos por día
    const activityByDate = {};
    savedItems.forEach(item => {
      const date = item.created_at.toISOString().split('T')[0];
      if (!activityByDate[date]) {
        activityByDate[date] = {
          Fecha: date,
          'Usuarios Activos': 0,
          'Cursos Vistos': 0,
          'Eventos Registrados': 0,
          'Aplicaciones Enviadas': 0
        };
      }

      if (item.item_type === 'course') activityByDate[date]['Cursos Vistos']++;
      if (item.item_type === 'event') activityByDate[date]['Eventos Registrados']++;
      if (item.item_type === 'job') activityByDate[date]['Aplicaciones Enviadas']++;
    });

    const reportData = Object.values(activityByDate);

    res.json({ success: true, data: reportData });
  } catch (error) {
    console.error('Error generating activity report:', error);
    res.status(500).json({ success: false, message: 'Error al generar reporte', error: error.message });
  }
});

// ============================================
// CONFIGURACIÓN DEL SISTEMA
// ============================================

// Obtener configuración del sistema
router.get('/settings', async (req, res) => {
  try {
    let settings = await prisma.systemSettings.findFirst();

    // Si no existe configuración, crear una por defecto
    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          maintenance_mode: false,
          maintenance_message: 'El sistema está en mantenimiento. Volveremos pronto.'
        }
      });
    }

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching system settings:', error);
    res.status(500).json({ success: false, message: 'Error al obtener configuración', error: error.message });
  }
});

// Actualizar modo de mantenimiento
router.patch('/settings/maintenance', async (req, res) => {
  try {
    const { maintenance_mode, maintenance_message } = req.body;

    let settings = await prisma.systemSettings.findFirst();

    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          maintenance_mode: maintenance_mode || false,
          maintenance_message: maintenance_message || 'El sistema está en mantenimiento. Volveremos pronto.'
        }
      });
    } else {
      settings = await prisma.systemSettings.update({
        where: { id: settings.id },
        data: {
          maintenance_mode: maintenance_mode !== undefined ? maintenance_mode : settings.maintenance_mode,
          maintenance_message: maintenance_message || settings.maintenance_message
        }
      });
    }

    res.json({
      success: true,
      data: settings,
      message: `Modo de mantenimiento ${maintenance_mode ? 'activado' : 'desactivado'}`
    });
  } catch (error) {
    console.error('Error updating maintenance mode:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar modo de mantenimiento', error: error.message });
  }
});

// ============================================
// NOTIFICACIONES
// ============================================

router.get('/notifications', async (req, res) => {
  try {
    // Por ahora devolvemos notificaciones mock
    // En producción, esto vendría de una tabla de notificaciones
    const notifications = [
      {
        id: '1',
        title: 'Sistema iniciado',
        message: 'El sistema ha sido iniciado correctamente',
        type: 'info',
        created_at: new Date().toISOString(),
        read: false
      }
    ];

    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener notificaciones' });
  }
});

router.post('/notifications', createNotificationDTO, validate, async (req, res) => {
  try {
    const { title, message, type, target_users } = req.body;

    // Aquí podrías guardar la notificación en una tabla
    // Y enviarla a través de WebSockets o push notifications

    const notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      target_users,
      created_at: new Date().toISOString(),
      read: false
    };

    res.json({
      success: true,
      message: 'Notificación enviada correctamente',
      notification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al enviar notificación' });
  }
});

// ============================================
// LOGS DEL SISTEMA
// ============================================

router.get('/logs', async (req, res) => {
  try {
    const { level, type, limit = 50 } = req.query;

    // Aquí deberías tener una tabla de logs
    // Por ahora devolvemos logs mock basados en actividad reciente

    const logs = [];

    // Obtener actividad reciente de usuarios
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      select: { email: true, created_at: true }
    });

    recentUsers.forEach(user => {
      logs.push({
        id: `user-${user.email}`,
        type: 'auth',
        message: `Usuario ${user.email} registrado en el sistema`,
        timestamp: user.created_at.toISOString(),
        level: 'info'
      });
    });

    // Obtener cursos recientes
    const recentCourses = await prisma.course.findMany({
      take: 3,
      orderBy: { created_at: 'desc' },
      select: { title: true, created_at: true }
    });

    recentCourses.forEach(course => {
      logs.push({
        id: `course-${course.title}`,
        type: 'data',
        message: `Nuevo curso agregado: ${course.title}`,
        timestamp: course.created_at.toISOString(),
        level: 'info'
      });
    });

    // Ordenar por fecha
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ success: true, logs: logs.slice(0, parseInt(limit)) });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ success: false, message: 'Error al obtener logs' });
  }
});

// ============================================
// ESTADÍSTICAS MEJORADAS
// ============================================

router.get('/dashboard-stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalCourses,
      totalEvents,
      totalJobs,
      recentUsers,
      activeSavedItems
    ] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.event.count(),
      prisma.jobVacancy.count(),
      prisma.user.count({
        where: {
          created_at: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Últimos 30 días
          }
        }
      }),
      prisma.savedItem.count({
        where: {
          created_at: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Última semana
          }
        }
      })
    ]);

    const stats = {
      totalUsers,
      totalCourses,
      totalEvents,
      totalJobs,
      activeUsers: recentUsers,
      pendingApplications: activeSavedItems
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Error al obtener estadísticas' });
  }
});

// Get all users for admin management
router.get('/users', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        company_name: true,
        industry: true,
        career: true,
        city: true,
        location: true,
        phone: true,
        created_at: true,
        updated_at: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
  }
});

// Get specific user details by ID
router.get('/users/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        company_name: true,
        industry: true,
        career: true,
        university: true,
        graduation_year: true,
        city: true,
        location: true,
        phone: true,
        website: true,
        description: true,
        skills: true,
        company_size: true,
        created_at: true,
        updated_at: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Error al obtener usuario' });
  }
});

// Get student applications by user ID
router.get('/users/:id/applications', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const applications = await prisma.job_application.findMany({
      where: { applicant_id: id },
      include: {
        job_vacancy: {
          select: {
            title: true,
            company: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Transform the data to include job details
    const formattedApplications = applications.map(app => ({
      ...app,
      job_title: app.job_vacancy?.title,
      company_name: app.job_vacancy?.company
    }));

    res.json({ success: true, applications: formattedApplications });
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({ success: false, message: 'Error al obtener postulaciones del usuario' });
  }
});

// Get company jobs by company ID
router.get('/companies/:id/jobs', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const jobs = await prisma.job_vacancy.findMany({
      where: { created_by: id },
      orderBy: {
        created_at: 'desc'
      }
    });

    res.json({ success: true, jobs });
  } catch (error) {
    console.error('Error fetching company jobs:', error);
    res.status(500).json({ success: false, message: 'Error al obtener trabajos de la empresa' });
  }
});

// Get applications for company jobs
router.get('/companies/:id/applications', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // First get all jobs from this company
    const companyJobs = await prisma.job_vacancy.findMany({
      where: { created_by: id },
      select: { id: true }
    });

    const jobIds = companyJobs.map(job => job.id);

    if (jobIds.length === 0) {
      return res.json({ success: true, applications: [] });
    }

    // Get all applications for these jobs
    const applications = await prisma.job_application.findMany({
      where: {
        job_vacancy_id: {
          in: jobIds
        }
      },
      include: {
        job_vacancy: {
          select: {
            title: true
          }
        },
        applicant: {
          select: {
            first_name: true,
            last_name: true,
            email: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Transform the data
    const formattedApplications = applications.map(app => ({
      ...app,
      job_title: app.job_vacancy?.title,
      applicant_name: `${app.applicant?.first_name || ''} ${app.applicant?.last_name || ''}`.trim()
    }));

    res.json({ success: true, applications: formattedApplications });
  } catch (error) {
    console.error('Error fetching company applications:', error);
    res.status(500).json({ success: false, message: 'Error al obtener postulaciones de la empresa' });
  }
});

module.exports = router;
