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

// Export only enums - Models are no longer available
module.exports = {
  UserRole,
  JobType,
  JobModality,
  ApplicationStatus,
  ApplyType
};
