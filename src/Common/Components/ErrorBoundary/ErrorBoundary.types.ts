import React, { ReactNode } from 'react';

export interface ErrorBoundaryProps {
  /** Child components to render */
  children: ReactNode;
  /** Custom fallback component to render when an error occurs */
  fallback?: ReactNode | React.ComponentType<ErrorFallbackProps>;
  /** Callback function called when an error is caught */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Whether to show error details in development mode */
  showErrorDetails?: boolean;
  /** Custom error message */
  errorMessage?: string;
  /** Custom error title */
  errorTitle?: string;
}

export interface ErrorFallbackProps {
  /** The error that occurred */
  error: Error;
  /** Error information including component stack */
  errorInfo?: React.ErrorInfo;
  /** Function to reset the error boundary */
  resetError: () => void;
  /** Custom error message */
  errorMessage?: string;
  /** Custom error title */
  errorTitle?: string;
} 