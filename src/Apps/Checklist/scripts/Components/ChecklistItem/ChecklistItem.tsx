import * as React from 'react';
import { 
  Checkbox, 
  TextField, 
  IconButton, 
  Tooltip,
  Badge,
  mergeStyles
} from '@fluentui/react';
import { 
  EditRegular, 
  DeleteRegular, 
  DragHandleRegular 
} from '@fluentui/react-icons';
import { SortableHandle } from 'react-sortable-hoc';
import { useChecklistItem } from '../../hooks/useChecklistItem';
import { ChecklistItemProps } from '../../types/ChecklistItem.types';
import { ChecklistItemStates } from '../../Interfaces';
import './ChecklistItem.scss';

const DragHandle = SortableHandle(() => (
  <IconButton
    icon={<DragHandleRegular />}
    className="drag-handle"
    ariaLabel="Drag to reorder"
  />
));

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  item,
  checklistType,
  isDefault = false,
  onToggle,
  onRemove,
  onEdit,
  onReorder,
  index,
  disabled = false
}) => {
  const {
    isEditing,
    editText,
    isHovered,
    itemState,
    handlers
  } = useChecklistItem(item, checklistType, onToggle, onRemove, onEdit);

  const itemClassName = mergeStyles(
    'checklist-item',
    {
      'is-editing': isEditing,
      'is-default': isDefault,
      'is-required': item.required,
      'is-completed': item.completed,
      'is-hovered': isHovered
    }
  );

  const stateBadge = itemState && (
    <Badge
      className="item-state-badge"
      style={{
        backgroundColor: itemState.backgroundColor,
        color: itemState.foregroundColor
      }}
    >
      {itemState.name}
    </Badge>
  );

  return (
    <div 
      className={itemClassName}
      onMouseEnter={() => handlers.setHovered(true)}
      onMouseLeave={() => handlers.setHovered(false)}
    >
      <div className="checklist-item-content">
        {/* Drag Handle */}
        {onReorder && !isDefault && (
          <div className="drag-handle-container">
            <DragHandle />
          </div>
        )}

        {/* Checkbox */}
        <Checkbox
          checked={item.completed}
          onChange={(_, checked) => handlers.toggle(checked || false)}
          disabled={disabled || isEditing}
          className="item-checkbox"
          ariaLabel={`Mark "${item.text}" as ${item.completed ? 'incomplete' : 'complete'}`}
        />

        {/* Item Content */}
        <div className="item-content">
          {isEditing ? (
            <TextField
              value={editText}
              onChange={(_, value) => handlers.setEditText(value || '')}
              onKeyDown={handlers.keyDown}
              onBlur={handlers.save}
              autoFocus
              className="edit-textfield"
              placeholder="Enter checklist item text"
            />
          ) : (
            <div className="item-text-container">
              <span className={`item-text ${item.completed ? 'completed' : ''}`}>
                {item.text}
              </span>
              {item.required && (
                <span className="required-indicator" aria-label="Required item">*</span>
              )}
              {stateBadge}
            </div>
          )}
        </div>

        {/* Actions */}
        {!isDefault && isHovered && !isEditing && (
          <div className="item-actions">
            <Tooltip content="Edit item">
              <IconButton
                icon={<EditRegular />}
                onClick={handlers.edit}
                disabled={disabled}
                className="action-button edit-button"
                ariaLabel={`Edit "${item.text}"`}
              />
            </Tooltip>
            <Tooltip content="Delete item">
              <IconButton
                icon={<DeleteRegular />}
                onClick={handlers.remove}
                disabled={disabled}
                className="action-button delete-button"
                ariaLabel={`Delete "${item.text}"`}
              />
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}; 