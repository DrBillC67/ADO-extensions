import { SpinnerSize } from '@fluentui/react';

export interface LoadingProps {
  /** Size of the spinner */
  size?: SpinnerSize;
  /** Label text to display with the spinner */
  label?: string;
  /** Whether to show as an overlay */
  overlay?: boolean;
  /** Additional CSS class name */
  className?: string;
  /** Additional props to pass to the container div */
  [key: string]: any;
} 