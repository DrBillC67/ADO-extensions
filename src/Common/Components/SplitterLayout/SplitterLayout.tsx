import * as React from 'react';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Stack, Text, IconButton, TooltipHost, DirectionalHint } from '@fluentui/react';
import { ResizeRegular, ChevronLeftRegular, ChevronRightRegular } from '@fluentui/react-icons';
import { SplitterLayoutProps, PaneProps } from './SplitterLayout.types';
import { Pane } from './Pane';
import './SplitterLayout.scss';

export const SplitterLayout: React.FC<SplitterLayoutProps> = ({
  orientation = 'horizontal',
  defaultSizes = [50, 50],
  minSizes = [20, 20],
  maxSizes = [80, 80],
  children,
  className,
  onResize,
  showResizeHandles = true,
  showCollapseButtons = false,
  ...props
}) => {
  const [sizes, setSizes] = useState<number[]>(defaultSizes);
  const [collapsedPanes, setCollapsedPanes] = useState<boolean[]>(new Array(children.length).fill(false));
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPosition, setDragStartPosition] = useState(0);
  const [dragStartSizes, setDragStartSizes] = useState<number[]>([]);
  const [activeSplitterIndex, setActiveSplitterIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const splitterRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Normalize sizes to ensure they sum to 100
  const normalizedSizes = useMemo(() => {
    const total = sizes.reduce((sum, size) => sum + size, 0);
    return sizes.map(size => (size / total) * 100);
  }, [sizes]);

  // Handle mouse down on splitter
  const handleSplitterMouseDown = useCallback((index: number, event: React.MouseEvent) => {
    event.preventDefault();
    setIsDragging(true);
    setActiveSplitterIndex(index);
    setDragStartPosition(orientation === 'horizontal' ? event.clientX : event.clientY);
    setDragStartSizes([...sizes]);
  }, [orientation, sizes]);

  // Handle mouse move
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging || activeSplitterIndex === null || !containerRef.current) {
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const currentPosition = orientation === 'horizontal' ? event.clientX : event.clientY;
    const containerSize = orientation === 'horizontal' ? containerRect.width : containerRect.height;
    const startPosition = orientation === 'horizontal' ? dragStartPosition - containerRect.left : dragStartPosition - containerRect.top;
    const currentPositionRelative = orientation === 'horizontal' ? event.clientX - containerRect.left : event.clientY - containerRect.top;

    const delta = currentPositionRelative - startPosition;
    const deltaPercent = (delta / containerSize) * 100;

    const newSizes = [...dragStartSizes];
    const leftPaneIndex = activeSplitterIndex;
    const rightPaneIndex = activeSplitterIndex + 1;

    // Calculate new sizes
    const leftPaneNewSize = Math.max(minSizes[leftPaneIndex], Math.min(maxSizes[leftPaneIndex], newSizes[leftPaneIndex] + deltaPercent));
    const rightPaneNewSize = Math.max(minSizes[rightPaneIndex], Math.min(maxSizes[rightPaneIndex], newSizes[rightPaneIndex] - deltaPercent));

    // Adjust if hitting min/max constraints
    const totalSize = leftPaneNewSize + rightPaneNewSize;
    if (totalSize !== 100) {
      const adjustment = (100 - totalSize) / 2;
      newSizes[leftPaneIndex] = leftPaneNewSize + adjustment;
      newSizes[rightPaneIndex] = rightPaneNewSize + adjustment;
    } else {
      newSizes[leftPaneIndex] = leftPaneNewSize;
      newSizes[rightPaneIndex] = rightPaneNewSize;
    }

    setSizes(newSizes);
    onResize?.(newSizes, activeSplitterIndex);
  }, [isDragging, activeSplitterIndex, dragStartPosition, dragStartSizes, minSizes, maxSizes, orientation, onResize]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setActiveSplitterIndex(null);
  }, []);

  // Handle pane collapse
  const handlePaneCollapse = useCallback((index: number) => {
    const newCollapsedPanes = [...collapsedPanes];
    newCollapsedPanes[index] = !newCollapsedPanes[index];
    setCollapsedPanes(newCollapsedPanes);
  }, [collapsedPanes]);

  // Handle pane expand
  const handlePaneExpand = useCallback((index: number) => {
    const newCollapsedPanes = [...collapsedPanes];
    newCollapsedPanes[index] = false;
    setCollapsedPanes(newCollapsedPanes);
  }, [collapsedPanes]);

  // Add/remove event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = orientation === 'horizontal' ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, orientation]);

  // Render splitter handle
  const renderSplitter = useCallback((index: number) => {
    if (!showResizeHandles) {
      return null;
    }

    const isCollapsed = collapsedPanes[index] || collapsedPanes[index + 1];
    const canResize = !isCollapsed && sizes[index] > minSizes[index] && sizes[index + 1] > minSizes[index + 1];

    return (
      <div
        ref={el => splitterRefs.current[index] = el}
        className={`splitter-handle ${orientation} ${isDragging && activeSplitterIndex === index ? 'dragging' : ''} ${!canResize ? 'disabled' : ''}`}
        onMouseDown={canResize ? (e) => handleSplitterMouseDown(index, e) : undefined}
        role="separator"
        aria-orientation={orientation}
        aria-label={`Resize pane ${index + 1}`}
      >
        <div className="splitter-grip">
          <ResizeRegular className="resize-icon" />
        </div>
        
        {showCollapseButtons && (
          <div className="collapse-buttons">
            {collapsedPanes[index] && (
              <TooltipHost content="Expand left pane" directionalHint={DirectionalHint.bottomCenter}>
                <IconButton
                  icon={<ChevronRightRegular />}
                  onClick={() => handlePaneExpand(index)}
                  className="expand-button"
                  ariaLabel="Expand left pane"
                />
              </TooltipHost>
            )}
            {collapsedPanes[index + 1] && (
              <TooltipHost content="Expand right pane" directionalHint={DirectionalHint.bottomCenter}>
                <IconButton
                  icon={<ChevronLeftRegular />}
                  onClick={() => handlePaneExpand(index + 1)}
                  className="expand-button"
                  ariaLabel="Expand right pane"
                />
              </TooltipHost>
            )}
          </div>
        )}
      </div>
    );
  }, [showResizeHandles, orientation, isDragging, activeSplitterIndex, collapsedPanes, sizes, minSizes, showCollapseButtons, handleSplitterMouseDown, handlePaneExpand]);

  // Render panes
  const renderPanes = useCallback(() => {
    return React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) {
        return null;
      }

      const isCollapsed = collapsedPanes[index];
      const size = isCollapsed ? 0 : normalizedSizes[index];

      return (
        <Pane
          key={index}
          size={size}
          orientation={orientation}
          collapsed={isCollapsed}
          onCollapse={showCollapseButtons ? () => handlePaneCollapse(index) : undefined}
          showCollapseButton={showCollapseButtons}
        >
          {child}
        </Pane>
      );
    });
  }, [children, normalizedSizes, orientation, collapsedPanes, showCollapseButtons, handlePaneCollapse]);

  return (
    <div
      ref={containerRef}
      className={`splitter-layout ${orientation} ${className || ''} ${isDragging ? 'dragging' : ''}`}
      {...props}
    >
      <div className="splitter-container">
        {renderPanes()}
        {React.Children.count(children) > 1 && 
          Array.from({ length: React.Children.count(children) - 1 }, (_, index) => renderSplitter(index))
        }
      </div>
    </div>
  );
};
