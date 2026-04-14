import type { OBDReference } from '@/store/manualSlice';

interface Props {
  data?: OBDReference | null;
}

export function OBDTab({ data }: Props) {
  if (!data) {
    return (
      <div style={{ color: 'var(--text-ghost)', fontSize: 10, textAlign: 'center', padding: 20 }}>
        N/A — No OBD data for this component
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* PIDs */}
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
          Related PIDs
        </h4>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {data.pids.map((pid) => (
            <code
              key={pid}
              style={{
                padding: '4px 8px',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 10,
                fontFamily: 'monospace',
                color: 'var(--accent)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {pid}
            </code>
          ))}
        </div>
      </div>

      {/* Expected values */}
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
          Expected Range
        </h4>
        <div
          style={{
            padding: '10px 12px',
            background: 'var(--bg-base)',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '3px solid var(--success)',
            fontSize: 11,
            color: 'var(--text-primary)',
            fontWeight: 500,
          }}
        >
          {data.expectedRange}
        </div>
      </div>

      {/* Red flags */}
      {data.redFlags && data.redFlags.length > 0 && (
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
            Red Flags
          </h4>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {data.redFlags.map((flag, i) => (
              <li
                key={i}
                style={{
                  padding: '8px 10px',
                  background: 'rgba(231, 76, 60, 0.1)',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: '3px solid var(--danger)',
                  fontSize: 10,
                  color: 'var(--text-secondary)',
                }}
              >
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick diagnostic tip */}
      <div
        style={{
          marginTop: 8,
          padding: 10,
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <h4
          style={{
            fontSize: 8,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 6,
          }}
        >
          Diagnostic Tip
        </h4>
        <p style={{ fontSize: 9, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
          Use an OBD-II scanner to read live data. Compare actual values to expected range. Check for related DTCs.
        </p>
      </div>
    </div>
  );
}
