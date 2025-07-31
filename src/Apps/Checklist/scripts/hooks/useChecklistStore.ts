import { useMemo } from 'react';
import { useChecklistStore as useStore } from '../stores/checklistStore';
import { ChecklistType, IWorkItemChecklists } from '../Interfaces';

export const useChecklistStore = (workItemId?: number) => {
  const store = useStore();
  
  const checklists = useMemo(() => {
    if (!workItemId) return null;
    return store.checklists[`${workItemId}`];
  }, [store.checklists, workItemId]);

  const loading = useMemo(() => {
    if (!workItemId) return false;
    return store.loading[`${workItemId}`] || false;
  }, [store.loading, workItemId]);

  const actions = useMemo(() => ({
    initializeChecklists: store.initializeChecklists,
    updateChecklist: store.updateChecklist,
    addChecklistItem: store.addChecklistItem,
    removeChecklistItem: store.removeChecklistItem,
    toggleChecklistItem: store.toggleChecklistItem,
    updateChecklistItem: store.updateChecklistItem,
    reorderChecklistItems: store.reorderChecklistItems,
    clearError: store.clearError,
    clearChecklists: store.clearChecklists
  }), [store]);

  return {
    checklists,
    loading,
    error: store.error,
    actions
  };
};

export const useChecklistByType = (workItemId: number, type: ChecklistType) => {
  const { checklists, loading, error, actions } = useChecklistStore(workItemId);
  
  const checklist = useMemo(() => {
    if (!checklists) return null;
    
    switch (type) {
      case ChecklistType.Personal:
        return checklists.personal;
      case ChecklistType.Shared:
        return checklists.shared;
      case ChecklistType.WitDefault:
        return checklists.witDefault;
      default:
        return null;
    }
  }, [checklists, type]);

  const items = useMemo(() => {
    return checklist?.checklistItems || [];
  }, [checklist]);

  const completedCount = useMemo(() => {
    return items.filter(item => item.completed).length;
  }, [items]);

  const totalCount = useMemo(() => {
    return items.length;
  }, [items]);

  const progress = useMemo(() => {
    if (totalCount === 0) return 0;
    return Math.round((completedCount / totalCount) * 100);
  }, [completedCount, totalCount]);

  return {
    checklist,
    items,
    completedCount,
    totalCount,
    progress,
    loading,
    error,
    actions
  };
}; 