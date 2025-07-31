import { WorkItemField } from 'TFS/WorkItemTracking/Contracts';

// Base Control Props
export interface BaseControlProps {
  className?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  error?: string;
  info?: string;
}

// DateTime Control Types
export interface DateTimeControlProps extends BaseControlProps {
  fieldName: string;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  showTime?: boolean;
  format?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  today?: Date;
}

export interface DateTimeControlState {
  expanded: boolean;
  hovered: boolean;
  focused: boolean;
  value: Date | null;
}

// Pattern Control Types
export interface PatternControlProps extends BaseControlProps {
  fieldName: string;
  pattern: string;
  errorMessage?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
}

export interface PatternControlState {
  value: string;
  isValid: boolean;
  validationError: string | null;
  focused: boolean;
}

// Slider Control Types
export interface SliderControlProps extends BaseControlProps {
  fieldName: string;
  minValue: number;
  maxValue: number;
  stepSize: number;
  value?: number;
  onChange?: (value: number) => void;
  showValue?: boolean;
  showLabels?: boolean;
  vertical?: boolean;
  marks?: SliderMark[];
}

export interface SliderMark {
  value: number;
  label: string;
}

export interface SliderControlState {
  value: number;
  dragging: boolean;
  focused: boolean;
}

// Rating Control Types
export interface RatingControlProps extends BaseControlProps {
  fieldName: string;
  minValue: number;
  maxValue: number;
  value?: number;
  onChange?: (value: number) => void;
  size?: 'small' | 'medium' | 'large';
  allowHalf?: boolean;
  readonly?: boolean;
  showValue?: boolean;
  icon?: string;
}

export interface RatingControlState {
  value: number;
  hoverValue: number;
  focused: boolean;
}

// MultiValue Control Types
export interface MultiValueControlProps extends BaseControlProps {
  fieldName: string;
  values: string[];
  selectedValues?: string[];
  onChange?: (values: string[]) => void;
  placeholder?: string;
  allowCustom?: boolean;
  maxItems?: number;
  searchable?: boolean;
  creatable?: boolean;
  caseSensitive?: boolean;
}

export interface MultiValueControlState {
  selectedValues: string[];
  inputValue: string;
  suggestions: string[];
  focused: boolean;
  expanded: boolean;
  highlightedIndex: number;
}

// Plain Text Control Types
export interface PlainTextControlProps extends BaseControlProps {
  text: string;
  maxHeight?: number;
  showMarkdown?: boolean;
  showFieldSubstitution?: boolean;
  fieldValues?: Record<string, any>;
  className?: string;
}

export interface PlainTextControlState {
  processedText: string;
  expanded: boolean;
  showFullText: boolean;
}

// Work Item Field Types
export interface WorkItemFieldControlProps extends BaseControlProps {
  field: WorkItemField;
  value?: any;
  onChange?: (value: any) => void;
  onSave?: () => void;
  onCancel?: () => void;
  readOnly?: boolean;
  autoSave?: boolean;
  saveDelay?: number;
}

// Form Validation Types
export interface ValidationRule {
  type: 'required' | 'pattern' | 'min' | 'max' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean | string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Theme Types
export interface ControlTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  errorColor: string;
  successColor: string;
  warningColor: string;
  disabledColor: string;
  focusColor: string;
  hoverColor: string;
}

// Accessibility Types
export interface AccessibilityProps {
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaLabelledBy?: string;
  ariaRequired?: boolean;
  ariaInvalid?: boolean;
  ariaExpanded?: boolean;
  ariaPressed?: boolean;
  ariaSelected?: boolean;
  role?: string;
  tabIndex?: number;
}

// Event Types
export interface ControlEvent {
  type: 'change' | 'focus' | 'blur' | 'keydown' | 'click' | 'save' | 'cancel';
  value?: any;
  fieldName?: string;
  timestamp: Date;
}

// API Response Types
export interface ControlApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

// Error Types
export interface ControlError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}

// Configuration Types
export interface ControlConfig {
  theme: ControlTheme;
  validation: {
    enabled: boolean;
    rules: ValidationRule[];
  };
  accessibility: {
    enabled: boolean;
    screenReaderSupport: boolean;
    keyboardNavigation: boolean;
  };
  performance: {
    debounceDelay: number;
    throttleDelay: number;
    lazyLoading: boolean;
  };
}

