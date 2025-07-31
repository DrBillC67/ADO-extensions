import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { BugBashState, BugBashActions, BugBash, BugBashItem, BugBashFilter, BugBashAnalytics, UserSettings, BugBashFormData, BugBashSettingsFormData } from '../types/BugBashPro.types';
import { BugBashDataService } from '../DataServices/BugBashDataService';
import { BugBashItemDataService } from '../DataServices/BugBashItemDataService';
import { BugBashSettingsDataService } from '../DataServices/BugBashSettingsDataService';

// Initial state
const initialState: BugBashState = {
  bugBashes: [],
  currentBugBash: undefined,
  bugBashItems: [],
  currentBugBashItem: undefined,
  loading: false,
  error: null,
  filters: {},
  analytics: undefined,
  userSettings: undefined
};

// Create the store
export const useBugBashStore = create<BugBashState & BugBashActions>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,

      // Bug Bash Actions
      loadBugBashes: async () => {
        set({ loading: true, error: null });
        try {
          const bugBashes = await BugBashDataService.getBugBashes();
          set({ bugBashes, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load bug bashes', 
            loading: false 
          });
        }
      },

      loadBugBash: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const bugBash = await BugBashDataService.getBugBash(id);
          set({ currentBugBash: bugBash, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load bug bash', 
            loading: false 
          });
        }
      },

      createBugBash: async (data: BugBashSettingsFormData) => {
        set({ loading: true, error: null });
        try {
          const bugBash = await BugBashDataService.createBugBash(data);
          set(state => ({
            bugBashes: [...state.bugBashes, bugBash],
            currentBugBash: bugBash,
            loading: false
          }));
          return bugBash;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create bug bash', 
            loading: false 
          });
          throw error;
        }
      },

      updateBugBash: async (id: string, data: Partial<BugBash>) => {
        set({ loading: true, error: null });
        try {
          await BugBashDataService.updateBugBash(id, data);
          set(state => ({
            bugBashes: state.bugBashes.map(bb => 
              bb.id === id ? { ...bb, ...data } : bb
            ),
            currentBugBash: state.currentBugBash?.id === id 
              ? { ...state.currentBugBash, ...data }
              : state.currentBugBash,
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update bug bash', 
            loading: false 
          });
        }
      },

      deleteBugBash: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await BugBashDataService.deleteBugBash(id);
          set(state => ({
            bugBashes: state.bugBashes.filter(bb => bb.id !== id),
            currentBugBash: state.currentBugBash?.id === id ? undefined : state.currentBugBash,
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete bug bash', 
            loading: false 
          });
        }
      },

      // Bug Bash Item Actions
      loadBugBashItems: async (bugBashId: string, filters?: BugBashFilter) => {
        set({ loading: true, error: null });
        try {
          const items = await BugBashItemDataService.getBugBashItems(bugBashId, filters);
          set({ bugBashItems: items, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load bug bash items', 
            loading: false 
          });
        }
      },

      loadBugBashItem: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const item = await BugBashItemDataService.getBugBashItem(id);
          set({ currentBugBashItem: item, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load bug bash item', 
            loading: false 
          });
        }
      },

      createBugBashItem: async (bugBashId: string, data: BugBashFormData) => {
        set({ loading: true, error: null });
        try {
          const item = await BugBashItemDataService.createBugBashItem(bugBashId, data);
          set(state => ({
            bugBashItems: [...state.bugBashItems, item],
            loading: false
          }));
          return item;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create bug bash item', 
            loading: false 
          });
          throw error;
        }
      },

      updateBugBashItem: async (id: string, data: Partial<BugBashItem>) => {
        set({ loading: true, error: null });
        try {
          await BugBashItemDataService.updateBugBashItem(id, data);
          set(state => ({
            bugBashItems: state.bugBashItems.map(item => 
              item.id === id ? { ...item, ...data } : item
            ),
            currentBugBashItem: state.currentBugBashItem?.id === id 
              ? { ...state.currentBugBashItem, ...data }
              : state.currentBugBashItem,
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update bug bash item', 
            loading: false 
          });
        }
      },

      deleteBugBashItem: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await BugBashItemDataService.deleteBugBashItem(id);
          set(state => ({
            bugBashItems: state.bugBashItems.filter(item => item.id !== id),
            currentBugBashItem: state.currentBugBashItem?.id === id ? undefined : state.currentBugBashItem,
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete bug bash item', 
            loading: false 
          });
        }
      },

      approveBugBashItem: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await BugBashItemDataService.approveBugBashItem(id);
          set(state => ({
            bugBashItems: state.bugBashItems.map(item => 
              item.id === id ? { ...item, status: 'approved' as const } : item
            ),
            currentBugBashItem: state.currentBugBashItem?.id === id 
              ? { ...state.currentBugBashItem, status: 'approved' as const }
              : state.currentBugBashItem,
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to approve bug bash item', 
            loading: false 
          });
        }
      },

      rejectBugBashItem: async (id: string, reason?: string) => {
        set({ loading: true, error: null });
        try {
          await BugBashItemDataService.rejectBugBashItem(id, reason);
          set(state => ({
            bugBashItems: state.bugBashItems.map(item => 
              item.id === id ? { ...item, status: 'rejected' as const } : item
            ),
            currentBugBashItem: state.currentBugBashItem?.id === id 
              ? { ...state.currentBugBashItem, status: 'rejected' as const }
              : state.currentBugBashItem,
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to reject bug bash item', 
            loading: false 
          });
        }
      },

      createWorkItem: async (bugBashItemId: string, workItemType: string) => {
        set({ loading: true, error: null });
        try {
          const workItem = await BugBashItemDataService.createWorkItem(bugBashItemId, workItemType);
          set(state => ({
            bugBashItems: state.bugBashItems.map(item => 
              item.id === bugBashItemId ? { ...item, workItem, workItemId: workItem.id } : item
            ),
            currentBugBashItem: state.currentBugBashItem?.id === bugBashItemId 
              ? { ...state.currentBugBashItem, workItem, workItemId: workItem.id }
              : state.currentBugBashItem,
            loading: false
          }));
          return workItem;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create work item', 
            loading: false 
          });
          throw error;
        }
      },

      linkWorkItem: async (bugBashItemId: string, workItemId: number) => {
        set({ loading: true, error: null });
        try {
          await BugBashItemDataService.linkWorkItem(bugBashItemId, workItemId);
          set(state => ({
            bugBashItems: state.bugBashItems.map(item => 
              item.id === bugBashItemId ? { ...item, workItemId } : item
            ),
            currentBugBashItem: state.currentBugBashItem?.id === bugBashItemId 
              ? { ...state.currentBugBashItem, workItemId }
              : state.currentBugBashItem,
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to link work item', 
            loading: false 
          });
        }
      },

      // Comment Actions
      addComment: async (bugBashItemId: string, content: string) => {
        set({ loading: true, error: null });
        try {
          const comment = await BugBashItemDataService.addComment(bugBashItemId, content);
          set(state => ({
            bugBashItems: state.bugBashItems.map(item => 
              item.id === bugBashItemId 
                ? { ...item, comments: [...item.comments, comment] }
                : item
            ),
            currentBugBashItem: state.currentBugBashItem?.id === bugBashItemId 
              ? { ...state.currentBugBashItem, comments: [...state.currentBugBashItem.comments, comment] }
              : state.currentBugBashItem,
            loading: false
          }));
          return comment;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add comment', 
            loading: false 
          });
          throw error;
        }
      },

      updateComment: async (commentId: string, content: string) => {
        set({ loading: true, error: null });
        try {
          await BugBashItemDataService.updateComment(commentId, content);
          set(state => ({
            bugBashItems: state.bugBashItems.map(item => ({
              ...item,
              comments: item.comments.map(comment => 
                comment.id === commentId 
                  ? { ...comment, content, isEdited: true, modifiedDate: new Date() }
                  : comment
              )
            })),
            currentBugBashItem: state.currentBugBashItem ? {
              ...state.currentBugBashItem,
              comments: state.currentBugBashItem.comments.map(comment => 
                comment.id === commentId 
                  ? { ...comment, content, isEdited: true, modifiedDate: new Date() }
                  : comment
              )
            } : undefined,
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update comment', 
            loading: false 
          });
        }
      },

      deleteComment: async (commentId: string) => {
        set({ loading: true, error: null });
        try {
          await BugBashItemDataService.deleteComment(commentId);
          set(state => ({
            bugBashItems: state.bugBashItems.map(item => ({
              ...item,
              comments: item.comments.filter(comment => comment.id !== commentId)
            })),
            currentBugBashItem: state.currentBugBashItem ? {
              ...state.currentBugBashItem,
              comments: state.currentBugBashItem.comments.filter(comment => comment.id !== commentId)
            } : undefined,
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete comment', 
            loading: false 
          });
        }
      },

      // Attachment Actions
      uploadAttachment: async (bugBashItemId: string, file: File) => {
        set({ loading: true, error: null });
        try {
          const attachment = await BugBashItemDataService.uploadAttachment(bugBashItemId, file);
          set(state => ({
            bugBashItems: state.bugBashItems.map(item => 
              item.id === bugBashItemId 
                ? { ...item, attachments: [...item.attachments, attachment] }
                : item
            ),
            currentBugBashItem: state.currentBugBashItem?.id === bugBashItemId 
              ? { ...state.currentBugBashItem, attachments: [...state.currentBugBashItem.attachments, attachment] }
              : state.currentBugBashItem,
            loading: false
          }));
          return attachment;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to upload attachment', 
            loading: false 
          });
          throw error;
        }
      },

      deleteAttachment: async (attachmentId: string) => {
        set({ loading: true, error: null });
        try {
          await BugBashItemDataService.deleteAttachment(attachmentId);
          set(state => ({
            bugBashItems: state.bugBashItems.map(item => ({
              ...item,
              attachments: item.attachments.filter(attachment => attachment.id !== attachmentId)
            })),
            currentBugBashItem: state.currentBugBashItem ? {
              ...state.currentBugBashItem,
              attachments: state.currentBugBashItem.attachments.filter(attachment => attachment.id !== attachmentId)
            } : undefined,
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete attachment', 
            loading: false 
          });
        }
      },

      // Analytics Actions
      loadAnalytics: async (bugBashId: string) => {
        set({ loading: true, error: null });
        try {
          const analytics = await BugBashDataService.getAnalytics(bugBashId);
          set({ analytics, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load analytics', 
            loading: false 
          });
        }
      },

      // Filter Actions
      updateFilters: (filters: Partial<BugBashFilter>) => {
        set(state => ({
          filters: { ...state.filters, ...filters }
        }));
      },

      clearFilters: () => {
        set({ filters: {} });
      },

      // User Settings Actions
      loadUserSettings: async () => {
        set({ loading: true, error: null });
        try {
          const settings = await BugBashSettingsDataService.getUserSettings();
          set({ userSettings: settings, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load user settings', 
            loading: false 
          });
        }
      },

      updateUserSettings: async (settings: Partial<UserSettings>) => {
        set({ loading: true, error: null });
        try {
          const updatedSettings = await BugBashSettingsDataService.updateUserSettings(settings);
          set({ userSettings: updatedSettings, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update user settings', 
            loading: false 
          });
        }
      }
    })),
    {
      name: 'bugBashStore',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

// Selectors for better performance
export const useBugBashes = () => useBugBashStore(state => state.bugBashes);
export const useCurrentBugBash = () => useBugBashStore(state => state.currentBugBash);
export const useBugBashItems = () => useBugBashStore(state => state.bugBashItems);
export const useCurrentBugBashItem = () => useBugBashStore(state => state.currentBugBashItem);
export const useBugBashLoading = () => useBugBashStore(state => state.loading);
export const useBugBashError = () => useBugBashStore(state => state.error);
export const useBugBashFilters = () => useBugBashStore(state => state.filters);
export const useBugBashAnalytics = () => useBugBashStore(state => state.analytics);
export const useUserSettings = () => useBugBashStore(state => state.userSettings);
