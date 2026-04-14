import { useState, useCallback } from 'react';
import type { Annotation } from '@/types/diagnostic';

interface Props {
  annotations: Annotation[];
  currentPageId: string;
  onAdd: (annotation: Omit<Annotation, 'id' | 'sessionId'>) => void;
  onRemove: (index: number) => void;
}

export function AnnotationEditor({ annotations, currentPageId, onAdd, onRemove }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [text, setText] = useState('');

  // Filter annotations for current page
  const pageAnnotations = annotations.filter((a) => a.pageId === currentPageId);

  const handleAdd = useCallback(() => {
    if (!text.trim()) return;

    onAdd({
      svgX: 0, // Would be set by click position on diagram
      svgY: 0,
      pageId: currentPageId,
      text: text.trim(),
      createdAt: Date.now(),
    });

    setText('');
    setIsAdding(false);
  }, [text, currentPageId, onAdd]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleAdd();
      }
      if (e.key === 'Escape') {
        setIsAdding(false);
        setText('');
      }
    },
    [handleAdd]
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontSize: 9,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          Notes ({pageAnnotations.length})
        </span>
        <button
          onClick={() => setIsAdding(true)}
          style={{
            padding: '4px 8px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-muted)',
            fontSize: 9,
            cursor: 'pointer',
          }}
          aria-label="Add annotation"
        >
          + Add
        </button>
      </div>

      {/* Add form */}
      {isAdding && (
        <div
          style={{
            padding: 8,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a note..."
            autoFocus
            style={{
              width: '100%',
              minHeight: 60,
              padding: 8,
              background: 'var(--bg-base)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              resize: 'vertical',
              outline: 'none',
            }}
            aria-label="Annotation text"
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                setIsAdding(false);
                setText('');
              }}
              style={{
                padding: '4px 8px',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-muted)',
                fontSize: 9,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!text.trim()}
              style={{
                padding: '4px 8px',
                background: text.trim() ? 'var(--accent)' : 'var(--bg-base)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: text.trim() ? 'var(--bg-base)' : 'var(--text-muted)',
                fontSize: 9,
                fontWeight: 600,
                cursor: text.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Annotations list */}
      {pageAnnotations.length === 0 && !isAdding && (
        <div
          style={{
            padding: 16,
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: 9,
          }}
        >
          No notes for this page
        </div>
      )}

      {pageAnnotations.map((annotation, index) => (
        <div
          key={annotation.id || index}
          style={{
            padding: 8,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            gap: 8,
          }}
        >
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: 10,
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
              }}
            >
              {annotation.text}
            </p>
            <span
              style={{
                fontSize: 8,
                color: 'var(--text-ghost)',
                marginTop: 4,
                display: 'block',
              }}
            >
              {new Date(annotation.createdAt).toLocaleString()}
            </span>
          </div>
          <button
            onClick={() => onRemove(annotations.indexOf(annotation))}
            style={{
              padding: 4,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-ghost)',
              fontSize: 12,
              cursor: 'pointer',
              alignSelf: 'flex-start',
            }}
            aria-label="Delete annotation"
          >
            \u2715
          </button>
        </div>
      ))}
    </div>
  );
}
