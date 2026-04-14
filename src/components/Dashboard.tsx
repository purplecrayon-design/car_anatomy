import { useStore } from '@/store';
import { Vehicle360Viewer } from './Vehicle360Viewer';

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
        minHeight: '100vh',
        background: 'var(--bg-base)',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '24px 32px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-surface)',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 300,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              1997 Lexus ES300
            </h1>
            <p
              style={{
                fontSize: 13,
                color: 'var(--text-muted)',
                marginTop: 4,
              }}
            >
              Diamond White Pearl · 1MZ-FE 3.0L V6
            </p>
          </div>
          <button
            onClick={() => setViewMode('explore')}
            style={{
              padding: '12px 24px',
              background: 'var(--accent)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-full)',
              fontSize: 14,
              fontWeight: 500,
              transition: 'all 0.2s ease',
            }}
          >
            Explore Components
          </button>
        </div>
      </header>

      {/* Main content */}
      <main
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '48px 32px',
        }}
      >
        {/* 360 Viewer */}
        <section style={{ marginBottom: 64 }}>
          <Vehicle360Viewer />
        </section>

        {/* Stats row */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 24,
            marginBottom: 64,
          }}
        >
          <StatCard
            label="Components Explored"
            value={visitedCount}
            total={totalComponents}
            accent="var(--accent)"
          />
          <StatCard
            label="Flagged Issues"
            value={flaggedNotes.length}
            accent={flaggedNotes.length > 0 ? 'var(--warning)' : 'var(--accent)'}
          />
          <StatCard
            label="Progress"
            value={`${progress}%`}
            accent="var(--accent-gold)"
          />
        </section>

        {/* Content grid */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 32,
          }}
        >
          {/* Recent Activity */}
          <Card title="Recent Activity">
            {recentComponents.length === 0 ? (
              <EmptyState message="No components inspected yet" />
            ) : (
              <ul style={{ listStyle: 'none' }}>
                {recentComponents.slice(0, 5).map((id) => {
                  const data = getComponentData(id);
                  return (
                    <li key={id}>
                      <button
                        onClick={() => handleComponentClick(id)}
                        style={{
                          width: '100%',
                          padding: '12px 0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottom: '1px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: 14,
                          textAlign: 'left',
                          transition: 'color 0.15s ease',
                        }}
                      >
                        <span>{data?.label || id}</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M6 4l4 4-4 4" stroke="var(--text-ghost)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          {/* Flagged Issues */}
          <Card title="Flagged Issues" accent={flaggedNotes.length > 0 ? 'var(--warning)' : undefined}>
            {flaggedNotes.length === 0 ? (
              <EmptyState message="No flagged issues" />
            ) : (
              <ul style={{ listStyle: 'none' }}>
                {flaggedNotes.slice(0, 5).map((note) => {
                  const data = getComponentData(note.componentId);
                  return (
                    <li key={note.id}>
                      <button
                        onClick={() => handleComponentClick(note.componentId)}
                        style={{
                          width: '100%',
                          padding: '12px 0',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: 4,
                          borderBottom: '1px solid var(--border-subtle)',
                          textAlign: 'left',
                        }}
                      >
                        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                          {data?.label || note.componentId}
                        </span>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                          {note.text.slice(0, 60)}{note.text.length > 60 ? '...' : ''}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          {/* Quick Reference */}
          <Card title="Quick Reference">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Engine', value: '1MZ-FE 3.0L V6' },
                { label: 'Power', value: '194 hp @ 5,200 rpm' },
                { label: 'Torque', value: '209 lb-ft @ 4,400 rpm' },
                { label: 'Transmission', value: '4-speed automatic' },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}

// Sub-components

function Card({ title, children, accent }: { title: string; children: React.ReactNode; accent?: string }) {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: 24,
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <h3
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: accent || 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 16,
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function StatCard({ label, value, total, accent }: { label: string; value: number | string; total?: number; accent: string }) {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: 24,
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 300,
          color: accent,
          lineHeight: 1,
        }}
      >
        {value}
        {total !== undefined && (
          <span style={{ fontSize: 16, color: 'var(--text-ghost)' }}> / {total}</span>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: '32px 0',
        textAlign: 'center',
        color: 'var(--text-ghost)',
        fontSize: 13,
      }}
    >
      {message}
    </div>
  );
}
