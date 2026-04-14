import { useState, useCallback, useId, type ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  count?: number;
  actions?: ReactNode;
}

export function Section({ title, children, defaultOpen = true, count, actions }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
      }
    },
    [handleToggle]
  );

  return (
    <section style={{ marginBottom: 8 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 8px',
          background: 'var(--bg-surface)',
          borderRadius: isOpen ? 'var(--radius-sm) var(--radius-sm) 0 0' : 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          borderBottom: isOpen ? '1px solid var(--border)' : '1px solid var(--border-subtle)',
        }}
      >
        <button
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: 9,
            cursor: 'pointer',
            padding: 0,
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontWeight: 500,
          }}
          aria-expanded={isOpen}
          aria-controls={contentId}
        >
          {/* Chevron */}
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              color: 'var(--text-muted)',
              fontSize: 10,
              lineHeight: 1,
              transition: 'transform var(--transition-fast)',
              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
            aria-hidden="true"
          >
            &#8250;
          </span>

          <span>{title}</span>

          {/* Count badge */}
          {count !== undefined && (
            <span
              style={{
                padding: '1px 5px',
                background: 'var(--bg-base)',
                borderRadius: 'var(--radius-full)',
                fontSize: 8,
                color: 'var(--text-muted)',
              }}
            >
              {count}
            </span>
          )}
        </button>

        {/* Actions */}
        {actions && (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            onClick={(e) => e.stopPropagation()}
          >
            {actions}
          </div>
        )}
      </div>

      {/* Content */}
      <div
        id={contentId}
        style={{
          display: isOpen ? 'block' : 'none',
          padding: 8,
          background: 'var(--bg-base)',
          border: '1px solid var(--border-subtle)',
          borderTop: 'none',
          borderRadius: '0 0 var(--radius-sm) var(--radius-sm)',
        }}
        role="region"
        aria-labelledby={`${contentId}-heading`}
      >
        {children}
      </div>
    </section>
  );
}
