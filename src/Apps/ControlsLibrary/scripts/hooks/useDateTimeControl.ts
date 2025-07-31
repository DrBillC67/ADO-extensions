import { useState, useCallback, useEffect } from 'react';
import { UseDateTimeControlReturn } from '../types/ControlsLibrary.types';

export const useDateTimeControl = (
  value: Date | null | undefined,
  onChange?: (date: Date | null) => void
): UseDateTimeControlReturn => {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState<Date | null>(value || null);

  // Update internal value when prop changes
  useEffect(() => {
    setInternalValue(value || null);
  }, [value]);

  // Set value
  const setValue = useCallback((date: Date | null) => {
    setInternalValue(date);
    onChange?.(date);
  }, [onChange]);

  // Set expanded state
  const setExpandedState = useCallback((expanded: boolean) => {
    setExpanded(expanded);
  }, []);

  // Set hovered state
  const setHoveredState = useCallback((hovered: boolean) => {
    setHovered(hovered);
  }, []);

  // Set focused state
  const setFocusedState = useCallback((focused: boolean) => {
    setFocused(focused);
  }, []);

  // Handle date selection
  const handleDateSelect = useCallback((date: Date) => {
    setValue(date);
    setExpanded(false);
  }, [setValue]);

  // Handle clear
  const handleClear = useCallback(() => {
    setValue(null);
  }, [setValue]);

  // Handle toggle
  const handleToggle = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  // Handle focus
  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);

  // Handle blur
  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);

  // Handle mouse enter
  const handleMouseEnter = useCallback(() => {
    setHovered(true);
  }, []);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  return {
    value: internalValue,
    expanded,
    hovered,
    focused,
    setValue,
    setExpanded: setExpandedState,
    setHovered: setHoveredState,
    setFocused: setFocusedState,
    handleDateSelect,
    handleClear,
    handleToggle,
    handleFocus,
    handleBlur,
    handleMouseEnter,
    handleMouseLeave
  };
}; 