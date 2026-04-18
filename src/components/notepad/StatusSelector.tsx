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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
          {componentLabel}
        </span>
        <button
          onClick={handleCycle}
          style={{
            padding: '8px 12px',
            minHeight: 36,
            background: 'transparent',
            border: `1px solid ${config.border}`,
            borderRadius: 'var(--radius-sm)',
            color: config.color,
            fontSize: 12,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontWeight: 500,
            transition: 'all 0.15s ease',
          }}
          aria-label={`Cycle status, currently ${config.label}`}
        >
          <span style={{ fontSize: 14 }}>{config.icon}</span>
          {config.label}
        </button>
      </div>

      {/* Status buttons - 36px minimum touch targets */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {STATUS_ORDER.map((s) => {
          const cfg = STATUS_MAP[s];
          const isActive = s === status;

          return (
            <button
              key={s}
              onClick={() => handleSelect(s)}
              style={{
                padding: '8px 12px',
                minWidth: 36,
                minHeight: 36,
                background: isActive ? cfg.bg : 'var(--bg-base)',
                border: `1px solid ${isActive ? cfg.border : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-sm)',
                color: isActive ? cfg.color : 'var(--text-muted)',
                fontSize: 16,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-pressed={isActive}
              aria-label={`Set status to ${cfg.label}`}
              title={cfg.label}
            >
              {cfg.icon}
            </button>
          );
        })}
      </div>
    </div>
  );
}
