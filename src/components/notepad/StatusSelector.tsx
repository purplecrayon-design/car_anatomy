import { useCallback } from 'react';
import type { DiagnosticStatus } from '@/types/diagnostic';
import { STATUS_MAP } from '@/types/diagnostic';

interface Props {
  componentId: string;
  componentLabel: string;
  status: DiagnosticStatus;
  onStatusChange: (id: string, status: DiagnosticStatus) => void;
}

const STATUS_ORDER: DiagnosticStatus[] = ['untested', 'testing', 'good', 'suspected', 'bad'];

export function StatusSelector({ componentId, componentLabel, status, onStatusChange }: Props) {
  const config = STATUS_MAP[status];

  const handleCycle = useCallback(() => {
    const currentIndex = STATUS_ORDER.indexOf(status);
    const nextIndex = (currentIndex + 1) % STATUS_ORDER.length;
    onStatusChange(componentId, STATUS_ORDER[nextIndex]);
  }, [componentId, status, onStatusChange]);

  const handleSelect = useCallback(
    (newStatus: DiagnosticStatus) => {
      onStatusChange(componentId, newStatus);
    },
    [componentId, onStatusChange]
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 12,
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: 'var(--radius-md)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500 }}>
          {componentLabel}
        </span>
        <button
          onClick={handleCycle}
          style={{
            padding: '4px 8px',
            background: 'transparent',
            border: `1px solid ${config.border}`,
            borderRadius: 'var(--radius-sm)',
            color: config.color,
            fontSize: 9,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
          aria-label={`Cycle status, currently ${config.label}`}
        >
          <span style={{ fontSize: 12 }}>{config.icon}</span>
          {config.label}
        </button>
      </div>

      {/* Status buttons */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {STATUS_ORDER.map((s) => {
          const cfg = STATUS_MAP[s];
          const isActive = s === status;

          return (
            <button
              key={s}
              onClick={() => handleSelect(s)}
              style={{
                padding: '4px 8px',
                background: isActive ? cfg.bg : 'var(--bg-base)',
                border: `1px solid ${isActive ? cfg.border : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-sm)',
                color: isActive ? cfg.color : 'var(--text-muted)',
                fontSize: 8,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              aria-pressed={isActive}
              aria-label={`Set status to ${cfg.label}`}
            >
              {cfg.icon}
            </button>
          );
        })}
      </div>
    </div>
  );
}
