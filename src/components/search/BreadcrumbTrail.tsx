import { useCallback } from 'react';
import { useStore } from '@/store';
import { wireColorToHex } from '@/utils/wireColors';

interface Props {
  onNavigate?: (entry: { pageId?: string; systemId?: string }) => void;
}

export function BreadcrumbTrail({ onNavigate }: Props) {
  const breadcrumbs = useStore((s) => s.breadcrumbs);
  const popBreadcrumb = useStore((s) => s.popBreadcrumb);
  const clearBreadcrumbs = useStore((s) => s.clearBreadcrumbs);

  const handleClick = useCallback(
    (index: number) => {
      const entry = breadcrumbs[index];
      // Pop all breadcrumbs after this one
      const popsNeeded = breadcrumbs.length - index - 1;
      for (let i = 0; i < popsNeeded; i++) {
        popBreadcrumb();
      }
      onNavigate?.({ pageId: entry.pageId, systemId: entry.systemId });
    },
    [breadcrumbs, popBreadcrumb, onNavigate]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick(index);
      }
    },
    [handleClick]
  );

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb navigation"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 8px',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)',
        overflowX: 'auto',
        maxWidth: '100%',
      }}
    >
      {/* Home/Clear button */}
      <button
        onClick={clearBreadcrumbs}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          fontSize: 10,
          cursor: 'pointer',
          padding: '2px 4px',
          borderRadius: 2,
          flexShrink: 0,
        }}
        aria-label="Clear navigation and go home"
        title="Clear trail"
      >
        &#8962;
      </button>

      <ol
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {breadcrumbs.map((entry, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const wireColor = entry.wireColor ? wireColorToHex(entry.wireColor) : undefined;

          return (
            <li key={index} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Separator */}
              {index > 0 && (
                <span
                  style={{
                    color: 'var(--text-ghost)',
                    fontSize: 8,
                    userSelect: 'none',
                  }}
                  aria-hidden="true"
                >
                  &#8250;
                </span>
              )}

              {/* Breadcrumb item */}
              <button
                onClick={() => handleClick(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                disabled={isLast}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  background: isLast ? 'var(--bg-elevated)' : 'transparent',
                  border: 'none',
                  color: isLast ? 'var(--text-secondary)' : 'var(--text-muted)',
                  fontSize: 9,
                  cursor: isLast ? 'default' : 'pointer',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-sm)',
                  whiteSpace: 'nowrap',
                  transition: 'color var(--transition-fast)',
                }}
                aria-current={isLast ? 'page' : undefined}
              >
                {/* Wire color indicator */}
                {wireColor && (
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: wireColor,
                      flexShrink: 0,
                    }}
                  />
                )}

                {/* System indicator */}
                {entry.systemId && !wireColor && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 2,
                      background: `var(--system-${entry.systemId}, var(--accent))`,
                      flexShrink: 0,
                    }}
                  />
                )}

                <span>{entry.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
