import type { WiringReference } from '@/store/manualSlice';

interface Props {
  data?: WiringReference;
}

export function WiringTab({ data }: Props) {
  if (!data) {
    return (
      <div style={{ color: 'var(--text-ghost)', fontSize: 10, textAlign: 'center', padding: 20 }}>
        No wiring diagram reference available
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* PDF reference */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 10px',
          background: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <span style={{ fontSize: 9, color: 'var(--text-secondary)' }}>{data.pdf}</span>
        <span
          style={{
            padding: '2px 8px',
            background: 'var(--system-charging)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 9,
            fontWeight: 600,
            color: 'var(--bg-base)',
          }}
        >
          Page {data.page}
        </span>
      </div>

      {/* Circuit info */}
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
          Circuit
        </h4>
        <div
          style={{
            padding: '8px 10px',
            background: 'var(--bg-base)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 11,
            color: 'var(--text-primary)',
            fontWeight: 500,
          }}
        >
          {data.circuit.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
        </div>
      </div>

      {/* Placeholder for wiring diagram section */}
      <div
        style={{
          height: 180,
          background: 'var(--bg-base)',
          borderRadius: 'var(--radius-sm)',
          border: '1px dashed var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-ghost)',
          fontSize: 9,
        }}
      >
        Wiring diagram section
      </div>

      {/* Quick reference */}
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
            marginBottom: 8,
          }}
        >
          Wire Colors
        </h4>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9 }}>
            <span style={{ width: 10, height: 10, background: '#fff', borderRadius: 2, border: '1px solid #ccc' }} />
            W = White
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9 }}>
            <span style={{ width: 10, height: 10, background: '#000', borderRadius: 2 }} />
            B = Black
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9 }}>
            <span style={{ width: 10, height: 10, background: '#e74c3c', borderRadius: 2 }} />
            R = Red
          </span>
        </div>
      </div>
    </div>
  );
}
