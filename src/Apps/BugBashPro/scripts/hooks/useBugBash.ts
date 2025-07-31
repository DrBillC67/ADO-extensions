import { useState, useEffect, useCallback, useMemo } from 'react';
import { useBugBashStore } from '../stores/bugBashStore';
import { 
  BugBash, 
  BugBashItem, 
  BugBashFilter, 
  BugBashFormData, 
  BugBashSettingsFormData,
  BugBashItemStatus,
  BugBashItemSeverity,
  BugBashItemPriority,
  AppViewMode
} from '../types/BugBashPro.types';

// Hook for managing bug bash data
export const useBugBash = (bugBashId?: string) => {
  const {
    bugBashes,
    currentBugBash,
    loading,
    error,
    loadBugBashes,
    loadBugBash,
    createBugBash,
    updateBugBash,
    deleteBugBash
  } = useBugBashStore();

  // Load bug bashes on mount
  useEffect(() => {
    loadBugBashes();
  }, [loadBugBashes]);

  // Load specific bug bash if ID provided
  useEffect(() => {
    if (bugBashId) {
      loadBugBash(bugBashId);
    }
  }, [bugBashId, loadBugBash]);

  // Get bug bash by ID
  const getBugBashById = useCallback((id: string) => {
    return bugBashes.find(bb => bb.id === id);
  }, [bugBashes]);

  // Get active bug bashes
  const activeBugBashes = useMemo(() => {
    return bugBashes.filter(bb => bb.isActive);
  }, [bugBashes]);

  // Get bug bashes by team
  const getBugBashesByTeam = useCallback((teamId: string) => {
    return bugBashes.filter(bb => bb.teamId === teamId);
  }, [bugBashes]);

  return {
    bugBashes,
    currentBugBash,
    loading,
    error,
    activeBugBashes,
    getBugBashById,
    getBugBashesByTeam,
    createBugBash,
    updateBugBash,
    deleteBugBash,
    refresh: loadBugBashes
  };
};

// Hook for managing bug bash items
export const useBugBashItems = (bugBashId?: string, filters?: BugBashFilter) => {
  const {
    bugBashItems,
    currentBugBashItem,
    loading,
    error,
    loadBugBashItems,
    loadBugBashItem,
    createBugBashItem,
    updateBugBashItem,
    deleteBugBashItem,
    approveBugBashItem,
    rejectBugBashItem,
    createWorkItem,
    linkWorkItem
  } = useBugBashStore();

  // Load bug bash items when bugBashId or filters change
  useEffect(() => {
    if (bugBashId) {
      loadBugBashItems(bugBashId, filters);
    }
  }, [bugBashId, filters, loadBugBashItems]);

  // Filter items by status
  const getItemsByStatus = useCallback((status: BugBashItemStatus) => {
    return bugBashItems.filter(item => item.status === status);
  }, [bugBashItems]);

  // Filter items by severity
  const getItemsBySeverity = useCallback((severity: BugBashItemSeverity) => {
    return bugBashItems.filter(item => item.severity === severity);
  }, [bugBashItems]);

  // Filter items by priority
  const getItemsByPriority = useCallback((priority: BugBashItemPriority) => {
    return bugBashItems.filter(item => item.priority === priority);
  }, [bugBashItems]);

  // Get items by user
  const getItemsByUser = useCallback((userId: string) => {
    return bugBashItems.filter(item => item.submittedBy === userId);
  }, [bugBashItems]);

  // Get items with work items
  const itemsWithWorkItems = useMemo(() => {
    return bugBashItems.filter(item => item.workItemId);
  }, [bugBashItems]);

  // Get items with attachments
  const itemsWithAttachments = useMemo(() => {
    return bugBashItems.filter(item => item.attachments.length > 0);
  }, [bugBashItems]);

  // Get items by tags
  const getItemsByTags = useCallback((tags: string[]) => {
    return bugBashItems.filter(item => 
      tags.some(tag => item.tags.includes(tag))
    );
  }, [bugBashItems]);

  return {
    bugBashItems,
    currentBugBashItem,
    loading,
    error,
    itemsWithWorkItems,
    itemsWithAttachments,
    getItemsByStatus,
    getItemsBySeverity,
    getItemsByPriority,
    getItemsByUser,
    getItemsByTags,
    createBugBashItem,
    updateBugBashItem,
    deleteBugBashItem,
    approveBugBashItem,
    rejectBugBashItem,
    createWorkItem,
    linkWorkItem,
    loadBugBashItem,
    refresh: () => bugBashId ? loadBugBashItems(bugBashId, filters) : Promise.resolve()
  };
};

