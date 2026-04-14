import { useState, useCallback, useEffect } from 'react';
import { useStore } from '@/store';
import { db } from '@/db/database';
import type { DiagnosticSession, SessionExport } from '@/types/session';
import { toast } from '@/components/shared/Toast';
import { ExportButton } from '@/components/shared/ExportButton';
import { ImportButton } from '@/components/shared/ImportButton';
import { ShareButton } from '@/components/shared/ShareButton';

export function SessionManager() {
  const [sessions, setSessions] = useState<DiagnosticSession[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const activeSessionId = useStore((s) => s.activeSessionId);
  const sessionName = useStore((s) => s.sessionName);
  const setActiveSession = useStore((s) => s.setActiveSession);
  const setSessionName = useStore((s) => s.setSessionName);
  const resetAllStatuses = useStore((s) => s.resetAllStatuses);

  // Load sessions from IndexedDB
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const allSessions = await db.sessions.orderBy('updatedAt').reverse().toArray();
        setSessions(allSessions);
      } catch (e) {
        console.error('Failed to load sessions:', e);
      }
    };
    loadSessions();
  }, [activeSessionId]);

  const handleCreate = useCallback(async () => {
    if (!newName.trim()) return;

    try {
      const session: Omit<DiagnosticSession, 'id'> = {
        name: newName.trim(),
        vehicleId: 'es300-1997',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const id = await db.sessions.add(session as DiagnosticSession);
      setActiveSession(String(id), newName.trim());
      resetAllStatuses();
      setIsCreating(false);
      setNewName('');
      toast.success(`Created session: ${newName.trim()}`);

      // Reload sessions
      const allSessions = await db.sessions.orderBy('updatedAt').reverse().toArray();
      setSessions(allSessions);
    } catch (e) {
      console.error('Failed to create session:', e);
      toast.error('Failed to create session');
    }
  }, [newName, setActiveSession, resetAllStatuses]);

  const handleSelect = useCallback(
    async (session: DiagnosticSession) => {
      setActiveSession(String(session.id), session.name);
      toast.info(`Switched to: ${session.name}`);

      // Update session timestamp
      await db.sessions.update(session.id!, { updatedAt: Date.now() });
    },
    [setActiveSession]
  );

  const handleDelete = useCallback(
    async (session: DiagnosticSession, e: React.MouseEvent) => {
      e.stopPropagation();

      if (String(session.id) === activeSessionId) {
        toast.error("Can't delete active session");
        return;
      }

      try {
        // Delete session and related data
        await db.sessions.delete(session.id!);
        await db.componentStatuses.where('sessionId').equals(String(session.id)).delete();
        await db.voltageReadings.where('sessionId').equals(String(session.id)).delete();
        await db.annotations.where('sessionId').equals(String(session.id)).delete();

        toast.success(`Deleted: ${session.name}`);

        // Reload sessions
        const allSessions = await db.sessions.orderBy('updatedAt').reverse().toArray();
        setSessions(allSessions);
      } catch (e) {
        console.error('Failed to delete session:', e);
        toast.error('Failed to delete session');
      }
    },
    [activeSessionId]
  );

  const handleRename = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSessionName(e.target.value);
    },
    [setSessionName]
  );

  const handleImport = useCallback(
    async (data: SessionExport) => {
      try {
        // Create new session from imported data
        const session: Omit<DiagnosticSession, 'id'> = {
          name: data.session.name + ' (Imported)',
          vehicleId: data.session.vehicleId,
          symptom: data.session.symptom,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        const id = await db.sessions.add(session as DiagnosticSession);
        setActiveSession(String(id), session.name);

        // Import component statuses
        if (data.statuses) {
          for (const [componentId, status] of Object.entries(data.statuses)) {
            await db.componentStatuses.add({
              sessionId: String(id),
              componentId,
              status: status as 'untested' | 'testing' | 'good' | 'suspected' | 'bad',
              updatedAt: Date.now(),
            });
          }
        }

        toast.success(`Imported session: ${session.name}`);

        // Reload sessions
        const allSessions = await db.sessions.orderBy('updatedAt').reverse().toArray();
        setSessions(allSessions);
      } catch (e) {
        console.error('Failed to import session:', e);
        toast.error('Failed to import session');
      }
    },
    [setActiveSession]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Current session */}
      <div
        style={{
          padding: 12,
          background: 'var(--bg-elevated)',
          border: '1px solid var(--accent)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <label
          style={{
            display: 'block',
            fontSize: 8,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 4,
          }}
        >
          Current Session
        </label>
        <input
          type="text"
          value={sessionName}
          onChange={handleRename}
          style={{
            width: '100%',
            padding: '6px 8px',
            background: 'var(--bg-base)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            outline: 'none',
          }}
          aria-label="Session name"
        />

        {/* Export/Import/Share buttons */}
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          <ExportButton variant="full" />
          <ImportButton variant="full" onImport={handleImport} />
          <ShareButton variant="full" />
        </div>
      </div>

      {/* New session button */}
      {!isCreating ? (
        <button
          onClick={() => setIsCreating(true)}
          style={{
            padding: '8px 12px',
            background: 'transparent',
            border: '1px dashed var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-muted)',
            fontSize: 10,
            cursor: 'pointer',
            width: '100%',
          }}
        >
          + New Session
        </button>
      ) : (
        <div
          style={{
            padding: 12,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="Session name..."
            autoFocus
            style={{
              width: '100%',
              padding: '6px 8px',
              background: 'var(--bg-base)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              outline: 'none',
              marginBottom: 8,
            }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                setIsCreating(false);
                setNewName('');
              }}
              style={{
                flex: 1,
                padding: '6px 8px',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-muted)',
                fontSize: 10,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!newName.trim()}
              style={{
                flex: 1,
                padding: '6px 8px',
                background: newName.trim() ? 'var(--accent)' : 'var(--bg-base)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: newName.trim() ? 'var(--bg-base)' : 'var(--text-muted)',
                fontSize: 10,
                fontWeight: 600,
                cursor: newName.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* Sessions list */}
      {sessions.length > 0 && (
        <div>
          <h3
            style={{
              fontSize: 8,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            Recent Sessions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {sessions.slice(0, 5).map((session) => {
              const isActive = String(session.id) === activeSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => !isActive && handleSelect(session)}
                  style={{
                    padding: '8px 10px',
                    background: isActive ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                    border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-sm)',
                    cursor: isActive ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    opacity: isActive ? 1 : 0.8,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontWeight: isActive ? 500 : 400,
                      }}
                    >
                      {session.name}
                    </div>
                    <div style={{ fontSize: 8, color: 'var(--text-ghost)' }}>
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  {!isActive && (
                    <button
                      onClick={(e) => handleDelete(session, e)}
                      style={{
                        padding: 4,
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-ghost)',
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                      aria-label={`Delete ${session.name}`}
                    >
                      \u2715
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
