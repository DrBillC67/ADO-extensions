import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, TooltipHost, DirectionalHint, TooltipDelay, TooltipOverflowMode } from '@fluentui/react';
import { WorkItem } from 'TFS/WorkItemTracking/Contracts';
import { WorkItemType } from 'TFS/WorkItemTracking/Contracts';
import { WorkItemTitleViewProps } from './WorkItemTitleView.types';
import { useWorkItemTypes } from '../../hooks/useWorkItemTypes';
import './WorkItemTitleView.scss';

export const WorkItemTitleView: React.FC<WorkItemTitleViewProps> = ({
  workItem,
  showId = true,
  onClick,
  className,
  ...props
}) => {
  const { types, loading } = useWorkItemTypes();
  const [workItemType, setWorkItemType] = useState<WorkItemType | null>(null);

  // Find the work item type based on the work item's type field
  useEffect(() => {
    if (types.length > 0 && workItem) {
      const typeName = workItem.fields['System.WorkItemType'];
      const foundType = types.find(t => t.name === typeName);
      setWorkItemType(foundType || null);
    }
  }, [types, workItem]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (onClick && !e.ctrlKey) {
      e.preventDefault();
      onClick(e);
    }
  }, [onClick]);

  const workItemUrl = useMemo(() => {
    if (!workItem) return '';
    const webContext = VSS.getWebContext();
    return `${webContext.collection.uri}/${webContext.project.name}/_workitems/edit/${workItem.id}`;
  }, [workItem]);

  const title = workItem?.fields['System.Title'] || 'Untitled';
  const workItemId = workItem?.id;

  if (loading) {
    return <div className="work-item-title-loading">Loading...</div>;
  }

  return (
    <div className={`work-item-title-view ${className || ''}`} {...props}>
      {workItemType?.icon?.url && (
        <img 
          src={workItemType.icon.url} 
          alt={workItemType.name}
          className="work-item-type-icon"
        />
      )}
      
      {showId && workItemId && (
        <span className="work-item-id">#{workItemId}</span>
      )}
      
      <div className="title-link">
        <TooltipHost 
          content={title} 
          delay={TooltipDelay.medium} 
          overflowMode={TooltipOverflowMode.Parent} 
          directionalHint={DirectionalHint.bottomLeftEdge}
        >
          <Link 
            href={workItemUrl} 
            onClick={handleClick}
            className="work-item-link"
          >
            {title}
          </Link>
        </TooltipHost>
      </div>
    </div>
  );
};
