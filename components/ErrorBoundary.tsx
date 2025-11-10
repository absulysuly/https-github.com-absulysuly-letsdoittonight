import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  // Fix: The class property initialization for state was causing a property access error on `this.props`. Reverting to a constructor to ensure props and state are correctly initialized.
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
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Something went wrong.</h1>
            <p>We've encountered an error. Please try refreshing the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
