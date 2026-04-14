import { useCallback, useRef, useState } from 'react';

interface Props {
  value: number;
  onChange: (value: number) => void;
  color?: string;
  disabled?: boolean;
  'aria-label'?: string;
}

export function OpacitySlider({
  value,
  onChange,
  color = 'var(--accent)',
  disabled = false,
  'aria-label': ariaLabel = 'Opacity',
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const updateValue = useCallback(
    (clientX: number) => {
      if (!trackRef.current || disabled) return;
      const rect = trackRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      onChange(Math.round(percent));
    },
    [onChange, disabled]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      setIsDragging(true);
      updateValue(e.clientX);

      const handleMouseMove = (e: MouseEvent) => updateValue(e.clientX);
      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [updateValue, disabled]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      let newValue = value;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          newValue = Math.min(100, value + (e.shiftKey ? 10 : 5));
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          newValue = Math.max(0, value - (e.shiftKey ? 10 : 5));
          break;
        case 'Home':
          newValue = 0;
          break;
        case 'End':
          newValue = 100;
          break;
        default:
          return;
      }
      e.preventDefault();
      onChange(newValue);
    },
    [value, onChange, disabled]
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
      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        style={{
          flex: 1,
          height: 4,
          background: 'var(--bg-base)',
          borderRadius: 'var(--radius-full)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          position: 'relative',
        }}
      >
        {/* Fill */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${value}%`,
            background: color,
            borderRadius: 'var(--radius-full)',
            transition: isDragging ? 'none' : 'width var(--transition-fast)',
          }}
        />
        {/* Thumb */}
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={ariaLabel}
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-disabled={disabled}
          onKeyDown={handleKeyDown}
          style={{
            position: 'absolute',
            left: `${value}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 10,
            height: 10,
            borderRadius: 'var(--radius-full)',
            background: color,
            border: '2px solid var(--bg-elevated)',
            boxShadow: 'var(--shadow-sm)',
            cursor: disabled ? 'not-allowed' : 'grab',
            transition: isDragging ? 'none' : 'left var(--transition-fast)',
          }}
        />
      </div>
      <span
        style={{
          fontSize: 8,
          color: 'var(--text-muted)',
          minWidth: 24,
          textAlign: 'right',
        }}
      >
        {value}%
      </span>
    </div>
  );
}
