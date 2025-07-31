import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { 
  MessageBar, 
  MessageBarType,
  ProgressIndicator,
  Stack,
  Text
} from '@fluentui/react';
import { 
  DragHandleRegular,
  AddRegular 
} from '@fluentui/react-icons';
import { ChecklistItem } from '../ChecklistItem';
import { ChecklistItemEditor } from '../ChecklistItemEditor';
import { ChecklistType, IChecklistItem } from '../../Interfaces';
import { useChecklistByType } from '../../hooks/useChecklistStore';
import { Loading } from 'Common/Components/Loading';
import './ChecklistView.scss';

const DragHandle = SortableHandle(() => (
  <div className="drag-handle">
    <DragHandleRegular />
  </div>
));

const SortableItem = SortableElement(({ value, checklistType, onToggle, onRemove, onEdit, onReorder, isDefault, disabled }) => (
  <div className="checklist-item-container">
    <DragHandle />
    <ChecklistItem
      item={value}
      checklistType={checklistType}
      isDefault={isDefault}
      onToggle={onToggle}
      onRemove={onRemove}
      onEdit={onEdit}
      onReorder={onReorder}
      disabled={disabled}
    />
  </div>
));

const SortableList = SortableContainer(({ items, checklistType, onToggle, onRemove, onEdit, onReorder, isDefault, disabled }) => (
  <div className="checklist-items">
    {items.map((item, index) => (
      <SortableItem
        key={`item-${item.id}`}
        index={index}
        value={item}
        checklistType={checklistType}
        onToggle={onToggle}
        onRemove={onRemove}
        onEdit={onEdit}
        onReorder={onReorder}
        isDefault={isDefault}
        disabled={disabled}
      />
    ))}
  </div>
));

export interface ChecklistViewProps {
  workItemId: number;
  workItemType: string;
  projectId: string;
  isPersonal?: boolean;
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({
  workItemId,
  workItemType,
  projectId,
  isPersonal = false
}) => {
  const checklistType = isPersonal ? ChecklistType.Personal : ChecklistType.Shared;
  const {
    items,
    completedCount,
    totalCount,
    progress,
    loading,
    error,
    actions
  } = useChecklistByType(workItemId, checklistType);

  // Initialize checklists when component mounts
  useEffect(() => {
    if (workItemId && workItemType && projectId) {
      actions.initializeChecklists(workItemId, workItemType, projectId);
    }
  }, [workItemId, workItemType, projectId, actions]);

  const handleToggle = useCallback((itemId: string, checked: boolean, type: ChecklistType) => {
    actions.toggleChecklistItem(itemId, checked, type);
  }, [actions]);

  const handleRemove = useCallback((itemId: string, type: ChecklistType) => {
    actions.removeChecklistItem(itemId, type);
  }, [actions]);

  const handleEdit = useCallback((item: IChecklistItem, type: ChecklistType) => {
    actions.updateChecklistItem(item.id, item, type);
  }, [actions]);

  const handleReorder = useCallback((data: { oldIndex: number; newIndex: number }, _ev: MouseEvent, type: ChecklistType) => {
    actions.reorderChecklistItems(data.oldIndex, data.newIndex, type);
  }, [actions]);

  const handleAddItem = useCallback((item: IChecklistItem, type: ChecklistType) => {
    actions.addChecklistItem(item, type);
  }, [actions]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <MessageBar messageBarType={MessageBarType.error} onDismiss={actions.clearError}>
        {error}
      </MessageBar>
    );
  }

  return (
    <div className="checklist-view">
      {/* Progress Indicator */}
      {totalCount > 0 && (
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center" className="progress-container">
          <Text variant="medium" className="progress-text">
            {completedCount} of {totalCount} completed
          </Text>
          <ProgressIndicator 
            percentComplete={progress / 100} 
            barHeight={4}
            className="progress-indicator"
          />
        </Stack>
      )}

      {/* Checklist Items */}
      <div className="checklist-items-container">
        {items.length > 0 ? (
          <SortableList
            items={items}
            checklistType={checklistType}
            onToggle={handleToggle}
            onRemove={handleRemove}
            onEdit={handleEdit}
            onReorder={handleReorder}
            isDefault={false}
            disabled={loading}
            useDragHandle
            lockAxis="y"
            helperClass="sortable-helper"
          />
        ) : (
          <div className="empty-state">
            <Text variant="medium" className="empty-text">
              No checklist items yet. Add your first item below.
            </Text>
          </div>
        )}
      </div>

      {/* Add New Item */}
      <ChecklistItemEditor
        inputPlaceholder="Add new item"
        disabled={loading}
        onSubmit={(item) => handleAddItem(item, checklistType)}
        className="add-item-editor"
      />
    </div>
  );
}; 