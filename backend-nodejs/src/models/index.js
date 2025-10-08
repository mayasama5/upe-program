const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Enums
const UserRole = {
  STUDENT: 'estudiante',
  COMPANY: 'empresa'
};

const JobType = {
  PRACTICA: 'practica',
  PASANTIA: 'pasantia',
  JUNIOR: 'junior',
  MEDIO: 'medio',
  SENIOR: 'senior'
};

const JobModality = {
  REMOTO: 'remoto',
  PRESENCIAL: 'presencial',
  HIBRIDO: 'hibrido'
};

const ApplicationStatus = {
  NUEVO: 'nuevo',
  EN_REVISION: 'en_revision',
  ENTREVISTA: 'entrevista',
  OFERTA: 'oferta',
  RECHAZADO: 'rechazado'
};

const ApplyType = {
  INTERNO: 'interno',
  EXTERNO: 'externo'
};

// User Schema
const userSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  picture: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.STUDENT
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  github_url: {
    type: String,
    default: null
  },
  linkedin_url: {
    type: String,
    default: null
  },
  portfolio_url: {
    type: String,
    default: null
  },
  skills: [{
    type: String
  }],
  bio: {
    type: String,
    default: null
  },
  company_name: {
    type: String,
    default: null
  },
  company_document: {
    type: String,
    default: null
  },
  cv_file_path: {
    type: String,
    default: null
  },
  certificate_files: [{
    type: mongoose.Schema.Types.Mixed
  }],
  degree_files: [{
    type: mongoose.Schema.Types.Mixed
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Session Schema
const sessionSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  user_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  session_token: {
    type: String,
    required: true,
    unique: true
  },
  expires_at: {
    type: Date,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Course Schema
const courseSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'es'
  },
  has_spanish_subtitles: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: true
  },
  is_free: {
    type: Boolean,
    default: true
  },
  image_url: {
    type: String,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Event Schema
const eventSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  organizer: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  event_date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  is_online: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Job Vacancy Schema
const jobVacancySchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  company_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  company_name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [{
    type: String
  }],
  modality: {
    type: String,
    enum: Object.values(JobModality),
    required: true
  },
  job_type: {
    type: String,
    enum: Object.values(JobType),
    required: true
  },
  seniority_level: {
    type: String,
    required: true
  },
  skills_stack: [{
    type: String
  }],
  city: {
    type: String,
    default: null
  },
  country: {
    type: String,
    default: 'Paraguay'
  },
  salary_range: {
    type: String,
    default: null
  },
  apply_type: {
    type: String,
    enum: Object.values(ApplyType),
    required: true
  },
  apply_url: {
    type: String,
    default: null
  },
  is_active: {
    type: Boolean,
    default: true
  },
  knockout_questions: [{
    type: String
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Saved Item Schema
const savedItemSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  user_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  item_id: {
    type: String,
    required: true
  },
  item_type: {
    type: String,
    required: true,
    enum: ['course', 'event', 'job']
  },
  item_data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  saved_at: {
    type: Date,
    default: Date.now
  }
});

// Job Application Schema
const jobApplicationSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  job_id: {
    type: String,
    required: true,
    ref: 'JobVacancy'
  },
  student_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  student_name: {
    type: String,
    required: true
  },
  student_email: {
    type: String,
    required: true
  },
  cv_url: {
    type: String,
    default: null
  },
  cover_letter: {
    type: String,
    default: null
  },
  answers: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: Object.values(ApplicationStatus),
    default: ApplicationStatus.NUEVO
  },
  notes: {
    type: String,
    default: null
  },
  applied_at: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better performance
userSchema.index({ email: 1 });
sessionSchema.index({ session_token: 1 });
sessionSchema.index({ expires_at: 1 });
courseSchema.index({ category: 1 });
eventSchema.index({ event_date: 1 });
jobVacancySchema.index({ company_id: 1 });
jobVacancySchema.index({ is_active: 1 });
savedItemSchema.index({ user_id: 1, item_type: 1 });
jobApplicationSchema.index({ job_id: 1 });
jobApplicationSchema.index({ student_id: 1 });

// Export models
const User = mongoose.model('User', userSchema);
const Session = mongoose.model('Session', sessionSchema);
const Course = mongoose.model('Course', courseSchema);
const Event = mongoose.model('Event', eventSchema);
const JobVacancy = mongoose.model('JobVacancy', jobVacancySchema);
const SavedItem = mongoose.model('SavedItem', savedItemSchema);
const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = {
  User,
  Session,
  Course,
  Event,
  JobVacancy,
  SavedItem,
  JobApplication,
  UserRole,
  JobType,
  JobModality,
  ApplicationStatus,
  ApplyType
};
