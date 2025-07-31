# Checklist Modernization: Practical Example

## Overview

This document demonstrates the modernization of the Checklist extension by converting the `ChecklistItem` component from a class-based component to a modern functional component with React hooks and Fluent UI v8.

## Current Implementation Analysis

### **Current ChecklistItem Component**
- **Size**: 109 lines
- **Architecture**: Class component with lifecycle methods
- **UI Framework**: OfficeFabric (Fluent UI v7)
- **State Management**: Props-based with callback functions
- **Features**: Checkbox, edit mode, delete, drag handle

## Modernized Implementation

### **1. Updated Dependencies**

```json
{
  "dependencies": {
    "@fluentui/react": "^8.110.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "zustand": "^4.4.0"
  }
}
```

### **2. Modern Types**

```typescript
// src/Apps/Checklist/scripts/types/ChecklistItem.types.ts
export interface ChecklistItemProps {
  item: IChecklistItem;
  checklistType: ChecklistType;
  isDefault?: boolean;
  onToggle: (itemId: string, checked: boolean, type: ChecklistType) => void;
  onRemove: (itemId: string, type: ChecklistType) => void;
  onEdit: (item: IChecklistItem, type: ChecklistType) => void;
  onReorder?: (oldIndex: number, newIndex: number, type: ChecklistType) => void;
  index?: number;
  disabled?: boolean;
}

export interface ChecklistItemState {
  isEditing: boolean;
  editText: string;
  isHovered: boolean;
  isDragging: boolean;
}
```

### **3. Custom Hooks**

```typescript
// src/Apps/Checklist/scripts/hooks/useChecklistItem.ts
import { useState, useCallback, useMemo } from 'react';
import { IChecklistItem, ChecklistType } from '../Interfaces';

export const useChecklistItem = (
  item: IChecklistItem,
  checklistType: ChecklistType,
  onToggle: (itemId: string, checked: boolean, type: ChecklistType) => void,
  onRemove: (itemId: string, type: ChecklistType) => void,
  onEdit: (item: IChecklistItem, type: ChecklistType) => void
) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = useCallback((checked: boolean) => {
    onToggle(item.id, checked, checklistType);
  }, [item.id, checklistType, onToggle]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setEditText(item.text);
  }, [item.text]);

  const handleSave = useCallback(() => {
    if (editText.trim() && editText !== item.text) {
      onEdit({ ...item, text: editText.trim() }, checklistType);
    }
    setIsEditing(false);
  }, [editText, item, checklistType, onEdit]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditText(item.text);
  }, [item.text]);

  const handleRemove = useCallback(() => {
    onRemove(item.id, checklistType);
  }, [item.id, checklistType, onRemove]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  const itemState = useMemo(() => {
    if (!item.state) return null;
    return ChecklistItemStates[item.state];
  }, [item.state]);

  return {
    isEditing,
    editText,
    isHovered,
    itemState,
    handlers: {
      toggle: handleToggle,
      edit: handleEdit,
      save: handleSave,
      cancel: handleCancel,
      remove: handleRemove,
      keyDown: handleKeyDown,
      setHovered: setIsHovered
    }
  };
};
```

### **4. Modern ChecklistItem Component**

```typescript
// src/Apps/Checklist/scripts/Components/ChecklistItem/ChecklistItem.tsx
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
```

### **5. Modern Styling**

```scss
// src/Apps/Checklist/scripts/Components/ChecklistItem/ChecklistItem.scss
.checklist-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.2s ease;
  margin-bottom: 4px;
  
  &:hover {
    background-color: var(--neutralLighter);
    
    .item-actions {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  &.is-editing {
    background-color: var(--themeLighter);
    border: 1px solid var(--themePrimary);
  }
  
  &.is-default {
    background-color: var(--neutralLight);
    border-left: 3px solid var(--themePrimary);
  }
  
  &.is-required {
    .required-indicator {
      color: var(--errorText);
      font-weight: bold;
      margin-left: 4px;
    }
  }
  
  &.is-completed {
    .item-text {
      text-decoration: line-through;
      color: var(--neutralSecondary);
    }
  }
}

.checklist-item-content {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
}

.drag-handle-container {
  display: flex;
  align-items: center;
  
  .drag-handle {
    opacity: 0.5;
    cursor: grab;
    
    &:hover {
      opacity: 1;
    }
    
    &:active {
      cursor: grabbing;
    }
  }
}

.item-checkbox {
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-text-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-text {
  word-break: break-word;
  line-height: 1.4;
  
  &.completed {
    text-decoration: line-through;
    color: var(--neutralSecondary);
  }
}

.edit-textfield {
  width: 100%;
  
  input {
    border: none;
    background: transparent;
    font-size: inherit;
    padding: 0;
    
    &:focus {
      outline: none;
    }
  }
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.2s ease;
  
  .action-button {
    min-width: 24px;
    height: 24px;
    padding: 0;
    
    &:hover {
      background-color: var(--neutralLight);
    }
    
    &.delete-button:hover {
      background-color: var(--errorBackground);
      color: var(--errorText);
    }
  }
}

.item-state-badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 500;
}

.required-indicator {
  color: var(--errorText);
  font-weight: bold;
}

// Dark theme support
.vss-dark {
  .checklist-item {
    &:hover {
      background-color: var(--neutralQuaternary);
    }
    
    &.is-editing {
      background-color: var(--themeDarkAlt);
    }
    
    &.is-default {
      background-color: var(--neutralTertiary);
    }
  }
  
  .item-actions .action-button:hover {
    background-color: var(--neutralTertiary);
  }
}

// High contrast theme support
.vss-high-contrast {
  .checklist-item {
    border: 1px solid var(--neutralPrimary);
    
    &:hover {
      border-color: var(--themePrimary);
    }
    
    &.is-editing {
      border-color: var(--themePrimary);
      border-width: 2px;
    }
  }
}
```

