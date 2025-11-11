import type { ApplyFormInterface } from '@/api/apply';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateDescription = (description?: string): ValidationResult => {
  if (description && description.length > 2000) {
    return {
      isValid: false,
      error: 'Description must be 2000 characters or less',
    };
  }

  return { isValid: true };
};

export const validateAppliedPrice = (
  appliedPrice?: number | string,
  budget?: number | string,
): ValidationResult => {
  if (appliedPrice === undefined || appliedPrice === null) {
    return { isValid: false };
  }
  if (budget === undefined || budget === null) {
    return { isValid: false };
  }

  const appliedPriceNum =
    typeof appliedPrice === 'string' ? parseFloat(appliedPrice) : appliedPrice;

  if (isNaN(appliedPriceNum)) {
    return { isValid: false, error: 'Applied price must be a valid number' };
  }

  if (appliedPriceNum < 0) {
    return { isValid: false, error: 'Applied price cannot be negative' };
  }

  if (appliedPriceNum > 99999999.99) {
    return {
      isValid: false,
      error: 'Applied price cannot exceed 99,999,999.99',
    };
  }

  const appliedPriceStr = appliedPriceNum.toString();
  const decimalIndex = appliedPriceStr.indexOf('.');
  if (decimalIndex !== -1 && appliedPriceStr.length - decimalIndex - 1 > 2) {
    return {
      isValid: false,
      error: 'Applied price must have at most 2 decimal places',
    };
  }

  return { isValid: true };
};

export const validateDate = (date: Date | undefined): ValidationResult => {
  if (!date) {
    return { isValid: false, error: 'Date is required' };
  }

  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }

  // Check if date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date < today) {
    return { isValid: false, error: 'Service date cannot be in the past' };
  }

  return { isValid: true };
};

export const applyValidator = (
  formData: ApplyFormInterface,
  field: string,
): ValidationResult => {
  switch (field) {
    case 'description':
      return validateDescription(formData.description);
    case 'appliedPrice':
      return validateAppliedPrice(formData.appliedPrice, formData.budget);
    case 'date':
      return validateDate(formData.date);
    default:
      return { isValid: true };
  }
};
