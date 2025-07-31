import React from 'react';

export type SplitterOrientation = 'horizontal' | 'vertical';

export interface SplitterLayoutProps {
  /** Orientation of the splitter layout */
  orientation?: SplitterOrientation;
  /** Default sizes for each pane (percentage) */
  defaultSizes?: number[];
  /** Minimum sizes for each pane (percentage) */
  minSizes?: number[];
  /** Maximum sizes for each pane (percentage) */
  maxSizes?: number[];
  /** Child panes */
  children: React.ReactNode;
  /** Callback when panes are resized */
  onResize?: (sizes: number[], splitterIndex: number) => void;
  /** Whether to show resize handles */
  showResizeHandles?: boolean;
  /** Whether to show collapse buttons */
  showCollapseButtons?: boolean;
  /** Additional CSS class name */
  className?: string;
  /** Additional props to pass to the container div */
  [key: string]: any;
}

export interface PaneProps {
  /** Size of the pane (percentage) */
  size: number;
  /** Orientation of the layout */
  orientation: SplitterOrientation;
  /** Whether the pane is collapsed */
  collapsed?: boolean;
  /** Callback when pane is collapsed/expanded */
  onCollapse?: () => void;
  /** Whether to show collapse button */
  showCollapseButton?: boolean;
  /** Child content */
  children: React.ReactNode;
  /** Additional CSS class name */
  className?: string;
  /** Additional props to pass to the pane div */
  [key: string]: any;
}

export interface SplitterHandleProps {
  /** Index of the splitter */
  index: number;
  /** Orientation of the layout */
  orientation: SplitterOrientation;
  /** Whether the splitter is being dragged */
  isDragging?: boolean;
  /** Whether the splitter is disabled */
  disabled?: boolean;
  /** Callback when splitter is clicked */
  onClick?: (index: number) => void;
  /** Callback when splitter drag starts */
  onDragStart?: (index: number, event: React.MouseEvent) => void;
  /** Additional CSS class name */
  className?: string;
  /** Additional props to pass to the handle div */
  [key: string]: any;
}

export interface SplitterLayoutState {
  /** Current sizes of panes */
  sizes: number[];
  /** Whether any pane is collapsed */
  collapsedPanes: boolean[];
  /** Whether dragging is in progress */
  isDragging: boolean;
  /** Index of the active splitter */
  activeSplitterIndex: number | null;
  /** Drag start position */
  dragStartPosition: number;
  /** Drag start sizes */
  dragStartSizes: number[];
} 