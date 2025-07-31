import { WorkItemType } from 'TFS/WorkItemTracking/Contracts';

// PR Work Items Types
export interface PRWorkItemsState {
  configuredWorkItemTypes: WorkItemType[];
  allWorkItemTypes: WorkItemType[];
  loading: boolean;
  error: string | null;
}

export interface PRWorkItemsActions {
  loadWorkItemTypes: () => Promise<void>;
  toggleWorkItemType: (workItemTypeName: string, enabled: boolean) => Promise<void>;
  createWorkItemAndLink: (workItemTypeName: string, pullRequestId: string) => Promise<void>;
}

// Component Props
export interface ConfigureDialogProps {
  className?: string;
}

export interface WorkItemTypeSelectorProps {
  workItemTypes: WorkItemType[];
  selectedTypes: string[];
  onToggleType: (typeName: string, enabled: boolean) => void;
  disabled?: boolean;
}

// Menu Items
export interface MenuItem {
  text: string;
  title: string;
  icon?: string;
  action?: () => Promise<void>;
  separator?: boolean;
  childItems?: MenuItem[];
}

// Configuration
export interface PRWorkItemsConfig {
  projectId: string;
  defaultWorkItemTypes: string[];
}

// API Responses
export interface CreateWorkItemResponse {
  id: number;
  url: string;
  success: boolean;
  error?: string;
}

// Hook Return Types
export interface UsePRWorkItemsReturn {
  configuredWorkItemTypes: WorkItemType[];
  allWorkItemTypes: WorkItemType[];
  loading: boolean;
  error: string | null;
  loadWorkItemTypes: () => Promise<void>;
  toggleWorkItemType: (workItemTypeName: string, enabled: boolean) => Promise<void>;
  createWorkItemAndLink: (workItemTypeName: string, pullRequestId: string) => Promise<void>;
} 