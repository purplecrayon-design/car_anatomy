import type { VoltageReading, VoltageResult } from '@/types/diagnostic';

interface Props {
  readings: VoltageReading[];
  expectedVoltage?: number;
}

const RESULT_STYLES: Record<VoltageResult, { color: string; bg: string; label: string }> = {
  pass: { color: 'var(--success)', bg: 'rgba(102, 187, 106, 0.1)', label: 'PASS' },
  warning: { color: 'var(--warning)', bg: 'rgba(255, 167, 38, 0.1)', label: 'WARN' },
  fail: { color: 'var(--danger)', bg: 'rgba(239, 83, 80, 0.1)', label: 'FAIL' },
};

const CONDITION_LABELS: Record<string, string> = {
  key_off: 'Key Off',
  koeo: 'KOEO',
  koer: 'KOER',
  cranking: 'Cranking',
};

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function VoltageDisplay({ readings, expectedVoltage }: Props) {
  if (readings.length === 0) {
    return (
      <div
        style={{
          padding: 12,
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <p style={{ fontSize: 9, color: 'var(--text-muted)', margin: 0, textAlign: 'center' }}>
          No voltage readings recorded
        </p>
      </div>
    );
  }

  // Get most recent reading
  const latestReading = readings[readings.length - 1];
  const resultStyle = RESULT_STYLES[latestReading.result];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {/* Latest reading display */}
      <div
        style={{
          padding: 12,
          background: resultStyle.bg,
          borderRadius: 'var(--radius-md)',
          border: `1px solid ${resultStyle.color}30`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: resultStyle.color,
                fontFamily: 'var(--font-mono)',
              }}
            >
              {latestReading.actual.toFixed(1)}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>V</span>
          </div>
          <span
            style={{
              fontSize: 8,
              fontWeight: 600,
              color: resultStyle.color,
              padding: '2px 6px',
              background: `${resultStyle.color}20`,
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {resultStyle.label}
          </span>
        </div>

        {expectedVoltage !== undefined && (
          <div style={{ marginTop: 8, fontSize: 9, color: 'var(--text-muted)' }}>
            Expected: {expectedVoltage.toFixed(1)}V
            <span style={{ marginLeft: 8, color: 'var(--text-ghost)' }}>
              ({CONDITION_LABELS[latestReading.condition]})
            </span>
          </div>
        )}
      </div>

      {/* History */}
      {readings.length > 1 && (
        <div>
          <h4
            style={{
              fontSize: 8,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            History
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {readings
              .slice(0, -1)
              .reverse()
              .slice(0, 5)
              .map((reading, i) => {
                const style = RESULT_STYLES[reading.result];
                return (
                  <div
                    key={reading.id ?? i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 8px',
                      background: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 9,
                    }}
                  >
                    <span style={{ color: style.color, fontFamily: 'var(--font-mono)' }}>
                      {reading.actual.toFixed(1)}V
                    </span>
                    <span style={{ color: 'var(--text-ghost)' }}>
                      {CONDITION_LABELS[reading.condition]}
                    </span>
                    <span style={{ color: 'var(--text-ghost)' }}>
                      {formatTime(reading.timestamp)}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
