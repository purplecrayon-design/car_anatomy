import { useCallback } from 'react';

export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay';

interface Props {
  value: BlendMode;
  onChange: (mode: BlendMode) => void;
  disabled?: boolean;
}

const MODES: { value: BlendMode; label: string; description: string }[] = [
  { value: 'normal', label: 'Normal', description: 'Standard layer display' },
  { value: 'multiply', label: 'Multiply', description: 'Darken overlapping areas' },
  { value: 'screen', label: 'Screen', description: 'Lighten overlapping areas' },
  { value: 'overlay', label: 'Overlay', description: 'Increase contrast' },
];

export function LayerModeSelector({ value, onChange, disabled = false }: Props) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value as BlendMode);
    },
    [onChange]
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        opacity: disabled ? 'var(--opacity-disabled)' : 1,
      }}
    >
      <label
        htmlFor="layer-blend-mode"
        style={{
          fontSize: 8,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        Blend
      </label>
      <select
        id="layer-blend-mode"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        style={{
          flex: 1,
          padding: '4px 6px',
          background: 'var(--bg-base)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--text-secondary)',
          fontSize: 9,
          fontFamily: 'inherit',
          cursor: disabled ? 'not-allowed' : 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 24 24' fill='none' stroke='%236a6a78' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 6px center',
          paddingRight: 20,
        }}
        aria-label="Layer blend mode"
      >
        {MODES.map((mode) => (
          <option key={mode.value} value={mode.value}>
            {mode.label}
          </option>
        ))}
      </select>
    </div>
  );
}
