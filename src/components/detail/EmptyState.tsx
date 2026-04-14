export function EmptyState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8, textAlign: 'center' }}>
      <div style={{ fontSize: 34, opacity: 0.06, color: 'var(--accent)' }}>⚡</div>
      <div style={{ color: 'var(--text-ghost)', fontSize: 9.5, lineHeight: 1.7 }}>Click any component to trace its circuit path</div>
      <div style={{ color: 'var(--border-subtle)', fontSize: 8 }}>Right-click to cycle diagnostic status</div>
    </div>
  );
}
