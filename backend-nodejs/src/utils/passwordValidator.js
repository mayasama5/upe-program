/**
 * Lista de contraseñas comunes que deben ser bloqueadas
 */
const COMMON_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'abc123',
  'monkey', '1234567', 'letmein', 'trustno1', 'dragon',
  'baseball', 'iloveyou', 'master', 'sunshine', 'ashley',
  'bailey', 'shadow', '123123', '654321', 'superman',
  'qazwsx', 'michael', 'football', 'admin', 'welcome',
  'jesus', 'ninja', 'mustang', 'password1', '123456789',
  'password123', 'admin123', 'root', 'toor', 'pass',
  '12345', '1234', 'test', 'guest', 'info', 'adm',
  'mysql', 'user', 'administrator', 'oracle', 'ftp',
  'pi', 'puppet', 'ansible', 'ec2-user', 'vagrant',
  'azureuser', 'academico', 'universidad', 'estudiante'
];

/**
 * Opciones de validación de contraseña
 */
const DEFAULT_OPTIONS = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  blockCommonPasswords: true,
  blockRepeatedChars: true,
  blockSequentialChars: true
};

/**
 * Verifica si la contraseña contiene al menos una mayúscula
 */
const hasUppercase = (password) => /[A-Z]/.test(password);

/**
 * Verifica si la contraseña contiene al menos una minúscula
 */
const hasLowercase = (password) => /[a-z]/.test(password);

/**
 * Verifica si la contraseña contiene al menos un número
 */
const hasNumbers = (password) => /\d/.test(password);

/**
 * Verifica si la contraseña contiene al menos un carácter especial
 */
const hasSpecialChars = (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

/**
 * Verifica si la contraseña es una de las contraseñas comunes
 */
const isCommonPassword = (password) => {
  const lowerPassword = password.toLowerCase();
  return COMMON_PASSWORDS.some(common => lowerPassword.includes(common));
};

/**
 * Verifica si la contraseña tiene caracteres repetidos excesivamente
 * Ej: "aaaaaaa", "1111111"
 */
const hasRepeatedChars = (password, maxRepeats = 3) => {
  const regex = new RegExp(`(.)\\1{${maxRepeats},}`);
  return regex.test(password);
};

/**
 * Verifica si la contraseña contiene secuencias obvias
 * Ej: "123456", "abcdef"
 */
const hasSequentialChars = (password) => {
  const sequences = [
    '0123456789',
    '9876543210',
    'abcdefghijklmnopqrstuvwxyz',
    'zyxwvutsrqponmlkjihgfedcba',
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm'
  ];

  const lowerPassword = password.toLowerCase();

  for (const sequence of sequences) {
    for (let i = 0; i < sequence.length - 3; i++) {
      const substring = sequence.substring(i, i + 4);
      if (lowerPassword.includes(substring)) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Calcula la entropía de la contraseña (complejidad)
 * Mayor entropía = contraseña más fuerte
 */
const calculateEntropy = (password) => {
  let charset = 0;

  if (/[a-z]/.test(password)) charset += 26;
  if (/[A-Z]/.test(password)) charset += 26;
  if (/\d/.test(password)) charset += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charset += 32;

  return password.length * Math.log2(charset);
};

/**
 * Obtiene la fortaleza de la contraseña
 * @returns {'weak'|'medium'|'strong'|'very-strong'}
 */
const getPasswordStrength = (password) => {
  const entropy = calculateEntropy(password);

  if (entropy < 30) return 'weak';
  if (entropy < 50) return 'medium';
  if (entropy < 70) return 'strong';
  return 'very-strong';
};

/**
 * Valida una contraseña según criterios de seguridad
 * @param {string} password - Contraseña a validar
 * @param {object} options - Opciones de validación
 * @returns {{valid: boolean, errors: string[], strength: string, suggestions: string[]}}
 */
const validatePassword = (password, options = {}) => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const errors = [];
  const suggestions = [];

  // Validación de longitud
  if (password.length < opts.minLength) {
    errors.push(`La contraseña debe tener al menos ${opts.minLength} caracteres`);
    suggestions.push(`Usa al menos ${opts.minLength} caracteres`);
  }

  if (password.length > opts.maxLength) {
    errors.push(`La contraseña no puede exceder ${opts.maxLength} caracteres`);
  }

  // Validación de caracteres requeridos
  if (opts.requireUppercase && !hasUppercase(password)) {
    errors.push('La contraseña debe incluir al menos una letra mayúscula');
    suggestions.push('Agrega al menos una letra mayúscula (A-Z)');
  }

  if (opts.requireLowercase && !hasLowercase(password)) {
    errors.push('La contraseña debe incluir al menos una letra minúscula');
    suggestions.push('Agrega al menos una letra minúscula (a-z)');
  }

  if (opts.requireNumbers && !hasNumbers(password)) {
    errors.push('La contraseña debe incluir al menos un número');
    suggestions.push('Agrega al menos un número (0-9)');
  }

  if (opts.requireSpecialChars && !hasSpecialChars(password)) {
    errors.push('La contraseña debe incluir al menos un carácter especial');
    suggestions.push('Agrega al menos un carácter especial (!@#$%^&*)');
  }

  // Validación de patrones débiles
  if (opts.blockCommonPasswords && isCommonPassword(password)) {
    errors.push('Esta contraseña es demasiado común y fácil de adivinar');
    suggestions.push('Evita contraseñas comunes como "password123"');
  }

  if (opts.blockRepeatedChars && hasRepeatedChars(password)) {
    errors.push('La contraseña contiene demasiados caracteres repetidos');
    suggestions.push('Evita repetir el mismo carácter muchas veces');
  }

  if (opts.blockSequentialChars && hasSequentialChars(password)) {
    errors.push('La contraseña contiene secuencias obvias');
    suggestions.push('Evita secuencias como "123456" o "abcdef"');
  }

  const strength = getPasswordStrength(password);

  // Sugerencias adicionales basadas en fortaleza
  if (strength === 'weak') {
    suggestions.push('Considera usar una combinación de letras, números y símbolos');
    suggestions.push('Cuanto más larga sea la contraseña, más segura será');
  }

  return {
    valid: errors.length === 0,
    errors,
    strength,
    suggestions: [...new Set(suggestions)], // Eliminar duplicados
    entropy: calculateEntropy(password)
  };
};

/**
 * Genera una contraseña segura aleatoria
 * @param {number} length - Longitud de la contraseña
 * @returns {string}
 */
const generateSecurePassword = (length = 16) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const allChars = uppercase + lowercase + numbers + special;
  let password = '';

  // Asegurar que tenga al menos uno de cada tipo
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Llenar el resto
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Mezclar
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

module.exports = {
  validatePassword,
  generateSecurePassword,
  getPasswordStrength,
  calculateEntropy,
  hasUppercase,
  hasLowercase,
  hasNumbers,
  hasSpecialChars,
  isCommonPassword,
  COMMON_PASSWORDS
};
