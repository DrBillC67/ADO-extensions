import React, { Component, ErrorInfo, ReactNode } from 'react';
import { MessageBar, MessageBarType } from '@fluentui/react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <MessageBar
                    messageBarType={MessageBarType.error}
                    isMultiline={true}
                >
                    <div>
                        <h3>Something went wrong</h3>
                        <p>An error occurred while rendering this component.</p>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details style={{ whiteSpace: 'pre-wrap' }}>
                                <summary>Error Details</summary>
                                {this.state.error.toString()}
                                {this.state.errorInfo && (
                                    <div>
                                        <br />
                                        <strong>Component Stack:</strong>
                                        <br />
                                        {this.state.errorInfo.componentStack}
                                    </div>
                                )}
                            </details>
                        )}
                    </div>
                </MessageBar>
            );
        }

        return this.props.children;
    }
} 