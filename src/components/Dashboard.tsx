import { useStore } from '@/store';
import { DashboardCard } from './dashboard/DashboardCard';

export function Dashboard() {
  const recentComponents = useStore((s) => s.recentComponents);
  const getFlaggedNotes = useStore((s) => s.getFlaggedNotes);
  const getComponentData = useStore((s) => s.getComponentData);
  const setSelectedNode = useStore((s) => s.setSelectedNode);
  const setViewMode = useStore((s) => s.setViewMode);
  const pdfIndex = useStore((s) => s.pdfIndex);

  const flaggedNotes = getFlaggedNotes();
  const totalComponents = Object.keys(pdfIndex).length;
  const visitedCount = recentComponents.length;
  const progress = totalComponents > 0 ? Math.round((visitedCount / totalComponents) * 100) : 0;

  const handleComponentClick = (componentId: string) => {
    setSelectedNode(componentId);
    setViewMode('explore');
  };

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 1000,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 8 }}>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          Dashboard
        </h1>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
          1997 Lexus ES300 / 1MZ-FE V6 Explorer
        </p>
      </div>

      {/* Cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {/* Recent Inspections */}
        <DashboardCard title="Recent Inspections" icon="🔍">
          {recentComponents.length === 0 ? (
            <p style={{ fontSize: 10, color: 'var(--text-ghost)', margin: 0 }}>
              No components inspected yet. Click on a component to begin.
            </p>
          ) : (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {recentComponents.slice(0, 5).map((id) => {
                const data = getComponentData(id);
                return (
                  <li key={id}>
                    <button
                      onClick={() => handleComponentClick(id)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        background: 'var(--bg-base)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-secondary)',
                        fontSize: 10,
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                    >
                      {data?.label || id}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </DashboardCard>

        {/* Flagged Issues */}
        <DashboardCard title="Flagged Issues" icon="⚠️" variant={flaggedNotes.length > 0 ? 'warning' : 'default'}>
          {flaggedNotes.length === 0 ? (
            <p style={{ fontSize: 10, color: 'var(--text-ghost)', margin: 0 }}>
              No flagged issues. Tag a note as "problem" to track issues.
            </p>
          ) : (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {flaggedNotes.slice(0, 5).map((note) => {
                const data = getComponentData(note.componentId);
                return (
                  <li key={note.id}>
                    <button
                      onClick={() => handleComponentClick(note.componentId)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        background: 'rgba(241, 196, 15, 0.05)',
                        border: '1px solid var(--warning)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-secondary)',
                        fontSize: 10,
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontWeight: 500 }}>{data?.label || note.componentId}</div>
                      <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>
                        {note.text.slice(0, 50)}{note.text.length > 50 ? '...' : ''}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </DashboardCard>

        {/* Learning Progress */}
        <DashboardCard title="Learning Progress" icon="📚" variant={progress >= 50 ? 'success' : 'default'}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Progress bar */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                  fontSize: 10,
                  color: 'var(--text-muted)',
                }}
              >
                <span>Components Explored</span>
                <span>{visitedCount} / {totalComponents}</span>
              </div>
              <div
                style={{
                  height: 8,
                  background: 'var(--bg-base)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: progress >= 50 ? 'var(--success)' : 'var(--accent)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 16 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>{progress}%</div>
                <div style={{ fontSize: 8, color: 'var(--text-muted)' }}>Complete</div>
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>7</div>
                <div style={{ fontSize: 8, color: 'var(--text-muted)' }}>Systems</div>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Quick OBD Reference */}
        <DashboardCard title="Quick OBD Reference" icon="📊">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { pid: 'ECT', desc: 'Coolant Temp', range: '80-95°C' },
              { pid: 'TPS', desc: 'Throttle Position', range: '0.5-4.5V' },
              { pid: 'MAF', desc: 'Mass Air Flow', range: '2-25 g/s' },
              { pid: 'O2S11', desc: 'Front O2 Sensor', range: '0.1-0.9V' },
            ].map((item) => (
              <div
                key={item.pid}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '6px 8px',
                  background: 'var(--bg-base)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <code
                  style={{
                    padding: '2px 6px',
                    background: 'var(--bg-elevated)',
                    borderRadius: 2,
                    fontSize: 9,
                    fontFamily: 'monospace',
                    color: 'var(--accent)',
                  }}
                >
                  {item.pid}
                </code>
                <span style={{ flex: 1, fontSize: 9, color: 'var(--text-muted)' }}>{item.desc}</span>
                <span style={{ fontSize: 9, color: 'var(--text-secondary)', fontWeight: 500 }}>{item.range}</span>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Start Exploring button */}
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <button
          onClick={() => setViewMode('explore')}
          style={{
            padding: '12px 32px',
            background: 'var(--accent)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: 'var(--bg-base)',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Start Exploring
        </button>
      </div>
    </div>
  );
}
