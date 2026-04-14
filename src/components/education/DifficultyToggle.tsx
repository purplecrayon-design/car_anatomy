import { useCallback } from 'react';
import type { DifficultyLevel } from '@/types/ui';

interface Props {
  value: DifficultyLevel;
  onChange: (level: DifficultyLevel) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

const LEVELS: { value: DifficultyLevel; label: string; color: string; description: string }[] = [
  {
    value: 'beginner',
    label: 'Beginner',
    color: 'var(--success)',
    description: 'Basic concepts and simple circuits',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    color: 'var(--warning)',
    description: 'Multi-component systems and diagnosis',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    color: 'var(--danger)',
    description: 'Complex troubleshooting and edge cases',
  },
];

export function DifficultyToggle({ value, onChange, disabled = false, size = 'md' }: Props) {
  const handleSelect = useCallback(
    (level: DifficultyLevel) => {
      if (!disabled) {
        onChange(level);
      }
    },
    [onChange, disabled]
  );

  const padding = size === 'sm' ? '4px 8px' : '6px 12px';
  const fontSize = size === 'sm' ? 8 : 10;
  const gap = size === 'sm' ? 4 : 6;

  return (
    <div
      style={{
        display: 'flex',
        gap,
        padding: 2,
        background: 'var(--bg-base)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        opacity: disabled ? 'var(--opacity-disabled)' : 1,
      }}
      role="radiogroup"
      aria-label="Difficulty level"
    >
      {LEVELS.map((level) => {
        const isActive = value === level.value;

        return (
          <button
            key={level.value}
            onClick={() => handleSelect(level.value)}
            disabled={disabled}
            style={{
              flex: 1,
              padding,
              background: isActive ? level.color : 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: isActive ? 'var(--bg-base)' : 'var(--text-muted)',
              fontSize,
              fontWeight: isActive ? 600 : 400,
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            role="radio"
            aria-checked={isActive}
            aria-label={level.label}
            title={level.description}
          >
            {level.label}
          </button>
        );
      })}
    </div>
  );
}
