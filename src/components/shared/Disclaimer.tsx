import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  isOpen: boolean;
  onAccept: () => void;
  onDecline?: () => void;
}

export function Disclaimer({ isOpen, onAccept, onDecline }: Props) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Track scroll position to enable accept button
  const handleScroll = useCallback(() => {
    if (!contentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setHasScrolledToBottom(true);
    }
  }, []);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onDecline) {
        onDecline();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onDecline]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
    >
      <div
        style={{
          width: '90%',
          maxWidth: 500,
          maxHeight: '80vh',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-elevated)',
          }}
        >
          <h1
            id="disclaimer-title"
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ color: 'var(--warning)' }}>&#9888;</span>
            Important Safety Information
          </h1>
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          onScroll={handleScroll}
          style={{
            flex: 1,
            padding: 20,
            overflowY: 'auto',
            fontSize: 11,
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}
        >
          <h2 style={{ fontSize: 12, color: 'var(--text-primary)', marginBottom: 8 }}>
            Educational Tool Disclaimer
          </h2>
          <p style={{ marginBottom: 16 }}>
            LexWire is an educational tool designed to help users understand automotive
            electrical systems. This application is intended for learning purposes only.
          </p>

          <h2 style={{ fontSize: 12, color: 'var(--text-primary)', marginBottom: 8 }}>
            Safety Warnings
          </h2>
          <ul style={{ marginBottom: 16, paddingLeft: 20 }}>
            <li style={{ marginBottom: 8 }}>
              <strong>Disconnect the battery</strong> before performing any electrical work
              on your vehicle.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Do not work alone</strong> when diagnosing or repairing electrical
              systems.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Use proper safety equipment</strong> including safety glasses and
              insulated tools.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Consult official service manuals</strong> for your specific vehicle
              before performing any repairs.
            </li>
          </ul>

          <h2 style={{ fontSize: 12, color: 'var(--text-primary)', marginBottom: 8 }}>
            Limitations
          </h2>
          <p style={{ marginBottom: 16 }}>
            While we strive for accuracy, this application may contain errors or
            inaccuracies. Wiring configurations may vary between model years, production
            dates, and optional equipment packages. Always verify information against
            official Toyota/Lexus service documentation.
          </p>

          <h2 style={{ fontSize: 12, color: 'var(--text-primary)', marginBottom: 8 }}>
            Liability
          </h2>
          <p style={{ marginBottom: 16 }}>
            The creators and contributors of this application assume no responsibility
            for any damage, injury, or loss resulting from the use of this tool. By using
            LexWire, you acknowledge that automotive electrical work carries inherent
            risks and agree to proceed at your own risk.
          </p>

          <div
            style={{
              padding: 12,
              background: 'rgba(255, 167, 38, 0.1)',
              border: '1px solid var(--warning)',
              borderRadius: 'var(--radius-sm)',
              marginTop: 16,
            }}
          >
            <p style={{ margin: 0, color: 'var(--warning)', fontWeight: 500 }}>
              If you are not comfortable working with automotive electrical systems,
              please consult a qualified automotive technician.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          {!hasScrolledToBottom && (
            <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>
              Scroll to read the full disclaimer
            </span>
          )}
          {hasScrolledToBottom && <span />}

          <div style={{ display: 'flex', gap: 8 }}>
            {onDecline && (
              <button
                onClick={onDecline}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-secondary)',
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                Decline
              </button>
            )}
            <button
              onClick={onAccept}
              disabled={!hasScrolledToBottom}
              style={{
                padding: '8px 16px',
                background: hasScrolledToBottom ? 'var(--accent)' : 'var(--bg-elevated)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: hasScrolledToBottom ? 'var(--bg-base)' : 'var(--text-ghost)',
                fontSize: 11,
                fontWeight: 600,
                cursor: hasScrolledToBottom ? 'pointer' : 'not-allowed',
              }}
              aria-disabled={!hasScrolledToBottom}
            >
              I Understand and Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
