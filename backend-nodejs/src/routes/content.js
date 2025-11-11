const express = require('express');
const prisma = require('../config/prisma');
const { optionalAuth, requireAuth, requireCompany, requireStudent } = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Validation schemas
const eventSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  event_date: Joi.date().required(),
  location: Joi.string().required(),
  is_online: Joi.boolean().default(true),
  category: Joi.string().required(),
  url: Joi.string().uri().required(),
  image_url: Joi.string().uri().allow('', null)
});

const jobVacancySchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  requirements: Joi.array().items(Joi.string()).default([]),
  modality: Joi.string().valid('remoto', 'presencial', 'hibrido').required(),
  job_type: Joi.string().valid('practica', 'pasantia', 'junior', 'medio', 'senior').required(),
  seniority_level: Joi.string().required(),
  skills_stack: Joi.array().items(Joi.string()).default([]),
  city: Joi.string().allow('', null),
  country: Joi.string().default('Paraguay'),
  salary_range: Joi.string().allow('', null),
  apply_type: Joi.string().valid('interno', 'externo').required(),
  apply_url: Joi.string().uri().allow('', null),
  contact_whatsapp: Joi.string().allow('', null),
  knockout_questions: Joi.array().items(Joi.string()).default([])
});

const jobApplicationSchema = Joi.object({
  cover_letter: Joi.string().allow('', null),
  contact_info: Joi.object({
    phone: Joi.string().allow('', null),
    email: Joi.string().email().allow('', null),
    linkedin: Joi.string().uri().allow('', null),
    portfolio: Joi.string().uri().allow('', null)
  }).default({}),
  experience_summary: Joi.string().allow('', null),
  availability: Joi.string().valid('inmediata', '1_semana', '2_semanas', '1_mes', 'a_convenir').default('inmediata'),
  answers: Joi.object().default({}),
  additional_info: Joi.object({
    motivation: Joi.string().allow('', null),
    skills: Joi.string().allow('', null),
    salary_expectation: Joi.string().allow('', null)
  }).default({})
});

const savedItemSchema = Joi.object({
  item_id: Joi.string().required(),
  item_type: Joi.string().valid('course', 'event', 'job').required(),
  item_data: Joi.object().required()
});

// Public system settings (logos, etc.)
router.get('/settings/public', async (req, res) => {
  try {
    const settings = await prisma.systemSettings.findFirst();

    // If no settings exist yet, respond with nulls to avoid 404s
    const payload = settings ? {
      university_logo: settings.university_logo,
      faculty_logo: settings.faculty_logo,
      techhub_logo: settings.techhub_logo,
      updated_at: settings.updated_at
    } : {
      university_logo: null,
      faculty_logo: null,
      techhub_logo: null,
      updated_at: null
    };

    res.json({ success: true, data: payload });
  } catch (error) {
    console.error('Get public settings error:', error);
    res.status(500).json({ success: false, message: 'Error al obtener configuración pública' });
  }
});

// Get courses
router.get('/courses', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      language,
      is_free,
      search
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    // Apply filters
    if (category) where.category = category;
    if (language) where.language = language;
    if (is_free !== undefined) where.is_free = is_free === 'true';
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { provider: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.course.count({ where })
    ]);

    res.json({
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching courses'
    });
  }
});

// Get events
router.get('/events', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      is_online,
      upcoming,
      search
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    // Apply filters
    if (category) where.category = category;
    if (is_online !== undefined) where.is_online = is_online === 'true';
    if (upcoming === 'true') {
      where.event_date = { gte: new Date() };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { organizer: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { event_date: 'asc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.event.count({ where })
    ]);

    res.json({
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching events'
    });
  }
});

// Create event (only for companies)
router.post('/events', requireCompany, async (req, res) => {
  try {
    // Validate request body
    const { error, value } = eventSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        message: error.details[0].message
      });
    }

    // Get company name from user
    const company = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { name: true, company_name: true }
    });

    // Create event
    const event = await prisma.event.create({
      data: {
        ...value,
        organizer: company.company_name || company.name,
        event_date: new Date(value.event_date)
      }
    });

    res.status(201).json({
      message: 'Evento creado exitosamente',
      event
    });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Ocurrió un error al crear el evento'
    });
  }
});

