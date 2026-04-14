import { useCallback, useState } from 'react';
import { useStore } from '@/store';
import { exportSession } from '@/services/export';
import type { SessionExport } from '@/types/session';

interface Props {
  variant?: 'icon' | 'text' | 'full';
  disabled?: boolean;
}

export function ExportButton({ variant = 'full', disabled = false }: Props) {
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const sessionName = useStore((s) => s.sessionName);
  const activeSessionId = useStore((s) => s.activeSessionId);
  const componentStatuses = useStore((s) => s.componentStatuses);
  const layers = useStore((s) => s.layers);
  const annotations = useStore((s) => s.annotations);

  const handleExport = useCallback(() => {
    if (disabled || isExporting) return;

    setIsExporting(true);

    const exportData: SessionExport = {
      version: 1,
      session: {
        name: sessionName || 'Untitled Session',
        vehicleId: 'es300-1997',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      statuses: componentStatuses,
      voltageReadings: [],
      annotations: annotations.map((a) => ({
        svgX: a.svgX,
        svgY: a.svgY,
        pageId: a.pageId,
        text: a.text,
      })),
      layerState: layers,
    };

    try {
      exportSession(exportData);
      setExported(true);
      setTimeout(() => setExported(false), 2000);
    } finally {
      setIsExporting(false);
    }
  }, [
    disabled,
    isExporting,
    sessionName,
    activeSessionId,
    componentStatuses,
    layers,
    annotations,
  ]);

  const iconOnly = variant === 'icon';
  const showIcon = variant !== 'text';
  const showText = variant !== 'icon';

  return (
    <button
      onClick={handleExport}
      disabled={disabled || isExporting}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: iconOnly ? '6px' : '6px 12px',
        background: exported ? 'rgba(102, 187, 106, 0.15)' : 'var(--bg-elevated)',
        border: `1px solid ${exported ? 'var(--success)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-sm)',
        color: exported ? 'var(--success)' : 'var(--text-secondary)',
        fontSize: 10,
        cursor: disabled || isExporting ? 'not-allowed' : 'pointer',
        transition: 'all var(--transition-fast)',
        minWidth: iconOnly ? 28 : undefined,
      }}
      aria-label="Export session"
      title="Export session to file"
    >
      {showIcon && (
        <span style={{ fontSize: 12 }}>
          {exported ? '\u2713' : isExporting ? '\u21BB' : '\u2913'}
        </span>
      )}
      {showText && (
        <span>{exported ? 'Exported!' : isExporting ? 'Exporting...' : 'Export'}</span>
      )}
    </button>
  );
}
