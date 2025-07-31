import { useState, useCallback, useEffect } from 'react';
import { UsePatternControlReturn } from '../types/ControlsLibrary.types';

export const usePatternControl = (
  pattern: string,
  value: string | undefined,
  onChange?: (value: string) => void
): UsePatternControlReturn => {
  const [internalValue, setInternalValue] = useState(value || '');
  const [isValid, setIsValid] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  // Update internal value when prop changes
  useEffect(() => {
    setInternalValue(value || '');
  }, [value]);

  // Validate pattern
  const validate = useCallback((inputValue: string) => {
    if (!pattern) {
      setIsValid(true);
      setValidationError(null);
      return true;
    }

    try {
      const regex = new RegExp(pattern);
      const valid = regex.test(inputValue);
      setIsValid(valid);
      setValidationError(valid ? null : 'Value does not match required pattern');
      return valid;
    } catch (error) {
      setIsValid(false);
      setValidationError('Invalid pattern');
      return false;
    }
  }, [pattern]);

  // Set value
  const setValue = useCallback((newValue: string) => {
    setInternalValue(newValue);
    validate(newValue);
  }, [validate]);

  // Set focused state
  const setFocusedState = useCallback((focused: boolean) => {
    setFocused(focused);
  }, []);

  // Handle change
  const handleChange = useCallback((newValue: string) => {
    setInternalValue(newValue);
    validate(newValue);
    onChange?.(newValue);
  }, [onChange, validate]);

  // Handle focus
  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);

  // Handle blur
  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);

  return {
    value: internalValue,
    isValid,
    validationError,
    focused,
    setValue,
    setFocused: setFocusedState,
    validate,
    handleChange,
    handleFocus,
    handleBlur
  };
}; 