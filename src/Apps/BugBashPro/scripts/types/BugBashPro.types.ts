import { WorkItem } from 'TFS/WorkItemTracking/Contracts';

// App View Modes
export enum AppViewMode {
  All = 'all',
  New = 'new',
  Results = 'results',
  Edit = 'edit',
  Charts = 'charts',
  Details = 'details'
}

// Bug Bash Types
export interface BugBash {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdBy: string;
  createdDate: Date;
  teamId: string;
  projectId: string;
  settings?: BugBashSettings;
}

export interface BugBashSettings {
  allowAnonymousSubmissions: boolean;
  requireApproval: boolean;
  maxSubmissionsPerUser: number;
  allowedWorkItemTypes: string[];
  defaultWorkItemType: string;
  templateFields: Record<string, any>;
}

// Bug Bash Item Types
export interface BugBashItem {
  id: string;
  bugBashId: string;
  title: string;
  description?: string;
  severity: BugBashItemSeverity;
  priority: BugBashItemPriority;
  status: BugBashItemStatus;
  submittedBy: string;
  submittedDate: Date;
  assignedTo?: string;
  workItemId?: number;
  workItem?: WorkItem;
  tags: string[];
  attachments: BugBashAttachment[];
  comments: BugBashComment[];
  teamId: string;
  projectId: string;
}

export enum BugBashItemSeverity {
  Critical = 'critical',
  High = 'high',
  Medium = 'medium',
  Low = 'low'
}

export enum BugBashItemPriority {
  Critical = 'critical',
  High = 'high',
  Medium = 'medium',
  Low = 'low'
}

export enum BugBashItemStatus {
  New = 'new',
  UnderReview = 'underReview',
  Approved = 'approved',
  Rejected = 'rejected',
  InProgress = 'inProgress',
  Resolved = 'resolved',
  Closed = 'closed'
}

// Bug Bash Attachment Types
export interface BugBashAttachment {
  id: string;
  bugBashItemId: string;
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  uploadedDate: Date;
  url: string;
  contentType: string;
}

// Bug Bash Comment Types
export interface BugBashComment {
  id: string;
  bugBashItemId: string;
  content: string;
  createdBy: string;
  createdDate: Date;
  modifiedBy?: string;
  modifiedDate?: Date;
  isEdited: boolean;
}

// User Settings Types
export interface UserSettings {
  userId: string;
  defaultView: AppViewMode;
  itemsPerPage: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  filters: Record<string, any>;
  theme: 'light' | 'dark' | 'highContrast';
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  browserNotifications: boolean;
  newItemNotifications: boolean;
  statusChangeNotifications: boolean;
  commentNotifications: boolean;
}

// Chart and Analytics Types
export interface BugBashAnalytics {
  totalItems: number;
  itemsByStatus: Record<BugBashItemStatus, number>;
  itemsBySeverity: Record<BugBashItemSeverity, number>;
  itemsByPriority: Record<BugBashItemPriority, number>;
  itemsByTeam: Record<string, number>;
  itemsByUser: Record<string, number>;
  itemsByDate: Record<string, number>;
  averageResolutionTime: number;
  topTags: Array<{ tag: string; count: number }>;
}

// Form Types
export interface BugBashFormData {
  title: string;
  description?: string;
  severity: BugBashItemSeverity;
  priority: BugBashItemPriority;
  tags: string[];
  attachments: File[];
}

export interface BugBashSettingsFormData {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allowAnonymousSubmissions: boolean;
  requireApproval: boolean;
  maxSubmissionsPerUser: number;
  allowedWorkItemTypes: string[];
  defaultWorkItemType: string;
  templateFields: Record<string, any>;
}

// Filter Types
export interface BugBashFilter {
  searchText?: string;
  status?: BugBashItemStatus[];
  severity?: BugBashItemSeverity[];
  priority?: BugBashItemPriority[];
  assignedTo?: string[];
  submittedBy?: string[];
  tags?: string[];
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  hasWorkItem?: boolean;
  hasAttachments?: boolean;
}

// Navigation Types
export interface NavigationState {
  appViewMode: AppViewMode;
  bugBashId?: string;
  bugBashItemId?: string;
  queryParams?: Record<string, string>;
}

// Store Types
export interface BugBashState {
  bugBashes: BugBash[];
  currentBugBash?: BugBash;
  bugBashItems: BugBashItem[];
  currentBugBashItem?: BugBashItem;
  loading: boolean;
  error: string | null;
  filters: BugBashFilter;
  analytics?: BugBashAnalytics;
  userSettings?: UserSettings;
}

export interface BugBashActions {
  loadBugBashes: () => Promise<void>;
  loadBugBash: (id: string) => Promise<void>;
  createBugBash: (data: BugBashSettingsFormData) => Promise<BugBash>;
  updateBugBash: (id: string, data: Partial<BugBash>) => Promise<void>;
  deleteBugBash: (id: string) => Promise<void>;
  loadBugBashItems: (bugBashId: string, filters?: BugBashFilter) => Promise<void>;
  loadBugBashItem: (id: string) => Promise<void>;
  createBugBashItem: (bugBashId: string, data: BugBashFormData) => Promise<BugBashItem>;
  updateBugBashItem: (id: string, data: Partial<BugBashItem>) => Promise<void>;
  deleteBugBashItem: (id: string) => Promise<void>;
  approveBugBashItem: (id: string) => Promise<void>;
  rejectBugBashItem: (id: string, reason?: string) => Promise<void>;
  createWorkItem: (bugBashItemId: string, workItemType: string) => Promise<WorkItem>;
  linkWorkItem: (bugBashItemId: string, workItemId: number) => Promise<void>;
  addComment: (bugBashItemId: string, content: string) => Promise<BugBashComment>;
  updateComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  uploadAttachment: (bugBashItemId: string, file: File) => Promise<BugBashAttachment>;
  deleteAttachment: (attachmentId: string) => Promise<void>;
  loadAnalytics: (bugBashId: string) => Promise<BugBashAnalytics>;
  updateFilters: (filters: Partial<BugBashFilter>) => void;
  clearFilters: () => void;
  loadUserSettings: () => Promise<void>;
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<void>;
}

// Component Props Types
export interface AppProps {
  className?: string;
}

export interface BugBashViewProps {
  bugBashId?: string;
  bugBashItemId?: string;
  pivotKey?: string;
  className?: string;
}

export interface BugBashItemProps {
  item: BugBashItem;
  onEdit?: (item: BugBashItem) => void;
  onDelete?: (item: BugBashItem) => void;
  onApprove?: (item: BugBashItem) => void;
  onReject?: (item: BugBashItem) => void;
  onViewDetails?: (item: BugBashItem) => void;
  className?: string;
}

export interface BugBashFormProps {
  bugBashId?: string;
  itemId?: string;
  onSave?: (data: BugBashFormData) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

export interface BugBashSettingsProps {
  bugBashId?: string;
  onSave?: (data: BugBashSettingsFormData) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

export interface BugBashAnalyticsProps {
  bugBashId: string;
  className?: string;
}

export interface BugBashFilterProps {
  filters: BugBashFilter;
  onFiltersChange: (filters: BugBashFilter) => void;
  className?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

// Error Types
export interface BugBashError {
  code: string;
  message: string;
  details?: any;
}

// Event Types
export interface BugBashEvent {
  type: 'itemCreated' | 'itemUpdated' | 'itemDeleted' | 'itemApproved' | 'itemRejected' | 'commentAdded' | 'attachmentUploaded';
  data: any;
  timestamp: Date;
  userId: string;
} 