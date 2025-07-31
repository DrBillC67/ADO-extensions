import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { WorkItem, WorkItemRelationType } from 'TFS/WorkItemTracking/Contracts';
import { IFilterState } from 'VSSUI/Utilities/Filter';
import { ISettings, ISortState, Constants } from '../Models';
import { RelatedWitsStore } from '../types/RelatedWits.types';
import { workItemComparer, workItemMatchesFilter } from '../Helpers';
import * as ExtensionDataManager from 'Common/Utilities/ExtensionDataManager';
import { getFormService } from 'Common/Utilities/WorkItemFormHelpers';

export const useRelatedWitsStore = create<RelatedWitsStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      workItems: [],
      filteredItems: [],
      settings: Constants.DEFAULT_SETTINGS,
      loading: false,
      error: null,
      filterState: {},
      sortState: { sortKey: 'System.ChangedDate', isSortedDescending: true },
      isWorkItemLoaded: false,
      isNew: false,
      settingsPanelOpen: false,
      relationsMap: {},
      relationTypes: [],

      // Actions
      loadRelatedWorkItems: async (workItemId: number, settings: ISettings) => {
        const { applyFilter, applySort } = get();
        
        set({ loading: true, error: null });

        try {
          const formService = await getFormService();
          const currentWorkItem = await formService.getWorkItem();
          
          if (!currentWorkItem) {
            throw new Error('Unable to get current work item');
          }

          // Create query based on settings
          const query = await createQuery(settings.fields, settings.sortByField, currentWorkItem);
          
          // Execute query to get related work items
          const workItems = await executeQuery(query);
          
          // Apply current filter and sort
          const filteredItems = applyFilterAndSort(workItems, get().filterState, get().sortState);
          
          set({ 
            workItems, 
            filteredItems, 
            loading: false,
            settings 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load related work items',
            loading: false 
          });
        }
      },

      applyFilter: (filterState: IFilterState) => {
        const { workItems, sortState } = get();
        const filteredItems = applyFilterAndSort(workItems, filterState, sortState);
        
        set({ filterState, filteredItems });
      },

      applySort: (sortState: ISortState) => {
        const { workItems, filterState } = get();
        const filteredItems = applyFilterAndSort(workItems, filterState, sortState);
        
        set({ sortState, filteredItems });
      },

      updateSettings: async (settings: ISettings) => {
        const { loadRelatedWorkItems } = get();
        
        try {
          // Save settings to extension data
          await ExtensionDataManager.setDocument(
            Constants.StorageKey,
            settings,
            Constants.UserScope
          );
          
          set({ settings, settingsPanelOpen: false });
          
          // Reload work items with new settings
          const formService = await getFormService();
          const currentWorkItem = await formService.getWorkItem();
          if (currentWorkItem) {
            await loadRelatedWorkItems(currentWorkItem.id, settings);
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to save settings'
          });
        }
      },

      addLink: async (workItemId: number, relationType: WorkItemRelationType) => {
        const { refresh } = get();
        
        try {
          const formService = await getFormService();
          const currentWorkItem = await formService.getWorkItem();
          
          if (!currentWorkItem) {
            throw new Error('Unable to get current work item');
          }

          // Add link between current work item and target work item
          await formService.addWorkItemRelations([{
            target: { id: workItemId },
            rel: relationType.name
          }]);
          
          // Refresh the list to show updated relations
          await refresh();
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add link'
          });
        }
      },

      clearFilters: () => {
        const { workItems, sortState } = get();
        const filteredItems = applyFilterAndSort(workItems, {}, sortState);
        
        set({ filterState: {}, filteredItems });
      },

      openSettings: () => {
        set({ settingsPanelOpen: true });
      },

      closeSettings: () => {
        set({ settingsPanelOpen: false });
      },

      setWorkItemLoaded: (loaded: boolean, isNew: boolean) => {
        set({ isWorkItemLoaded: loaded, isNew });
      },

      clearError: () => {
        set({ error: null });
      },

      refresh: async () => {
        const { loadRelatedWorkItems, settings } = get();
        const formService = await getFormService();
        const currentWorkItem = await formService.getWorkItem();
        
        if (currentWorkItem) {
          await loadRelatedWorkItems(currentWorkItem.id, settings);
        }
      }
    }),
    {
      name: 'related-wits-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

// Helper functions
async function createQuery(fieldsToSeek: string[], sortByField: string, currentWorkItem: any): Promise<{ project: string; wiql: string }> {
  const context = VSS.getWebContext();
  const project = context.project.name;
  
  // Build WIQL query based on field values
  const conditions = fieldsToSeek
    .map(field => {
      const value = currentWorkItem.fields[field];
      if (value) {
        return `[${field}] = '${value}'`;
      }
      return null;
    })
    .filter(Boolean)
    .join(' AND ');
  
  const wiql = `
    SELECT [System.Id], [System.WorkItemType], [System.Title], [System.AssignedTo], [System.AreaPath], [System.State], [System.ChangedDate]
    FROM WorkItems
    WHERE ${conditions}
    AND [System.Id] != ${currentWorkItem.id}
    ORDER BY [${sortByField}] DESC
  `;
  
  return { project, wiql };
}

async function executeQuery(query: { project: string; wiql: string }): Promise<WorkItem[]> {
  // This would integrate with Azure DevOps REST API to execute the WIQL query
  // For now, returning empty array as placeholder
  return [];
}

function applyFilterAndSort(workItems: WorkItem[], filterState: IFilterState, sortState: ISortState): WorkItem[] {
  let filteredItems = workItems;
  
  // Apply filters
  if (filterState && Object.keys(filterState).length > 0) {
    filteredItems = workItems.filter(item => workItemMatchesFilter(item, filterState));
  }
  
  // Apply sorting
  if (sortState) {
    filteredItems.sort((a, b) => workItemComparer(a, b, sortState));
  }
  
  return filteredItems;
} 