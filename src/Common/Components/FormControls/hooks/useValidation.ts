import { useState, useCallback, useMemo } from 'react';
import { ValidationRule, ValidationResult } from '../EnhancedTextField.types';

export const useValidation = (validationRules: ValidationRule[] = []) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  // Validation functions
  const validators = useMemo(() => ({
    required: (value: string): boolean => {
      return value.trim().length > 0;
    },

    minLength: (value: string, minLength: number): boolean => {
      return value.length >= minLength;
    },

    maxLength: (value: string, maxLength: number): boolean => {
      return value.length <= maxLength;
    },

    pattern: (value: string, pattern: string): boolean => {
      const regex = new RegExp(pattern);
      return regex.test(value);
    },

    email: (value: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },

    url: (value: string): boolean => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },

    phone: (value: string): boolean => {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
    }
  }), []);

  // Validate a single rule
  const validateRule = useCallback((rule: ValidationRule, value: string): ValidationResult => {
    let isValid = true;
    let errorMessage = '';

    switch (rule.type) {
      case 'required':
        isValid = validators.required(value);
        break;

      case 'minLength':
        isValid = validators.minLength(value, rule.value);
        break;

      case 'maxLength':
        isValid = validators.maxLength(value, rule.value);
        break;

      case 'pattern':
        isValid = validators.pattern(value, rule.value);
        break;

      case 'email':
        isValid = validators.email(value);
        break;

      case 'url':
        isValid = validators.url(value);
        break;

      case 'phone':
        isValid = validators.phone(value);
        break;

      case 'custom':
        if (rule.validator) {
          const result = rule.validator(value);
          if (typeof result === 'boolean') {
            isValid = result;
          } else {
            isValid = false;
            errorMessage = result;
          }
        }
        break;

      default:
        isValid = true;
    }

    return {
      isValid,
      errorMessage: errorMessage || rule.message,
      failedRule: isValid ? undefined : rule
    };
  }, [validators]);

  // Validate all rules
  const validateField = useCallback((value: string): ValidationResult => {
    if (validationRules.length === 0) {
      return { isValid: true };
    }

    for (const rule of validationRules) {
      const result = validateRule(rule, value);
      if (!result.isValid) {
        setValidationError(result.errorMessage);
        return result;
      }
    }

    setValidationError(null);
    return { isValid: true };
  }, [validationRules, validateRule]);

  // Clear validation error
  const clearValidation = useCallback(() => {
    setValidationError(null);
  }, []);

  // Validate on specific events
  const validateOnBlur = useCallback((value: string) => {
    const blurRules = validationRules.filter(rule => rule.validateOnBlur !== false);
    if (blurRules.length > 0) {
      validateField(value);
    }
  }, [validationRules, validateField]);

  const validateOnChange = useCallback((value: string) => {
    const changeRules = validationRules.filter(rule => rule.validateOnChange === true);
    if (changeRules.length > 0) {
      validateField(value);
    }
  }, [validationRules, validateField]);

  // Check if field is valid
  const isValid = useMemo(() => {
    return !validationError;
  }, [validationError]);

  // Get validation summary
  const getValidationSummary = useCallback((value: string) => {
    const results = validationRules.map(rule => validateRule(rule, value));
    const failedRules = results.filter(result => !result.isValid);
    
    return {
      isValid: failedRules.length === 0,
      failedRules,
      errorMessages: failedRules.map(rule => rule.errorMessage),
      passedRules: results.filter(result => result.isValid)
    };
  }, [validationRules, validateRule]);

  return {
    validationError,
    isValid,
    validateField,
    validateOnBlur,
    validateOnChange,
    clearValidation,
    getValidationSummary
  };
}; 