export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateBudget = (
  minBudget?: number,
  maxBudget?: number,
): ValidationResult => {
  if (
    typeof minBudget === 'number' &&
    typeof maxBudget === 'number' &&
    minBudget > maxBudget
  ) {
    return {
      isValid: false,
      error: 'Minimum budget should not be more than maximum budget',
    };
  }
  return { isValid: true };
};

export const validateDateRange = (
  startDate?: string,
  endDate?: string,
): ValidationResult => {
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      return {
        isValid: false,
        error: 'Start date should be before or equal to end date',
      };
    }
  }
  return { isValid: true };
};

export const filterValidator = (
  minBudget?: number,
  maxBudget?: number,
  startDate?: string,
  endDate?: string,
): ValidationResult => {
  const budgetResult = validateBudget(minBudget, maxBudget);
  if (!budgetResult.isValid) return budgetResult;

  const dateResult = validateDateRange(startDate, endDate);
  if (!dateResult.isValid) return dateResult;

  return { isValid: true };
};
