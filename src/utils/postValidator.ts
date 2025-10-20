import type { PostFormInterface } from '@/api/post';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateTitle = (title: string): ValidationResult => {
  if (title === '') {
    return { isValid: false, error: 'Post title cannot be empty' };
  }

  if (title.length > 200) {
    return {
      isValid: false,
      error: 'Post title must be 200 characters or less',
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
      error: 'Please fill in a valid telephone number',
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

export const validateOther = (tag: string, other: string): ValidationResult => {
  if (tag !== 'others') {
    return { isValid: true };
  }

  if (other.trim() === '') {
    return { isValid: false, error: 'Please specify this field' };
  }

  if (other.length > 20) {
    return {
      isValid: false,
      error: 'This field must be 20 characters or less',
    };
  }

  return { isValid: true };
};

export const validateDate = (date: Date | undefined): ValidationResult => {
  if (!date) {
    return { isValid: false, error: 'Date cannot be empty' };
  }

  // Check if date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date < today) {
    return { isValid: false, error: 'Post date cannot be in the past' };
  }

  return { isValid: true };
};

export const postValidator = (
  formData: PostFormInterface,
  field: string,
): ValidationResult => {
  switch (field) {
    case 'title':
      return validateTitle(formData.title);
    case 'description':
      return validateDescription(formData.description);
    case 'budget':
      return validateBudget(formData.budget);
    case 'telNumber':
      return validateTelNumber(formData.telNumber);
    case 'location':
      return validateLocation(formData.location);
    case 'tag':
      return validateTags([formData.tag as string]);
    case 'other':
      return validateOther(formData.tag as string, formData.other);
    case 'date':
      return validateDate(formData.date);
    default:
      return { isValid: true };
  }
};
