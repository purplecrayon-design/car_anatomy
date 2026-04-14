import { useStore } from '@/store';
import type { InteractionMode, DifficultyLevel } from '@/types/ui';
import { ModelSelector } from './ModelSelector';

const MODES: { value: InteractionMode; label: string; icon: string }[] = [
  { value: 'trace', label: 'Trace', icon: 'T' },
  { value: 'xray', label: 'X-Ray', icon: 'X' },
  { value: 'isolation', label: 'Isolate', icon: 'I' },
];

const DIFFICULTIES: { value: DifficultyLevel; label: string; color: string }[] = [
  { value: 'beginner', label: 'Beginner', color: 'var(--success)' },
  { value: 'intermediate', label: 'Intermediate', color: 'var(--warning)' },
  { value: 'advanced', label: 'Advanced', color: 'var(--danger)' },
];

export function TopBar() {
  const sessionName = useStore((s) => s.sessionName);
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);
  const difficulty = useStore((s) => s.difficulty);
  const setDifficulty = useStore((s) => s.setDifficulty);
  const toggleCommandPalette = useStore((s) => s.toggleCommandPalette);
  const startTour = useStore((s) => s.startTour);
  const startQuiz = useStore((s) => s.startQuiz);
  const currentPage = useStore((s) => s.currentPage);
  const viewMode = useStore((s) => s.viewMode);
  const setViewMode = useStore((s) => s.setViewMode);

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        height: 44,
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
      }}
      role="banner"
    >
      {/* Left section - Logo and session */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--accent)',
          }}
        >
          <span style={{ fontSize: 16 }}>-</span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 1,
              color: 'var(--text-primary)',
            }}
          >
            LEXWIRE
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 20,
            background: 'var(--border)',
          }}
        />

        {/* Session name */}
        <span
          style={{
            fontSize: 10,
            color: 'var(--text-muted)',
            maxWidth: 150,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {sessionName}
        </span>

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 20,
            background: 'var(--border)',
          }}
        />

        {/* Model selector */}
        <ModelSelector />
      </div>

      {/* Center section - Mode toggles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {MODES.map((m) => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            style={{
              padding: '4px 10px',
              background: mode === m.value ? 'var(--bg-elevated)' : 'transparent',
              border: `1px solid ${mode === m.value ? 'var(--accent)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-sm)',
              color: mode === m.value ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: 9,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            aria-pressed={mode === m.value}
            aria-label={`${m.label} mode`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Right section - Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Home/Dashboard toggle */}
        <button
          onClick={() => setViewMode(viewMode === 'dashboard' ? 'explore' : 'dashboard')}
          style={{
            padding: '4px 8px',
            background: viewMode === 'dashboard' ? 'var(--accent)' : 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: viewMode === 'dashboard' ? 'var(--bg-base)' : 'var(--text-muted)',
            fontSize: 9,
            cursor: 'pointer',
          }}
          aria-label={viewMode === 'dashboard' ? 'Go to Explorer' : 'Go to Dashboard'}
        >
          {viewMode === 'dashboard' ? 'Explore' : 'Home'}
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

        {/* Difficulty selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              onClick={() => setDifficulty(d.value)}
              style={{
                width: 8,
                height: 8,
                borderRadius: 'var(--radius-full)',
                background: difficulty === d.value ? d.color : 'var(--border)',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
              aria-pressed={difficulty === d.value}
              aria-label={`Set difficulty to ${d.label}`}
              title={d.label}
            />
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 20,
            background: 'var(--border)',
          }}
        />

        {/* Tour button */}
        <button
          onClick={() => startTour(currentPage)}
          style={{
            padding: '4px 8px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-muted)',
            fontSize: 9,
            cursor: 'pointer',
          }}
          aria-label="Start guided tour"
        >
          Tour
        </button>

        {/* Quiz button */}
        <button
          onClick={() => startQuiz(currentPage)}
          style={{
            padding: '4px 8px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-muted)',
            fontSize: 9,
            cursor: 'pointer',
          }}
          aria-label="Start quiz"
        >
          Quiz
        </button>

        {/* Search button */}
        <button
          onClick={toggleCommandPalette}
          style={{
            padding: '4px 12px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-muted)',
            fontSize: 9,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
          aria-label="Open search (Cmd+K)"
        >
          <span>Search</span>
          <kbd
            style={{
              padding: '1px 4px',
              background: 'var(--bg-base)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 2,
              fontSize: 8,
              color: 'var(--text-ghost)',
            }}
          >
            \u2318K
          </kbd>
        </button>
      </div>
    </header>
  );
}
