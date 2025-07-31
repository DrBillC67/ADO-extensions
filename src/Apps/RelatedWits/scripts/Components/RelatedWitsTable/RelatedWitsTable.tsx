import * as React from 'react';
import { useState, useCallback, useMemo } from 'react';
import { 
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
  ISelection,
  Selection,
  IContextualMenuItem,
  CommandBar,
  ICommandBarItemProps,
  Stack,
  Text,
  Spinner,
  SpinnerSize
} from '@fluentui/react';
import { 
  RefreshRegular,
  FilterRegular,
  SortRegular,
  LinkRegular,
  OpenRegular,
  CopyRegular
} from '@fluentui/react-icons';
import { WorkItem, WorkItemRelationType } from 'TFS/WorkItemTracking/Contracts';
import { RelatedWitsTableProps, WorkItemColumn } from '../../types/RelatedWits.types';
import { WorkItemStateView } from 'Common/Components/VSTS/WorkItemStateView';
import { WorkItemTitleView } from 'Common/Components/VSTS/WorkItemTitleView';
import { IdentityView } from 'Common/Components/IdentityView';
import { openWorkItemDialog } from 'Common/Utilities/WorkItemFormHelpers';
import { getQueryUrl } from 'Common/Utilities/UrlHelper';
import './RelatedWitsTable.scss';

