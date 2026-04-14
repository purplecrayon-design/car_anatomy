import { useEffect, useState } from 'react';
import { useOffline } from '@/hooks/useOffline';

interface Props {
  showWhenOnline?: boolean;
}

export function OfflineBanner({ showWhenOnline = false }: Props) {
  const isOffline = useOffline();
  const [wasOffline, setWasOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  // Track offline state to show reconnected message
  useEffect(() => {
    if (isOffline) {
      setWasOffline(true);
    } else if (wasOffline) {
      setShowReconnected(true);
      const timeout = setTimeout(() => {
        setShowReconnected(false);
        setWasOffline(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isOffline, wasOffline]);

  // Don't render if online and not showing reconnected message
  if (!isOffline && !showReconnected && !showWhenOnline) {
    return null;
  }

  const isReconnected = !isOffline && showReconnected;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '8px 16px',
        background: isReconnected
          ? 'var(--success)'
          : isOffline
            ? 'var(--warning)'
            : 'var(--accent)',
        color: 'var(--bg-base)',
        fontSize: 11,
        fontWeight: 500,
        textAlign: 'center',
        animation: 'slideDown 0.3s ease-out',
      }}
    >
      {/* Status icon */}
      <span style={{ fontSize: 14 }}>
        {isReconnected ? '\u2713' : isOffline ? '\u26A0' : '\u2601'}
      </span>

      {/* Status message */}
      <span>
        {isReconnected
          ? 'Back online! Changes will be saved.'
          : isOffline
            ? 'You are offline. Changes will be saved locally.'
            : 'Online'}
      </span>

      {/* PWA indicator when offline */}
      {isOffline && (
        <span
          style={{
            padding: '2px 6px',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: 4,
            fontSize: 9,
          }}
        >
          PWA Mode
        </span>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
