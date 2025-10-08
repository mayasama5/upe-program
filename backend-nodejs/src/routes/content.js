const express = require('express');
const { Course, Event, JobVacancy, SavedItem, JobApplication, User } = require('../models');
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
    const query = {};

    // Apply filters
    if (category) query.category = category;
    if (language) query.language = language;
    if (is_free !== undefined) query.is_free = is_free === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { provider: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Course.countDocuments(query);

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
    const query = {};

    // Apply filters
    if (category) query.category = category;
    if (is_online !== undefined) query.is_online = is_online === 'true';
    if (upcoming === 'true') {
      query.event_date = { $gte: new Date() };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(query)
      .sort({ event_date: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(query);

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
    const query = { is_active: true };

    // Apply filters
    if (modality) query.modality = modality;
    if (job_type) query.job_type = job_type;
    if (city) query.city = { $regex: city, $options: 'i' };
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      query.skills_stack = { $in: skillsArray };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { company_name: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await JobVacancy.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await JobVacancy.countDocuments(query);

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

    const jobVacancy = new JobVacancy({
      ...value,
      company_id: req.user.id,
      company_name: req.user.company_name || req.user.name
    });

    await jobVacancy.save();

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

    const job = await JobVacancy.findOne({ id: jobId, is_active: true });

    if (!job) {
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
    const job = await JobVacancy.findOne({ id: jobId, is_active: true });
    if (!job) {
      return res.status(404).json({
        error: 'Job not found',
        message: 'Job vacancy not found or no longer active'
      });
    }

    // Check if user already applied
    const existingApplication = await JobApplication.findOne({
      job_id: jobId,
      student_id: req.user.id
    });

    if (existingApplication) {
      return res.status(409).json({
        error: 'Already applied',
        message: 'You have already applied to this job'
      });
    }

    const application = new JobApplication({
      job_id: jobId,
      student_id: req.user.id,
      student_name: req.user.name,
      student_email: req.user.email,
      cv_url: req.user.cv_file_path,
      cover_letter: value.cover_letter,
      answers: value.answers
    });

    await application.save();

    res.status(201).json({
      message: 'Application submitted successfully',
      application: {
        id: application.id,
        job_id: application.job_id,
        status: application.status,
        applied_at: application.applied_at
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
    
    // First get all jobs for this company
    const companyJobs = await JobVacancy.find({ company_id: req.user.id });
    const jobIds = companyJobs.map(job => job.id);

    const query = { job_id: { $in: jobIds } };
    
    if (status) query.status = status;
    if (job_id) query.job_id = job_id;

    const applications = await JobApplication.find(query)
      .sort({ applied_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await JobApplication.countDocuments(query);

    // Enrich applications with job details
    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        const job = companyJobs.find(j => j.id === app.job_id);
        return {
          ...app.toObject(),
          job_title: job?.title || 'Unknown Job'
        };
      })
    );

    res.json({
      applications: enrichedApplications,
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
    const { status, notes } = req.body;

    if (!status || !['nuevo', 'en_revision', 'entrevista', 'oferta', 'rechazado'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be one of: nuevo, en_revision, entrevista, oferta, rechazado'
      });
    }

    const application = await JobApplication.findOne({ id: applicationId });
    if (!application) {
      return res.status(404).json({
        error: 'Application not found',
        message: 'Application not found'
      });
    }

    // Verify this application belongs to a job from this company
    const job = await JobVacancy.findOne({ 
      id: application.job_id, 
      company_id: req.user.id 
    });

    if (!job) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update applications for your own job postings'
      });
    }

    const updatedApplication = await JobApplication.findOneAndUpdate(
      { id: applicationId },
      { 
        $set: { 
          status, 
          notes: notes || application.notes 
        } 
      },
      { new: true }
    );

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