// Get jobs
router.get('/jobs', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      modality,
      job_type,
      city,
      skills,
      search,
      company_id,
      posted_by_user_id
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = { is_active: true };

    // Apply filters
    if (modality) where.modality = modality;
    if (job_type) where.job_type = job_type;
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      where.requirements = { hasSome: skillsArray };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ];
    }
    // Filter by company (using posted_by_user_id for company filtering)
    if (company_id) where.posted_by_user_id = company_id;
    if (posted_by_user_id) where.posted_by_user_id = posted_by_user_id;

    const [jobs, total] = await Promise.all([
      prisma.jobVacancy.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.jobVacancy.count({ where })
    ]);

    res.json({
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching jobs'
    });
  }
});

// Create job (company only)
router.post('/jobs', requireCompany, async (req, res) => {
  try {
    const { error, value } = jobVacancySchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        message: error.details[0].message
      });
    }

    const jobVacancy = await prisma.jobVacancy.create({
      data: {
        title: value.title,
        description: value.description,
        company: req.user.company_name || req.user.name,
        location: value.city || value.country || 'Paraguay',
        city: value.city || null,
        job_type: value.job_type,
        modality: value.modality,
        salary_range: value.salary_range,
        requirements: value.requirements || [],
        responsibilities: value.skills_stack || [],
        apply_type: value.apply_type,
        external_url: value.apply_url,
        contact_whatsapp: value.contact_whatsapp,
        posted_by_user_id: req.user.id,
        category: 'Tecnología'
      }
    });

    res.status(201).json({
      message: 'Job vacancy created successfully',
      job: jobVacancy
    });

  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while creating job vacancy'
    });
  }
});

// Get specific job
router.get('/jobs/:jobId', optionalAuth, async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await prisma.jobVacancy.findUnique({
      where: { id: jobId },
      include: { posted_by: true }
    });

    if (!job || !job.is_active) {
      return res.status(404).json({
        error: 'Job not found',
        message: 'Job vacancy not found or no longer active'
      });
    }

    res.json({ job });

  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching job details'
    });
  }
});

// Apply to job (student only)
router.post('/jobs/:jobId/apply', requireStudent, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { error, value } = jobApplicationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        message: error.details[0].message
      });
    }

    // Check if job exists and is active
    const job = await prisma.jobVacancy.findUnique({
      where: { id: jobId }
    });

    if (!job || !job.is_active) {
      return res.status(404).json({
        error: 'Job not found',
        message: 'Job vacancy not found or no longer active'
      });
    }

    // Check if user already applied
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        job_vacancy_id_applicant_id: {
          job_vacancy_id: jobId,
          applicant_id: req.user.id
        }
      }
    });

    if (existingApplication) {
      return res.status(409).json({
        error: 'Already applied',
        message: 'You have already applied to this job'
      });
    }

    const application = await prisma.jobApplication.create({
      data: {
        job_vacancy_id: jobId,
        applicant_id: req.user.id,
        cover_letter: value.cover_letter,
        contact_info: value.contact_info || {},
        experience_summary: value.experience_summary,
        availability: value.availability || 'inmediata',
        additional_info: value.additional_info || {}
      }
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application: {
        id: application.id,
        job_vacancy_id: application.job_vacancy_id,
        status: application.status,
        created_at: application.created_at
      }
    });

  } catch (error) {
    console.error('Job application error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while submitting application'
    });
  }
});

// Get company applications (company only)
router.get('/company/applications', requireCompany, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      job_id
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {
      job_vacancy: {
        posted_by_user_id: req.user.id
      }
    };

    if (status) where.status = status;
    if (job_id) where.job_vacancy_id = job_id;

    const [applications, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        include: {
          job_vacancy: true,
          applicant: true
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.jobApplication.count({ where })
    ]);

    res.json({
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get company applications error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching applications'
    });
  }
});

