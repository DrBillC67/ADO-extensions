import { WorkItem, WorkItemRelationType } from 'TFS/WorkItemTracking/Contracts';
import { IFilterState } from 'VSSUI/Utilities/Filter';
import { ISettings, ISortState } from '../Models';

export interface RelatedWitsProps {
  className?: string;
}

export interface RelatedWitsState {
  workItems: WorkItem[];
  filteredItems: WorkItem[];
  settings: ISettings;
  loading: boolean;
  error: string | null;
  filterState: IFilterState;
  sortState: ISortState;
  isWorkItemLoaded: boolean;
  isNew: boolean;
  settingsPanelOpen: boolean;
  relationsMap: Record<string, boolean>;
  relationTypes: WorkItemRelationType[];
}

export interface RelatedWitsTableProps {
  items: WorkItem[];
  loading: boolean;
  onItemClick: (workItem: WorkItem) => void;
  onAddLink: (workItem: WorkItem, relationType: WorkItemRelationType) => void;
  onRefresh: () => void;
}

export interface RelatedWitsFiltersProps {
  filterState: IFilterState;
  onFilterChange: (filterState: IFilterState) => void;
  onClearFilters: () => void;
}

export interface RelatedWitsHeaderProps {
  workItemCount: number;
  onRefresh: () => void;
  onOpenSettings: () => void;
  loading: boolean;
}

export interface RelatedWitsSettingsProps {
  settings: ISettings;
  onSave: (settings: ISettings) => void;
  onCancel: () => void;
  open: boolean;
}

export interface WorkItemSearchParams {
  workItemId: number;
  settings: ISettings;
  projectId: string;
}

export interface WorkItemSearchResult {
  workItems: WorkItem[];
  totalCount: number;
  hasMore: boolean;
}

export interface RelatedWitsStore {
  // State
  workItems: WorkItem[];
  filteredItems: WorkItem[];
  settings: ISettings;
  loading: boolean;
  error: string | null;
  filterState: IFilterState;
  sortState: ISortState;
  isWorkItemLoaded: boolean;
  isNew: boolean;
  settingsPanelOpen: boolean;
  relationsMap: Record<string, boolean>;
  relationTypes: WorkItemRelationType[];

  // Actions
  loadRelatedWorkItems: (workItemId: number, settings: ISettings) => Promise<void>;
  applyFilter: (filterState: IFilterState) => void;
  applySort: (sortState: ISortState) => void;
  updateSettings: (settings: ISettings) => Promise<void>;
  addLink: (workItemId: number, relationType: WorkItemRelationType) => Promise<void>;
  clearFilters: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  setWorkItemLoaded: (loaded: boolean, isNew: boolean) => void;
  clearError: () => void;
  refresh: () => Promise<void>;
}

export interface WorkItemColumn {
  key: string;
  name: string;
  fieldName: string;
  minWidth: number;
  maxWidth?: number;
  isResizable: boolean;
  isSorted: boolean;
  isSortedDescending: boolean;
  onRender: (item: WorkItem, index: number, column: WorkItemColumn) => React.ReactNode;
  onColumnClick: (ev: React.MouseEvent<HTMLElement>, column: WorkItemColumn) => void;
}

export interface FilterBarItem {
  key: string;
  name: string;
  type: 'text' | 'picklist' | 'date' | 'boolean';
  placeholder?: string;
  options?: Array<{ key: string; text: string }>;
  value?: any;
  onChange: (value: any) => void;
}

export interface ContextMenuProps {
  workItem: WorkItem;
  relationTypes: WorkItemRelationType[];
  onAddLink: (relationType: WorkItemRelationType) => void;
  onOpenWorkItem: () => void;
  onCopyId: () => void;
  onCopyTitle: () => void;
}

export interface AdvancedFiltersProps {
  filterState: IFilterState;
  onFilterChange: (filterState: IFilterState) => void;
  onClearFilters: () => void;
  onSaveSearch: (search: SavedSearch) => void;
  savedSearches?: SavedSearch[];
  onLoadSearch: (search: SavedSearch) => void;
  onDeleteSearch: (searchId: string) => void;
  loading?: boolean;
}

export interface SavedSearch {
  id: string;
  name: string;
  filterState: IFilterState;
  dateRange?: { startDate?: Date; endDate?: Date };
  createdAt: string;
}

export interface ExportOptionsProps {
  workItems: WorkItem[];
  onExport: (exportData: ExportData) => Promise<void>;
  loading?: boolean;
}

export interface ExportData {
  format: 'csv' | 'excel';
  fields: string[];
  workItems: WorkItem[];
} 