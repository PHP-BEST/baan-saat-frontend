export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateName = (name: string): ValidationResult => {
  if (name.length > 150) {
    return { isValid: false, error: 'Name must be 150 characters or less' };
  }

  if (/\d/.test(name)) {
    return { isValid: false, error: 'Name should not contain numbers' };
  }

  return { isValid: true };
};

export const validateEmail = (email: string): ValidationResult => {
  if (email === '') {
    return { isValid: true };
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

export const validateTelNumber = (telNumber: string): ValidationResult => {
  if (telNumber === '') {
    return { isValid: true };
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

  return { isValid: true };
};

export const validateDescription = (description: string): ValidationResult => {
  if (description.length > 2000) {
    return {
      isValid: false,
      error: 'Description must be 2000 characters or less',
    };
  }

  return { isValid: true };
};

export const validateField = (
  field: string,
  value: string,
): ValidationResult => {
  switch (field) {
    case 'name':
      return validateName(value);
    case 'email':
      return validateEmail(value);
    case 'telNumber':
      return validateTelNumber(value);
    case 'description':
      return validateDescription(value);
    default:
      return { isValid: true };
  }
};
