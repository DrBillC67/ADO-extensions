import React from 'react';

export interface IFocussable {
  focus(): void;
}

export interface BaseComponentProps {
  /** Additional CSS class name */
  className?: string;
  /** Child components */
  children?: React.ReactNode;
  /** Additional props to pass to the component */
  [key: string]: any;
}

export interface LoadingComponentProps extends BaseComponentProps {
  /** Size of the loading indicator */
  size?: 'small' | 'medium' | 'large';
  /** Label text to display */
  label?: string;
  /** Whether to show as an overlay */
  overlay?: boolean;
}

export interface ErrorComponentProps extends BaseComponentProps {
  /** Error message to display */
  error?: string;
  /** Error title */
  title?: string;
  /** Whether to show error details */
  showDetails?: boolean;
  /** Callback when retry is clicked */
  onRetry?: () => void;
  /** Callback when report is clicked */
  onReport?: () => void;
}

export interface VSTSComponentProps extends BaseComponentProps {
  /** Project context */
  projectId?: string;
  /** Team context */
  teamId?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string | null;
}
