import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-status-fail/10 flex items-center justify-center mb-4">
            <AlertTriangle size={28} className="text-status-fail" />
          </div>
          <h2 className="text-lg font-semibold text-content-primary mb-1">Something went wrong</h2>
          <p className="text-sm text-content-secondary max-w-md mb-4">
            An unexpected error occurred. You can try refreshing the page or contact support.
          </p>
          {this.state.error && (
            <pre className="text-xs text-content-muted bg-surface-inset rounded-lg p-3 mb-4 max-w-lg overflow-auto">
              {this.state.error.message}
            </pre>
          )}
          <button onClick={this.handleRetry} className="btn-primary flex items-center gap-2">
            <RefreshCw size={14} /> Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
