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
        {/* Visibility toggle - 44px touch target with smaller visual */}
        <button
          onClick={handleToggle}
          onKeyDown={(e) => handleKeyDown(e, 'toggle')}
          style={{
            width: 28,
            height: 28,
            minWidth: 28,
            minHeight: 28,
            borderRadius: 6,
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            position: 'relative',
          }}
          role="switch"
          aria-checked={visible}
          aria-label={`Toggle ${label} layer visibility`}
          title={visible ? `Hide ${label}` : `Show ${label}`}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              background: visible ? color : 'var(--border)',
              transition: 'background var(--transition-fast), transform 0.1s ease',
              transform: visible ? 'scale(1)' : 'scale(0.9)',
            }}
          />
        </button>

        {/* Label */}
        <span
          onClick={handleToggle}
          style={{
            flex: 1,
            color: visible ? 'var(--text-secondary)' : 'var(--text-muted)',
            fontSize: 12,
            cursor: 'pointer',
            userSelect: 'none',
            fontWeight: visible ? 500 : 400,
          }}
        >
          {label}
        </span>

        {/* Solo button - 28px touch target */}
        <button
          onClick={handleSolo}
          onKeyDown={(e) => handleKeyDown(e, 'solo')}
          style={{
            background: isSoloed ? color + '20' : 'transparent',
            border: `1px solid ${isSoloed ? color : 'transparent'}`,
            color: isSoloed ? color : 'var(--text-muted)',
            fontSize: 10,
            cursor: 'pointer',
            fontFamily: 'inherit',
            padding: '4px 8px',
            minWidth: 28,
            minHeight: 28,
            borderRadius: 4,
            fontWeight: isSoloed ? 600 : 500,
            transition: 'all var(--transition-fast)',
          }}
          aria-pressed={isSoloed}
          aria-label={`Solo ${label} layer`}
          title={isSoloed ? `Unsolo ${label}` : `Solo ${label}`}
        >
          Solo
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
