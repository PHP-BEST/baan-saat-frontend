import type { ServiceFieldValue } from './type';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateDescription = (description: string): ValidationResult => {
  if (description.length > 2000) {
    return {
      isValid: false,
      error: 'Description must be 2000 characters or less',
    };
  }

  return { isValid: true };
};

export const validateOfferedPrice = (
  offeredPrice: number | string,
  budget: number | string,
): ValidationResult => {
  const offeredPriceNum =
    typeof offeredPrice === 'string' ? parseFloat(offeredPrice) : offeredPrice;
  const budgetNum = typeof budget === 'string' ? parseFloat(budget) : budget;

  if (isNaN(offeredPriceNum)) {
    return { isValid: false, error: 'Offered price must be a valid number' };
  }

  if (offeredPriceNum < 0) {
    return { isValid: false, error: 'Offered price cannot be negative' };
  }

  if (offeredPriceNum > 99999999.99) {
    return {
      isValid: false,
      error: 'Offered price cannot exceed 99,999,999.99',
    };
  }

  const offeredPriceStr = offeredPriceNum.toString();
  const decimalIndex = offeredPriceStr.indexOf('.');
  if (decimalIndex !== -1 && offeredPriceStr.length - decimalIndex - 1 > 2) {
    return {
      isValid: false,
      error: 'Offered price must have at most 2 decimal places',
    };
  }

  if (offeredPriceNum > budgetNum) {
    return {
      isValid: false,
      error: 'Offered price cannot exceed the service budget',
    };
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

export const offerValidator = (
  field: string,
  value: ServiceFieldValue,
  budget?: number | string,
): ValidationResult => {
  switch (field) {
    case 'description':
      return validateDescription(value as string);
    case 'offeredPrice':
      return validateOfferedPrice(value as number | string, budget ?? 0);
    case 'date':
      return validateDate(value as Date | string);
    default:
      return { isValid: true };
  }
};

export const validateOffer = (
  offer: {
    description: string;
    offeredPrice: number;
    date: Date | string;
  },
  budget?: number | string,
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  const descriptionValidation = validateDescription(offer.description);
  if (!descriptionValidation.isValid) {
    errors.description = descriptionValidation.error!;
  }

  const dateValidation = validateDate(offer.date);
  if (!dateValidation.isValid) {
    errors.date = dateValidation.error!;
  }

  if (offer.offeredPrice) {
    const offeredPriceValidation = validateOfferedPrice(
      offer.offeredPrice,
      budget ?? 0,
    );
    if (!offeredPriceValidation.isValid) {
      errors.offeredPrice = offeredPriceValidation.error!;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
