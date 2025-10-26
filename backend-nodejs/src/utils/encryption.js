const crypto = require('crypto');
const CryptoJS = require('crypto-js');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-encryption-key';
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

/**
 * Encripta datos sensibles usando AES-256
 * @param {string} text - Texto a encriptar
 * @returns {string} Texto encriptado
 */
const encrypt = (text) => {
  if (!text) return null;

  try {
    const encrypted = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw new Error('Error al encriptar datos');
  }
};

/**
 * Desencripta datos usando AES-256
 * @param {string} encryptedText - Texto encriptado
 * @returns {string} Texto desencriptado
 */
const decrypt = (encryptedText) => {
  if (!encryptedText) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw new Error('Error al desencriptar datos');
  }
};

/**
 * Encripta datos usando Node.js crypto (alternativa)
 * @param {string} text - Texto a encriptar
 * @returns {string} Texto encriptado en formato hex
 */
const encryptNode = (text) => {
  if (!text) return null;

  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw new Error('Error al encriptar datos');
  }
};

/**
 * Desencripta datos usando Node.js crypto (alternativa)
 * @param {string} text - Texto encriptado
 * @returns {string} Texto desencriptado
 */
const decryptNode = (text) => {
  if (!text) return null;

  try {
    const parts = text.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];

    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw new Error('Error al desencriptar datos');
  }
};

/**
 * Hash de contraseña usando bcrypt
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} Hash de la contraseña
 */
const hashPassword = async (password) => {
  const bcrypt = require('bcrypt');
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compara contraseña con hash
 * @param {string} password - Contraseña en texto plano
 * @param {string} hash - Hash almacenado
 * @returns {Promise<boolean>} True si coinciden
 */
const comparePassword = async (password, hash) => {
  const bcrypt = require('bcrypt');
  return await bcrypt.compare(password, hash);
};

/**
 * Genera un hash SHA-256
 * @param {string} text - Texto a hashear
 * @returns {string} Hash en formato hex
 */
const sha256 = (text) => {
  return crypto.createHash('sha256').update(text).digest('hex');
};

/**
 * Genera un token aleatorio seguro
 * @param {number} length - Longitud del token en bytes
 * @returns {string} Token en formato hex
 */
const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

module.exports = {
  encrypt,
  decrypt,
  encryptNode,
  decryptNode,
  hashPassword,
  comparePassword,
  sha256,
  generateSecureToken
};
