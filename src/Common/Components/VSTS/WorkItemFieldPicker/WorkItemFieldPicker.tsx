import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Dropdown,
  IDropdownOption,
  IDropdownProps,
  TextField,
  Stack,
  Text,
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType,
  IconButton,
  TooltipHost,
  DirectionalHint
} from '@fluentui/react';
import { SearchRegular, FilterRegular, ClearRegular } from '@fluentui/react-icons';
import { WorkItemField } from 'TFS/WorkItemTracking/Contracts';
import { WorkItemFieldPickerProps } from './WorkItemFieldPicker.types';
import { useWorkItemFields } from '../../hooks/useWorkItemFields';
import './WorkItemFieldPicker.scss';

export const WorkItemFieldPicker: React.FC<WorkItemFieldPickerProps> = ({
  selectedField,
  onFieldChange,
  workItemType,
  fieldTypes = [],
  showSearch = true,
  showFilter = true,
  disabled = false,
  required = false,
  label,
  placeholder = 'Select a field...',
  error,
  className,
  ...props
}) => {
  const [searchText, setSearchText] = useState('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const { fields, loading, error: fieldsError } = useWorkItemFields(workItemType);

  // Filter fields based on search text and field types
  const filteredFields = useMemo(() => {
    let filtered = fields;

    // Filter by field types if specified
    if (fieldTypes.length > 0 && filterType !== 'all') {
      filtered = filtered.filter(field => 
        fieldTypes.includes(field.type) || fieldTypes.includes(field.referenceName)
      );
    }

    // Filter by search text
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(field =>
        field.name.toLowerCase().includes(searchLower) ||
        field.referenceName.toLowerCase().includes(searchLower) ||
        (field.description && field.description.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [fields, searchText, fieldTypes, filterType]);

  // Convert fields to dropdown options
  const dropdownOptions = useMemo((): IDropdownOption[] => {
    return filteredFields.map(field => ({
      key: field.referenceName,
      text: field.name,
      data: field,
      title: field.description || field.name
    }));
  }, [filteredFields]);

  // Handle field selection
  const handleFieldChange = useCallback((event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (option) {
      onFieldChange(option.data as WorkItemField, option.key as string);
    } else {
      onFieldChange(null, '');
    }
  }, [onFieldChange]);

  // Handle search text change
  const handleSearchChange = useCallback((_, newValue?: string) => {
    setSearchText(newValue || '');
  }, []);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchText('');
  }, []);

  // Toggle advanced filter
  const handleToggleFilter = useCallback(() => {
    setShowAdvancedFilter(!showAdvancedFilter);
  }, [showAdvancedFilter]);

  // Handle filter type change
  const handleFilterTypeChange = useCallback((_, option?: IDropdownOption) => {
    setFilterType(option?.key as string || 'all');
  }, []);

  // Filter type options
  const filterTypeOptions = useMemo((): IDropdownOption[] => [
    { key: 'all', text: 'All Fields' },
    { key: 'string', text: 'String Fields' },
    { key: 'integer', text: 'Number Fields' },
    { key: 'dateTime', text: 'Date Fields' },
    { key: 'boolean', text: 'Boolean Fields' },
    { key: 'identity', text: 'Identity Fields' },
    { key: 'treePath', text: 'Tree Path Fields' },
    { key: 'picklist', text: 'Picklist Fields' }
  ], []);

  // Render loading state
  if (loading) {
    return (
      <div className={`work-item-field-picker ${className || ''}`}>
        <Stack gap={8}>
          {label && (
            <Text variant="medium" className="picker-label">
              {label}
              {required && <span className="required-indicator">*</span>}
            </Text>
          )}
          <div className="picker-loading">
            <Spinner size={SpinnerSize.small} label="Loading fields..." />
          </div>
        </Stack>
      </div>
    );
  }

  // Render error state
  if (fieldsError) {
    return (
      <div className={`work-item-field-picker ${className || ''}`}>
        <Stack gap={8}>
          {label && (
            <Text variant="medium" className="picker-label">
              {label}
              {required && <span className="required-indicator">*</span>}
            </Text>
          )}
          <MessageBar messageBarType={MessageBarType.error}>
            <Text variant="small">
              Failed to load work item fields. Please try again.
            </Text>
          </MessageBar>
        </Stack>
      </div>
    );
  }

  return (
    <div className={`work-item-field-picker ${className || ''}`} {...props}>
      <Stack gap={8}>
        {/* Label */}
        {label && (
          <Text variant="medium" className="picker-label">
            {label}
            {required && <span className="required-indicator">*</span>}
          </Text>
        )}

        {/* Search and Filter Controls */}
        {(showSearch || showFilter) && (
          <Stack horizontal gap={8} verticalAlign="center">
            {/* Search */}
            {showSearch && (
              <div className="search-container">
                <TextField
                  placeholder="Search fields..."
                  value={searchText}
                  onChange={handleSearchChange}
                  onRenderPrefix={() => <SearchRegular className="search-icon" />}
                  onRenderSuffix={() => 
                    searchText ? (
                      <IconButton
                        icon={<ClearRegular />}
                        onClick={handleClearSearch}
                        className="clear-button"
                        ariaLabel="Clear search"
                      />
                    ) : null
                  }
                  className="search-field"
                />
              </div>
            )}

            {/* Filter Toggle */}
            {showFilter && (
              <TooltipHost content="Filter fields" directionalHint={DirectionalHint.bottomRightEdge}>
                <IconButton
                  icon={<FilterRegular />}
                  onClick={handleToggleFilter}
                  className={`filter-button ${showAdvancedFilter ? 'active' : ''}`}
                  ariaLabel="Toggle field filter"
                />
              </TooltipHost>
            )}
          </Stack>
        )}

        {/* Advanced Filter */}
        {showAdvancedFilter && showFilter && (
          <div className="advanced-filter">
            <Dropdown
              label="Field Type"
              selectedKey={filterType}
              options={filterTypeOptions}
              onChange={handleFilterTypeChange}
              className="filter-dropdown"
            />
          </div>
        )}

        {/* Field Dropdown */}
        <Dropdown
          selectedKey={selectedField?.referenceName || ''}
          options={dropdownOptions}
          onChange={handleFieldChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          errorMessage={error}
          className="field-dropdown"
          calloutProps={{
            className: 'field-dropdown-callout'
          }}
          onRenderOption={(option) => (
            <div className="field-option">
              <Stack gap={4}>
                <Text variant="medium" className="field-name">
                  {option.text}
                </Text>
                <Text variant="small" className="field-reference">
                  {option.key}
                </Text>
                {option.data?.description && (
                  <Text variant="small" className="field-description">
                    {option.data.description}
                  </Text>
                )}
              </Stack>
            </div>
          )}
        />

        {/* Results Count */}
        {searchText && (
          <Text variant="small" className="results-count">
            {filteredFields.length} field{filteredFields.length !== 1 ? 's' : ''} found
          </Text>
        )}
      </Stack>
    </div>
  );
};
