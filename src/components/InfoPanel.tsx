import { useState } from 'react';
import { useSelectedComponentStore } from '@/stores/useSelectedComponentStore';
import { useNotesStore, type NoteTag, type ComponentStatus } from '@/stores/useNotesStore';
import { useVehicleStore } from '@/stores/useVehicleStore';

const TABS = ['info', 'torque', 'obd', 'notes'] as const;
type TabId = typeof TABS[number];

const STATUS_OPTIONS: { value: ComponentStatus; label: string; color: string }[] = [
  { value: 'untested', label: 'Untested', color: '#9CA3AF' },
  { value: 'ok', label: 'OK', color: '#10B981' },
  { value: 'suspect', label: 'Suspect', color: '#F59E0B' },
  { value: 'failed', label: 'Failed', color: '#EF4444' },
];

const NOTE_TAGS: { value: NoteTag; label: string }[] = [
  { value: 'diagnostic', label: 'Diagnostic' },
  { value: 'repair', label: 'Repair' },
  { value: 'torque', label: 'Torque' },
  { value: 'obd', label: 'OBD' },
  { value: 'wiring', label: 'Wiring' },
  { value: 'problem', label: 'Problem' },
  { value: 'tip', label: 'Tip' },
];

export function InfoPanel() {
  const [activeTab, setActiveTab] = useState<TabId>('info');
  const [noteText, setNoteText] = useState('');
  const [selectedTags, setSelectedTags] = useState<NoteTag[]>([]);

  const { selectedComponent, clearSelection } = useSelectedComponentStore();
  const { currentVehicle } = useVehicleStore();
  const {
    addNote,
    deleteNote,
    getNotesForComponent,
    setComponentStatus,
    getComponentStatus,
  } = useNotesStore();

  if (!selectedComponent) {
    return (
      <aside className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">Select a component</p>
            <p className="text-xs text-gray-400 mt-1">
              Click on the diagram to view details
            </p>
          </div>
        </div>
      </aside>
    );
  }

  const notes = getNotesForComponent(selectedComponent.id);
  const status = getComponentStatus(selectedComponent.id);

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addNote(selectedComponent.id, currentVehicle.id, noteText.trim(), selectedTags);
    setNoteText('');
    setSelectedTags([]);
  };

  const toggleTag = (tag: NoteTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <aside className="w-80 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              {selectedComponent.label}
            </h2>
            {selectedComponent.systems && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedComponent.systems.map((sys) => (
                  <span
                    key={sys}
                    className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-medium text-gray-600 uppercase"
                  >
                    {sys.replace('-', ' ')}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={clearSelection}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 4L4 12M4 4l8 8" />
            </svg>
          </button>
        </div>

        {/* Shared badge */}
        {selectedComponent.shared && (
          <div className="mt-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800">
              Shared with 1997 Toyota Camry (1MZ-FE)
            </p>
          </div>
        )}
      </div>

      {/* Status selector */}
      <div className="px-5 py-3 border-b border-gray-100">
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Status
        </label>
        <div className="flex gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setComponentStatus(selectedComponent.id, opt.value)}
              className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                status === opt.value
                  ? 'text-white shadow-sm'
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: status === opt.value ? opt.color : undefined,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <nav className="flex border-b border-gray-100">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-3 text-xs font-medium uppercase tracking-wide transition-colors ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-px'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === 'info' && (
          <div className="space-y-4">
            {selectedComponent.manual ? (
              <>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Manual Reference
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">
                        {selectedComponent.manual.pdf}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        Page {selectedComponent.manual.page}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {selectedComponent.manual.excerpt}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">
                No manual data available
              </p>
            )}

            {selectedComponent.wiring && (
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Wiring Reference
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">
                      {selectedComponent.wiring.pdf}
                    </span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                      Page {selectedComponent.wiring.page}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    Circuit: {selectedComponent.wiring.circuit}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'torque' && (
          <div>
            {selectedComponent.torque && selectedComponent.torque.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] font-semibold text-gray-400 uppercase">
                    <th className="pb-2">Fastener</th>
                    <th className="pb-2 text-right">N·m</th>
                    <th className="pb-2 text-right">ft·lbf</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedComponent.torque.map((spec, i) => (
                    <tr key={i}>
                      <td className="py-2 text-gray-700">
                        {spec.name}
                        {spec.note && (
                          <span className="block text-[10px] text-blue-600 mt-0.5">
                            {spec.note}
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-right font-medium text-gray-900">
                        {spec.nm || '—'}
                      </td>
                      <td className="py-2 text-right text-gray-600">
                        {spec.ftlbf || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">
                No torque specs available
              </p>
            )}
          </div>
        )}

        {activeTab === 'obd' && (
          <div>
            {selectedComponent.obd ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Related PIDs
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedComponent.obd.pids.map((pid) => (
                      <code
                        key={pid}
                        className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-blue-600"
                      >
                        {pid}
                      </code>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Expected Range
                  </label>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">
                      {selectedComponent.obd.expectedRange}
                    </p>
                  </div>
                </div>

                {selectedComponent.obd.redFlags.length > 0 && (
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Red Flags
                    </label>
                    <ul className="space-y-2">
                      {selectedComponent.obd.redFlags.map((flag, i) => (
                        <li
                          key={i}
                          className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800"
                        >
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">
                No OBD data available
              </p>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4">
            {/* Add note */}
            <div>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                rows={3}
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {NOTE_TAGS.map((tag) => (
                  <button
                    key={tag.value}
                    onClick={() => toggleTag(tag.value)}
                    className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                      selectedTags.includes(tag.value)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleAddNote}
                disabled={!noteText.trim()}
                className="mt-3 w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Note
              </button>
            </div>

            {/* Notes list */}
            {notes.length > 0 && (
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Notes ({notes.length})
                </label>
                <ul className="space-y-2">
                  {notes.map((note) => (
                    <li
                      key={note.id}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <p className="text-sm text-gray-700">{note.text}</p>
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {note.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${
                                tag === 'problem'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-gray-400">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => deleteNote(selectedComponent.id, note.id)}
                          className="text-[10px] text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
