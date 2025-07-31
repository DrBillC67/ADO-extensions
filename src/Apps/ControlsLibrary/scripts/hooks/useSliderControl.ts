import { useState, useCallback, useEffect } from 'react';
import { UseSliderControlReturn } from '../types/ControlsLibrary.types';

export const useSliderControl = (
  min: number,
  max: number,
  step: number,
  value: number | undefined,
  onChange?: (value: number) => void
): UseSliderControlReturn => {
  const [internalValue, setInternalValue] = useState(value || min);
  const [isValid, setIsValid] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Update internal value when prop changes
  useEffect(() => {
    setInternalValue(value || min);
  }, [value, min]);

  // Validate value
  const validate = useCallback((inputValue: number) => {
    if (inputValue < min) {
      setIsValid(false);
      setValidationError(`Value must be at least ${min}`);
      return false;
    }
    
    if (inputValue > max) {
      setIsValid(false);
      setValidationError(`Value must be at most ${max}`);
      return false;
    }

    // Check if value is a valid step
    const remainder = (inputValue - min) % step;
    if (Math.abs(remainder) > 0.001) { // Allow for floating point precision
      setIsValid(false);
      setValidationError(`Value must be a multiple of ${step}`);
      return false;
    }

    setIsValid(true);
    setValidationError(null);
    return true;
  }, [min, max, step]);

  // Set value
  const setValue = useCallback((newValue: number) => {
    setInternalValue(newValue);
    validate(newValue);
  }, [validate]);

  // Handle change
  const handleChange = useCallback((newValue: number) => {
    setInternalValue(newValue);
    validate(newValue);
    onChange?.(newValue);
  }, [onChange, validate]);

  // Handle input change
  const handleInputChange = useCallback((newValue: number) => {
    // Clamp value to min/max range
    const clampedValue = Math.max(min, Math.min(max, newValue));
    
    // Round to nearest step
    const roundedValue = Math.round(clampedValue / step) * step;
    
    setInternalValue(roundedValue);
    validate(roundedValue);
    onChange?.(roundedValue);
  }, [min, max, step, onChange, validate]);

  return {
    value: internalValue,
    isValid,
    validationError,
    setValue,
    validate,
    handleChange,
    handleInputChange
  };
}; 