// Hook for managing comments
export const useBugBashComments = (bugBashItemId?: string) => {
  const {
    addComment,
    updateComment,
    deleteComment,
    loading,
    error
  } = useBugBashStore();

  const [commentText, setCommentText] = useState('');

  const handleAddComment = useCallback(async () => {
    if (bugBashItemId && commentText.trim()) {
      await addComment(bugBashItemId, commentText.trim());
      setCommentText('');
    }
  }, [bugBashItemId, commentText, addComment]);

  const handleUpdateComment = useCallback(async (commentId: string, content: string) => {
    await updateComment(commentId, content);
  }, [updateComment]);

  const handleDeleteComment = useCallback(async (commentId: string) => {
    await deleteComment(commentId);
  }, [deleteComment]);

  return {
    commentText,
    setCommentText,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    loading,
    error
  };
};

// Hook for managing attachments
export const useBugBashAttachments = (bugBashItemId?: string) => {
  const {
    uploadAttachment,
    deleteAttachment,
    loading,
    error
  } = useBugBashStore();

  const handleUploadAttachment = useCallback(async (file: File) => {
    if (bugBashItemId) {
      return await uploadAttachment(bugBashItemId, file);
    }
  }, [bugBashItemId, uploadAttachment]);

  const handleDeleteAttachment = useCallback(async (attachmentId: string) => {
    await deleteAttachment(attachmentId);
  }, [deleteAttachment]);

  return {
    handleUploadAttachment,
    handleDeleteAttachment,
    loading,
    error
  };
};

// Hook for managing filters
export const useBugBashFilters = () => {
  const {
    filters,
    updateFilters,
    clearFilters
  } = useBugBashStore();

  const handleFilterChange = useCallback((newFilters: Partial<BugBashFilter>) => {
    updateFilters(newFilters);
  }, [updateFilters]);

  const handleClearFilters = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).length > 0;
  }, [filters]);

  return {
    filters,
    handleFilterChange,
    handleClearFilters,
    hasActiveFilters
  };
};

// Hook for managing analytics
export const useBugBashAnalytics = (bugBashId?: string) => {
  const {
    analytics,
    loadAnalytics,
    loading,
    error
  } = useBugBashStore();

  // Load analytics when bugBashId changes
  useEffect(() => {
    if (bugBashId) {
      loadAnalytics(bugBashId);
    }
  }, [bugBashId, loadAnalytics]);

  return {
    analytics,
    loading,
    error,
    refresh: () => bugBashId ? loadAnalytics(bugBashId) : Promise.resolve()
  };
};

// Hook for managing user settings
export const useUserSettings = () => {
  const {
    userSettings,
    loadUserSettings,
    updateUserSettings,
    loading,
    error
  } = useBugBashStore();

  // Load user settings on mount
  useEffect(() => {
    loadUserSettings();
  }, [loadUserSettings]);

  const handleUpdateSettings = useCallback(async (settings: Partial<typeof userSettings>) => {
    await updateUserSettings(settings);
  }, [updateUserSettings]);

  return {
    userSettings,
    handleUpdateSettings,
    loading,
    error,
    refresh: loadUserSettings
  };
};

// Hook for navigation
export const useBugBashNavigation = () => {
  const [currentView, setCurrentView] = useState<AppViewMode>(AppViewMode.All);
  const [selectedBugBashId, setSelectedBugBashId] = useState<string | undefined>();
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();

  const navigateToView = useCallback((view: AppViewMode, bugBashId?: string, itemId?: string) => {
    setCurrentView(view);
    setSelectedBugBashId(bugBashId);
    setSelectedItemId(itemId);
  }, []);

  const navigateToBugBash = useCallback((bugBashId: string, view: AppViewMode = AppViewMode.Results) => {
    navigateToView(view, bugBashId);
  }, [navigateToView]);

  const navigateToItem = useCallback((itemId: string, bugBashId?: string) => {
    navigateToView(AppViewMode.Details, bugBashId, itemId);
  }, [navigateToView]);

  const navigateToAll = useCallback(() => {
    navigateToView(AppViewMode.All);
  }, [navigateToView]);

  const navigateToNew = useCallback((bugBashId?: string) => {
    navigateToView(AppViewMode.New, bugBashId);
  }, [navigateToView]);

  return {
    currentView,
    selectedBugBashId,
    selectedItemId,
    navigateToView,
    navigateToBugBash,
    navigateToItem,
    navigateToAll,
    navigateToNew
  };
};

// Hook for form validation
export const useBugBashFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateBugBashForm = useCallback((data: BugBashSettingsFormData) => {
    const newErrors: Record<string, string> = {};

    if (!data.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!data.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!data.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (data.startDate && data.endDate && data.startDate >= data.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (data.maxSubmissionsPerUser < 1) {
      newErrors.maxSubmissionsPerUser = 'Max submissions must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const validateBugBashItemForm = useCallback((data: BugBashFormData) => {
    const newErrors: Record<string, string> = {};

    if (!data.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!data.severity) {
      newErrors.severity = 'Severity is required';
    }

    if (!data.priority) {
      newErrors.priority = 'Priority is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateBugBashForm,
    validateBugBashItemForm,
    clearErrors
  };
}; 