import * as React from 'react';
import { useState, useCallback, useMemo } from 'react';
import {
  Stack,
  Text,
  TextField,
  Dropdown,
  IDropdownOption,
  DatePicker,
  PrimaryButton,
  DefaultButton,
  IconButton,
  TooltipHost,
  DirectionalHint,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize
} from '@fluentui/react';
import {
  FilterRegular,
  SaveRegular,
  DeleteRegular,
  SearchRegular,
  ClearRegular
} from '@fluentui/react-icons';
import { WorkItem } from 'TFS/WorkItemTracking/Contracts';
import { IFilterState } from 'VSSUI/Utilities/Filter';
import { AdvancedFiltersProps, SavedSearch } from '../../types/RelatedWits.types';
import './AdvancedFilters.scss';

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filterState,
  onFilterChange,
  onClearFilters,
  onSaveSearch,
  savedSearches,
  onLoadSearch,
  onDeleteSearch,
  loading
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [dateRange, setDateRange] = useState<{ startDate?: Date; endDate?: Date }>({});
  const [customFilters, setCustomFilters] = useState<Record<string, string>>({});

  const fieldOptions = useMemo((): IDropdownOption[] => [
    { key: 'System.Title', text: 'Title' },
    { key: 'System.WorkItemType', text: 'Work Item Type' },
    { key: 'System.State', text: 'State' },
    { key: 'System.AssignedTo', text: 'Assigned To' },
    { key: 'System.AreaPath', text: 'Area Path' },
    { key: 'System.Tags', text: 'Tags' },
    { key: 'System.ChangedDate', text: 'Changed Date' },
    { key: 'System.CreatedDate', text: 'Created Date' }
  ], []);

  const handleExpandToggle = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handleDateRangeChange = useCallback((field: 'startDate' | 'endDate', date?: Date) => {
    setDateRange(prev => ({
      ...prev,
      [field]: date
    }));
  }, []);

  const handleCustomFilterChange = useCallback((field: string, value: string) => {
    setCustomFilters(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    const newFilterState: IFilterState = {
      ...filterState,
      ...customFilters
    };

    // Add date range filters
    if (dateRange.startDate) {
      newFilterState['System.ChangedDate'] = `>=${dateRange.startDate.toISOString()}`;
    }
    if (dateRange.endDate) {
      newFilterState['System.ChangedDate'] = `${newFilterState['System.ChangedDate'] || ''} <=${dateRange.endDate.toISOString()}`;
    }

    onFilterChange(newFilterState);
  }, [filterState, customFilters, dateRange, onFilterChange]);

  const handleClearAll = useCallback(() => {
    setDateRange({});
    setCustomFilters({});
    onClearFilters();
  }, [onClearFilters]);

  const handleSaveSearch = useCallback(() => {
    if (!searchName.trim()) {
      return;
    }

    const searchToSave: SavedSearch = {
      id: Date.now().toString(),
      name: searchName,
      filterState: {
        ...filterState,
        ...customFilters
      },
      dateRange,
      createdAt: new Date().toISOString()
    };

    onSaveSearch(searchToSave);
    setSearchName('');
    setShowSaveDialog(false);
  }, [searchName, filterState, customFilters, dateRange, onSaveSearch]);

  const handleLoadSearch = useCallback((search: SavedSearch) => {
    setDateRange(search.dateRange || {});
    setCustomFilters(search.filterState || {});
    onLoadSearch(search);
  }, [onLoadSearch]);

  const hasActiveFilters = useMemo(() => {
    return Object.keys(customFilters).length > 0 || 
           dateRange.startDate || 
           dateRange.endDate ||
           Object.keys(filterState).length > 0;
  }, [customFilters, dateRange, filterState]);

  return (
    <div className="advanced-filters">
      {/* Header */}
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center" className="filters-header">
        <Stack horizontal gap={8} verticalAlign="center">
          <FilterRegular className="filter-icon" />
          <Text variant="medium" className="filters-title">
            Advanced Filters
          </Text>
          {hasActiveFilters && (
            <div className="active-filters-badge">
              Active
            </div>
          )}
        </Stack>
        
        <Stack horizontal gap={8}>
          <TooltipHost content="Save current search" directionalHint={DirectionalHint.bottomRightEdge}>
            <IconButton
              icon={<SaveRegular />}
              onClick={() => setShowSaveDialog(true)}
              disabled={!hasActiveFilters}
              className="header-button"
              ariaLabel="Save Search"
            />
          </TooltipHost>
          
          <TooltipHost content="Clear all filters" directionalHint={DirectionalHint.bottomRightEdge}>
            <IconButton
              icon={<ClearRegular />}
              onClick={handleClearAll}
              disabled={!hasActiveFilters}
              className="header-button"
              ariaLabel="Clear Filters"
            />
          </TooltipHost>
          
          <DefaultButton
            text={isExpanded ? "Hide" : "Show"}
            onClick={handleExpandToggle}
            className="expand-button"
          />
        </Stack>
      </Stack>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="filters-content">
          <Stack gap={16}>
            {/* Date Range */}
            <Stack gap={8}>
              <Text variant="medium" className="section-title">
                Date Range
              </Text>
              <Stack horizontal gap={16}>
                <DatePicker
                  label="From Date"
                  value={dateRange.startDate}
                  onSelectDate={(date) => handleDateRangeChange('startDate', date)}
                  placeholder="Select start date"
                  className="date-picker"
                />
                <DatePicker
                  label="To Date"
                  value={dateRange.endDate}
                  onSelectDate={(date) => handleDateRangeChange('endDate', date)}
                  placeholder="Select end date"
                  className="date-picker"
                />
              </Stack>
            </Stack>

            {/* Custom Field Filters */}
            <Stack gap={8}>
              <Text variant="medium" className="section-title">
                Field Filters
              </Text>
              <Stack gap={12}>
                {fieldOptions.slice(0, 4).map(field => (
                  <TextField
                    key={field.key}
                    label={field.text}
                    value={customFilters[field.key] || ''}
                    onChange={(_, value) => handleCustomFilterChange(field.key, value || '')}
                    placeholder={`Filter by ${field.text.toLowerCase()}`}
                    className="filter-field"
                  />
                ))}
              </Stack>
            </Stack>

            {/* Action Buttons */}
            <Stack horizontal gap={8} horizontalAlign="end">
              <DefaultButton
                text="Clear"
                onClick={handleClearAll}
                disabled={!hasActiveFilters}
              />
              <PrimaryButton
                text="Apply Filters"
                onClick={handleApplyFilters}
                disabled={loading}
                iconProps={loading ? { iconName: 'Spinner' } : undefined}
              />
            </Stack>
          </Stack>
        </div>
      )}

      {/* Saved Searches */}
      {savedSearches && savedSearches.length > 0 && (
        <div className="saved-searches">
          <Stack gap={8}>
            <Text variant="medium" className="section-title">
              Saved Searches
            </Text>
            <Stack gap={4}>
              {savedSearches.map(search => (
                <Stack key={search.id} horizontal horizontalAlign="space-between" verticalAlign="center" className="saved-search-item">
                  <Stack horizontal gap={8} verticalAlign="center">
                    <SearchRegular className="search-icon" />
                    <Text variant="small" className="search-name">
                      {search.name}
                    </Text>
                    <Text variant="small" className="search-date">
                      {new Date(search.createdAt).toLocaleDateString()}
                    </Text>
                  </Stack>
                  
                  <Stack horizontal gap={4}>
                    <DefaultButton
                      text="Load"
                      size="small"
                      onClick={() => handleLoadSearch(search)}
                    />
                    <IconButton
                      icon={<DeleteRegular />}
                      onClick={() => onDeleteSearch(search.id)}
                      className="delete-button"
                      ariaLabel="Delete Search"
                    />
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </div>
      )}

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <div className="save-dialog-overlay">
          <div className="save-dialog">
            <Stack gap={16}>
              <Text variant="large" className="dialog-title">
                Save Search
              </Text>
              
              <TextField
                label="Search Name"
                value={searchName}
                onChange={(_, value) => setSearchName(value || '')}
                placeholder="Enter a name for this search"
                autoFocus
              />
              
              <Stack horizontal gap={8} horizontalAlign="end">
                <DefaultButton
                  text="Cancel"
                  onClick={() => setShowSaveDialog(false)}
                />
                <PrimaryButton
                  text="Save"
                  onClick={handleSaveSearch}
                  disabled={!searchName.trim()}
                />
              </Stack>
            </Stack>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <Spinner size={SpinnerSize.medium} label="Applying filters..." />
        </div>
      )}
    </div>
  );
}; 