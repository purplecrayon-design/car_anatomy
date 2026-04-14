import { useCallback } from 'react';
import { OpacitySlider } from './OpacitySlider';

interface Props {
  id: string;
  label: string;
  color: string;
  visible: boolean;
  opacity: number;
  isSoloed: boolean;
  showOpacity?: boolean;
  onToggleVisibility: (id: string) => void;
  onToggleSolo: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
}

export function LayerRow({
  id,
  label,
  color,
  visible,
  opacity,
  isSoloed,
  showOpacity = false,
  onToggleVisibility,
  onToggleSolo,
  onOpacityChange,
}: Props) {
  const handleToggle = useCallback(() => {
    onToggleVisibility(id);
  }, [id, onToggleVisibility]);

  const handleSolo = useCallback(() => {
    onToggleSolo(id);
  }, [id, onToggleSolo]);

  const handleOpacity = useCallback(
    (value: number) => {
      onOpacityChange(id, value);
    },
    [id, onOpacityChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, action: 'toggle' | 'solo') => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (action === 'toggle') handleToggle();
        else handleSolo();
      }
    },
    [handleToggle, handleSolo]
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: showOpacity ? 6 : 0,
        padding: '6px 7px',
        background: visible ? 'var(--bg-elevated)' : 'var(--bg-surface)',
        border: `1px solid ${isSoloed ? color + '50' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-sm)',
        transition: 'background var(--transition-fast), border-color var(--transition-fast)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        {/* Visibility toggle */}
        <button
          onClick={handleToggle}
          onKeyDown={(e) => handleKeyDown(e, 'toggle')}
          style={{
            width: 11,
            height: 11,
            borderRadius: 2,
            cursor: 'pointer',
            background: visible ? color : 'var(--border)',
            border: 'none',
            padding: 0,
            transition: 'background var(--transition-fast)',
            flexShrink: 0,
          }}
          role="switch"
          aria-checked={visible}
          aria-label={`Toggle ${label} layer visibility`}
          title={visible ? `Hide ${label}` : `Show ${label}`}
        />

        {/* Label */}
        <span
          onClick={handleToggle}
          style={{
            flex: 1,
            color: visible ? 'var(--text-secondary)' : 'var(--text-muted)',
            fontSize: 9.5,
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          {label}
        </span>

        {/* Solo button */}
        <button
          onClick={handleSolo}
          onKeyDown={(e) => handleKeyDown(e, 'solo')}
          style={{
            background: 'transparent',
            border: 'none',
            color: isSoloed ? color : 'var(--text-muted)',
            fontSize: 7,
            cursor: 'pointer',
            fontFamily: 'inherit',
            padding: '2px 4px',
            borderRadius: 2,
            fontWeight: isSoloed ? 600 : 400,
          }}
          aria-pressed={isSoloed}
          aria-label={`Solo ${label} layer`}
          title={isSoloed ? `Unsolo ${label}` : `Solo ${label}`}
        >
          S
        </button>
      </div>

      {/* Opacity slider - shown when layer is visible and feature enabled */}
      {showOpacity && visible && (
        <OpacitySlider
          value={opacity}
          onChange={handleOpacity}
          color={color}
          aria-label={`${label} layer opacity`}
        />
      )}
    </div>
  );
}
