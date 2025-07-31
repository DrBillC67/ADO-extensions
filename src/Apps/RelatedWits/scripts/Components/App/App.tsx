import * as React from 'react';
import { useEffect, useCallback } from 'react';
import { 
  Fabric, 
  MessageBar, 
  MessageBarType,
  Stack,
  Text,
  IconButton,
  TooltipHost,
  DirectionalHint,
  Panel,
  PanelType
} from '@fluentui/react';
import { 
  SettingsRegular,
  RefreshRegular,
  InfoRegular
} from '@fluentui/react-icons';
import { RelatedWitsTable } from '../RelatedWitsTable';
import { SettingsPanel } from '../SettingsPanel';
import { Loading } from 'Common/Components/Loading';
import { getMarketplaceUrl } from 'Common/Utilities/UrlHelper';
import { useRelatedWits } from '../../hooks/useRelatedWits';
import { useWorkItemForm } from '../../hooks/useWorkItemForm';
import { useSettings } from '../../hooks/useSettings';
import { WorkItem, WorkItemRelationType } from 'TFS/WorkItemTracking/Contracts';
import { openWorkItemDialog } from 'Common/Utilities/WorkItemFormHelpers';
import './App.scss';

export interface RelatedWitsAppProps {
  className?: string;
}

export const RelatedWitsApp: React.FC<RelatedWitsAppProps> = ({ className }) => {
  const { workItemId, isNew, isLoaded } = useWorkItemForm();
  const { settings, saveSettings } = useSettings();
  const {
    workItems,
    filteredItems,
    loading,
    error,
    settingsPanelOpen,
    actions
  } = useRelatedWits();

  // Initialize when work item is loaded
  useEffect(() => {
    if (isLoaded && workItemId && !isNew) {
      actions.setWorkItemLoaded(true, false);
      actions.loadRelatedWorkItems(workItemId, settings);
    } else if (isLoaded && isNew) {
      actions.setWorkItemLoaded(true, true);
    }
  }, [isLoaded, workItemId, isNew, settings, actions]);

  const handleRefresh = useCallback(async () => {
    if (workItemId) {
      await actions.refresh();
    }
  }, [workItemId, actions]);

  const handleOpenSettings = useCallback(() => {
    actions.openSettings();
  }, [actions]);

  const handleCloseSettings = useCallback(() => {
    actions.closeSettings();
  }, [actions]);

  const handleSaveSettings = useCallback(async (newSettings: any) => {
    try {
      await saveSettings(newSettings);
      await actions.updateSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [saveSettings, actions]);

  const handleItemClick = useCallback((workItem: WorkItem) => {
    openWorkItemDialog(workItem.id);
  }, []);

  const handleAddLink = useCallback(async (workItem: WorkItem, relationType: WorkItemRelationType) => {
    await actions.addLink(workItem.id, relationType);
  }, [actions]);

  const handleClearError = useCallback(() => {
    actions.clearError();
  }, [actions]);

  // Show loading state
  if (!isLoaded) {
    return (
      <Fabric className="fabric-container">
        <Loading />
      </Fabric>
    );
  }

  // Show message for new work items
  if (isNew) {
    return (
      <Fabric className="fabric-container">
        <MessageBar messageBarType={MessageBarType.info}>
          You need to save the work item before viewing related work items.
        </MessageBar>
      </Fabric>
    );
  }

  return (
    <Fabric className="fabric-container">
      <div className={`related-wits-app ${className || ''}`}>
        {/* Header */}
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center" className="app-header">
          <Stack horizontal gap={8} verticalAlign="center">
            <Text variant="large" className="app-title">
              Related Work Items
            </Text>
            {filteredItems && (
              <Text variant="medium" className="item-count">
                ({filteredItems.length} items)
              </Text>
            )}
          </Stack>
          
          <Stack horizontal gap={8}>
            <TooltipHost 
              content="How to use the extension" 
              directionalHint={DirectionalHint.bottomLeftEdge}
            >
              <IconButton
                icon={<InfoRegular />}
                href={getMarketplaceUrl()}
                target="_blank"
                className="header-button"
                ariaLabel="Help"
              />
            </TooltipHost>
            
            <TooltipHost 
              content="Refresh list" 
              directionalHint={DirectionalHint.bottomRightEdge}
            >
              <IconButton
                icon={<RefreshRegular />}
                onClick={handleRefresh}
                disabled={loading}
                className="header-button"
                ariaLabel="Refresh"
              />
            </TooltipHost>
            
            <TooltipHost 
              content="Settings" 
              directionalHint={DirectionalHint.bottomRightEdge}
            >
              <IconButton
                icon={<SettingsRegular />}
                onClick={handleOpenSettings}
                className="header-button"
                ariaLabel="Settings"
              />
            </TooltipHost>
          </Stack>
        </Stack>

        {/* Error Message */}
        {error && (
          <MessageBar 
            messageBarType={MessageBarType.error} 
            onDismiss={handleClearError}
            className="error-message"
          >
            {error}
          </MessageBar>
        )}

        {/* Content */}
        <div className="app-content">
          {loading ? (
            <Loading />
          ) : (
            <RelatedWitsTable
              items={filteredItems || []}
              loading={loading}
              onItemClick={handleItemClick}
              onAddLink={handleAddLink}
              onRefresh={handleRefresh}
            />
          )}
        </div>

        {/* Settings Panel */}
        <Panel
          isOpen={settingsPanelOpen}
          onDismiss={handleCloseSettings}
          headerText="Related Work Items Settings"
          type={PanelType.medium}
          className="settings-panel"
        >
          <SettingsPanel
            settings={settings}
            onSave={handleSaveSettings}
            onCancel={handleCloseSettings}
          />
        </Panel>
      </div>
    </Fabric>
  );
}; 