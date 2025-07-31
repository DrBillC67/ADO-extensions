import { useState, useEffect, useCallback } from 'react';
import { WorkItemType } from 'TFS/WorkItemTracking/Contracts';

// Mock function - in real implementation, this would call Azure DevOps APIs
const loadWorkItemTypes = async (): Promise<WorkItemType[]> => {
  // This would typically call the Azure DevOps REST API
  // For now, returning mock data
  return [
    {
      name: 'Bug',
      icon: {
        id: 'bug',
        url: 'https://dev.azure.com/_apis/wit/workItemIcons/bug'
      }
    },
    {
      name: 'Task',
      icon: {
        id: 'task',
        url: 'https://dev.azure.com/_apis/wit/workItemIcons/task'
      }
    },
    {
      name: 'User Story',
      icon: {
        id: 'userstory',
        url: 'https://dev.azure.com/_apis/wit/workItemIcons/userstory'
      }
    },
    {
      name: 'Feature',
      icon: {
        id: 'feature',
        url: 'https://dev.azure.com/_apis/wit/workItemIcons/feature'
      }
    }
  ];
};

export const useWorkItemTypes = () => {
  const [types, setTypes] = useState<WorkItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const workItemTypes = await loadWorkItemTypes();
      setTypes(workItemTypes);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load work item types'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTypes();
  }, [loadTypes]);

  const getTypeByName = useCallback((name: string): WorkItemType | undefined => {
    return types.find(type => type.name === name);
  }, [types]);

  const refresh = useCallback(() => {
    loadTypes();
  }, [loadTypes]);

  return {
    types,
    loading,
    error,
    getTypeByName,
    refresh
  };
}; 