import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Stack,
  Text,
  TextField,
  IconButton,
  TooltipHost,
  DirectionalHint,
  Callout,
  FocusTrapCallout,
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType
} from '@fluentui/react';
import {
  CalendarRegular,
  ClearRegular,
  ClockRegular
} from '@fluentui/react-icons';
import { format, isValid, parse } from 'date-fns';
import { DateTimeControlProps, DateTimeControlState } from '../../types/ControlsLibrary.types';
import { useDateTimeControl } from '../../hooks/useDateTimeControl';
import { DateTimePicker } from 'Common/Components/DateTimePicker';
import './DateTimeControl.scss';

export const DateTimeControl: React.FC<DateTimeControlProps> = ({
  fieldName,
  value,
  onChange,
  showTime = true,
  format: dateFormat = 'M/d/yyyy h:mm a',
  placeholder = 'Select date and time...',
  minDate,
  maxDate,
  today = new Date(),
  disabled = false,
  required = false,
  label,
  error,
  info,
  className,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<Date | null>(value || null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Custom hook for date/time logic
  const {
    value: hookValue,
    expanded,
    hovered,
    focused,
    handleDateSelect,
    handleClear,
    handleToggle,
    handleFocus,
    handleBlur,
    handleMouseEnter,
    handleMouseLeave
  } = useDateTimeControl(value, onChange);

  // Update internal state when props change
  useEffect(() => {
    setInternalValue(value || null);
    if (value) {
      setInputValue(format(value, dateFormat));
    } else {
      setInputValue('');
    }
  }, [value, dateFormat]);

  // Handle date selection
  const handleDateSelectCallback = useCallback((date: Date) => {
    setInternalValue(date);
    setInputValue(format(date, dateFormat));
    setIsExpanded(false);
    setValidationError(null);
    onChange?.(date);
  }, [dateFormat, onChange]);

  // Handle clear
  const handleClearCallback = useCallback(() => {
    setInternalValue(null);
    setInputValue('');
    setValidationError(null);
    onChange?.(null);
  }, [onChange]);

  // Handle input change
  const handleInputChange = useCallback((_, newValue?: string) => {
    setInputValue(newValue || '');
    
    if (newValue) {
      try {
        const parsedDate = parse(newValue, dateFormat, new Date());
        if (isValid(parsedDate)) {
          setInternalValue(parsedDate);
          setValidationError(null);
          onChange?.(parsedDate);
        } else {
          setValidationError('Invalid date format');
        }
      } catch (error) {
        setValidationError('Invalid date format');
      }
    } else {
      setInternalValue(null);
      setValidationError(null);
      onChange?.(null);
    }
  }, [dateFormat, onChange]);

  // Handle toggle calendar
  const handleToggleCalendar = useCallback(() => {
    if (!disabled) {
      setIsExpanded(!isExpanded);
    }
  }, [disabled, isExpanded]);

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

  // Handle mouse enter
  const handleMouseEnterCallback = useCallback(() => {
    setIsHovered(true);
    handleMouseEnter();
  }, [handleMouseEnter]);

  // Handle mouse leave
  const handleMouseLeaveCallback = useCallback(() => {
    setIsHovered(false);
    handleMouseLeave();
  }, [handleMouseLeave]);

  // Handle keyboard events
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggleCalendar();
    } else if (event.key === 'Escape') {
      setIsExpanded(false);
    }
  }, [handleToggleCalendar]);

  // Validate date range
  const validateDateRange = useCallback((date: Date) => {
    if (minDate && date < minDate) {
      return `Date cannot be earlier than ${format(minDate, 'M/d/yyyy')}`;
    }
    if (maxDate && date > maxDate) {
      return `Date cannot be later than ${format(maxDate, 'M/d/yyyy')}`;
    }
    return null;
  }, [minDate, maxDate]);

  // Format display value
  const displayValue = useMemo(() => {
    if (!internalValue) return '';
    return format(internalValue, dateFormat);
  }, [internalValue, dateFormat]);

  // Determine if control is active
  const isActive = isHovered || isFocused || isExpanded;

  // Render calendar icon
  const renderCalendarIcon = () => (
    <IconButton
      icon={<CalendarRegular />}
      onClick={handleToggleCalendar}
      disabled={disabled}
      className="date-time-picker-icon"
      ariaLabel="Open calendar"
      title="Open calendar"
    />
  );

  // Render time icon
  const renderTimeIcon = () => (
    <IconButton
      icon={<ClockRegular />}
      onClick={handleToggleCalendar}
      disabled={disabled}
      className="date-time-picker-icon time-icon"
      ariaLabel="Select time"
      title="Select time"
    />
  );

  // Render clear button
  const renderClearButton = () => {
    if (!internalValue || disabled) return null;

    return (
      <IconButton
        icon={<ClearRegular />}
        onClick={handleClearCallback}
        disabled={disabled}
        className="date-time-picker-icon clear-icon"
        ariaLabel="Clear date"
        title="Clear date"
      />
    );
  };

  // Render calendar callout
  const renderCalendarCallout = () => {
    if (!isExpanded) return null;

    return (
      <Callout
        target={`#${fieldName}-datetime-control`}
        onDismiss={() => setIsExpanded(false)}
        directionalHint={DirectionalHint.bottomLeftEdge}
        className="date-time-picker-callout"
        role="dialog"
        aria-label="Date and time picker"
      >
        <FocusTrapCallout
          focusTrapProps={{
            isClickableOutsideFocusTrap: true
          }}
        >
          <div className="date-time-picker-content">
            <DateTimePicker
              onSelectDate={handleDateSelectCallback}
              today={today}
              value={internalValue || today}
              minDate={minDate}
              maxDate={maxDate}
              showTime={showTime}
              format={dateFormat}
            />
          </div>
        </FocusTrapCallout>
      </Callout>
    );
  };

  // Render error message
  const renderError = () => {
    const errorMessage = error || validationError;
    if (!errorMessage) return null;

    return (
      <MessageBar messageBarType={MessageBarType.error} className="date-time-error">
        <Text variant="small">{errorMessage}</Text>
      </MessageBar>
    );
  };

  // Render info message
  const renderInfo = () => {
    if (!info) return null;

    return (
      <Text variant="small" className="date-time-info">
        {info}
      </Text>
    );
  };

  return (
    <div className={`date-time-control ${className || ''}`} {...props}>
      <Stack gap={8}>
        {/* Label */}
        {label && (
          <Text variant="medium" className="date-time-label">
            {label}
            {required && <span className="required-indicator">*</span>}
          </Text>
        )}

        {/* Control Container */}
        <div
          id={`${fieldName}-datetime-control`}
          className={`date-time-picker-input-container ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
          onMouseEnter={handleMouseEnterCallback}
          onMouseLeave={handleMouseLeaveCallback}
          onFocus={handleFocusCallback}
          onBlur={handleBlurCallback}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isExpanded}
          aria-haspopup="dialog"
          aria-label={label || 'Date and time picker'}
          aria-required={required}
          aria-invalid={!!error}
        >
          {/* Input Field */}
          <TextField
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className="date-time-picker-input"
            borderless
            autoComplete="off"
            spellCheck={false}
            aria-label="Date and time input"
          />

          {/* Action Buttons */}
          <div className="date-time-picker-actions">
            {renderClearButton()}
            {showTime ? renderTimeIcon() : renderCalendarIcon()}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="date-time-loading">
              <Spinner size={SpinnerSize.small} />
            </div>
          )}
        </div>

        {/* Error Message */}
        {renderError()}

        {/* Info Message */}
        {renderInfo()}

        {/* Calendar Callout */}
        {renderCalendarCallout()}
      </Stack>
    </div>
  );
}; 