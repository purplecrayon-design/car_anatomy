import { useStore } from '@/store';

export function BottomBar() {
  const zoom = useStore((s) => s.zoom);
  const selectedNodeId = useStore((s) => s.selectedNodeId);
  const traceResult = useStore((s) => s.traceResult);
  const statuses = useStore((s) => s.componentStatuses);
  const isSaving = useStore((s) => s.isSaving);
  const lastSavedAt = useStore((s) => s.lastSavedAt);
  const mode = useStore((s) => s.mode);

  const testedCount = Object.values(statuses).filter((s) => s !== 'untested').length;
  const totalCount = Object.keys(statuses).length;

  const formatTime = (timestamp: number | null) => {
    if (!timestamp) return 'Not saved';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <footer
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        height: 24,
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        fontSize: 9,
        color: 'var(--text-muted)',
      }}
      role="contentinfo"
    >
      {/* Left section - Status indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Mode indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent)',
            }}
          />
          <span style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>{mode}</span>
        </div>

        {/* Selection indicator */}
        {selectedNodeId && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: 'var(--text-ghost)' }}>|</span>
            <span>Selected: {selectedNodeId}</span>
          </div>
        )}

        {/* Trace indicator */}
        {traceResult && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: 'var(--text-ghost)' }}>|</span>
            <span style={{ color: 'var(--success)' }}>
              Trace: {traceResult.nodes.size} nodes, {traceResult.edges.size} wires
            </span>
          </div>
        )}
      </div>

      {/* Center section - Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>
          Tested: {testedCount}/{totalCount}
        </span>
        <div
          style={{
            width: 60,
            height: 4,
            background: 'var(--border)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: totalCount > 0 ? `${(testedCount / totalCount) * 100}%` : '0%',
              height: '100%',
              background: 'linear-gradient(90deg, var(--accent), var(--success))',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Right section - Save status and zoom */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Save status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: 'var(--radius-full)',
              background: isSaving ? 'var(--warning)' : 'var(--success)',
              animation: isSaving ? 'pulse 1s infinite' : 'none',
            }}
          />
          <span>{isSaving ? 'Saving...' : `Saved ${formatTime(lastSavedAt)}`}</span>
        </div>

        {/* Zoom level */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: 'var(--text-ghost)' }}>|</span>
          <span>{Math.round(zoom * 100)}%</span>
        </div>

        {/* Help link */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            // TODO: Open help modal
          }}
          style={{
            color: 'var(--text-ghost)',
            textDecoration: 'none',
          }}
          aria-label="Help"
        >
          ?
        </a>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </footer>
  );
}
