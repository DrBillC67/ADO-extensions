import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { 
  Fabric, 
  MessageBar, 
  MessageBarType,
  Pivot, 
  PivotItem,
  IconButton,
  TooltipHost,
  DirectionalHint,
  Stack
} from '@fluentui/react';
import { 
  InfoRegular,
  RefreshRegular,
  SettingsRegular
} from '@fluentui/react-icons';
import { ChecklistView } from '../ChecklistView';
import { Loading } from 'Common/Components/Loading';
import { getMarketplaceUrl, getWorkItemTypeSettingsUrl } from 'Common/Utilities/UrlHelper';
import { useChecklistStore } from '../../hooks/useChecklistStore';
import { 
  IWorkItemChangedArgs, 
  IWorkItemLoadedArgs, 
  IWorkItemNotificationListener 
} from 'TFS/WorkItemTracking/ExtensionContracts';
import './App.scss';

export interface ChecklistAppProps {
  className?: string;
}

export const ChecklistApp: React.FC<ChecklistAppProps> = ({ className }) => {
  const [workItemId, setWorkItemId] = useState<number | null>(null);
  const [workItemType, setWorkItemType] = useState<string>('');
  const [projectId, setProjectId] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('');
  const [isNew, setIsNew] = useState<boolean>(false);
  
  const { actions } = useChecklistStore();

  // Register work item form events
  useEffect(() => {
    const contributionId = VSS.getContribution().id;
    
    VSS.register(contributionId, {
      onLoaded: (args: IWorkItemLoadedArgs) => {
        handleWorkItemLoad(args.id, args.isNew);
      },
      onUnloaded: (_args: IWorkItemChangedArgs) => {
        handleWorkItemUnload();
      },
      onSaved: (args: IWorkItemChangedArgs) => {
        if (args.id !== workItemId) {
          setWorkItemId(args.id);
        }
      },
      onRefreshed: (_args: IWorkItemChangedArgs) => {
        handleWorkItemRefresh();
      }
    } as IWorkItemNotificationListener);

    return () => {
      VSS.unregister(contributionId);
    };
  }, [workItemId]);

  const handleWorkItemLoad = useCallback(async (id: number, isNewWorkItem: boolean) => {
    try {
      const context = VSS.getWebContext();
      setWorkItemId(id);
      setWorkItemType(context.workItemType || '');
      setProjectId(context.project.id);
      setProjectName(context.project.name);
      setIsNew(isNewWorkItem);

      if (!isNewWorkItem && id > 0) {
        await actions.initializeChecklists(id, context.workItemType || '', context.project.id);
      }
    } catch (error) {
      console.error('Error loading work item:', error);
    }
  }, [actions]);

  const handleWorkItemUnload = useCallback(() => {
    setWorkItemId(null);
    setWorkItemType('');
    setProjectId('');
    setProjectName('');
    setIsNew(false);
    actions.clearChecklists();
  }, [actions]);

  const handleWorkItemRefresh = useCallback(() => {
    if (workItemId && workItemType && projectId) {
      actions.initializeChecklists(workItemId, workItemType, projectId);
    }
  }, [workItemId, workItemType, projectId, actions]);

  const handleRefreshClick = useCallback(() => {
    handleWorkItemRefresh();
  }, [handleWorkItemRefresh]);

  const getSettingsUrl = useCallback(() => {
    if (workItemType && projectName) {
      return getWorkItemTypeSettingsUrl(workItemType, projectName);
    }
    return undefined;
  }, [workItemType, projectName]);

  // Show loading state
  if (workItemId === null) {
    return (
      <Fabric className="fabric-container">
        <Loading />
      </Fabric>
    );
  }

  // Show message for new work items
  if (isNew || workItemId === 0) {
    return (
      <Fabric className="fabric-container">
        <MessageBar messageBarType={MessageBarType.info}>
          You need to save the work item before working with the checklist.
        </MessageBar>
      </Fabric>
    );
  }

  return (
    <Fabric className="fabric-container">
      <div className={`checklist-app ${className || ''}`}>
        {/* Command Bar */}
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center" className="command-bar">
          <Stack horizontal gap={8}>
            <TooltipHost 
              content="How to use the extension" 
              directionalHint={DirectionalHint.bottomLeftEdge}
            >
              <IconButton
                icon={<InfoRegular />}
                href={getMarketplaceUrl()}
                target="_blank"
                className="command-button"
                ariaLabel="Help"
              />
            </TooltipHost>
          </Stack>
          
          <Stack horizontal gap={8}>
            <TooltipHost 
              content="Refresh checklist" 
              directionalHint={DirectionalHint.bottomRightEdge}
            >
              <IconButton
                icon={<RefreshRegular />}
                onClick={handleRefreshClick}
                className="command-button"
                ariaLabel="Refresh"
              />
            </TooltipHost>
            
            <TooltipHost 
              content="Settings" 
              directionalHint={DirectionalHint.bottomRightEdge}
            >
              <IconButton
                icon={<SettingsRegular />}
                href={getSettingsUrl()}
                target="_blank"
                className="command-button"
                ariaLabel="Settings"
              />
            </TooltipHost>
          </Stack>
        </Stack>

        {/* Checklist Content */}
        <div className="checklist-content">
          <Pivot aria-label="Checklist tabs">
            <PivotItem headerText="Shared" itemKey="shared">
              <ChecklistView
                workItemId={workItemId}
                workItemType={workItemType}
                projectId={projectId}
                isPersonal={false}
              />
            </PivotItem>
            <PivotItem headerText="Personal" itemKey="personal">
              <ChecklistView
                workItemId={workItemId}
                workItemType={workItemType}
                projectId={projectId}
                isPersonal={true}
              />
            </PivotItem>
          </Pivot>
        </div>
      </div>
    </Fabric>
  );
}; 