import { useState, useEffect, useCallback, useMemo } from 'react';
import { WorkItem, WorkItemRelationType } from 'TFS/WorkItemTracking/Contracts';
import { IFilterState } from 'VSSUI/Utilities/Filter';
import { ISettings, ISortState, Constants } from '../Models';
import { useRelatedWitsStore } from '../stores/relatedWitsStore';
import { RelatedWitsState } from '../types/RelatedWits.types';
import * as ExtensionDataManager from 'Common/Utilities/ExtensionDataManager';
import { getFormService } from 'Common/Utilities/WorkItemFormHelpers';

export const useRelatedWits = () => {
  const store = useRelatedWitsStore();
  
  const actions = useMemo(() => ({
    loadRelatedWorkItems: store.loadRelatedWorkItems,
    applyFilter: store.applyFilter,
    applySort: store.applySort,
    updateSettings: store.updateSettings,
    addLink: store.addLink,
    clearFilters: store.clearFilters,
    openSettings: store.openSettings,
    closeSettings: store.closeSettings,
    setWorkItemLoaded: store.setWorkItemLoaded,
    clearError: store.clearError,
    refresh: store.refresh
  }), [store]);

  return {
    // State
    workItems: store.workItems,
    filteredItems: store.filteredItems,
    settings: store.settings,
    loading: store.loading,
    error: store.error,
    filterState: store.filterState,
    sortState: store.sortState,
    isWorkItemLoaded: store.isWorkItemLoaded,
    isNew: store.isNew,
    settingsPanelOpen: store.settingsPanelOpen,
    relationsMap: store.relationsMap,
    relationTypes: store.relationTypes,
    
    // Actions
    actions
  };
};

export const useWorkItemForm = () => {
  const [workItemId, setWorkItemId] = useState<number | null>(null);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const contributionId = VSS.getContribution().id;
    
    VSS.register(contributionId, {
      onLoaded: (args: any) => {
        setWorkItemId(args.id);
        setIsNew(args.isNew);
        setIsLoaded(true);
      },
      onUnloaded: () => {
        setWorkItemId(null);
        setIsNew(false);
        setIsLoaded(false);
      },
      onSaved: (args: any) => {
        if (args.id !== workItemId) {
          setWorkItemId(args.id);
        }
        setIsNew(false);
      }
    });

    return () => {
      VSS.unregister(contributionId);
    };
  }, [workItemId]);

  return {
    workItemId,
    isNew,
    isLoaded
  };
};

export const useSettings = () => {
  const [settings, setSettings] = useState<ISettings>(Constants.DEFAULT_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const savedSettings = await ExtensionDataManager.getDocument(
        Constants.StorageKey,
        Constants.UserScope
      );
      
      if (savedSettings) {
        setSettings(savedSettings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSettings = useCallback(async (newSettings: ISettings) => {
    try {
      await ExtensionDataManager.setDocument(
        Constants.StorageKey,
        newSettings,
        Constants.UserScope
      );
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    loadSettings,
    saveSettings
  };
};

export const useWorkItemSearch = (workItemId: number | null, settings: ISettings) => {
  const [searchResults, setSearchResults] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(async () => {
    if (!workItemId) return;

    setLoading(true);
    setError(null);

    try {
      const formService = await getFormService();
      const currentWorkItem = await formService.getWorkItem();
      
      if (!currentWorkItem) {
        throw new Error('Unable to get current work item');
      }

      // Create and execute query
      const query = await createQuery(settings.fields, settings.sortByField, currentWorkItem);
      const results = await executeQuery(query);
      
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [workItemId, settings]);

  useEffect(() => {
    if (workItemId && settings) {
      performSearch();
    }
  }, [workItemId, settings, performSearch]);

  return {
    searchResults,
    loading,
    error,
    performSearch
  };
};

export const useWorkItemFilters = (items: WorkItem[]) => {
  const [filterState, setFilterState] = useState<IFilterState>({});
  const [sortState, setSortState] = useState<ISortState>({
    sortKey: 'System.ChangedDate',
    isSortedDescending: true
  });

  const filteredItems = useMemo(() => {
    let filtered = items;
    
    // Apply filters
    if (filterState && Object.keys(filterState).length > 0) {
      filtered = items.filter(item => workItemMatchesFilter(item, filterState));
    }
    
    // Apply sorting
    if (sortState) {
      filtered.sort((a, b) => workItemComparer(a, b, sortState));
    }
    
    return filtered;
  }, [items, filterState, sortState]);

  const clearFilters = useCallback(() => {
    setFilterState({});
  }, []);

  const clearSort = useCallback(() => {
    setSortState({
      sortKey: 'System.ChangedDate',
      isSortedDescending: true
    });
  }, []);

  return {
    filterState,
    sortState,
    filteredItems,
    setFilterState,
    setSortState,
    clearFilters,
    clearSort
  };
};

// Helper functions (these would be imported from existing Helpers.ts)
function workItemMatchesFilter(item: WorkItem, filterState: IFilterState): boolean {
  // Implementation from existing Helpers.ts
  return true;
}

function workItemComparer(a: WorkItem, b: WorkItem, sortState: ISortState): number {
  // Implementation from existing Helpers.ts
  return 0;
}

async function createQuery(fieldsToSeek: string[], sortByField: string, currentWorkItem: any): Promise<{ project: string; wiql: string }> {
  const context = VSS.getWebContext();
  const project = context.project.name;
  
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
  // Placeholder implementation
  return [];
} 