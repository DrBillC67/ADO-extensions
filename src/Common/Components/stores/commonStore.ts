import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Common store interface
export interface CommonState {
  // Theme state
  theme: 'light' | 'dark' | 'high-contrast';
  
  // Loading states
  globalLoading: boolean;
  loadingStates: Record<string, boolean>;
  
  // Error states
  globalError: string | null;
  errors: Record<string, string | null>;
  
  // User preferences
  preferences: Record<string, any>;
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'high-contrast') => void;
  setGlobalLoading: (loading: boolean) => void;
  setLoadingState: (key: string, loading: boolean) => void;
  setGlobalError: (error: string | null) => void;
  setError: (key: string, error: string | null) => void;
  setPreference: (key: string, value: any) => void;
  clearErrors: () => void;
  clearLoadingStates: () => void;
  reset: () => void;
}

// Initial state
const initialState = {
  theme: 'light' as const,
  globalLoading: false,
  loadingStates: {},
  globalError: null,
  errors: {},
  preferences: {}
};

// Create the common store
export const useCommonStore = create<CommonState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Theme actions
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        document.body.className = document.body.className
          .replace(/vss-light|vss-dark|vss-high-contrast/g, `vss-${theme}`);
      },

      // Loading actions
      setGlobalLoading: (globalLoading) => set({ globalLoading }),
      
      setLoadingState: (key, loading) => {
        set((state) => ({
          loadingStates: {
            ...state.loadingStates,
            [key]: loading
          }
        }));
      },

      // Error actions
      setGlobalError: (globalError) => set({ globalError }),
      
      setError: (key, error) => {
        set((state) => ({
          errors: {
            ...state.errors,
            [key]: error
          }
        }));
      },

      // Preference actions
      setPreference: (key, value) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            [key]: value
          }
        }));
        
        // Persist to localStorage
        try {
          localStorage.setItem(`common-pref-${key}`, JSON.stringify(value));
        } catch (error) {
          console.error('Failed to save preference:', error);
        }
      },

      // Utility actions
      clearErrors: () => set({ globalError: null, errors: {} }),
      
      clearLoadingStates: () => set({ globalLoading: false, loadingStates: {} }),
      
      reset: () => set(initialState)
    }),
    {
      name: 'common-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

// Specialized stores for different domains
export interface WorkItemStore {
  workItems: Record<number, any>;
  workItemTypes: any[];
  fields: any[];
  
  // Actions
  setWorkItem: (id: number, workItem: any) => void;
  setWorkItemTypes: (types: any[]) => void;
  setFields: (fields: any[]) => void;
  clearWorkItems: () => void;
}

export const useWorkItemStore = create<WorkItemStore>()(
  devtools(
    (set) => ({
      workItems: {},
      workItemTypes: [],
      fields: [],

      setWorkItem: (id, workItem) => {
        set((state) => ({
          workItems: {
            ...state.workItems,
            [id]: workItem
          }
        }));
      },

      setWorkItemTypes: (types) => set({ workItemTypes: types }),
      
      setFields: (fields) => set({ fields }),
      
      clearWorkItems: () => set({ workItems: {} })
    }),
    {
      name: 'work-item-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

// UI store for UI-specific state
export interface UIStore {
  modals: Record<string, boolean>;
  sidebars: Record<string, boolean>;
  notifications: Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    duration?: number;
  }>;
  
  // Actions
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  openSidebar: (id: string) => void;
  closeSidebar: (id: string) => void;
  addNotification: (notification: Omit<UIStore['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIStore>()(
  devtools(
    (set) => ({
      modals: {},
      sidebars: {},
      notifications: [],

      openModal: (id) => {
        set((state) => ({
          modals: { ...state.modals, [id]: true }
        }));
      },

      closeModal: (id) => {
        set((state) => ({
          modals: { ...state.modals, [id]: false }
        }));
      },

      openSidebar: (id) => {
        set((state) => ({
          sidebars: { ...state.sidebars, [id]: true }
        }));
      },

      closeSidebar: (id) => {
        set((state) => ({
          sidebars: { ...state.sidebars, [id]: false }
        }));
      },

      addNotification: (notification) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification = { ...notification, id };
        
        set((state) => ({
          notifications: [...state.notifications, newNotification]
        }));

        // Auto-remove notification after duration
        if (notification.duration) {
          setTimeout(() => {
            set((state) => ({
              notifications: state.notifications.filter(n => n.id !== id)
            }));
          }, notification.duration);
        }
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      },

      clearNotifications: () => set({ notifications: [] })
    }),
    {
      name: 'ui-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

// Export store utilities
export const storeUtils = {
  // Initialize stores with persisted data
  initialize: () => {
    // Load theme from localStorage
    try {
      const savedTheme = localStorage.getItem('common-theme');
      if (savedTheme) {
        useCommonStore.getState().setTheme(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }

    // Load preferences from localStorage
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('common-pref-'));
      keys.forEach(key => {
        const prefKey = key.replace('common-pref-', '');
        const value = JSON.parse(localStorage.getItem(key)!);
        useCommonStore.getState().setPreference(prefKey, value);
      });
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  },

  // Persist theme changes
  persistTheme: (theme: 'light' | 'dark' | 'high-contrast') => {
    try {
      localStorage.setItem('common-theme', JSON.stringify(theme));
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }
}; 