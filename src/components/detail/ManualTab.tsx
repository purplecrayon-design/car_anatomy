import type { ManualReference } from '@/store/manualSlice';

interface Props {
  data?: ManualReference;
}

export function ManualTab({ data }: Props) {
  if (!data) {
    return (
      <div style={{ color: 'var(--text-ghost)', fontSize: 10, textAlign: 'center', padding: 20 }}>
        No manual reference available
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
            background: 'var(--accent)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 9,
            fontWeight: 600,
            color: 'var(--bg-base)',
          }}
        >
          Page {data.page}
        </span>
      </div>

      {/* Excerpt */}
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
          Excerpt
        </h4>
        <p
          style={{
            fontSize: 11,
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            margin: 0,
            padding: 10,
            background: 'var(--bg-base)',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '3px solid var(--accent)',
          }}
        >
          {data.excerpt}
        </p>
      </div>

      {/* Placeholder for screenshot */}
      <div
        style={{
          height: 120,
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
        Manual page screenshot
      </div>
    </div>
  );
}
