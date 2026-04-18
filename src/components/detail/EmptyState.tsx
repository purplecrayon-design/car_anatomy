export function EmptyState() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: 12,
      textAlign: 'center',
      padding: '24px 16px',
    }}>
      <div style={{
        fontSize: 48,
        opacity: 0.15,
        color: 'var(--accent)',
        marginBottom: 4,
      }}>
        ⚡
      </div>
      <div style={{
        color: 'var(--text-secondary)',
        fontSize: 13,
        lineHeight: 1.5,
        fontWeight: 500,
      }}>
        Click any component to view details
      </div>
      <div style={{
        color: 'var(--text-muted)',
        fontSize: 12,
        lineHeight: 1.4,
      }}>
        Right-click to set diagnostic status
      </div>
    </div>
  );
}
