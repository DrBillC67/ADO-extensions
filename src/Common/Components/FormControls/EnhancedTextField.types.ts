import { ITextFieldProps } from '@fluentui/react';

export interface EnhancedTextFieldProps extends Omit<ITextFieldProps, 'onChange'> {
  /** Current value of the field */
  value?: string;
  /** Callback when value changes */
  onChange?: (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => void;
  /** Validation rules for the field */
  validationRules?: ValidationRule[];
  /** Formatting configuration for the field */
  format?: FieldFormat;
  /** Whether to show character count */
  showCharacterCount?: boolean;
  /** Whether to show password toggle button */
  showPasswordToggle?: boolean;
  /** Whether to show copy to clipboard button */
  showCopyButton?: boolean;
  /** Whether to show clear field button */
  showClearButton?: boolean;
  /** Whether to show info icon */
  showInfoIcon?: boolean;
  /** Info text to display in tooltip */
  infoText?: string;
  /** Whether the field is in loading state */
  loading?: boolean;
  /** Additional CSS class name */
  className?: string;
  /** Additional props to pass to the container div */
  [key: string]: any;
}

export interface ValidationRule {
  /** Type of validation */
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'url' | 'phone' | 'custom';
  /** Validation value (e.g., min length, pattern) */
  value?: any;
  /** Error message to display */
  message: string;
  /** Custom validation function */
  validator?: (value: string) => boolean | string;
  /** Whether to validate on blur */
  validateOnBlur?: boolean;
  /** Whether to validate on change */
  validateOnChange?: boolean;
}

export interface FieldFormat {
  /** Type of formatting */
  type: 'phone' | 'currency' | 'date' | 'time' | 'number' | 'uppercase' | 'lowercase' | 'capitalize' | 'custom';
  /** Format pattern (e.g., phone format, currency symbol) */
  pattern?: string;
  /** Custom formatting function */
  formatter?: (value: string) => string;
  /** Custom unformatting function */
  unformatter?: (value: string) => string;
  /** Locale for formatting */
  locale?: string;
  /** Currency code for currency formatting */
  currency?: string;
  /** Date format for date formatting */
  dateFormat?: string;
  /** Time format for time formatting */
  timeFormat?: string;
}

export interface ValidationResult {
  /** Whether the validation passed */
  isValid: boolean;
  /** Error message if validation failed */
  errorMessage?: string;
  /** Validation rule that failed */
  failedRule?: ValidationRule;
}

export interface FieldFormatResult {
  /** Formatted value */
  formattedValue: string;
  /** Whether formatting was applied */
  wasFormatted: boolean;
  /** Original value before formatting */
  originalValue: string;
}

export interface EnhancedTextFieldState {
  /** Internal value */
  value: string;
  /** Whether password is visible */
  showPassword: boolean;
  /** Whether field is focused */
  isFocused: boolean;
  /** Whether field has been touched */
  hasBeenTouched: boolean;
  /** Current validation error */
  validationError: string | null;
  /** Whether field is in error state */
  hasError: boolean;
}

export interface ValidationContext {
  /** Current field value */
  value: string;
  /** Field label */
  label?: string;
  /** Whether field is required */
  required?: boolean;
  /** Maximum length */
  maxLength?: number;
  /** Minimum length */
  minLength?: number;
  /** Field type */
  type?: string;
}

export interface FormatContext {
  /** Current field value */
  value: string;
  /** Format configuration */
  format: FieldFormat;
  /** Field type */
  type?: string;
  /** Locale */
  locale?: string;
} 