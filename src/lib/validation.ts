// src/lib/validation.ts
export const validationRules = {
  required: (value: any): boolean => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined;
  },

  email: (value: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value);
  },

  phoneNumber: (value: string): boolean => {
    const cleaned = value.replace(/[\s\-()]/g, '');
    return cleaned.startsWith('+') 
      ? /^\+\d{7,15}$/.test(cleaned)
      : /^09\d{9}$/.test(cleaned) || /^\d{7,15}$/.test(cleaned);
  },

  passwordComplexity: (value: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (value.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(value)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(value)) errors.push('One lowercase letter');
    if (!/[0-9]/.test(value)) errors.push('One number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) errors.push('One special character');
    return { valid: errors.length === 0, errors };
  },

  minLength: (value: string, min: number): boolean => value.length >= min,
  
  maxLength: (value: string, max: number): boolean => value.length <= max,
};