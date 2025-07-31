import { WorkItemField } from 'TFS/WorkItemTracking/Contracts';

export interface WorkItemFieldPickerProps {
  /** Currently selected field */
  selectedField?: WorkItemField | null;
  /** Callback when field selection changes */
  onFieldChange: (field: WorkItemField | null, fieldReferenceName: string) => void;
  /** Work item type to filter fields by */
  workItemType?: string;
  /** Array of field types to include */
  fieldTypes?: string[];
  /** Whether to show search functionality */
  showSearch?: boolean;
  /** Whether to show filter functionality */
  showFilter?: boolean;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Label text for the picker */
  label?: string;
  /** Placeholder text for the dropdown */
  placeholder?: string;
  /** Error message to display */
  error?: string;
  /** Additional CSS class name */
  className?: string;
  /** Additional props to pass to the container div */
  [key: string]: any;
}

export interface WorkItemFieldOption {
  /** Field reference name */
  referenceName: string;
  /** Field display name */
  name: string;
  /** Field description */
  description?: string;
  /** Field type */
  type: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is read-only */
  readOnly?: boolean;
  /** Field help text */
  helpText?: string;
}

export interface WorkItemFieldFilter {
  /** Filter by field type */
  fieldType?: string;
  /** Filter by field name */
  fieldName?: string;
  /** Filter by field reference name */
  referenceName?: string;
  /** Whether to include system fields */
  includeSystemFields?: boolean;
  /** Whether to include custom fields */
  includeCustomFields?: boolean;
  /** Whether to include read-only fields */
  includeReadOnly?: boolean;
}

export interface WorkItemFieldPickerState {
  /** Available fields */
  fields: WorkItemField[];
  /** Filtered fields */
  filteredFields: WorkItemField[];
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: string | null;
  /** Search text */
  searchText: string;
  /** Current filter */
  filter: WorkItemFieldFilter;
  /** Whether advanced filter is shown */
  showAdvancedFilter: boolean;
} 