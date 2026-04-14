import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: 'var(--bg-base)',
            color: 'var(--text-primary)',
            padding: 24,
            textAlign: 'center',
          }}
          role="alert"
          aria-live="assertive"
        >
          <div
            style={{
              fontSize: 48,
              marginBottom: 16,
              color: 'var(--danger)',
            }}
          >
            !
          </div>
          <h1
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 8,
              color: 'var(--text-primary)',
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: 12,
              color: 'var(--text-secondary)',
              marginBottom: 24,
              maxWidth: 400,
            }}
          >
            The application encountered an unexpected error. Your diagnostic session data has been
            preserved in local storage.
          </p>

          {this.state.error && (
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: 12,
                marginBottom: 24,
                maxWidth: 500,
                overflow: 'auto',
                textAlign: 'left',
              }}
            >
              <code
                style={{
                  fontSize: 10,
                  color: 'var(--danger)',
                  fontFamily: 'var(--font-mono)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {this.state.error.message}
              </code>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={this.handleRetry}
              style={{
                padding: '8px 16px',
                background: 'var(--accent)',
                color: '#000',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '8px 16px',
                background: 'var(--bg-elevated)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
