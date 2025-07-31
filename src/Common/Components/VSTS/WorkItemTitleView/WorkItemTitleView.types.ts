import { WorkItem } from 'TFS/WorkItemTracking/Contracts';

export interface WorkItemTitleViewProps {
  /** The work item to display */
  workItem: WorkItem;
  /** Whether to show the work item ID */
  showId?: boolean;
  /** Click handler for the work item link */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  /** Additional CSS class name */
  className?: string;
  /** Additional props to pass to the container div */
  [key: string]: any;
} 