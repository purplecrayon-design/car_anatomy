import { useStore } from '@/store';

export function ProgressTracker() {
  const statuses = useStore((s) => s.componentStatuses);
  const total = Object.keys(statuses).length;
  const tested = Object.values(statuses).filter((s) => s !== 'untested').length;
  const pct = total > 0 ? Math.round((tested / total) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ color: 'var(--text-ghost)', fontSize: 7.5, textTransform: 'uppercase', letterSpacing: 2, padding: '2px 6px' }}>
        Progress
      </div>
      <div style={{ padding: '0 6px' }}>
        <div style={{ width: '100%', height: 4, background: 'var(--border-subtle)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: pct + '%', height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--success))', borderRadius: 2, transition: 'width 0.4s' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, fontSize: 7.5, color: 'var(--text-ghost)' }}>
          <span>{tested}/{total}</span>
          <span>{pct}%</span>
        </div>
      </div>
    </div>
  );
}