### **6. Component Index**

```typescript
// src/Apps/Checklist/scripts/Components/ChecklistItem/index.ts
export { ChecklistItem } from './ChecklistItem';
export type { ChecklistItemProps } from '../../types/ChecklistItem.types';
```

### **7. Unit Tests**

```typescript
// src/Apps/Checklist/scripts/Components/ChecklistItem/__tests__/ChecklistItem.test.tsx
import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChecklistItem } from '../ChecklistItem';
import { ChecklistType, ChecklistItemState } from '../../../Interfaces';

const mockItem = {
  id: '1',
  text: 'Test checklist item',
  completed: false,
  required: false,
  state: ChecklistItemState.New
};

const mockHandlers = {
  onToggle: jest.fn(),
  onRemove: jest.fn(),
  onEdit: jest.fn(),
  onReorder: jest.fn()
};

describe('ChecklistItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders checklist item correctly', () => {
    render(
      <ChecklistItem
        item={mockItem}
        checklistType={ChecklistType.Personal}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Test checklist item')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('handles checkbox toggle', () => {
    render(
      <ChecklistItem
        item={mockItem}
        checklistType={ChecklistType.Personal}
        {...mockHandlers}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockHandlers.onToggle).toHaveBeenCalledWith('1', true, ChecklistType.Personal);
  });

  it('enters edit mode when edit button is clicked', async () => {
    render(
      <ChecklistItem
        item={mockItem}
        checklistType={ChecklistType.Personal}
        {...mockHandlers}
      />
    );

    // Hover to show actions
    fireEvent.mouseEnter(screen.getByRole('listitem'));
    
    await waitFor(() => {
      expect(screen.getByLabelText('Edit "Test checklist item"')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Edit "Test checklist item"'));

    expect(screen.getByDisplayValue('Test checklist item')).toBeInTheDocument();
  });

  it('saves changes when Enter is pressed', async () => {
    render(
      <ChecklistItem
        item={mockItem}
        checklistType={ChecklistType.Personal}
        {...mockHandlers}
      />
    );

    // Enter edit mode
    fireEvent.mouseEnter(screen.getByRole('listitem'));
    await waitFor(() => {
      expect(screen.getByLabelText('Edit "Test checklist item"')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByLabelText('Edit "Test checklist item"'));

    // Edit text
    const textField = screen.getByDisplayValue('Test checklist item');
    fireEvent.change(textField, { target: { value: 'Updated text' } });
    fireEvent.keyDown(textField, { key: 'Enter' });

    expect(mockHandlers.onEdit).toHaveBeenCalledWith(
      { ...mockItem, text: 'Updated text' },
      ChecklistType.Personal
    );
  });

  it('shows required indicator for required items', () => {
    const requiredItem = { ...mockItem, required: true };
    
    render(
      <ChecklistItem
        item={requiredItem}
        checklistType={ChecklistType.Personal}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('*')).toHaveAttribute('aria-label', 'Required item');
  });

  it('shows state badge for items with state', () => {
    const itemWithState = { ...mockItem, state: ChecklistItemState.InProgress };
    
    render(
      <ChecklistItem
        item={itemWithState}
        checklistType={ChecklistType.Personal}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('applies completed styling for completed items', () => {
    const completedItem = { ...mockItem, completed: true };
    
    render(
      <ChecklistItem
        item={completedItem}
        checklistType={ChecklistType.Personal}
        {...mockHandlers}
      />
    );

    const itemElement = screen.getByRole('listitem');
    expect(itemElement).toHaveClass('is-completed');
  });
});
```

## Benefits of Modernization

### **1. Performance Improvements**
- **Reduced Re-renders**: React hooks optimize component updates
- **Better Memoization**: useCallback and useMemo prevent unnecessary re-renders
- **Smaller Bundle**: Modern dependencies reduce bundle size

### **2. Developer Experience**
- **Cleaner Code**: Functional components are more readable
- **Better Testing**: Hooks are easier to test in isolation
- **Type Safety**: Improved TypeScript integration

### **3. User Experience**
- **Better Accessibility**: Fluent UI v8 provides improved a11y
- **Smoother Interactions**: Optimized animations and transitions
- **Responsive Design**: Better mobile and tablet support

### **4. Maintainability**
- **Separation of Concerns**: Custom hooks separate business logic
- **Reusability**: Components are more modular and reusable
- **Future-Proof**: Modern React patterns ensure longevity

## Migration Strategy

### **Step-by-Step Migration**
1. **Create new component structure** alongside existing components
2. **Implement custom hooks** for business logic
3. **Update types and interfaces** for better type safety
4. **Migrate styling** to modern SCSS patterns
5. **Add comprehensive tests** for new components
6. **Gradually replace** old components with new ones
7. **Remove legacy code** after successful migration

### **Backward Compatibility**
- Maintain existing props interface during transition
- Use feature flags for gradual rollout
- Provide migration utilities for existing data

This modernization example demonstrates the transformation from a class-based component to a modern, functional component with improved performance, maintainability, and user experience. 