import type { ServiceFieldValue } from './type';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const validateName = (name: string): ValidationResult => {
  if (name === '') {
    return { isValid: false, error: 'Name cannot be empty' };
  }

  if (name.length > 150) {
    return { isValid: false, error: 'Name must be 150 characters or less' };
  }

  if (/\d/.test(name)) {
    return { isValid: false, error: 'Name should not contain numbers' };
  }

  return { isValid: true };
};

const validateEmail = (email: string): ValidationResult => {
  if (email === '') {
    return { isValid: false, error: 'Email cannot be empty' };
  }

  if (email.length > 254) {
    return { isValid: false, error: 'Email must be 254 characters or less' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please fill in a valid email address' };
  }

  return { isValid: true };
};

const validateTelNumber = (telNumber: string): ValidationResult => {
  if (telNumber === '') {
    return { isValid: false, error: 'Telephone number cannot be empty' };
  }

  if (telNumber.length > 10) {
    return {
      isValid: false,
      error: 'Telephone number must be 10 characters or less',
    };
  }

  if (!/^\d+$/.test(telNumber)) {
    return {
      isValid: false,
      error: 'Telephone number must contain only digits',
    };
  }

  if (!telNumber.startsWith('0')) {
    return { isValid: false, error: 'Telephone number must start with 0' };
  }

  if (!/^[0-9]{9,10}$/.test(telNumber)) {
    return {
      isValid: false,
      error: 'Telephone number must be 9 or 10 digits',
    };
  }

  return { isValid: true };
};

const validateDescription = (description: string): ValidationResult => {
  if (description.length > 2000) {
    return {
      isValid: false,
      error: 'Description must be 2000 characters or less',
    };
  }

  return { isValid: true };
};

export const profileValidator = (
  field: string,
  value: ServiceFieldValue,
): ValidationResult => {
  switch (field) {
    case 'name':
      return validateName(value as string);
    case 'email':
      return validateEmail(value as string);
    case 'telNumber':
      return validateTelNumber(value as string);
    case 'description':
      return validateDescription(value as string);
    default:
      return { isValid: true };
  }
};
