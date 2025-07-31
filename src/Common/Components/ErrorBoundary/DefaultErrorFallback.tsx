import React from 'react';
import { MessageBar, MessageBarType, PrimaryButton, Stack, Text, DetailsList, IColumn } from '@fluentui/react';
import { ErrorFallbackProps } from './ErrorBoundary.types';
import './ErrorBoundary.scss';

export const DefaultErrorFallback: React.FC<ErrorFallbackProps & { showErrorDetails?: boolean }> = ({
  error,
  errorInfo,
  resetError,
  errorMessage = 'An error occurred while rendering this component.',
  errorTitle = 'Something went wrong',
  showErrorDetails = process.env.NODE_ENV === 'development'
}) => {
  const handleRetry = () => {
    resetError();
  };

  const errorDetails = [
    { key: 'name', name: 'Error Name', value: error.name },
    { key: 'message', name: 'Error Message', value: error.message },
    { key: 'stack', name: 'Error Stack', value: error.stack },
    ...(errorInfo ? [{ key: 'componentStack', name: 'Component Stack', value: errorInfo.componentStack }] : [])
  ];

  const columns: IColumn[] = [
    {
      key: 'name',
      name: 'Property',
      fieldName: 'name',
      minWidth: 100,
      maxWidth: 150,
      isResizable: true
    },
    {
      key: 'value',
      name: 'Value',
      fieldName: 'value',
      minWidth: 200,
      isResizable: true,
      onRender: (item: any) => (
        <Text variant="small" className="error-detail-value">
          {item.value}
        </Text>
      )
    }
  ];

  return (
    <div className="error-boundary-fallback">
      <MessageBar
        messageBarType={MessageBarType.error}
        isMultiline={true}
        className="error-message-bar"
      >
        <Stack gap={16}>
          <Stack gap={8}>
            <Text variant="large" className="error-title">
              {errorTitle}
            </Text>
            <Text variant="medium" className="error-message">
              {errorMessage}
            </Text>
          </Stack>

          <Stack horizontal gap={8}>
            <PrimaryButton
              text="Try Again"
              onClick={handleRetry}
              className="retry-button"
            />
            <PrimaryButton
              text="Report Issue"
              onClick={() => {
                const issueBody = `Error: ${error.message}\n\nStack: ${error.stack}\n\nComponent Stack: ${errorInfo?.componentStack}`;
                const issueUrl = `https://github.com/your-repo/issues/new?title=Error: ${encodeURIComponent(error.message)}&body=${encodeURIComponent(issueBody)}`;
                window.open(issueUrl, '_blank');
              }}
              className="report-button"
            />
          </Stack>

          {showErrorDetails && (
            <div className="error-details">
              <Text variant="medium" className="details-title">
                Error Details
              </Text>
              <DetailsList
                items={errorDetails}
                columns={columns}
                layoutMode={1}
                isHeaderVisible={false}
                className="error-details-list"
              />
            </div>
          )}
        </Stack>
      </MessageBar>
    </div>
  );
}; 