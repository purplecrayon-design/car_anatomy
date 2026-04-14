import { useStore } from '@/store';

export function TopBar() {
  const viewMode = useStore((s) => s.viewMode);
  const setViewMode = useStore((s) => s.setViewMode);
  const toggleCommandPalette = useStore((s) => s.toggleCommandPalette);

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 56,
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Left - Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={() => setViewMode('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: 0,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 300,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            97
          </span>
          <div
            style={{
              width: 1,
              height: 20,
              background: 'var(--border)',
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: 'var(--accent)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            ES300
          </span>
        </button>
      </div>

      {/* Center - View toggle */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: 4,
          background: 'var(--bg-base)',
          borderRadius: 'var(--radius-full)',
        }}
      >
        {['dashboard', 'explore'].map((mode) => {
          const isActive = viewMode === mode;
          return (
            <button
              key={mode}
              onClick={() => setViewMode(mode as 'dashboard' | 'explore')}
              style={{
                padding: '8px 20px',
                background: isActive ? 'var(--bg-surface)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                borderRadius: 'var(--radius-full)',
                fontSize: 13,
                fontWeight: 500,
                textTransform: 'capitalize',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {mode === 'dashboard' ? 'Overview' : 'Explore'}
            </button>
          );
        })}
      </nav>

      {/* Right - Search */}
      <button
        onClick={toggleCommandPalette}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          background: 'var(--bg-base)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-full)',
          color: 'var(--text-muted)',
          fontSize: 13,
          transition: 'all 0.15s ease',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span>Search</span>
        <kbd
          style={{
            padding: '2px 6px',
            background: 'var(--bg-surface)',
            borderRadius: 4,
            fontSize: 11,
            color: 'var(--text-ghost)',
          }}
        >
          ⌘K
        </kbd>
      </button>
    </header>
  );
}
