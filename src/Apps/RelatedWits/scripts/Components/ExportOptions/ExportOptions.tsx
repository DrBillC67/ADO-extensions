import * as React from 'react';
import { useState, useCallback } from 'react';
import {
  Stack,
  Text,
  PrimaryButton,
  DefaultButton,
  Dropdown,
  IDropdownOption,
  Checkbox,
  ICheckboxProps,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  Dialog,
  DialogType,
  DialogFooter
} from '@fluentui/react';
import {
  DownloadRegular,
  DocumentRegular,
  TableRegular
} from '@fluentui/react-icons';
import { WorkItem } from 'TFS/WorkItemTracking/Contracts';
import { ExportOptionsProps } from '../../types/RelatedWits.types';
import './ExportOptions.scss';

export const ExportOptions: React.FC<ExportOptionsProps> = ({
  workItems,
  onExport,
  loading
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState<string>('csv');
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'System.Id',
    'System.Title',
    'System.WorkItemType',
    'System.State',
    'System.AssignedTo',
    'System.ChangedDate'
  ]);
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<{ type: MessageBarType; text: string } | null>(null);

  const formatOptions: IDropdownOption[] = [
    { key: 'csv', text: 'CSV (.csv)' },
    { key: 'excel', text: 'Excel (.xlsx)' }
  ];

  const availableFields: IDropdownOption[] = [
    { key: 'System.Id', text: 'ID' },
    { key: 'System.Title', text: 'Title' },
    { key: 'System.WorkItemType', text: 'Work Item Type' },
    { key: 'System.State', text: 'State' },
    { key: 'System.AssignedTo', text: 'Assigned To' },
    { key: 'System.AreaPath', text: 'Area Path' },
    { key: 'System.Tags', text: 'Tags' },
    { key: 'System.ChangedDate', text: 'Changed Date' },
    { key: 'System.CreatedDate', text: 'Created Date' },
    { key: 'System.CreatedBy', text: 'Created By' },
    { key: 'System.Description', text: 'Description' },
    { key: 'System.Reason', text: 'Reason' },
    { key: 'System.Priority', text: 'Priority' },
    { key: 'System.Severity', text: 'Severity' }
  ];

  const handleOpenDialog = useCallback(() => {
    setShowDialog(true);
    setExportMessage(null);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setShowDialog(false);
    setExporting(false);
    setExportMessage(null);
  }, []);

  const handleFormatChange = useCallback((_, option?: IDropdownOption) => {
    if (option) {
      setExportFormat(option.key as string);
    }
  }, []);

  const handleFieldToggle = useCallback((field: string, checked?: boolean) => {
    setSelectedFields(prev => {
      if (checked) {
        return [...prev, field];
      } else {
        return prev.filter(f => f !== field);
      }
    });
  }, []);

  const handleSelectAll = useCallback((checked?: boolean) => {
    if (checked) {
      setSelectedFields(availableFields.map(f => f.key as string));
    } else {
      setSelectedFields([]);
    }
  }, [availableFields]);

  const handleExport = useCallback(async () => {
    if (selectedFields.length === 0) {
      setExportMessage({
        type: MessageBarType.warning,
        text: 'Please select at least one field to export.'
      });
      return;
    }

    setExporting(true);
    setExportMessage(null);

    try {
      const exportData = {
        format: exportFormat,
        fields: selectedFields,
        workItems: workItems
      };

      await onExport(exportData);
      
      setExportMessage({
        type: MessageBarType.success,
        text: `Successfully exported ${workItems.length} work items to ${exportFormat.toUpperCase()} format.`
      });

      // Close dialog after a short delay
      setTimeout(() => {
        handleCloseDialog();
      }, 2000);

    } catch (error) {
      setExportMessage({
        type: MessageBarType.error,
        text: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setExporting(false);
    }
  }, [selectedFields, exportFormat, workItems, onExport, handleCloseDialog]);

  const canExport = workItems && workItems.length > 0 && !loading;

  return (
    <div className="export-options">
      <TooltipHost content="Export work items" directionalHint={DirectionalHint.bottomRightEdge}>
        <PrimaryButton
          icon={<DownloadRegular />}
          text="Export"
          onClick={handleOpenDialog}
          disabled={!canExport}
          className="export-button"
        />
      </TooltipHost>

      <Dialog
        hidden={!showDialog}
        onDismiss={handleCloseDialog}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Export Work Items',
          subText: `Export ${workItems?.length || 0} work items to your preferred format.`
        }}
        modalProps={{
          isBlocking: false,
          styles: { main: { maxWidth: 600 } }
        }}
      >
        <div className="export-dialog-content">
          <Stack gap={16}>
            {/* Export Format */}
            <Stack gap={8}>
              <Text variant="medium" className="section-title">
                Export Format
              </Text>
              <Dropdown
                label="Format"
                selectedKey={exportFormat}
                options={formatOptions}
                onChange={handleFormatChange}
                disabled={exporting}
              />
            </Stack>

            {/* Field Selection */}
            <Stack gap={8}>
              <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                <Text variant="medium" className="section-title">
                  Fields to Export
                </Text>
                <Checkbox
                  label="Select All"
                  checked={selectedFields.length === availableFields.length}
                  onChange={(_, checked) => handleSelectAll(checked)}
                  disabled={exporting}
                />
              </Stack>
              
              <div className="fields-grid">
                {availableFields.map(field => (
                  <Checkbox
                    key={field.key}
                    label={field.text}
                    checked={selectedFields.includes(field.key as string)}
                    onChange={(_, checked) => handleFieldToggle(field.key as string, checked)}
                    disabled={exporting}
                    className="field-checkbox"
                  />
                ))}
              </div>
            </Stack>

            {/* Export Message */}
            {exportMessage && (
              <MessageBar messageBarType={exportMessage.type}>
                {exportMessage.text}
              </MessageBar>
            )}

            {/* Export Preview */}
            {selectedFields.length > 0 && (
              <Stack gap={8}>
                <Text variant="medium" className="section-title">
                  Export Preview
                </Text>
                <div className="export-preview">
                  <Text variant="small" className="preview-text">
                    {workItems?.length || 0} work items will be exported with {selectedFields.length} fields
                    {exportFormat === 'csv' ? ' in CSV format' : ' in Excel format'}.
                  </Text>
                </div>
              </Stack>
            )}
          </Stack>
        </div>

        <DialogFooter>
          <DefaultButton onClick={handleCloseDialog} disabled={exporting}>
            Cancel
          </DefaultButton>
          <PrimaryButton
            onClick={handleExport}
            disabled={exporting || selectedFields.length === 0}
            iconProps={exporting ? { iconName: 'Spinner' } : undefined}
          >
            {exporting ? 'Exporting...' : 'Export'}
          </PrimaryButton>
        </DialogFooter>
      </Dialog>
    </div>
  );
}; 