import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  IWorkItemChecklists, 
  IWorkItemChecklist, 
  IChecklistItem, 
  ChecklistType 
} from '../Interfaces';
import { ChecklistDataService } from '../DataServices/ChecklistDataService';

interface ChecklistState {
  // State
  checklists: Record<string, IWorkItemChecklists>;
  loading: Record<string, boolean>;
  error: string | null;
  currentWorkItemId: number | null;
  currentWorkItemType: string | null;
  currentProjectId: string | null;

  // Actions
  initializeChecklists: (workItemId: number, workItemType: string, projectId: string) => Promise<void>;
  updateChecklist: (checklist: IWorkItemChecklist, type: ChecklistType) => Promise<void>;
  addChecklistItem: (item: IChecklistItem, type: ChecklistType) => Promise<void>;
  removeChecklistItem: (itemId: string, type: ChecklistType) => Promise<void>;
  toggleChecklistItem: (itemId: string, checked: boolean, type: ChecklistType) => Promise<void>;
  updateChecklistItem: (itemId: string, updates: Partial<IChecklistItem>, type: ChecklistType) => Promise<void>;
  reorderChecklistItems: (oldIndex: number, newIndex: number, type: ChecklistType) => Promise<void>;
  clearError: () => void;
  clearChecklists: () => void;
}

