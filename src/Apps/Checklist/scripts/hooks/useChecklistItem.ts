import { useState, useCallback, useMemo } from 'react';
import { IChecklistItem, ChecklistType, ChecklistItemStates } from '../Interfaces';
import { ChecklistItemHookResult } from '../types/ChecklistItem.types';

export const useChecklistItem = (
  item: IChecklistItem,
  checklistType: ChecklistType,
  onToggle: (itemId: string, checked: boolean, type: ChecklistType) => void,
  onRemove: (itemId: string, type: ChecklistType) => void,
  onEdit: (item: IChecklistItem, type: ChecklistType) => void
): ChecklistItemHookResult => {
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
      setHovered: setIsHovered,
      setEditText
    }
  };
}; 