import type { TourStep as TourStepType } from '@/types/tour';

interface Props {
  step: TourStepType;
  stepNumber: number;
  totalSteps: number;
  onPrev?: () => void;
  onNext?: () => void;
  onClose?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'var(--success)',
  intermediate: 'var(--warning)',
  advanced: 'var(--danger)',
};

export function TourStep({
  step,
  stepNumber,
  totalSteps,
  onPrev,
  onNext,
  onClose,
  isFirst = false,
  isLast = false,
}: Props) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && !isFirst) {
      onPrev?.();
    } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
      onNext?.();
    } else if (e.key === 'Escape') {
      onClose?.();
    }
  };

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
        maxWidth: 480,
      }}
      role="dialog"
      aria-modal="false"
      aria-label={`Tour step ${stepNumber} of ${totalSteps}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-elevated)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              padding: '2px 6px',
              background: DIFFICULTY_COLORS[step.difficulty] || 'var(--accent)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 8,
              fontWeight: 600,
              color: 'var(--bg-base)',
              textTransform: 'uppercase',
            }}
          >
            {step.difficulty}
          </span>
          <h2
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            {step.title}
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: 16,
              cursor: 'pointer',
              padding: 4,
            }}
            aria-label="Close tour step"
          >
            &#10005;
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 14 }}>
        <p
          style={{
            fontSize: 11,
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {step.text}
        </p>
      </div>

      {/* Footer with navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-base)',
        }}
      >
        {/* Progress indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 'var(--radius-full)',
                  background: i === stepNumber - 1 ? 'var(--accent)' : 'var(--border)',
                  transition: 'background var(--transition-fast)',
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>
            {stepNumber} / {totalSteps}
          </span>
        </div>

        {/* Navigation buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          {onPrev && (
            <button
              onClick={onPrev}
              disabled={isFirst}
              style={{
                padding: '6px 12px',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: isFirst ? 'var(--text-ghost)' : 'var(--text-secondary)',
                fontSize: 10,
                cursor: isFirst ? 'not-allowed' : 'pointer',
              }}
              aria-label="Previous step"
            >
              &#8592; Back
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              style={{
                padding: '6px 12px',
                background: 'var(--accent)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--bg-base)',
                fontSize: 10,
                fontWeight: 600,
                cursor: 'pointer',
              }}
              aria-label={isLast ? 'Finish tour' : 'Next step'}
            >
              {isLast ? 'Finish' : 'Next &#8594;'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
