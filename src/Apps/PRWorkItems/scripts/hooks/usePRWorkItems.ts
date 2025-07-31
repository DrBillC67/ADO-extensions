import { useState, useCallback, useEffect } from 'react';
import { WorkItemType } from 'TFS/WorkItemTracking/Contracts';
import { UsePRWorkItemsReturn } from '../types/PRWorkItems.types';
import { contains } from 'Common/Utilities/Array';
import { stringEquals } from 'Common/Utilities/String';
import * as ExtensionDataManager from 'Common/Utilities/ExtensionDataManager';
import { getClient } from 'Common/Utilities/WITRestClient';
import { getFormNavigationService } from 'Common/Utilities/WorkItemFormHelpers';
import { reloadPage } from 'Common/Utilities/Navigation';
import { JsonPatchDocument, JsonPatchOperation, Operation } from 'VSS/WebApi/Contracts';

export const usePRWorkItems = (): UsePRWorkItemsReturn => {
  const [configuredWorkItemTypes, setConfiguredWorkItemTypes] = useState<WorkItemType[]>([]);
  const [allWorkItemTypes, setAllWorkItemTypes] = useState<WorkItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load work item types
  const loadWorkItemTypes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const projectId = VSS.getWebContext().project.id;
      const witClient = getClient();

      const [configuredTypesSetting, allTypes] = await Promise.all([
        ExtensionDataManager.readSetting(`wits_${projectId}`, ['Bug', 'User Story'], false),
        witClient.getWorkItemTypes(projectId)
      ]);

      const configuredTypes = allTypes.filter(w => 
        contains(configuredTypesSetting, w.name, (w1, w2) => stringEquals(w1, w2, true))
      );

      setConfiguredWorkItemTypes(configuredTypes);
      setAllWorkItemTypes(allTypes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load work item types');
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle work item type
  const toggleWorkItemType = useCallback(async (workItemTypeName: string, enabled: boolean) => {
    try {
      const projectId = VSS.getWebContext().project.id;
      const currentSetting = await ExtensionDataManager.readSetting(`wits_${projectId}`, ['Bug', 'User Story'], false);
      
      let newSetting: string[];
      if (enabled) {
        newSetting = [...currentSetting, workItemTypeName];
      } else {
        newSetting = currentSetting.filter(name => !stringEquals(name, workItemTypeName, true));
      }

      await ExtensionDataManager.writeSetting(`wits_${projectId}`, newSetting, false);
      
      // Reload work item types to reflect changes
      await loadWorkItemTypes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update work item types');
    }
  }, [loadWorkItemTypes]);

  // Create work item and link to PR
  const createWorkItemAndLink = useCallback(async (workItemTypeName: string, pullRequestId: string) => {
    try {
      const workItemNavSvc = await getFormNavigationService();
      const witClient = getClient();

      const workItem = await workItemNavSvc.openNewWorkItem(workItemTypeName);
      
      if (workItem && workItem.id) {
        const patchDocument: JsonPatchDocument & JsonPatchOperation[] = [
          {
            op: Operation.Add,
            path: '/relations/-',
            value: {
              rel: 'ArtifactLink',
              url: pullRequestId,
              attributes: {
                name: 'Pull Request'
              }
            }
          } as JsonPatchOperation
        ];

        await witClient.updateWorkItem(patchDocument, workItem.id);
        reloadPage();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create work item');
      throw err;
    }
  }, []);

  // Load work item types on mount
  useEffect(() => {
    loadWorkItemTypes();
  }, [loadWorkItemTypes]);

  return {
    configuredWorkItemTypes,
    allWorkItemTypes,
    loading,
    error,
    loadWorkItemTypes,
    toggleWorkItemType,
    createWorkItemAndLink
  };
}; 