import { useCallback, useState } from 'react';
import type { Annotation } from '@/types/diagnostic';

interface Props {
  annotation: Annotation;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function AnnotationMarker({ annotation, isSelected = false, onSelect, onDelete }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (annotation.id !== undefined) {
        onSelect?.(annotation.id);
      }
    },
    [annotation.id, onSelect]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (annotation.id !== undefined) {
        onDelete?.(annotation.id);
      }
    },
    [annotation.id, onDelete]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (annotation.id !== undefined) {
          onSelect?.(annotation.id);
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        if (annotation.id !== undefined) {
          onDelete?.(annotation.id);
        }
      }
    },
    [annotation.id, onSelect, onDelete]
  );

  const markerSize = 20;
  const truncatedText =
    annotation.text.length > 50 ? annotation.text.slice(0, 47) + '...' : annotation.text;

  return (
    <div
      style={{
        position: 'absolute',
        left: annotation.svgX,
        top: annotation.svgY,
        transform: 'translate(-50%, -100%)',
        zIndex: isSelected ? 100 : 10,
      }}
    >
      {/* Marker pin */}
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        tabIndex={0}
        role="button"
        aria-label={`Annotation: ${truncatedText}`}
        aria-expanded={isSelected || isHovered}
        style={{
          width: markerSize,
          height: markerSize,
          borderRadius: '50% 50% 50% 0',
          background: isSelected ? 'var(--accent)' : 'var(--warning)',
          border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--warning)'}`,
          boxShadow: 'var(--shadow-md)',
          cursor: 'pointer',
          transform: 'rotate(-45deg)',
          transformOrigin: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all var(--transition-fast)',
        }}
      >
        <span
          style={{
            transform: 'rotate(45deg)',
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--bg-base)',
          }}
        >
          !
        </span>
      </div>

      {/* Tooltip (shown on hover or when selected) */}
      {(isSelected || isHovered) && (
        <div
          style={{
            position: 'absolute',
            bottom: markerSize + 8,
            left: '50%',
            transform: 'translateX(-50%)',
            minWidth: 150,
            maxWidth: 250,
            padding: 8,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 101,
          }}
        >
          <p
            style={{
              fontSize: 10,
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.4,
              wordBreak: 'break-word',
            }}
          >
            {annotation.text}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 6,
              paddingTop: 6,
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <span style={{ fontSize: 8, color: 'var(--text-ghost)' }}>
              {new Date(annotation.createdAt).toLocaleDateString()}
            </span>

            {onDelete && (
              <button
                onClick={handleDelete}
                style={{
                  padding: '2px 6px',
                  background: 'transparent',
                  border: '1px solid var(--danger)',
                  borderRadius: 2,
                  color: 'var(--danger)',
                  fontSize: 8,
                  cursor: 'pointer',
                }}
                aria-label="Delete annotation"
              >
                Delete
              </button>
            )}
          </div>

          {/* Tooltip arrow */}
          <div
            style={{
              position: 'absolute',
              bottom: -6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid var(--border)',
            }}
          />
        </div>
      )}
    </div>
  );
}
