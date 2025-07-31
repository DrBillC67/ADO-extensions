import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Stack,
  Text,
  Slider,
  TextField,
  MessageBar,
  MessageBarType,
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
import { SliderControlProps, SliderControlState } from '../../types/ControlsLibrary.types';
import { useSliderControl } from '../../hooks/useSliderControl';
import './SliderControl.scss';

export const SliderControl: React.FC<SliderControlProps> = ({
  fieldName,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  showValue = true,
  showInput = true,
  disabled = false,
  required = false,
  label,
  error,
  info,
  className,
  marks,
  vertical = false,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(value || min);
  const [showInfoCallout, setShowInfoCallout] = useState(false);
  const [inputValue, setInputValue] = useState(String(value || min));

  // Custom hook for slider logic
  const {
    value: hookValue,
    isValid,
    validationError,
    handleChange,
    handleInputChange,
    validate
  } = useSliderControl(min, max, step, value, onChange);

  // Update internal value when props change
  useEffect(() => {
    const newValue = value || min;
    setInternalValue(newValue);
    setInputValue(String(newValue));
  }, [value, min]);

  // Handle slider change
  const handleSliderChange = useCallback((newValue: number) => {
    setInternalValue(newValue);
    setInputValue(String(newValue));
    handleChange(newValue);
  }, [handleChange]);

  // Handle input change
  const handleInputChangeCallback = useCallback((_, newValue?: string) => {
    const numValue = parseFloat(newValue || '0');
    setInputValue(newValue || '0');
    
    if (!isNaN(numValue)) {
      handleInputChange(numValue);
    }
  }, [handleInputChange]);

  // Handle info icon click
  const handleInfoClick = useCallback(() => {
    setShowInfoCallout(!showInfoCallout);
  }, [showInfoCallout]);

  // Validate value on mount and when constraints change
  useEffect(() => {
    validate(internalValue);
  }, [min, max, step, validate, internalValue]);

  // Calculate percentage for marks
  const calculateMarkPosition = useCallback((markValue: number) => {
    return ((markValue - min) / (max - min)) * 100;
  }, [min, max]);

  // Render marks
  const renderMarks = () => {
    if (!marks || marks.length === 0) return null;

    return (
      <div className="slider-marks">
        {marks.map((mark, index) => (
          <div
            key={index}
            className="slider-mark"
            style={{
              left: `${calculateMarkPosition(mark.value)}%`
            }}
          >
            <div className="mark-line" />
            <Text variant="small" className="mark-label">
              {mark.label || mark.value}
            </Text>
          </div>
        ))}
      </div>
    );
  };

  // Render validation icon
  const renderValidationIcon = () => {
    if (!isValid && internalValue !== min) {
      return (
        <div className="validation-icon invalid">
          <ErrorCircleRegular />
        </div>
      );
    }
    return null;
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
        aria-label="Slider information"
      >
        <FocusTrapCallout>
          <div className="info-content">
            <Stack gap={8}>
              <Text variant="medium" className="info-title">
                Slider Information
              </Text>
              <Text variant="small" className="info-text">
                {info}
              </Text>
              <div className="slider-info">
                <Text variant="small" className="info-label">
                  Range:
                </Text>
                <Text variant="small" className="info-value">
                  {min} - {max}
                </Text>
                <Text variant="small" className="info-label">
                  Step:
                </Text>
                <Text variant="small" className="info-value">
                  {step}
                </Text>
              </div>
            </Stack>
          </div>
        </FocusTrapCallout>
      </Callout>
    );
  };

  // Render error message
  const renderErrorMessage = () => {
    const message = error || validationError;
    if (!message) return null;

    return (
      <MessageBar 
        messageBarType={MessageBarType.error} 
        className="slider-error"
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
      <Text variant="small" className="slider-info-message">
        {info}
      </Text>
    );
  };

  return (
    <div className={`slider-control ${className || ''} ${vertical ? 'vertical' : ''}`} {...props}>
      <Stack gap={8}>
        {/* Label */}
        {label && (
          <div className="slider-label-container">
            <Text variant="medium" className="slider-label">
              {label}
              {required && <span className="required-indicator">*</span>}
            </Text>
            {info && (
              <IconButton
                id={`${fieldName}-info-icon`}
                icon={<InfoRegular />}
                onClick={handleInfoClick}
                className="info-icon"
                ariaLabel="Slider information"
                title="Slider information"
              />
            )}
          </div>
        )}

        {/* Slider Container */}
        <div className="slider-container">
          {/* Slider */}
          <div className="slider-wrapper">
            <Slider
              min={min}
              max={max}
              step={step}
              value={internalValue}
              onChange={handleSliderChange}
              disabled={disabled}
              showValue={false}
              vertical={vertical}
              className="slider-component"
              aria-label={label || 'Slider'}
              aria-describedby={error ? `${fieldName}-error` : undefined}
            />
            
            {/* Marks */}
            {renderMarks()}
          </div>

          {/* Value Display */}
          {showValue && (
            <div className="value-display">
              <Text variant="medium" className="value-text">
                {internalValue}
              </Text>
              {renderValidationIcon()}
            </div>
          )}

          {/* Input Field */}
          {showInput && (
            <div className="input-wrapper">
              <TextField
                value={inputValue}
                onChange={handleInputChangeCallback}
                type="number"
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                className="slider-input"
                borderless
                autoComplete="off"
                aria-label={`${label || 'Slider'} value`}
              />
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