import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  // Fix: Replaced state class property with a constructor to explicitly call super(props).
  // This resolves the error "Property 'props' does not exist on type 'ErrorBoundary'" by
  // ensuring the component's props are correctly initialized.
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card rounded-lg p-8 text-center max-w-md">
                <h1 className="text-2xl font-bold text-red-400 mb-2">Something went wrong.</h1>
                <p className="text-theme-text-muted mb-6">
                    We've encountered an unexpected error. Please try refreshing the page.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="formal-button"
                >
                    Refresh Page
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;