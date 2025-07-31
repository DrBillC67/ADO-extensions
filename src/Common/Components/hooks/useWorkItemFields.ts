import { useState, useEffect, useCallback } from 'react';
import { WorkItemField } from 'TFS/WorkItemTracking/Contracts';

// Mock function - in real implementation, this would call Azure DevOps APIs
const loadWorkItemFields = async (workItemType?: string): Promise<WorkItemField[]> => {
  // This would typically call the Azure DevOps REST API
  // For now, returning mock data
  const mockFields: WorkItemField[] = [
    {
      referenceName: 'System.Id',
      name: 'ID',
      type: 'integer',
      description: 'Work item identifier',
      required: true,
      readOnly: true
    },
    {
      referenceName: 'System.Title',
      name: 'Title',
      type: 'string',
      description: 'Work item title',
      required: true,
      readOnly: false
    },
    {
      referenceName: 'System.Description',
      name: 'Description',
      type: 'html',
      description: 'Work item description',
      required: false,
      readOnly: false
    },
    {
      referenceName: 'System.State',
      name: 'State',
      type: 'string',
      description: 'Current state of the work item',
      required: true,
      readOnly: false
    },
    {
      referenceName: 'System.AssignedTo',
      name: 'Assigned To',
      type: 'identity',
      description: 'Person assigned to the work item',
      required: false,
      readOnly: false
    },
    {
      referenceName: 'System.AreaPath',
      name: 'Area Path',
      type: 'treePath',
      description: 'Area path for the work item',
      required: false,
      readOnly: false
    },
    {
      referenceName: 'System.IterationPath',
      name: 'Iteration Path',
      type: 'treePath',
      description: 'Iteration path for the work item',
      required: false,
      readOnly: false
    },
    {
      referenceName: 'System.Tags',
      name: 'Tags',
      type: 'string',
      description: 'Tags associated with the work item',
      required: false,
      readOnly: false
    },
    {
      referenceName: 'System.CreatedBy',
      name: 'Created By',
      type: 'identity',
      description: 'Person who created the work item',
      required: false,
      readOnly: true
    },
    {
      referenceName: 'System.CreatedDate',
      name: 'Created Date',
      type: 'dateTime',
      description: 'Date when the work item was created',
      required: false,
      readOnly: true
    },
    {
      referenceName: 'System.ChangedBy',
      name: 'Changed By',
      type: 'identity',
      description: 'Person who last changed the work item',
      required: false,
      readOnly: true
    },
    {
      referenceName: 'System.ChangedDate',
      name: 'Changed Date',
      type: 'dateTime',
      description: 'Date when the work item was last changed',
      required: false,
      readOnly: true
    },
    {
      referenceName: 'System.Priority',
      name: 'Priority',
      type: 'integer',
      description: 'Priority of the work item',
      required: false,
      readOnly: false
    },
    {
      referenceName: 'System.Severity',
      name: 'Severity',
      type: 'string',
      description: 'Severity of the work item',
      required: false,
      readOnly: false
    },
    {
      referenceName: 'System.Reason',
      name: 'Reason',
      type: 'string',
      description: 'Reason for the current state',
      required: false,
      readOnly: false
    }
  ];

  // Filter by work item type if specified
  if (workItemType) {
    // In a real implementation, this would filter based on the work item type
    // For now, return all fields
    return mockFields;
  }

  return mockFields;
};

export const useWorkItemFields = (workItemType?: string) => {
  const [fields, setFields] = useState<WorkItemField[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadFields = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const workItemFields = await loadWorkItemFields(workItemType);
      setFields(workItemFields);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load work item fields'));
    } finally {
      setLoading(false);
    }
  }, [workItemType]);

  useEffect(() => {
    loadFields();
  }, [loadFields]);

  const getFieldByReferenceName = useCallback((referenceName: string): WorkItemField | undefined => {
    return fields.find(field => field.referenceName === referenceName);
  }, [fields]);

  const getFieldsByType = useCallback((type: string): WorkItemField[] => {
    return fields.filter(field => field.type === type);
  }, [fields]);

  const getRequiredFields = useCallback((): WorkItemField[] => {
    return fields.filter(field => field.required);
  }, [fields]);

  const getReadOnlyFields = useCallback((): WorkItemField[] => {
    return fields.filter(field => field.readOnly);
  }, [fields]);

  const refresh = useCallback(() => {
    loadFields();
  }, [loadFields]);

  return {
    fields,
    loading,
    error,
    getFieldByReferenceName,
    getFieldsByType,
    getRequiredFields,
    getReadOnlyFields,
    refresh
  };
}; 