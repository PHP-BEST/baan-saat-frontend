import type { ServiceFieldValue } from './type';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateTitle = (title: string): ValidationResult => {
  if (title === '') {
    return { isValid: false, error: 'Service title cannot be empty' };
  }

  if (title.length > 200) {
    return {
      isValid: false,
      error: 'Service title must be 200 characters or less',
    };
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

export const validateBudget = (budget: number | string): ValidationResult => {
  const budgetNum = typeof budget === 'string' ? parseFloat(budget) : budget;

  if (isNaN(budgetNum)) {
    return { isValid: false, error: 'Budget must be a valid number' };
  }

  if (budgetNum < 0) {
    return { isValid: false, error: 'Budget cannot be negative' };
  }

  if (budgetNum > 99999999.99) {
    return { isValid: false, error: 'Budget cannot exceed 99,999,999.99' };
  }

  // Check for at most 2 decimal places
  const budgetStr = budgetNum.toString();
  const decimalIndex = budgetStr.indexOf('.');
  if (decimalIndex !== -1 && budgetStr.length - decimalIndex - 1 > 2) {
    return {
      isValid: false,
      error: 'Budget must have at most 2 decimal places',
    };
  }

  return { isValid: true };
};

export const validateTelNumber = (telNumber: string): ValidationResult => {
  if (telNumber === '') {
    return { isValid: false, error: 'Telephone number cannot be empty' };
  }

  if (telNumber.length < 9 || telNumber.length > 10) {
    return {
      isValid: false,
      error: 'Telephone number must be 9 or 10 digits',
    };
  }

  if (!/^0\d{8,9}$/.test(telNumber)) {
    return {
      isValid: false,
      error: 'Please fill in a valid telephone number (must start with 0)',
    };
  }

  return { isValid: true };
};

export const validateLocation = (location: string): ValidationResult => {
  if (location.length > 2000) {
    return {
      isValid: false,
      error: 'Location must be 2000 characters or less',
    };
  }

  return { isValid: true };
};

export const validateTags = (tags: string[]): ValidationResult => {
  const validTags = [
    'houseCleaning',
    'houseRepair',
    'plumbing',
    'electrical',
    'hvac',
    'painting',
    'landscaping',
    'others',
  ];

  for (const tag of tags) {
    if (!validTags.includes(tag)) {
      return { isValid: false, error: `Invalid tag: ${tag}` };
    }
  }

  return { isValid: true };
};

export const validateDate = (date: Date | string): ValidationResult => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }

  // Check if date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);

  if (dateObj < today) {
    return { isValid: false, error: 'Service date cannot be in the past' };
  }

  return { isValid: true };
};

export const serviceValidator = (
  field: string,
  value: ServiceFieldValue,
): ValidationResult => {
  switch (field) {
    case 'serviceTitle':
    case 'title':
      return validateTitle(value as string);
    case 'description':
      return validateDescription(value as string);
    case 'budget':
      return validateBudget(value as number | string);
    case 'telNumber':
      return validateTelNumber(value as string);
    case 'location':
      return validateLocation(value as string);
    case 'tags':
      return validateTags(value as string[]);
    case 'date':
      return validateDate(value as Date | string);
    default:
      return { isValid: true };
  }
};

export const validateService = (service: {
  title: string;
  description?: string;
  budget?: number;
  coverPhotoUrl?: string;
  telNumber: string;
  location?: string;
  tags?: string[];
  date: Date | string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  const titleValidation = validateTitle(service.title);
  if (!titleValidation.isValid) {
    errors.title = titleValidation.error!;
  }

  const telValidation = validateTelNumber(service.telNumber);
  if (!telValidation.isValid) {
    errors.telNumber = telValidation.error!;
  }

  const dateValidation = validateDate(service.date);
  if (!dateValidation.isValid) {
    errors.date = dateValidation.error!;
  }

  if (service.description) {
    const descValidation = validateDescription(service.description);
    if (!descValidation.isValid) {
      errors.description = descValidation.error!;
    }
  }

  if (service.budget !== undefined) {
    const budgetValidation = validateBudget(service.budget);
    if (!budgetValidation.isValid) {
      errors.budget = budgetValidation.error!;
    }
  }

  if (service.location) {
    const locationValidation = validateLocation(service.location);
    if (!locationValidation.isValid) {
      errors.location = locationValidation.error!;
    }
  }

  if (service.tags) {
    const tagsValidation = validateTags(service.tags);
    if (!tagsValidation.isValid) {
      errors.tags = tagsValidation.error!;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
