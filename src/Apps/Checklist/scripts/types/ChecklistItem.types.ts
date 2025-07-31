import { IChecklistItem, ChecklistType } from '../Interfaces';

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

export interface ChecklistItemHandlers {
  toggle: (checked: boolean) => void;
  edit: () => void;
  save: () => void;
  cancel: () => void;
  remove: () => void;
  keyDown: (e: React.KeyboardEvent) => void;
  setHovered: (hovered: boolean) => void;
  setEditText: (text: string) => void;
}

export interface ChecklistItemHookResult {
  isEditing: boolean;
  editText: string;
  isHovered: boolean;
  itemState: any;
  handlers: ChecklistItemHandlers;
} 