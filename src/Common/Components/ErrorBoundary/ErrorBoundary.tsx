import React, { Component, ErrorInfo, ReactNode } from 'react';
import { MessageBar, MessageBarType, PrimaryButton, Stack, Text } from '@fluentui/react';
import { ErrorBoundaryProps, ErrorFallbackProps } from './ErrorBoundary.types';
import { DefaultErrorFallback } from './DefaultErrorFallback';

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo);
  }

  private resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, render it
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          const FallbackComponent = this.props.fallback;
          return (
            <FallbackComponent
              error={this.state.error!}
              errorInfo={this.state.errorInfo}
              resetError={this.resetError}
              errorMessage={this.props.errorMessage}
              errorTitle={this.props.errorTitle}
            />
          );
        }
        return this.props.fallback;
      }

      // Default error UI
      return (
        <DefaultErrorFallback
          error={this.state.error!}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
          errorMessage={this.props.errorMessage}
          errorTitle={this.props.errorTitle}
          showErrorDetails={this.props.showErrorDetails}
        />
      );
    }

    return this.props.children;
  }
} 