export const useChecklistStore = create<ChecklistState>()(
  devtools(
    (set, get) => ({
      // Initial state
      checklists: {},
      loading: {},
      error: null,
      currentWorkItemId: null,
      currentWorkItemType: null,
      currentProjectId: null,

      // Actions
      initializeChecklists: async (workItemId: number, workItemType: string, projectId: string) => {
        const key = `${workItemId}`;
        
        set((state) => ({
          loading: { ...state.loading, [key]: true },
          error: null,
          currentWorkItemId: workItemId,
          currentWorkItemType: workItemType,
          currentProjectId: projectId
        }));

        try {
          const models = await ChecklistDataService.loadWorkItemChecklists(workItemId, workItemType, projectId);
          
          set((state) => ({
            checklists: { ...state.checklists, [key]: models },
            loading: { ...state.loading, [key]: false }
          }));
        } catch (error) {
          set((state) => ({
            error: error instanceof Error ? error.message : 'Failed to load checklists',
            loading: { ...state.loading, [key]: false }
          }));
        }
      },

      updateChecklist: async (checklist: IWorkItemChecklist, type: ChecklistType) => {
        const { currentWorkItemId, currentWorkItemType, currentProjectId } = get();
        if (!currentWorkItemId || !currentWorkItemType || !currentProjectId) return;

        const key = `${currentWorkItemId}`;
        
        set((state) => ({
          loading: { ...state.loading, [key]: true },
          error: null
        }));

        try {
          let updatedChecklist: IWorkItemChecklist;

          if (type === ChecklistType.WitDefault) {
            updatedChecklist = await ChecklistDataService.updateDefaultChecklistForWorkItem(checklist);
          } else {
            const isPersonal = type === ChecklistType.Personal;
            updatedChecklist = await ChecklistDataService.updateWorkItemChecklist(checklist, isPersonal);
          }

          set((state) => {
            const currentChecklists = state.checklists[key] || { personal: null, shared: null, witDefault: null };
            
            let updatedChecklists: IWorkItemChecklists;
            switch (type) {
              case ChecklistType.Personal:
                updatedChecklists = { ...currentChecklists, personal: updatedChecklist };
                break;
              case ChecklistType.Shared:
                updatedChecklists = { ...currentChecklists, shared: updatedChecklist };
                break;
              case ChecklistType.WitDefault:
                updatedChecklists = { ...currentChecklists, witDefault: updatedChecklist };
                break;
              default:
                updatedChecklists = currentChecklists;
            }

            return {
              checklists: { ...state.checklists, [key]: updatedChecklists },
              loading: { ...state.loading, [key]: false }
            };
          });
        } catch (error) {
          set((state) => ({
            error: error instanceof Error ? error.message : 'Failed to update checklist',
            loading: { ...state.loading, [key]: false }
          }));
        }
      },

      addChecklistItem: async (item: IChecklistItem, type: ChecklistType) => {
        const { currentWorkItemId, currentWorkItemType, currentProjectId } = get();
        if (!currentWorkItemId || !currentWorkItemType || !currentProjectId) return;

        const key = `${currentWorkItemId}`;
        const currentChecklists = get().checklists[key];
        if (!currentChecklists) return;

        let currentChecklist: IWorkItemChecklist;
        switch (type) {
          case ChecklistType.Personal:
            currentChecklist = currentChecklists.personal;
            break;
          case ChecklistType.Shared:
            currentChecklist = currentChecklists.shared;
            break;
          case ChecklistType.WitDefault:
            currentChecklist = currentChecklists.witDefault;
            break;
          default:
            return;
        }

        if (!currentChecklist) return;

        const updatedChecklist: IWorkItemChecklist = {
          ...currentChecklist,
          checklistItems: [...currentChecklist.checklistItems, item]
        };

        await get().updateChecklist(updatedChecklist, type);
      },

      removeChecklistItem: async (itemId: string, type: ChecklistType) => {
        const { currentWorkItemId, currentWorkItemType, currentProjectId } = get();
        if (!currentWorkItemId || !currentWorkItemType || !currentProjectId) return;

        const key = `${currentWorkItemId}`;
        const currentChecklists = get().checklists[key];
        if (!currentChecklists) return;

        let currentChecklist: IWorkItemChecklist;
        switch (type) {
          case ChecklistType.Personal:
            currentChecklist = currentChecklists.personal;
            break;
          case ChecklistType.Shared:
            currentChecklist = currentChecklists.shared;
            break;
          case ChecklistType.WitDefault:
            currentChecklist = currentChecklists.witDefault;
            break;
          default:
            return;
        }

        if (!currentChecklist) return;

        const updatedChecklist: IWorkItemChecklist = {
          ...currentChecklist,
          checklistItems: currentChecklist.checklistItems.filter(item => item.id !== itemId)
        };

        await get().updateChecklist(updatedChecklist, type);
      },

      toggleChecklistItem: async (itemId: string, checked: boolean, type: ChecklistType) => {
        const { currentWorkItemId, currentWorkItemType, currentProjectId } = get();
        if (!currentWorkItemId || !currentWorkItemType || !currentProjectId) return;

        const key = `${currentWorkItemId}`;
        const currentChecklists = get().checklists[key];
        if (!currentChecklists) return;

        let currentChecklist: IWorkItemChecklist;
        switch (type) {
          case ChecklistType.Personal:
            currentChecklist = currentChecklists.personal;
            break;
          case ChecklistType.Shared:
            currentChecklist = currentChecklists.shared;
            break;
          case ChecklistType.WitDefault:
            currentChecklist = currentChecklists.witDefault;
            break;
          default:
            return;
        }

        if (!currentChecklist) return;

        const updatedChecklist: IWorkItemChecklist = {
          ...currentChecklist,
          checklistItems: currentChecklist.checklistItems.map(item =>
            item.id === itemId ? { ...item, completed: checked } : item
          )
        };

        await get().updateChecklist(updatedChecklist, type);
      },

      updateChecklistItem: async (itemId: string, updates: Partial<IChecklistItem>, type: ChecklistType) => {
        const { currentWorkItemId, currentWorkItemType, currentProjectId } = get();
        if (!currentWorkItemId || !currentWorkItemType || !currentProjectId) return;

        const key = `${currentWorkItemId}`;
        const currentChecklists = get().checklists[key];
        if (!currentChecklists) return;

        let currentChecklist: IWorkItemChecklist;
        switch (type) {
          case ChecklistType.Personal:
            currentChecklist = currentChecklists.personal;
            break;
          case ChecklistType.Shared:
            currentChecklist = currentChecklists.shared;
            break;
          case ChecklistType.WitDefault:
            currentChecklist = currentChecklists.witDefault;
            break;
          default:
            return;
        }

        if (!currentChecklist) return;

        const updatedChecklist: IWorkItemChecklist = {
          ...currentChecklist,
          checklistItems: currentChecklist.checklistItems.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
          )
        };

        await get().updateChecklist(updatedChecklist, type);
      },

      reorderChecklistItems: async (oldIndex: number, newIndex: number, type: ChecklistType) => {
        const { currentWorkItemId, currentWorkItemType, currentProjectId } = get();
        if (!currentWorkItemId || !currentWorkItemType || !currentProjectId) return;

        const key = `${currentWorkItemId}`;
        const currentChecklists = get().checklists[key];
        if (!currentChecklists) return;

        let currentChecklist: IWorkItemChecklist;
        switch (type) {
          case ChecklistType.Personal:
            currentChecklist = currentChecklists.personal;
            break;
          case ChecklistType.Shared:
            currentChecklist = currentChecklists.shared;
            break;
          case ChecklistType.WitDefault:
            currentChecklist = currentChecklists.witDefault;
            break;
          default:
            return;
        }

        if (!currentChecklist) return;

        const items = [...currentChecklist.checklistItems];
        const [removed] = items.splice(oldIndex, 1);
        items.splice(newIndex, 0, removed);

        const updatedChecklist: IWorkItemChecklist = {
          ...currentChecklist,
          checklistItems: items
        };

        await get().updateChecklist(updatedChecklist, type);
      },

      clearError: () => {
        set({ error: null });
      },

      clearChecklists: () => {
        set({
          checklists: {},
          loading: {},
          error: null,
          currentWorkItemId: null,
          currentWorkItemType: null,
          currentProjectId: null
        });
      }
    }),
    {
      name: 'checklist-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);
