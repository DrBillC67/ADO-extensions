import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Stack,
  Text,
  TextField,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  IconButton,
  TooltipHost,
  DirectionalHint,
  Callout,
  FocusTrapCallout
} from '@fluentui/react';
import {
  InfoRegular,
  WarningRegular,
  CheckmarkRegular,
  ErrorCircleRegular
} from '@fluentui/react-icons';
import { PatternControlProps, PatternControlState } from '../../types/ControlsLibrary.types';
import { usePatternControl } from '../../hooks/usePatternControl';
import './PatternControl.scss';

export const PatternControl: React.FC<PatternControlProps> = ({
  fieldName,
  pattern,
  errorMessage,
  value,
  onChange,
  placeholder = 'Enter value...',
  multiline = false,
  rows = 3,
  maxLength,
  disabled = false,
  required = false,
  label,
  error,
  info,
  className,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const [showInfoCallout, setShowInfoCallout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Custom hook for pattern validation logic
  const {
    value: hookValue,
    isValid,
    validationError,
    focused,
    handleChange,
    handleFocus,
    handleBlur,
    validate
  } = usePatternControl(pattern, value, onChange);

  // Update internal value when props change
  useEffect(() => {
    setInternalValue(value || '');
  }, [value]);

  // Handle input change
  const handleInputChange = useCallback((_, newValue?: string) => {
    const newVal = newValue || '';
    setInternalValue(newVal);
    handleChange(newVal);
  }, [handleChange]);

  // Handle focus
  const handleFocusCallback = useCallback(() => {
    setIsFocused(true);
    handleFocus();
  }, [handleFocus]);

  // Handle blur
  const handleBlurCallback = useCallback(() => {
    setIsFocused(false);
    handleBlur();
  }, [handleBlur]);

  // Handle info icon click
  const handleInfoClick = useCallback(() => {
    setShowInfoCallout(!showInfoCallout);
  }, [showInfoCallout]);

  // Validate pattern on mount and when pattern changes
  useEffect(() => {
    if (internalValue) {
      validate(internalValue);
    }
  }, [pattern, validate, internalValue]);

  // Determine validation state
  const validationState = useMemo(() => {
    if (!internalValue) {
      return 'empty';
    }
    if (isValid) {
      return 'valid';
    }
    return 'invalid';
  }, [internalValue, isValid]);

  // Get validation message
  const getValidationMessage = useCallback(() => {
    if (error) return error;
    if (validationError) return validationError;
    if (errorMessage && !isValid && internalValue) return errorMessage;
    return '';
  }, [error, validationError, errorMessage, isValid, internalValue]);

  // Render validation icon
  const renderValidationIcon = () => {
    if (!internalValue) return null;

    switch (validationState) {
      case 'valid':
        return (
          <div className="validation-icon valid">
            <CheckmarkRegular />
          </div>
        );
      case 'invalid':
        return (
          <div className="validation-icon invalid">
            <ErrorCircleRegular />
          </div>
        );
      default:
        return null;
    }
  };

  // Render info callout
  const renderInfoCallout = () => {
    if (!showInfoCallout || !info) return null;

    return (
      <Callout
        target={`#${fieldName}-info-icon`}
        onDismiss={() => setShowInfoCallout(false)}
        directionalHint={DirectionalHint.topCenter}
        className="info-callout"
        role="dialog"
        aria-label="Pattern information"
      >
        <FocusTrapCallout>
          <div className="info-content">
            <Stack gap={8}>
              <Text variant="medium" className="info-title">
                Pattern Information
              </Text>
              <Text variant="small" className="info-text">
                {info}
              </Text>
              {pattern && (
                <div className="pattern-info">
                  <Text variant="small" className="pattern-label">
                    Pattern:
                  </Text>
                  <Text variant="small" className="pattern-value">
                    {pattern}
                  </Text>
                </div>
              )}
            </Stack>
          </div>
        </FocusTrapCallout>
      </Callout>
    );
  };

  // Render error message
  const renderErrorMessage = () => {
    const message = getValidationMessage();
    if (!message) return null;

    return (
      <MessageBar 
        messageBarType={MessageBarType.error} 
        className="pattern-error"
        isMultiline={false}
      >
        <Text variant="small">{message}</Text>
      </MessageBar>
    );
  };

  // Render info message
  const renderInfoMessage = () => {
    if (!info) return null;

    return (
      <Text variant="small" className="pattern-info-message">
        {info}
      </Text>
    );
  };

  // Determine if control is active
  const isActive = isFocused || showInfoCallout;

  return (
    <div className={`pattern-control ${className || ''}`} {...props}>
      <Stack gap={8}>
        {/* Label */}
        {label && (
          <div className="pattern-label-container">
            <Text variant="medium" className="pattern-label">
              {label}
              {required && <span className="required-indicator">*</span>}
            </Text>
            {info && (
              <IconButton
                id={`${fieldName}-info-icon`}
                icon={<InfoRegular />}
                onClick={handleInfoClick}
                className="info-icon"
                ariaLabel="Pattern information"
                title="Pattern information"
              />
            )}
          </div>
        )}

        {/* Input Container */}
        <div
          className={`pattern-input-container ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''} ${validationState}`}
          onFocus={handleFocusCallback}
          onBlur={handleBlurCallback}
        >
          {/* Input Field */}
          <TextField
            value={internalValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            multiline={multiline}
            rows={multiline ? rows : undefined}
            maxLength={maxLength}
            disabled={disabled}
            required={required}
            className="pattern-input"
            borderless
            autoComplete="off"
            spellCheck={false}
            aria-label={label || 'Pattern input'}
            aria-invalid={!isValid && internalValue ? 'true' : 'false'}
            aria-describedby={getValidationMessage() ? `${fieldName}-error` : undefined}
          />

          {/* Validation Icon */}
          {renderValidationIcon()}

          {/* Loading State */}
          {isLoading && (
            <div className="pattern-loading">
              <Spinner size={SpinnerSize.small} />
            </div>
          )}
        </div>

        {/* Error Message */}
        {renderErrorMessage()}

        {/* Info Message */}
        {renderInfoMessage()}

        {/* Info Callout */}
        {renderInfoCallout()}
      </Stack>
    </div>
  );
}; 