// Update application status (company only)
router.put('/company/applications/:applicationId/status', requireCompany, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!status || !['nuevo', 'en_revision', 'entrevista', 'oferta', 'rechazado'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be one of: nuevo, en_revision, entrevista, oferta, rechazado'
      });
    }

    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: { job_vacancy: true }
    });

    if (!application) {
      return res.status(404).json({
        error: 'Application not found',
        message: 'Application not found'
      });
    }

    // Verify this application belongs to a job from this company
    if (application.job_vacancy.posted_by_user_id !== req.user.id) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update applications for your own job postings'
      });
    }

    const updatedApplication = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status }
    });

    res.json({
      message: 'Application status updated successfully',
      application: updatedApplication
    });

  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while updating application status'
    });
  }
});

// Get company jobs (company only)
router.get('/company/jobs', requireCompany, async (req, res) => {
  try {
    const jobs = await prisma.jobVacancy.findMany({
      where: {
        posted_by_user_id: req.user.id
      },
      orderBy: { created_at: 'desc' },
      include: {
        _count: {
          select: {
            applications: true
          }
        }
      }
    });

    res.json({
      jobs: jobs.map(job => ({
        id: job.id,
        title: job.title,
        description: job.description,
        location: job.location,
        city: job.city,
        job_type: job.job_type,
        modality: job.modality,
        is_active: job.is_active,
        created_at: job.created_at,
        applications_count: job._count.applications
      }))
    });

  } catch (error) {
    console.error('Get company jobs error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching company jobs'
    });
  }
});

// Update job status (company only)
router.put('/company/jobs/:jobId/status', requireCompany, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== 'boolean') {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'is_active must be a boolean value'
      });
    }

    const job = await prisma.jobVacancy.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({
        error: 'Job not found',
        message: 'Job vacancy not found'
      });
    }

    // Verify this job belongs to this company
    if (job.posted_by_user_id !== req.user.id) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update your own job postings'
      });
    }

    const updatedJob = await prisma.jobVacancy.update({
      where: { id: jobId },
      data: { is_active }
    });

    res.json({
      message: 'Job status updated successfully',
      job: {
        id: updatedJob.id,
        title: updatedJob.title,
        is_active: updatedJob.is_active
      }
    });

  } catch (error) {
    console.error('Update job status error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while updating job status'
    });
  }
});

// Get student applications (student only)
router.get('/student/applications', requireStudent, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {
      applicant_id: req.user.id
    };

    if (status) where.status = status;

    const [applications, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        include: {
          job_vacancy: {
            select: {
              id: true,
              title: true,
              company: true,
              location: true,
              city: true,
              job_type: true,
              modality: true,
              description: true,
              created_at: true
            }
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.jobApplication.count({ where })
    ]);

    res.json({
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get student applications error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching applications'
    });
  }
});

// Get all companies
router.get('/companies', async (req, res) => {
  try {
    const companies = await prisma.user.findMany({
      where: {
        role: 'empresa'
      },
      select: {
        id: true,
        email: true,
        name: true,
        company_name: true,
        industry: true,
        city: true,
        country: true,
        address: true,
        phone: true,
        website: true,
        bio: true,
        company_size: true,
        benefits: true,
        created_at: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Obtener el conteo de vacantes activas para cada empresa
    const companiesWithJobCount = await Promise.all(
      companies.map(async (company) => {
        const jobCount = await prisma.jobVacancy.count({
          where: {
            posted_by_user_id: company.id,
            is_active: true
          }
        });
        
        return {
          ...company,
          openPositions: jobCount
        };
      })
    );

    res.json({
      success: true,
      companies: companiesWithJobCount
    });

  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching companies'
    });
  }
});

// ============================================
// NEWS/NOTICIAS ROUTES
// ============================================

// Get all news (public endpoint)
router.get('/news', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      search
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = { is_published: true };

    // Apply filters
    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { published_at: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.news.count({ where })
    ]);

    res.json({
      success: true,
      news,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching news'
    });
  }
});

// Get single news by ID (public endpoint)
router.get('/news/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const news = await prisma.news.findUnique({
      where: { id }
    });

    if (!news) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Noticia no encontrada'
      });
    }

    res.json({
      success: true,
      news
    });

  } catch (error) {
    console.error('Get news by ID error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching news'
    });
  }
});

module.exports = router;
