import * as React from 'react';
import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Stack,
  Text,
  PrimaryButton,
  DefaultButton,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  Pivot,
  PivotItem,
  IconButton,
  TooltipHost,
  DirectionalHint,
  Callout,
  FocusTrapCallout,
  Dialog,
  DialogType,
  DialogFooter
} from '@fluentui/react';
import {
  EditRegular,
  DeleteRegular,
  SettingsRegular,
  ShareRegular,
  CopyRegular,
  MoreHorizontalRegular,
  ArrowLeftRegular,
  RefreshRegular
} from '@fluentui/react-icons';
import { format } from 'date-fns';
import { BugBash, BugBashItem, AppViewMode } from '../../types/BugBashPro.types';
import { useBugBash, useBugBashItems } from '../../hooks/useBugBash';
import { BugBashItemList } from '../BugBashItemList/BugBashItemList';
import { BugBashForm } from '../BugBashForm/BugBashForm';
import { BugBashSettings } from '../BugBashSettings/BugBashSettings';
import { BugBashAnalytics } from '../BugBashAnalytics/BugBashAnalytics';
import './BugBashView.scss';

export interface BugBashViewProps {
  bugBashId: string;
  onBack?: () => void;
  className?: string;
}

export const BugBashView: React.FC<BugBashViewProps> = ({
  bugBashId,
  onBack,
  className
}) => {
  const [selectedTab, setSelectedTab] = useState<string>('items');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Custom hooks
  const {
    currentBugBash: bugBash,
    loading: bugBashLoading,
    error: bugBashError,
    updateBugBash,
    deleteBugBash
  } = useBugBash(bugBashId);

  const {
    bugBashItems,
    loading: itemsLoading,
    error: itemsError,
    loadBugBashItems
  } = useBugBashItems(bugBashId);

  // Load bug bash items when component mounts
  useEffect(() => {
    if (bugBashId) {
      loadBugBashItems();
    }
  }, [bugBashId, loadBugBashItems]);

  // Handle tab change
  const handleTabChange = useCallback((item?: PivotItem) => {
    if (item) {
      setSelectedTab(item.props.itemKey || 'items');
    }
  }, []);

  // Handle edit bug bash
  const handleEditBugBash = useCallback(async (data: any) => {
    try {
      await updateBugBash(bugBashId, data);
      setShowEditDialog(false);
    } catch (error) {
      console.error('Failed to update bug bash:', error);
    }
  }, [bugBashId, updateBugBash]);

  // Handle delete bug bash
  const handleDeleteBugBash = useCallback(async () => {
    try {
      await deleteBugBash(bugBashId);
      setShowDeleteConfirm(false);
      onBack?.();
    } catch (error) {
      console.error('Failed to delete bug bash:', error);
    }
  }, [bugBashId, deleteBugBash, onBack]);

  // Handle duplicate bug bash
  const handleDuplicateBugBash = useCallback(() => {
    // TODO: Implement duplicate functionality
    setShowActionsMenu(false);
  }, []);

  // Handle share bug bash
  const handleShareBugBash = useCallback(() => {
    // TODO: Implement share functionality
    setShowActionsMenu(false);
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    loadBugBashItems();
  }, [loadBugBashItems]);

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!bugBashItems) return null;

    const total = bugBashItems.length;
    const active = bugBashItems.filter(item => item.status === 'active').length;
    const resolved = bugBashItems.filter(item => item.status === 'resolved').length;
    const closed = bugBashItems.filter(item => item.status === 'closed').length;

    return {
      total,
      active,
      resolved,
      closed,
      progress: total > 0 ? Math.round((resolved + closed) / total * 100) : 0
    };
  }, [bugBashItems]);

  // Render loading state
  if (bugBashLoading) {
    return (
      <div className={`bug-bash-view ${className || ''}`}>
        <Stack horizontalAlign="center" verticalAlign="center" style={{ height: '400px' }}>
          <Spinner size={SpinnerSize.large} label="Loading bug bash..." />
        </Stack>
      </div>
    );
  }

  // Render error state
  if (bugBashError || !bugBash) {
    return (
      <div className={`bug-bash-view ${className || ''}`}>
        <MessageBar messageBarType={MessageBarType.error}>
          <Text variant="medium">
            Failed to load bug bash. Please refresh the page and try again.
          </Text>
          <Text variant="small" className="error-details">
            {bugBashError}
          </Text>
        </MessageBar>
      </div>
    );
  }

  return (
    <div className={`bug-bash-view ${className || ''}`}>
      <Stack gap={16}>
        {/* Header */}
        <div className="view-header">
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
            <Stack horizontal gap={16} verticalAlign="center">
              <IconButton
                icon={<ArrowLeftRegular />}
                onClick={onBack}
                ariaLabel="Go back"
                title="Go back"
                className="back-button"
              />
              <div className="bug-bash-info">
                <Text variant="xLarge" className="bug-bash-title">
                  {bugBash.title}
                </Text>
                {bugBash.description && (
                  <Text variant="medium" className="bug-bash-description">
                    {bugBash.description}
                  </Text>
                )}
              </div>
            </Stack>
            
            <Stack horizontal gap={8} verticalAlign="center">
              <IconButton
                icon={<RefreshRegular />}
                onClick={handleRefresh}
                ariaLabel="Refresh"
                title="Refresh"
                disabled={itemsLoading}
              />
              <IconButton
                icon={<SettingsRegular />}
                onClick={() => setShowSettingsDialog(true)}
                ariaLabel="Settings"
                title="Settings"
              />
              <IconButton
                icon={<MoreHorizontalRegular />}
                onClick={() => setShowActionsMenu(!showActionsMenu)}
                ariaLabel="More actions"
                title="More actions"
              />
              {showActionsMenu && (
                <Callout
                  target="#actions-menu"
                  onDismiss={() => setShowActionsMenu(false)}
                  directionalHint={DirectionalHint.bottomRightEdge}
                  className="actions-callout"
                >
                  <FocusTrapCallout>
                    <Stack gap={4} className="actions-menu">
                      <DefaultButton
                        icon={<EditRegular />}
                        text="Edit Bug Bash"
                        onClick={() => {
                          setShowEditDialog(true);
                          setShowActionsMenu(false);
                        }}
                      />
                      <DefaultButton
                        icon={<CopyRegular />}
                        text="Duplicate"
                        onClick={handleDuplicateBugBash}
                      />
                      <DefaultButton
                        icon={<ShareRegular />}
                        text="Share"
                        onClick={handleShareBugBash}
                      />
                      <DefaultButton
                        icon={<DeleteRegular />}
                        text="Delete"
                        onClick={() => {
                          setShowDeleteConfirm(true);
                          setShowActionsMenu(false);
                        }}
                        className="delete-action"
                      />
                    </Stack>
                  </FocusTrapCallout>
                </Callout>
              )}
            </Stack>
          </Stack>
        </div>

        {/* Statistics */}
        {statistics && (
          <div className="statistics-section">
            <Stack horizontal gap={24} horizontalAlign="center">
              <div className="stat-item">
                <Text variant="xLarge" className="stat-value">
                  {statistics.total}
                </Text>
                <Text variant="small" className="stat-label">
                  Total Items
                </Text>
              </div>
              <div className="stat-item">
                <Text variant="xLarge" className="stat-value active">
                  {statistics.active}
                </Text>
                <Text variant="small" className="stat-label">
                  Active
                </Text>
              </div>
              <div className="stat-item">
                <Text variant="xLarge" className="stat-value resolved">
                  {statistics.resolved}
                </Text>
                <Text variant="small" className="stat-label">
                  Resolved
                </Text>
              </div>
              <div className="stat-item">
                <Text variant="xLarge" className="stat-value closed">
                  {statistics.closed}
                </Text>
                <Text variant="small" className="stat-label">
                  Closed
                </Text>
              </div>
              <div className="stat-item">
                <Text variant="xLarge" className="stat-value progress">
                  {statistics.progress}%
                </Text>
                <Text variant="small" className="stat-label">
                  Progress
                </Text>
              </div>
            </Stack>
          </div>
        )}

        {/* Content Tabs */}
        <div className="content-section">
          <Pivot
            selectedKey={selectedTab}
            onLinkClick={handleTabChange}
            className="bug-bash-pivot"
          >
            <PivotItem
              headerText="Items"
              itemKey="items"
              itemCount={statistics?.total || 0}
            >
              <BugBashItemList
                bugBashId={bugBashId}
                items={bugBashItems || []}
                loading={itemsLoading}
                error={itemsError}
                onRefresh={handleRefresh}
              />
            </PivotItem>
            
            <PivotItem
              headerText="Analytics"
              itemKey="analytics"
            >
              <BugBashAnalytics
                bugBashId={bugBashId}
                items={bugBashItems || []}
                statistics={statistics}
              />
            </PivotItem>
            
            <PivotItem
              headerText="Settings"
              itemKey="settings"
            >
              <BugBashSettings
                bugBash={bugBash}
                onSave={handleEditBugBash}
              />
            </PivotItem>
          </Pivot>
        </div>

        {/* Edit Dialog */}
        <Dialog
          hidden={!showEditDialog}
          onDismiss={() => setShowEditDialog(false)}
          dialogContentProps={{
            type: DialogType.normal,
            title: 'Edit Bug Bash',
            subText: 'Update bug bash settings'
          }}
          maxWidth={600}
        >
          <BugBashForm
            bugBash={bugBash}
            onSave={handleEditBugBash}
            onCancel={() => setShowEditDialog(false)}
          />
        </Dialog>

        {/* Settings Dialog */}
        <Dialog
          hidden={!showSettingsDialog}
          onDismiss={() => setShowSettingsDialog(false)}
          dialogContentProps={{
            type: DialogType.normal,
            title: 'Bug Bash Settings',
            subText: 'Configure bug bash settings'
          }}
          maxWidth={800}
        >
          <BugBashSettings
            bugBash={bugBash}
            onSave={handleEditBugBash}
            onCancel={() => setShowSettingsDialog(false)}
          />
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          hidden={!showDeleteConfirm}
          onDismiss={() => setShowDeleteConfirm(false)}
          dialogContentProps={{
            type: DialogType.normal,
            title: 'Delete Bug Bash',
            subText: 'Are you sure you want to delete this bug bash? This action cannot be undone.'
          }}
        >
          <DialogFooter>
            <DefaultButton
              text="Cancel"
              onClick={() => setShowDeleteConfirm(false)}
            />
            <PrimaryButton
              text="Delete"
              onClick={handleDeleteBugBash}
              className="delete-button"
            />
          </DialogFooter>
        </Dialog>
      </Stack>
    </div>
  );
}; 