import { useState } from 'react';
import { useStore } from '@/store';
import { StatusSelector } from '../notepad/StatusSelector';
import type { NoteTag } from '@/store/notesSlice';

const TAGS: { id: NoteTag; label: string; color: string }[] = [
  { id: 'diagnostic', label: 'Diagnostic', color: 'var(--accent)' },
  { id: 'concept', label: 'Concept', color: 'var(--success)' },
  { id: 'torque', label: 'Torque', color: 'var(--warning)' },
  { id: 'obd', label: 'OBD', color: '#9b59b6' },
  { id: 'problem', label: 'Problem', color: 'var(--danger)' },
];

interface Props {
  componentId: string;
  componentLabel: string;
}

export function NotesTab({ componentId, componentLabel }: Props) {
  const [noteText, setNoteText] = useState('');
  const [selectedTags, setSelectedTags] = useState<NoteTag[]>([]);

  const currentVehicle = useStore((s) => s.currentVehicle);
  const statuses = useStore((s) => s.componentStatuses);
  const setComponentStatus = useStore((s) => s.setComponentStatus);
  const addNote = useStore((s) => s.addNote);
  const deleteNote = useStore((s) => s.deleteNote);
  const getNotesForComponent = useStore((s) => s.getNotesForComponent);

  const notes = getNotesForComponent(componentId);

  const toggleTag = (tag: NoteTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (!noteText.trim()) return;
    addNote(componentId, currentVehicle, noteText.trim(), selectedTags);
    setNoteText('');
    setSelectedTags([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Status selector */}
      <StatusSelector
        componentId={componentId}
        componentLabel={componentLabel}
        status={statuses[componentId] || 'untested'}
        onStatusChange={setComponentStatus}
      />

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border-subtle)' }} />

      {/* Add note */}
      <div>
        <h4
          style={{
            fontSize: 8,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          Add Note
        </h4>

        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a note about this component..."
          style={{
            width: '100%',
            minHeight: 60,
            padding: 10,
            background: 'var(--bg-base)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            fontSize: 10,
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />

        {/* Tag selector */}
        <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
          {TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);
            return (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                style={{
                  padding: '3px 8px',
                  background: isSelected ? tag.color : 'var(--bg-elevated)',
                  border: `1px solid ${isSelected ? tag.color : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-sm)',
                  color: isSelected ? 'var(--bg-base)' : 'var(--text-muted)',
                  fontSize: 8,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tag.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!noteText.trim()}
          style={{
            marginTop: 10,
            padding: '6px 12px',
            background: noteText.trim() ? 'var(--accent)' : 'var(--bg-elevated)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            color: noteText.trim() ? 'var(--bg-base)' : 'var(--text-ghost)',
            fontSize: 9,
            fontWeight: 500,
            cursor: noteText.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          Save Note
        </button>
      </div>

      {/* Notes list */}
      {notes.length > 0 && (
        <div>
          <h4
            style={{
              fontSize: 8,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            Notes ({notes.length})
          </h4>

          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {notes.map((note) => (
              <li
                key={note.id}
                style={{
                  padding: 10,
                  background: 'var(--bg-base)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <p style={{ fontSize: 10, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5, flex: 1 }}>
                    {note.text}
                  </p>
                  <button
                    onClick={() => deleteNote(componentId, note.id)}
                    style={{
                      padding: '2px 6px',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-ghost)',
                      fontSize: 10,
                      cursor: 'pointer',
                    }}
                    aria-label="Delete note"
                  >
                    ×
                  </button>
                </div>

                {note.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                    {note.tags.map((tagId) => {
                      const tag = TAGS.find((t) => t.id === tagId);
                      return (
                        <span
                          key={tagId}
                          style={{
                            padding: '1px 5px',
                            background: tag?.color || 'var(--bg-elevated)',
                            borderRadius: 2,
                            fontSize: 7,
                            color: 'var(--bg-base)',
                            fontWeight: 500,
                          }}
                        >
                          {tag?.label || tagId}
                        </span>
                      );
                    })}
                  </div>
                )}

                <div style={{ fontSize: 8, color: 'var(--text-ghost)', marginTop: 6 }}>
                  {new Date(note.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