// Hook Return Types
export interface UseDateTimeControlReturn {
  value: Date | null;
  expanded: boolean;
  hovered: boolean;
  focused: boolean;
  setValue: (date: Date | null) => void;
  setExpanded: (expanded: boolean) => void;
  setHovered: (hovered: boolean) => void;
  setFocused: (focused: boolean) => void;
  handleDateSelect: (date: Date) => void;
  handleClear: () => void;
  handleToggle: () => void;
  handleFocus: () => void;
  handleBlur: () => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}

export interface UsePatternControlReturn {
  value: string;
  isValid: boolean;
  validationError: string | null;
  focused: boolean;
  setValue: (value: string) => void;
  setFocused: (focused: boolean) => void;
  validate: (value: string) => boolean;
  handleChange: (value: string) => void;
  handleFocus: () => void;
  handleBlur: () => void;
}

export interface UseSliderControlReturn {
  value: number;
  dragging: boolean;
  focused: boolean;
  setValue: (value: number) => void;
  setDragging: (dragging: boolean) => void;
  setFocused: (focused: boolean) => void;
  handleChange: (value: number) => void;
  handleMouseDown: () => void;
  handleMouseUp: () => void;
  handleFocus: () => void;
  handleBlur: () => void;
}

export interface UseRatingControlReturn {
  value: number;
  hoverValue: number;
  focused: boolean;
  setValue: (value: number) => void;
  setHoverValue: (value: number) => void;
  setFocused: (focused: boolean) => void;
  handleChange: (value: number) => void;
  handleHover: (value: number) => void;
  handleMouseLeave: () => void;
  handleFocus: () => void;
  handleBlur: () => void;
}

export interface UseMultiValueControlReturn {
  selectedValues: string[];
  inputValue: string;
  suggestions: string[];
  focused: boolean;
  expanded: boolean;
  highlightedIndex: number;
  setSelectedValues: (values: string[]) => void;
  setInputValue: (value: string) => void;
  setSuggestions: (suggestions: string[]) => void;
  setFocused: (focused: boolean) => void;
  setExpanded: (expanded: boolean) => void;
  setHighlightedIndex: (index: number) => void;
  handleInputChange: (value: string) => void;
  handleItemSelect: (value: string) => void;
  handleItemRemove: (value: string) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  handleFocus: () => void;
  handleBlur: () => void;
}

export interface UsePlainTextControlReturn {
  processedText: string;
  expanded: boolean;
  showFullText: boolean;
  setExpanded: (expanded: boolean) => void;
  setShowFullText: (show: boolean) => void;
  handleToggle: () => void;
  handleExpand: () => void;
  handleCollapse: () => void;
}

// Store Types
export interface ControlsLibraryState {
  config: ControlConfig;
  errors: ControlError[];
  events: ControlEvent[];
  loading: boolean;
}

export interface ControlsLibraryActions {
  updateConfig: (config: Partial<ControlConfig>) => void;
  addError: (error: ControlError) => void;
  clearErrors: () => void;
  addEvent: (event: ControlEvent) => void;
  clearEvents: () => void;
  setLoading: (loading: boolean) => void;
}

// Component Props Types
export interface DateTimeControlComponentProps extends DateTimeControlProps {
  onRenderCalendar?: (props: any) => React.ReactNode;
  onRenderTimePicker?: (props: any) => React.ReactNode;
}

export interface PatternControlComponentProps extends PatternControlProps {
  onRenderInput?: (props: any) => React.ReactNode;
  onRenderError?: (error: string) => React.ReactNode;
}

export interface SliderControlComponentProps extends SliderControlProps {
  onRenderTrack?: (props: any) => React.ReactNode;
  onRenderThumb?: (props: any) => React.ReactNode;
  onRenderMark?: (mark: SliderMark) => React.ReactNode;
}

export interface RatingControlComponentProps extends RatingControlProps {
  onRenderStar?: (props: any) => React.ReactNode;
  onRenderValue?: (value: number) => React.ReactNode;
}

export interface MultiValueControlComponentProps extends MultiValueControlProps {
  onRenderItem?: (value: string, index: number) => React.ReactNode;
  onRenderSuggestion?: (suggestion: string, index: number) => React.ReactNode;
  onRenderInput?: (props: any) => React.ReactNode;
}

export interface PlainTextControlComponentProps extends PlainTextControlProps {
  onRenderText?: (text: string) => React.ReactNode;
  onRenderMarkdown?: (text: string) => React.ReactNode;
} 