import * as React from 'react';
import { useState, useCallback, useMemo } from 'react';
import {
  Stack,
  Text,
  PrimaryButton,
  DefaultButton,
  SearchBox,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
  IGroup,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
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
  AddRegular,
  SearchRegular,
  FilterRegular,
  SortRegular,
  MoreHorizontalRegular,
  EditRegular,
  DeleteRegular,
  CopyRegular,
  ShareRegular
} from '@fluentui/react-icons';
import { format } from 'date-fns';
import { BugBash, AppViewMode } from '../../types/BugBashPro.types';
import { useBugBash } from '../../hooks/useBugBash';
import { BugBashForm } from '../BugBashForm/BugBashForm';
import './AllBugBashesView.scss';

export interface AllBugBashesViewProps {
  bugBashes: BugBash[];
  activeBugBashes: BugBash[];
  onBugBashSelect?: (bugBash: BugBash) => void;
  onNewBugBash?: () => void;
  className?: string;
}

export const AllBugBashesView: React.FC<AllBugBashesViewProps> = ({
  bugBashes,
  activeBugBashes,
  onBugBashSelect,
  onNewBugBash,
  className
}) => {
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [selectedBugBash, setSelectedBugBash] = useState<BugBash | null>(null);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);

  const { loading, error, createBugBash, deleteBugBash } = useBugBash();

  // Filter and sort bug bashes
  const filteredAndSortedBugBashes = useMemo(() => {
    let filtered = bugBashes;

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(bb => 
        bb.title.toLowerCase().includes(searchText.toLowerCase()) ||
        bb.description?.toLowerCase().includes(searchText.toLowerCase()) ||
        bb.createdBy.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply status filter
    if (filterType === 'active') {
      filtered = filtered.filter(bb => bb.isActive);
    } else if (filterType === 'inactive') {
      filtered = filtered.filter(bb => !bb.isActive);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          comparison = new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
          break;
        case 'status':
          comparison = (a.isActive ? 1 : 0) - (b.isActive ? 1 : 0);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [bugBashes, searchText, filterType, sortBy, sortOrder]);

  // Group bug bashes by status
  const groupedBugBashes = useMemo(() => {
    const groups: IGroup[] = [];
    const activeItems: BugBash[] = [];
    const inactiveItems: BugBash[] = [];

    filteredAndSortedBugBashes.forEach((bugBash, index) => {
      if (bugBash.isActive) {
        activeItems.push(bugBash);
      } else {
        inactiveItems.push(bugBash);
      }
    });

    if (activeItems.length > 0) {
      groups.push({
        key: 'active',
        name: `Active Bug Bashes (${activeItems.length})`,
        startIndex: 0,
        count: activeItems.length,
        isCollapsed: false
      });
    }

    if (inactiveItems.length > 0) {
      groups.push({
        key: 'inactive',
        name: `Inactive Bug Bashes (${inactiveItems.length})`,
        startIndex: activeItems.length,
        count: inactiveItems.length,
        isCollapsed: false
      });
    }

    return groups;
  }, [filteredAndSortedBugBashes]);

  // Define columns
  const columns: IColumn[] = useMemo(() => [
    {
      key: 'title',
      name: 'Title',
      fieldName: 'title',
      minWidth: 200,
      maxWidth: 300,
      isResizable: true,
      onRender: (item: BugBash) => (
        <div className="bug-bash-title">
          <Text variant="medium" className="title-text">
            {item.title}
          </Text>
          {item.description && (
            <Text variant="small" className="description-text">
              {item.description}
            </Text>
          )}
        </div>
      )
    },
    {
      key: 'status',
      name: 'Status',
      fieldName: 'isActive',
      minWidth: 100,
      maxWidth: 120,
      onRender: (item: BugBash) => (
        <div className={`status-badge ${item.isActive ? 'active' : 'inactive'}`}>
          <Text variant="small">
            {item.isActive ? 'Active' : 'Inactive'}
          </Text>
        </div>
      )
    },
    {
      key: 'dates',
      name: 'Date Range',
      fieldName: 'startDate',
      minWidth: 150,
      maxWidth: 200,
      onRender: (item: BugBash) => (
        <div className="date-range">
          <Text variant="small">
            {format(new Date(item.startDate), 'M/d/yyyy')} - {format(new Date(item.endDate), 'M/d/yyyy')}
          </Text>
        </div>
      )
    },
    {
      key: 'createdBy',
      name: 'Created By',
      fieldName: 'createdBy',
      minWidth: 120,
      maxWidth: 150,
      onRender: (item: BugBash) => (
        <Text variant="small">{item.createdBy}</Text>
      )
    },
    {
      key: 'createdDate',
      name: 'Created Date',
      fieldName: 'createdDate',
      minWidth: 120,
      maxWidth: 150,
      onRender: (item: BugBash) => (
        <Text variant="small">
          {format(new Date(item.createdDate), 'M/d/yyyy')}
        </Text>
      )
    },
    {
      key: 'actions',
      name: 'Actions',
      fieldName: 'actions',
      minWidth: 80,
      maxWidth: 80,
      onRender: (item: BugBash) => (
        <div className="bug-bash-actions">
          <IconButton
            icon={<MoreHorizontalRegular />}
            onClick={(e) => {
              e.stopPropagation();
              setShowActionsMenu(showActionsMenu === item.id ? null : item.id);
            }}
            ariaLabel="More actions"
            title="More actions"
          />
          {showActionsMenu === item.id && (
            <Callout
              target={`#actions-${item.id}`}
              onDismiss={() => setShowActionsMenu(null)}
              directionalHint={DirectionalHint.bottomRightEdge}
              className="actions-callout"
            >
              <FocusTrapCallout>
                <Stack gap={4} className="actions-menu">
                  <DefaultButton
                    icon={<EditRegular />}
                    text="Edit"
                    onClick={() => {
                      setSelectedBugBash(item);
                      setShowActionsMenu(null);
                    }}
                  />
                  <DefaultButton
                    icon={<CopyRegular />}
                    text="Duplicate"
                    onClick={() => {
                      // Handle duplicate
                      setShowActionsMenu(null);
                    }}
                  />
                  <DefaultButton
                    icon={<ShareRegular />}
                    text="Share"
                    onClick={() => {
                      // Handle share
                      setShowActionsMenu(null);
                    }}
                  />
                  <DefaultButton
                    icon={<DeleteRegular />}
                    text="Delete"
                    onClick={() => {
                      // Handle delete
                      setShowActionsMenu(null);
                    }}
                    className="delete-action"
                  />
                </Stack>
              </FocusTrapCallout>
            </Callout>
          )}
        </div>
      )
    }
  ], [showActionsMenu]);

  // Handle bug bash selection
  const handleBugBashSelect = useCallback((bugBash: BugBash) => {
    onBugBashSelect?.(bugBash);
  }, [onBugBashSelect]);

  // Handle new bug bash creation
  const handleNewBugBash = useCallback(() => {
    setShowNewDialog(true);
  }, []);

  // Handle create bug bash
  const handleCreateBugBash = useCallback(async (data: any) => {
    try {
      await createBugBash(data);
      setShowNewDialog(false);
    } catch (error) {
      console.error('Failed to create bug bash:', error);
    }
  }, [createBugBash]);

  // Handle search
  const handleSearch = useCallback((newValue?: string) => {
    setSearchText(newValue || '');
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((newFilter: 'all' | 'active' | 'inactive') => {
    setFilterType(newFilter);
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((newSortBy: 'name' | 'date' | 'status') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  }, [sortBy, sortOrder]);

  // Render loading state
  if (loading && bugBashes.length === 0) {
    return (
      <div className={`all-bug-bashes-view ${className || ''}`}>
        <Stack horizontalAlign="center" verticalAlign="center" style={{ height: '400px' }}>
          <Spinner size={SpinnerSize.large} label="Loading bug bashes..." />
        </Stack>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={`all-bug-bashes-view ${className || ''}`}>
        <MessageBar messageBarType={MessageBarType.error}>
          <Text variant="medium">
            Failed to load bug bashes. Please refresh the page and try again.
          </Text>
          <Text variant="small" className="error-details">
            {error}
          </Text>
        </MessageBar>
      </div>
    );
  }

  return (
    <div className={`all-bug-bashes-view ${className || ''}`}>
      <Stack gap={16}>
        {/* Header */}
        <div className="view-header">
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
            <Text variant="xLarge" className="view-title">
              Bug Bashes
            </Text>
            <PrimaryButton
              icon={<AddRegular />}
              text="New Bug Bash"
              onClick={handleNewBugBash}
              disabled={loading}
            />
          </Stack>
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <Stack horizontal gap={16} verticalAlign="center">
            <SearchBox
              placeholder="Search bug bashes..."
              value={searchText}
              onChange={(_, newValue) => handleSearch(newValue)}
              iconProps={{ iconName: 'Search' }}
              className="search-box"
            />
            
            <div className="filter-buttons">
              <DefaultButton
                text="All"
                onClick={() => handleFilterChange('all')}
                primary={filterType === 'all'}
                size="small"
              />
              <DefaultButton
                text="Active"
                onClick={() => handleFilterChange('active')}
                primary={filterType === 'active'}
                size="small"
              />
              <DefaultButton
                text="Inactive"
                onClick={() => handleFilterChange('inactive')}
                primary={filterType === 'inactive'}
                size="small"
              />
            </div>

            <div className="sort-buttons">
              <DefaultButton
                icon={<SortRegular />}
                text="Sort"
                onClick={() => handleSortChange(sortBy === 'name' ? 'date' : 'name')}
                size="small"
              />
            </div>
          </Stack>
        </div>

        {/* Bug Bashes List */}
        <div className="bug-bashes-list">
          {filteredAndSortedBugBashes.length === 0 ? (
            <div className="empty-state">
              <Text variant="large" className="empty-title">
                No bug bashes found
              </Text>
              <Text variant="medium" className="empty-description">
                {searchText || filterType !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first bug bash to get started'
                }
              </Text>
              {!searchText && filterType === 'all' && (
                <PrimaryButton
                  icon={<AddRegular />}
                  text="Create Bug Bash"
                  onClick={handleNewBugBash}
                  className="empty-action"
                />
              )}
            </div>
          ) : (
            <DetailsList
              items={filteredAndSortedBugBashes}
              columns={columns}
              groups={groupedBugBashes}
              layoutMode={DetailsListLayoutMode.justified}
              selectionMode={SelectionMode.none}
              onItemInvoked={handleBugBashSelect}
              className="bug-bashes-details-list"
            />
          )}
        </div>

        {/* New Bug Bash Dialog */}
        <Dialog
          hidden={!showNewDialog}
          onDismiss={() => setShowNewDialog(false)}
          dialogContentProps={{
            type: DialogType.normal,
            title: 'Create New Bug Bash',
            subText: 'Configure your new bug bash settings'
          }}
          maxWidth={600}
        >
          <BugBashForm
            onSave={handleCreateBugBash}
            onCancel={() => setShowNewDialog(false)}
          />
        </Dialog>

        {/* Edit Bug Bash Dialog */}
        {selectedBugBash && (
          <Dialog
            hidden={!selectedBugBash}
            onDismiss={() => setSelectedBugBash(null)}
            dialogContentProps={{
              type: DialogType.normal,
              title: 'Edit Bug Bash',
              subText: 'Update bug bash settings'
            }}
            maxWidth={600}
          >
            <BugBashForm
              bugBash={selectedBugBash}
              onSave={handleCreateBugBash}
              onCancel={() => setSelectedBugBash(null)}
            />
          </Dialog>
        )}
      </Stack>
    </div>
  );
}; 