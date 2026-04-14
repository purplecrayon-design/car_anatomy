import { useEffect, useMemo } from 'react';
import { useStore } from '@/store';
import type { TourStep } from '@/types/tour';
import type { DifficultyLevel } from '@/types/ui';

// Import tour data
import chargingTour from '@/data/vehicles/es300-1997/tours/charging.json';

const TOURS: Record<string, TourStep[]> = {
  charging: chargingTour as TourStep[],
};

export function GuidedTour() {
  const tourIndex = useStore((s) => s.tourIndex);
  const tourSystemId = useStore((s) => s.tourSystemId);
  const nextStep = useStore((s) => s.nextStep);
  const prevStep = useStore((s) => s.prevStep);
  const endTour = useStore((s) => s.endTour);
  const setSelectedNode = useStore((s) => s.setSelectedNode);
  const difficulty = useStore((s) => s.difficulty);

  // Get steps filtered by difficulty
  const steps = useMemo(() => {
    if (!tourSystemId) return [];
    const allSteps = TOURS[tourSystemId] || [];

    const difficultyLevels: Record<DifficultyLevel, DifficultyLevel[]> = {
      beginner: ['beginner'],
      intermediate: ['beginner', 'intermediate'],
      advanced: ['beginner', 'intermediate', 'advanced'],
    };

    const allowed = difficultyLevels[difficulty];
    return allSteps.filter((step) => allowed.includes(step.difficulty as DifficultyLevel));
  }, [tourSystemId, difficulty]);

  const currentStep = steps[tourIndex];
  const isFirstStep = tourIndex === 0;
  const isLastStep = tourIndex === steps.length - 1;

  // Highlight the current node when step changes
  useEffect(() => {
    if (currentStep) {
      setSelectedNode(currentStep.nodeId);
    }
  }, [currentStep, setSelectedNode]);

  // Not in a tour
  if (tourIndex < 0 || !tourSystemId || !currentStep) {
    return null;
  }

  const handlePrev = () => {
    if (!isFirstStep) {
      prevStep();
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      endTour();
    } else {
      nextStep();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
      handleNext();
    } else if (e.key === 'Escape') {
      endTour();
    }
  };

  const difficultyColors: Record<string, string> = {
    beginner: 'var(--success)',
    intermediate: 'var(--warning)',
    advanced: 'var(--danger)',
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: 480,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 1000,
        overflow: 'hidden',
      }}
      role="dialog"
      aria-modal="false"
      aria-label={`Tour step ${tourIndex + 1} of ${steps.length}`}
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
              background: difficultyColors[currentStep.difficulty],
              borderRadius: 'var(--radius-sm)',
              fontSize: 8,
              fontWeight: 600,
              color: 'var(--bg-base)',
              textTransform: 'uppercase',
            }}
          >
            {currentStep.difficulty}
          </span>
          <h2
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            {currentStep.title}
          </h2>
        </div>
        <button
          onClick={endTour}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: 16,
            cursor: 'pointer',
            padding: 4,
          }}
          aria-label="End tour"
        >
          \u2715
        </button>
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
          {currentStep.text}
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
            {steps.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 'var(--radius-full)',
                  background: i === tourIndex ? 'var(--accent)' : 'var(--border)',
                  transition: 'background 0.15s ease',
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>
            {tourIndex + 1} / {steps.length}
          </span>
        </div>

        {/* Navigation buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handlePrev}
            disabled={isFirstStep}
            style={{
              padding: '6px 12px',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: isFirstStep ? 'var(--text-ghost)' : 'var(--text-secondary)',
              fontSize: 10,
              cursor: isFirstStep ? 'not-allowed' : 'pointer',
            }}
            aria-label="Previous step"
          >
            \u2190 Back
          </button>
          <button
            onClick={handleNext}
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
            aria-label={isLastStep ? 'Finish tour' : 'Next step'}
          >
            {isLastStep ? 'Finish' : 'Next \u2192'}
          </button>
        </div>
      </div>
    </div>
  );
}
