const dns = require('dns').promises;

/**
 * Lista de dominios de emails desechables/temporales
 * Esta es una lista básica, en producción deberías usar un servicio como
 * https://github.com/disposable/disposable-email-domains
 */
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com',
  'guerrillamail.com',
  'mailinator.com',
  '10minutemail.com',
  'throwaway.email',
  'temp-mail.org',
  'getnada.com',
  'maildrop.cc',
  'yopmail.com',
  'mohmal.com',
  'sharklasers.com',
  'grr.la',
  'guerrillamail.biz',
  'guerrillamail.de',
  'spam4.me',
  'trashmail.com',
  'fakeinbox.com',
  'emailondeck.com',
  'mintemail.com',
  'mytrashmail.com',
  'mailnesia.com',
  'dispostable.com',
  'armyspy.com',
  'cuvox.de',
  'dayrep.com',
  'einrot.com',
  'fleckens.hu',
  'gustr.com',
  'jourrapide.com',
  'rhyta.com',
  'teleworm.us',
  'superrito.com',
  'a.femalepalace.com',
  'mailcatch.com',
  'mailinator.net',
  'spamgourmet.com',
  'trashmail.net',
  'wegwerfmail.de',
  '0815.ru',
  'anonymous.io',
  'getairmail.com',
  'throwam.com',
  'burnermail.io',
  'anonbox.net',
  'sharklasers.com'
];

/**
 * Valida el formato básico del email
 * @param {string} email
 * @returns {boolean}
 */
const validateEmailFormat = (email) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

/**
 * Verifica si el dominio del email es desechable/temporal
 * @param {string} email
 * @returns {boolean}
 */
const isDisposableEmail = (email) => {
  const domain = email.toLowerCase().split('@')[1];
  return DISPOSABLE_EMAIL_DOMAINS.includes(domain);
};

/**
 * Verifica si el dominio tiene registros MX válidos (puede recibir emails)
 * @param {string} email
 * @returns {Promise<boolean>}
 */
const hasValidMXRecords = async (email) => {
  try {
    const domain = email.split('@')[1];
    const mxRecords = await dns.resolveMx(domain);
    return mxRecords && mxRecords.length > 0;
  } catch (error) {
    // Si hay error al resolver DNS, el dominio probablemente no existe
    console.log(`MX lookup failed for ${email}:`, error.code);
    return false;
  }
};

/**
 * Validación completa de email
 * @param {string} email
 * @param {object} options - Opciones de validación
 * @param {boolean} options.checkMX - Verificar registros MX (default: true)
 * @param {boolean} options.blockDisposable - Bloquear emails desechables (default: true)
 * @returns {Promise<{valid: boolean, error?: string}>}
 */
const validateEmail = async (email, options = {}) => {
  const {
    checkMX = true,
    blockDisposable = true
  } = options;

  // 1. Validar formato básico
  if (!validateEmailFormat(email)) {
    return {
      valid: false,
      error: 'Formato de email inválido'
    };
  }

  // 2. Verificar si es email desechable
  if (blockDisposable && isDisposableEmail(email)) {
    return {
      valid: false,
      error: 'No se permiten emails desechables o temporales'
    };
  }

  // 3. Verificar registros MX (que el dominio puede recibir emails)
  if (checkMX) {
    const hasMX = await hasValidMXRecords(email);
    if (!hasMX) {
      return {
        valid: false,
        error: 'El dominio del email no existe o no puede recibir correos'
      };
    }
  }

  return { valid: true };
};

/**
 * Valida múltiples emails en paralelo
 * @param {string[]} emails
 * @param {object} options
 * @returns {Promise<Array>}
 */
const validateEmails = async (emails, options = {}) => {
  const validations = await Promise.all(
    emails.map(email => validateEmail(email, options))
  );

  return emails.map((email, index) => ({
    email,
    ...validations[index]
  }));
};

/**
 * Normaliza un email (lowercase, trim)
 * @param {string} email
 * @returns {string}
 */
const normalizeEmail = (email) => {
  return email.toLowerCase().trim();
};

module.exports = {
  validateEmail,
  validateEmails,
  validateEmailFormat,
  isDisposableEmail,
  hasValidMXRecords,
  normalizeEmail,
  DISPOSABLE_EMAIL_DOMAINS
};