export const RelatedWitsTable: React.FC<RelatedWitsTableProps> = ({
  items,
  loading,
  onItemClick,
  onAddLink,
  onRefresh
}) => {
  const [selection] = useState<ISelection>(new Selection({
    getKey: (item: WorkItem) => item.id.toString()
  }));

  const [sortState, setSortState] = useState<{ key: string; isDescending: boolean }>({
    key: 'System.ChangedDate',
    isDescending: true
  });

  const columns = useMemo((): IColumn[] => [
    {
      key: 'System.Id',
      name: 'ID',
      fieldName: 'System.Id',
      minWidth: 60,
      maxWidth: 80,
      isResizable: true,
      isSorted: sortState.key === 'System.Id',
      isSortedDescending: sortState.key === 'System.Id' ? sortState.isDescending : false,
      onRender: (item: WorkItem) => (
        <Text variant="small" className="work-item-id">
          #{item.id}
        </Text>
      ),
      onColumnClick: () => handleSort('System.Id')
    },
    {
      key: 'System.WorkItemType',
      name: 'Type',
      fieldName: 'System.WorkItemType',
      minWidth: 100,
      maxWidth: 120,
      isResizable: true,
      isSorted: sortState.key === 'System.WorkItemType',
      isSortedDescending: sortState.key === 'System.WorkItemType' ? sortState.isDescending : false,
      onRender: (item: WorkItem) => (
        <Text variant="small" className="work-item-type">
          {item.fields['System.WorkItemType']}
        </Text>
      ),
      onColumnClick: () => handleSort('System.WorkItemType')
    },
    {
      key: 'System.Title',
      name: 'Title',
      fieldName: 'System.Title',
      minWidth: 200,
      isResizable: true,
      isSorted: sortState.key === 'System.Title',
      isSortedDescending: sortState.key === 'System.Title' ? sortState.isDescending : false,
      onRender: (item: WorkItem) => (
        <WorkItemTitleView 
          workItem={item}
          className="work-item-title"
        />
      ),
      onColumnClick: () => handleSort('System.Title')
    },
    {
      key: 'System.AssignedTo',
      name: 'Assigned To',
      fieldName: 'System.AssignedTo',
      minWidth: 120,
      maxWidth: 150,
      isResizable: true,
      isSorted: sortState.key === 'System.AssignedTo',
      isSortedDescending: sortState.key === 'System.AssignedTo' ? sortState.isDescending : false,
      onRender: (item: WorkItem) => (
        <IdentityView 
          identity={item.fields['System.AssignedTo']}
          className="work-item-assigned-to"
        />
      ),
      onColumnClick: () => handleSort('System.AssignedTo')
    },
    {
      key: 'System.AreaPath',
      name: 'Area Path',
      fieldName: 'System.AreaPath',
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      isSorted: sortState.key === 'System.AreaPath',
      isSortedDescending: sortState.key === 'System.AreaPath' ? sortState.isDescending : false,
      onRender: (item: WorkItem) => (
        <Text variant="small" className="work-item-area-path">
          {item.fields['System.AreaPath']}
        </Text>
      ),
      onColumnClick: () => handleSort('System.AreaPath')
    },
    {
      key: 'System.State',
      name: 'State',
      fieldName: 'System.State',
      minWidth: 100,
      maxWidth: 120,
      isResizable: true,
      isSorted: sortState.key === 'System.State',
      isSortedDescending: sortState.key === 'System.State' ? sortState.isDescending : false,
      onRender: (item: WorkItem) => (
        <WorkItemStateView 
          workItem={item}
          className="work-item-state"
        />
      ),
      onColumnClick: () => handleSort('System.State')
    },
    {
      key: 'System.ChangedDate',
      name: 'Changed Date',
      fieldName: 'System.ChangedDate',
      minWidth: 120,
      maxWidth: 140,
      isResizable: true,
      isSorted: sortState.key === 'System.ChangedDate',
      isSortedDescending: sortState.key === 'System.ChangedDate' ? sortState.isDescending : false,
      onRender: (item: WorkItem) => (
        <Text variant="small" className="work-item-changed-date">
          {new Date(item.fields['System.ChangedDate']).toLocaleDateString()}
        </Text>
      ),
      onColumnClick: () => handleSort('System.ChangedDate')
    }
  ], [sortState]);

  const handleSort = useCallback((key: string) => {
    setSortState(prev => ({
      key,
      isDescending: prev.key === key ? !prev.isDescending : true
    }));
  }, []);

  const handleItemInvoked = useCallback((item: WorkItem) => {
    onItemClick(item);
  }, [onItemClick]);

  const handleContextMenu = useCallback((item: WorkItem): IContextualMenuItem[] => {
    return [
      {
        key: 'open',
        text: 'Open Work Item',
        iconProps: { iconName: 'OpenRegular' },
        onClick: () => onItemClick(item)
      },
      {
        key: 'addLink',
        text: 'Add Link',
        iconProps: { iconName: 'LinkRegular' },
        subMenuProps: {
          items: [
            {
              key: 'parent',
              text: 'Parent',
              onClick: () => onAddLink(item, { name: 'Parent' } as WorkItemRelationType)
            },
            {
              key: 'child',
              text: 'Child',
              onClick: () => onAddLink(item, { name: 'Child' } as WorkItemRelationType)
            },
            {
              key: 'related',
              text: 'Related',
              onClick: () => onAddLink(item, { name: 'Related' } as WorkItemRelationType)
            }
          ]
        }
      },
      {
        key: 'copyId',
        text: 'Copy ID',
        iconProps: { iconName: 'CopyRegular' },
        onClick: () => navigator.clipboard.writeText(item.id.toString())
      },
      {
        key: 'copyTitle',
        text: 'Copy Title',
        iconProps: { iconName: 'CopyRegular' },
        onClick: () => navigator.clipboard.writeText(item.fields['System.Title'])
      }
    ];
  }, [onItemClick, onAddLink]);

  const commandBarItems = useMemo((): ICommandBarItemProps[] => [
    {
      key: 'refresh',
      text: 'Refresh',
      iconProps: { iconName: 'RefreshRegular' },
      onClick: onRefresh
    },
    {
      key: 'filter',
      text: 'Filter',
      iconProps: { iconName: 'FilterRegular' },
      onClick: () => console.log('Filter clicked')
    },
    {
      key: 'sort',
      text: 'Sort',
      iconProps: { iconName: 'SortRegular' },
      onClick: () => console.log('Sort clicked')
    }
  ], [onRefresh]);

  const sortedItems = useMemo(() => {
    if (!items) return [];
    
    return [...items].sort((a, b) => {
      const aValue = a.fields[sortState.key];
      const bValue = b.fields[sortState.key];
      
      if (aValue < bValue) return sortState.isDescending ? 1 : -1;
      if (aValue > bValue) return sortState.isDescending ? -1 : 1;
      return 0;
    });
  }, [items, sortState]);

  if (loading) {
    return (
      <Stack horizontalAlign="center" verticalAlign="center" className="loading-container">
        <Spinner size={SpinnerSize.large} label="Loading related work items..." />
      </Stack>
    );
  }

  return (
    <div className="related-wits-table">
      <CommandBar
        items={commandBarItems}
        className="table-command-bar"
      />
      
      {sortedItems.length > 0 ? (
        <DetailsList
          items={sortedItems}
          columns={columns}
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.multiple}
          selection={selection}
          onItemInvoked={handleItemInvoked}
          onRenderRow={(props) => (
            <div 
              {...props}
              className="table-row"
              onContextMenu={(e) => {
                e.preventDefault();
                // Handle context menu
              }}
            />
          )}
          className="work-items-details-list"
        />
      ) : (
        <Stack horizontalAlign="center" verticalAlign="center" className="empty-state">
          <Text variant="large">No related work items found</Text>
          <Text variant="medium" className="empty-state-subtitle">
            Try adjusting your search criteria or settings
          </Text>
        </Stack>
      )}
    </div>
  );
}; 