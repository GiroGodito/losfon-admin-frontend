// src/utils/validators.ts
export const validators = {
  isRequired: (value: string): boolean => value.trim().length > 0,

  minLength: (value: string, min: number): boolean => value.trim().length >= min,

  maxLength: (value: string, max: number): boolean => value.trim().length <= max,

  isEmail: (value: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value);
  },

  isPhoneNumber: (value: string): boolean => {
    const cleaned = value.replace(/[\s\-\(\)]/g, '');
    return cleaned.startsWith('+') 
      ? /^\+\d{7,15}$/.test(cleaned)
      : /^09\d{9}$/.test(cleaned) || /^\d{7,15}$/.test(cleaned);
  },

  isPasswordComplex: (value: string): boolean => {
    return value.length >= 8 &&
      /[A-Z]/.test(value) &&
      /[a-z]/.test(value) &&
      /[0-9]/.test(value) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(value);
  },

  matches: (value: string, compareTo: string): boolean => value === compareTo,
};