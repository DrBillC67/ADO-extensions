import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TextField,
  ITextFieldProps,
  ITextFieldStyles,
  Stack,
  Text,
  IconButton,
  TooltipHost,
  DirectionalHint,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize
} from '@fluentui/react';
import {
  EyeRegular,
  EyeOffRegular,
  CopyRegular,
  ClearRegular,
  InfoRegular,
  WarningRegular
} from '@fluentui/react-icons';
import { EnhancedTextFieldProps, ValidationRule, FieldFormat } from './EnhancedTextField.types';
import { useValidation } from './hooks/useValidation';
import { useFieldFormatting } from './hooks/useFieldFormatting';
import './EnhancedTextField.scss';

export const EnhancedTextField: React.FC<EnhancedTextFieldProps> = ({
  value = '',
  onChange,
  label,
  required = false,
  disabled = false,
  readOnly = false,
  placeholder,
  description,
  error,
  validationRules = [],
  format,
  showCharacterCount = false,
  maxLength,
  showPasswordToggle = false,
  showCopyButton = false,
  showClearButton = false,
  showInfoIcon = false,
  infoText,
  loading = false,
  autoComplete,
  autoFocus = false,
  multiline = false,
  rows = 3,
  resizable = true,
  className,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  // Validation hook
  const { validationError, validateField, clearValidation } = useValidation(validationRules);

  // Formatting hook
  const { formatValue, unformatValue } = useFieldFormatting(format);

  // Update internal value when prop changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Handle value change
  const handleChange = useCallback((event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    let processedValue = newValue || '';

    // Apply formatting if specified
    if (format && processedValue) {
      processedValue = formatValue(processedValue);
    }

    // Update internal state
    setInternalValue(processedValue);

    // Validate field
    if (hasBeenTouched) {
      validateField(processedValue);
    }

    // Call parent onChange
    onChange?.(event, processedValue);
  }, [format, formatValue, hasBeenTouched, validateField, onChange]);

  // Handle focus
  const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(true);
    props.onFocus?.(event);
  }, [props]);

  // Handle blur
  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(false);
    setHasBeenTouched(true);
    
    // Validate on blur
    validateField(internalValue);
    
    props.onBlur?.(event);
  }, [internalValue, validateField, props]);

  // Handle password toggle
  const handlePasswordToggle = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  // Handle copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(internalValue);
      // Could show a success toast here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, [internalValue]);

  // Handle clear field
  const handleClear = useCallback(() => {
    setInternalValue('');
    clearValidation();
    onChange?.(null as any, '');
  }, [clearValidation, onChange]);

  // Determine field type
  const fieldType = useMemo(() => {
    if (showPasswordToggle && !showPassword) {
      return 'password';
    }
    return props.type || 'text';
  }, [showPasswordToggle, showPassword, props.type]);

  // Character count
  const characterCount = useMemo(() => {
    return internalValue.length;
  }, [internalValue]);

  // Determine error message
  const errorMessage = useMemo(() => {
    return error || validationError;
  }, [error, validationError]);

  // Determine if field is in error state
  const hasError = useMemo(() => {
    return !!errorMessage;
  }, [errorMessage]);

  // Field styles
  const fieldStyles = useMemo((): ITextFieldStyles => ({
    root: {
      width: '100%'
    },
    fieldGroup: {
      borderColor: hasError ? 'var(--errorText)' : isFocused ? 'var(--themePrimary)' : 'var(--neutralTertiary)',
      '&:hover': {
        borderColor: hasError ? 'var(--errorText)' : 'var(--neutralSecondary)'
      }
    },
    field: {
      color: disabled ? 'var(--neutralTertiary)' : 'var(--neutralPrimary)',
      backgroundColor: disabled ? 'var(--neutralLighter)' : 'var(--white)'
    },
    subComponentStyles: {
      label: {
        root: {
          color: hasError ? 'var(--errorText)' : 'var(--neutralPrimary)',
          fontWeight: required ? 600 : 400
        }
      }
    }
  }), [hasError, isFocused, disabled, required]);

  // Render suffix (buttons)
  const renderSuffix = useCallback(() => {
    const buttons = [];

    // Loading spinner
    if (loading) {
      buttons.push(
        <Spinner key="loading" size={SpinnerSize.small} />
      );
    }

    // Clear button
    if (showClearButton && internalValue && !disabled && !readOnly) {
      buttons.push(
        <TooltipHost key="clear" content="Clear field" directionalHint={DirectionalHint.bottomRightEdge}>
          <IconButton
            icon={<ClearRegular />}
            onClick={handleClear}
            className="field-button clear-button"
            ariaLabel="Clear field"
          />
        </TooltipHost>
      );
    }

    // Copy button
    if (showCopyButton && internalValue && !disabled) {
      buttons.push(
        <TooltipHost key="copy" content="Copy to clipboard" directionalHint={DirectionalHint.bottomRightEdge}>
          <IconButton
            icon={<CopyRegular />}
            onClick={handleCopy}
            className="field-button copy-button"
            ariaLabel="Copy to clipboard"
          />
        </TooltipHost>
      );
    }

    // Password toggle
    if (showPasswordToggle && !disabled) {
      buttons.push(
        <TooltipHost key="password" content={showPassword ? "Hide password" : "Show password"} directionalHint={DirectionalHint.bottomRightEdge}>
          <IconButton
            icon={showPassword ? <EyeOffRegular /> : <EyeRegular />}
            onClick={handlePasswordToggle}
            className="field-button password-button"
            ariaLabel={showPassword ? "Hide password" : "Show password"}
          />
        </TooltipHost>
      );
    }

    // Info icon
    if (showInfoIcon && infoText) {
      buttons.push(
        <TooltipHost key="info" content={infoText} directionalHint={DirectionalHint.bottomRightEdge}>
          <IconButton
            icon={<InfoRegular />}
            className="field-button info-button"
            ariaLabel="Information"
          />
        </TooltipHost>
      );
    }

    return buttons.length > 0 ? buttons : undefined;
  }, [loading, showClearButton, internalValue, disabled, readOnly, showCopyButton, showPasswordToggle, showPassword, showInfoIcon, infoText, handleClear, handleCopy, handlePasswordToggle]);

  return (
    <div className={`enhanced-text-field ${className || ''} ${hasError ? 'has-error' : ''} ${isFocused ? 'focused' : ''}`}>
      <Stack gap={4}>
        {/* Main TextField */}
        <TextField
          value={internalValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          label={label}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          description={description}
          errorMessage={errorMessage}
          maxLength={maxLength}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          multiline={multiline}
          rows={rows}
          resizable={resizable}
          type={fieldType}
          styles={fieldStyles}
          onRenderSuffix={renderSuffix}
          {...props}
        />

        {/* Character Count */}
        {showCharacterCount && maxLength && (
          <Text variant="small" className="character-count">
            {characterCount} / {maxLength} characters
          </Text>
        )}

        {/* Validation Message */}
        {hasError && (
          <MessageBar
            messageBarType={MessageBarType.error}
            className="validation-message"
            isMultiline={false}
          >
            <Text variant="small">
              {errorMessage}
            </Text>
          </MessageBar>
        )}

        {/* Warning for required field */}
        {required && !internalValue && hasBeenTouched && (
          <MessageBar
            messageBarType={MessageBarType.warning}
            className="required-message"
            isMultiline={false}
          >
            <Text variant="small">
              This field is required
            </Text>
          </MessageBar>
        )}
      </Stack>
    </div>
  );
}; 