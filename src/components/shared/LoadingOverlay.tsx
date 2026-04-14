interface Props {
  message?: string;
  isFullScreen?: boolean;
}

export function LoadingOverlay({ message = 'Loading...', isFullScreen = false }: Props) {
  const containerStyle: React.CSSProperties = isFullScreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'var(--bg-base)',
        zIndex: 9999,
      }
    : {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(7, 7, 11, 0.8)',
        zIndex: 100,
      };

  return (
    <div
      style={{
        ...containerStyle,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {/* Spinner */}
      <div
        style={{
          width: 32,
          height: 32,
          border: '2px solid var(--border)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginBottom: 12,
        }}
      />

      {/* Message */}
      <div
        style={{
          color: 'var(--text-secondary)',
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
        }}
      >
        {message}
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
