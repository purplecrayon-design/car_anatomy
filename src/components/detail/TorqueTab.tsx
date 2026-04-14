import type { TorqueSpec } from '@/store/manualSlice';

interface Props {
  data?: TorqueSpec[] | null;
}

export function TorqueTab({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div style={{ color: 'var(--text-ghost)', fontSize: 10, textAlign: 'center', padding: 20 }}>
        N/A — No torque specifications
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Torque table */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 10,
        }}
      >
        <thead>
          <tr
            style={{
              background: 'var(--bg-elevated)',
              textAlign: 'left',
            }}
          >
            <th style={{ padding: '8px 10px', color: 'var(--text-muted)', fontWeight: 500 }}>
              Fastener
            </th>
            <th style={{ padding: '8px 6px', color: 'var(--text-muted)', fontWeight: 500, textAlign: 'right' }}>
              N·m
            </th>
            <th style={{ padding: '8px 6px', color: 'var(--text-muted)', fontWeight: 500, textAlign: 'right' }}>
              kgf·cm
            </th>
            <th style={{ padding: '8px 6px', color: 'var(--text-muted)', fontWeight: 500, textAlign: 'right' }}>
              ft·lbf
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((spec, i) => (
            <tr
              key={i}
              style={{
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>
                {spec.name}
                {spec.note && (
                  <div style={{ fontSize: 8, color: 'var(--accent)', marginTop: 2 }}>
                    {spec.note}
                  </div>
                )}
              </td>
              <td
                style={{
                  padding: '10px 6px',
                  textAlign: 'right',
                  fontFamily: 'monospace',
                  color: spec.nm > 0 ? 'var(--text-primary)' : 'var(--text-ghost)',
                  fontWeight: 600,
                }}
              >
                {spec.nm > 0 ? spec.nm : '—'}
              </td>
              <td
                style={{
                  padding: '10px 6px',
                  textAlign: 'right',
                  fontFamily: 'monospace',
                  color: spec.kgfcm > 0 ? 'var(--text-secondary)' : 'var(--text-ghost)',
                }}
              >
                {spec.kgfcm > 0 ? spec.kgfcm : '—'}
              </td>
              <td
                style={{
                  padding: '10px 6px',
                  textAlign: 'right',
                  fontFamily: 'monospace',
                  color: spec.ftlbf > 0 ? 'var(--text-secondary)' : 'var(--text-ghost)',
                }}
              >
                {spec.ftlbf > 0 ? spec.ftlbf : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Conversion reference */}
      <div
        style={{
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
          Conversion
        </h4>
        <div style={{ display: 'flex', gap: 12, fontSize: 9, color: 'var(--text-muted)' }}>
          <span>1 N·m = 10.2 kgf·cm</span>
          <span>1 N·m = 0.738 ft·lbf</span>
        </div>
      </div>

      {/* Safety note */}
      <div
        style={{
          padding: 10,
          background: 'rgba(241, 196, 15, 0.1)',
          borderRadius: 'var(--radius-sm)',
          borderLeft: '3px solid var(--warning)',
        }}
      >
        <p style={{ fontSize: 9, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
          Always use a calibrated torque wrench. Torque values assume clean, dry threads unless otherwise specified. Re-torque may be required for TTY (torque-to-yield) bolts.
        </p>
      </div>
    </div>
  );
}
