import * as React from 'react';
import { useState, useCallback } from 'react';
import {
  Stack,
  Text,
  Checkbox,
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  DefaultButton
} from '@fluentui/react';
import { WorkItemType } from 'TFS/WorkItemTracking/Contracts';
import { usePRWorkItems } from '../../hooks/usePRWorkItems';
import { ConfigureDialogProps } from '../../types/PRWorkItems.types';
import './ConfigureDialog.scss';

export const ConfigureDialog: React.FC<ConfigureDialogProps> = ({ className }) => {
  const {
    allWorkItemTypes,
    configuredWorkItemTypes,
    loading,
    error,
    toggleWorkItemType
  } = usePRWorkItems();

  const [saving, setSaving] = useState(false);

  // Handle work item type toggle
  const handleToggleType = useCallback(async (workItemTypeName: string, enabled: boolean) => {
    setSaving(true);
    try {
      await toggleWorkItemType(workItemTypeName, enabled);
    } finally {
      setSaving(false);
    }
  }, [toggleWorkItemType]);

  // Check if work item type is selected
  const isTypeSelected = useCallback((workItemTypeName: string) => {
    return configuredWorkItemTypes.some(type => 
      type.name.toLowerCase() === workItemTypeName.toLowerCase()
    );
  }, [configuredWorkItemTypes]);

  // Handle save
  const handleSave = useCallback(() => {
    // Close dialog
    const dialogService = VSS.getService(VSS.ServiceIds.Dialog) as IHostDialogService;
    dialogService.close();
  }, []);

  // Handle cancel
  const handleCancel = useCallback(() => {
    // Close dialog
    const dialogService = VSS.getService(VSS.ServiceIds.Dialog) as IHostDialogService;
    dialogService.close();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div className={`configure-dialog ${className || ''}`}>
        <Stack horizontalAlign="center" verticalAlign="center" style={{ height: '200px' }}>
          <Spinner size={SpinnerSize.large} label="Loading work item types..." />
        </Stack>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={`configure-dialog ${className || ''}`}>
        <MessageBar messageBarType={MessageBarType.error}>
          <Text variant="medium">
            Failed to load work item types. Please refresh and try again.
          </Text>
          <Text variant="small" className="error-details">
            {error}
          </Text>
        </MessageBar>
      </div>
    );
  }

  return (
    <div className={`configure-dialog ${className || ''}`}>
      <Stack gap={16}>
        {/* Header */}
        <div className="dialog-header">
          <Text variant="large" className="dialog-title">
            Configure Work Item Types
          </Text>
          <Text variant="medium" className="dialog-description">
            Select work item types which can be linked to Pull requests.
          </Text>
        </div>

        {/* Work Item Types List */}
        <div className="work-item-types-list">
          <Stack gap={8}>
            {allWorkItemTypes.map(workItemType => (
              <Checkbox
                key={workItemType.name}
                label={workItemType.name}
                checked={isTypeSelected(workItemType.name)}
                onChange={(_, checked) => handleToggleType(workItemType.name, checked || false)}
                disabled={saving}
                className="work-item-type-checkbox"
              />
            ))}
          </Stack>
        </div>

        {/* Footer */}
        <div className="dialog-footer">
          <Stack horizontal gap={8} horizontalAlign="end">
            <DefaultButton
              text="Cancel"
              onClick={handleCancel}
              disabled={saving}
            />
            <PrimaryButton
              text="Save"
              onClick={handleSave}
              disabled={saving}
            />
          </Stack>
        </div>
      </Stack>
    </div>
  );
}; 