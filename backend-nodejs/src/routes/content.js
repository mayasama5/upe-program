const express = require('express');
const prisma = require('../config/prisma');
const { optionalAuth, requireAuth, requireCompany, requireStudent } = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Validation schemas
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
  apply_url: Joi.string().uri().when('apply_type', {
    is: 'externo',
    then: Joi.required(),
    otherwise: Joi.allow('', null)
  }),
  knockout_questions: Joi.array().items(Joi.string()).default([])
});

const jobApplicationSchema = Joi.object({
  cover_letter: Joi.string().allow('', null),
  answers: Joi.object().default({})
});

const savedItemSchema = Joi.object({
  item_id: Joi.string().required(),
  item_type: Joi.string().valid('course', 'event', 'job').required(),
  item_data: Joi.object().required()
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
      search
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = { is_active: true };

    // Apply filters
    if (modality) where.modality = modality;
    if (job_type) where.job_type = job_type;
    if (city) where.location = { contains: city, mode: 'insensitive' };
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
        job_type: value.job_type,
        modality: value.modality,
        salary_range: value.salary_range,
        requirements: value.requirements || [],
        responsibilities: value.skills_stack || [],
        apply_type: value.apply_type,
        external_url: value.apply_url,
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
        cover_letter: value.cover_letter
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

module.exports = router;
