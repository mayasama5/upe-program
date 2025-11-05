const { validateEmail, isDisposableEmail } = require('../emailValidator');
const { validatePassword, getPasswordStrength } = require('../passwordValidator');

describe('Email Validator', () => {
  describe('validateEmail', () => {
    test('should accept valid email with real domain', async () => {
      const result = await validateEmail('test@gmail.com', { checkMX: false });
      expect(result.valid).toBe(true);
    });

    test('should reject invalid email format', async () => {
      const result = await validateEmail('notanemail', { checkMX: false });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Formato de email inválido');
    });

    test('should reject disposable email', async () => {
      const result = await validateEmail('test@tempmail.com', { checkMX: false });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('emails desechables');
    });

    test('should accept disposable email if disabled', async () => {
      const result = await validateEmail('test@tempmail.com', {
        checkMX: false,
        blockDisposable: false
      });
      expect(result.valid).toBe(true);
    });
  });

  describe('isDisposableEmail', () => {
    test('should identify disposable emails', () => {
      expect(isDisposableEmail('test@tempmail.com')).toBe(true);
      expect(isDisposableEmail('test@guerrillamail.com')).toBe(true);
      expect(isDisposableEmail('test@mailinator.com')).toBe(true);
    });

    test('should not flag legitimate emails', () => {
      expect(isDisposableEmail('test@gmail.com')).toBe(false);
      expect(isDisposableEmail('test@outlook.com')).toBe(false);
      expect(isDisposableEmail('test@yahoo.com')).toBe(false);
    });
  });
});

describe('Password Validator', () => {
  describe('validatePassword', () => {
    test('should accept strong password', () => {
      const result = validatePassword('MyP@ssw0rd123');
      expect(result.valid).toBe(true);
      expect(result.strength).not.toBe('weak');
    });

    test('should reject short password', () => {
      const result = validatePassword('Abc1!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('La contraseña debe tener al menos 8 caracteres');
    });

    test('should reject password without uppercase', () => {
      const result = validatePassword('password123!');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('mayúscula'))).toBe(true);
    });

    test('should reject password without lowercase', () => {
      const result = validatePassword('PASSWORD123!');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('minúscula'))).toBe(true);
    });

    test('should reject password without numbers', () => {
      const result = validatePassword('Password!');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('número'))).toBe(true);
    });

    test('should reject password without special chars', () => {
      const result = validatePassword('Password123');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('carácter especial'))).toBe(true);
    });

    test('should reject common passwords', () => {
      const result = validatePassword('Password123!');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('demasiado común'))).toBe(true);
    });

    test('should reject sequential characters', () => {
      const result = validatePassword('Abcd1234!');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('secuencias obvias'))).toBe(true);
    });

    test('should reject repeated characters', () => {
      const result = validatePassword('Aaaaaaa1!');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('repetidos'))).toBe(true);
    });
  });

  describe('getPasswordStrength', () => {
    test('should rate weak passwords as weak', () => {
      expect(getPasswordStrength('abc')).toBe('weak');
      expect(getPasswordStrength('12345')).toBe('weak');
    });

    test('should rate medium passwords', () => {
      const strength = getPasswordStrength('Password1');
      expect(['medium', 'strong']).toContain(strength);
    });

    test('should rate strong passwords', () => {
      const strength = getPasswordStrength('MyP@ssw0rd123!');
      expect(['strong', 'very-strong']).toContain(strength);
    });
  });
});
