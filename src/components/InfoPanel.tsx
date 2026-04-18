import { useState } from 'react';
import { useSelectedComponentStore } from '@/stores/useSelectedComponentStore';
import { useNotesStore, type NoteTag, type ComponentStatus } from '@/stores/useNotesStore';
import { useVehicleStore } from '@/stores/useVehicleStore';

const TABS = ['info', 'torque', 'obd', 'notes'] as const;
type TabId = typeof TABS[number];

const STATUS_OPTIONS: { value: ComponentStatus; label: string; color: string }[] = [
  { value: 'untested', label: 'Untested', color: '#64748b' },
  { value: 'ok', label: 'OK', color: '#10b981' },
  { value: 'suspect', label: 'Suspect', color: '#f59e0b' },
  { value: 'failed', label: 'Failed', color: '#ef4444' },
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

// 1MZ-FE Torque specs database
const TORQUE_SPECS: Record<string, { name: string; nm: number; kgfcm: number; ftlbf: number; note?: string }[]> = {
  'cylinder-head': [
    { name: 'Cylinder head bolts (1st pass)', nm: 40, kgfcm: 408, ftlbf: 29 },
    { name: 'Cylinder head bolts (2nd pass)', nm: 0, kgfcm: 0, ftlbf: 0, note: '+90° turn' },
    { name: 'Cylinder head bolts (3rd pass)', nm: 0, kgfcm: 0, ftlbf: 0, note: '+90° turn' },
  ],
  'intake-manifold': [
    { name: 'Intake manifold bolts', nm: 11, kgfcm: 112, ftlbf: 8 },
  ],
  'exhaust-manifold': [
    { name: 'Exhaust manifold nuts', nm: 49, kgfcm: 500, ftlbf: 36 },
  ],
  'spark-plugs': [
    { name: 'Spark plugs', nm: 18, kgfcm: 184, ftlbf: 13 },
  ],
  'oil-pan': [
    { name: 'Oil pan bolts', nm: 9, kgfcm: 92, ftlbf: 7 },
    { name: 'Oil drain plug', nm: 25, kgfcm: 255, ftlbf: 18 },
  ],
  'water-pump': [
    { name: 'Water pump bolts', nm: 10, kgfcm: 102, ftlbf: 7 },
  ],
  'timing-belt': [
    { name: 'Timing belt tensioner', nm: 27, kgfcm: 275, ftlbf: 20 },
    { name: 'Camshaft sprocket bolt', nm: 60, kgfcm: 612, ftlbf: 44 },
    { name: 'Crankshaft pulley bolt', nm: 215, kgfcm: 2193, ftlbf: 159 },
  ],
  'alternator': [
    { name: 'Alternator pivot bolt', nm: 57, kgfcm: 581, ftlbf: 42 },
    { name: 'Alternator adjusting bolt', nm: 18, kgfcm: 184, ftlbf: 13 },
  ],
  'starter-motor': [
    { name: 'Starter mounting bolts', nm: 37, kgfcm: 377, ftlbf: 27 },
  ],
  'front-caliper': [
    { name: 'Caliper mounting bolts', nm: 107, kgfcm: 1091, ftlbf: 79 },
    { name: 'Caliper slide pins', nm: 34, kgfcm: 347, ftlbf: 25 },
  ],
  'rear-caliper': [
    { name: 'Caliper mounting bolts', nm: 34, kgfcm: 347, ftlbf: 25 },
  ],
  'wheel-nuts': [
    { name: 'Wheel lug nuts', nm: 103, kgfcm: 1050, ftlbf: 76 },
  ],
  'transaxle': [
    { name: 'Transaxle drain plug', nm: 49, kgfcm: 500, ftlbf: 36 },
    { name: 'Transaxle case bolts', nm: 25, kgfcm: 255, ftlbf: 18 },
  ],
};

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
      <aside className="w-full md:w-80 bg-slate-900/95 backdrop-blur-xl md:border-l border-slate-800/50 flex flex-col h-full shadow-xl">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800/80 backdrop-blur flex items-center justify-center shadow-lg">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748b"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium">Select a component</p>
            <p className="text-slate-500 text-sm mt-1">
              Click on the diagram to view details
            </p>
          </div>
        </div>
      </aside>
    );
  }

  const notes = getNotesForComponent(selectedComponent.id);
  const status = getComponentStatus(selectedComponent.id);
  const torqueSpecs = TORQUE_SPECS[selectedComponent.id] || [];

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
    <aside className="w-full md:w-80 bg-slate-900/95 backdrop-blur-xl md:border-l border-slate-800/50 flex flex-col h-full overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">
              {selectedComponent.label}
            </h2>
            {selectedComponent.systems && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedComponent.systems.map((sys) => (
                  <span
                    key={sys}
                    className="px-2 py-1 bg-slate-800 rounded text-xs font-medium text-slate-400 uppercase tracking-wide"
                  >
                    {sys.replace('-', ' ')}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={clearSelection}
            className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 4L4 12M4 4l8 8" />
            </svg>
          </button>
        </div>

        {/* Shared Camry banner */}
        {selectedComponent.shared && (
          <div className="mt-3 px-3 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <p className="text-xs text-amber-400 font-medium">
                Also fits 1997 Toyota Camry (1MZ-FE)
              </p>
            </div>
            <p className="text-xs text-amber-500/70 mt-1 pl-6">
              Identical or similar part — consider both when replacing
            </p>
          </div>
        )}
      </div>

      {/* Status selector */}
      <div className="px-5 py-4 border-b border-slate-800">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Component Status
        </label>
        <div className="flex gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setComponentStatus(selectedComponent.id, opt.value)}
              className={`flex-1 px-3 py-3 rounded-2xl text-sm font-semibold transition-all min-h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                status === opt.value
                  ? 'text-white shadow-lg shadow-current/30 scale-[1.02] focus:ring-white/50'
                  : 'text-slate-400 bg-slate-800/80 backdrop-blur hover:bg-slate-700 focus:ring-slate-500'
              }`}
              style={{
                backgroundColor: status === opt.value ? opt.color : undefined,
              }}
              aria-pressed={status === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <nav className="flex border-b border-slate-800">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wide transition-all ${
              activeTab === tab
                ? 'text-emerald-400 border-b-2 border-emerald-400 -mb-px bg-slate-800/50'
                : 'text-slate-500 hover:text-slate-300'
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
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Haynes Manual Reference
                  </label>
                  <div className="p-4 bg-slate-800/80 backdrop-blur rounded-2xl border border-slate-700/50 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-slate-400">
                        {selectedComponent.manual.pdf}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded">
                        Page {selectedComponent.manual.page}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {selectedComponent.manual.excerpt}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6 bg-slate-800/50 rounded-xl text-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" className="mx-auto mb-3">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                <p className="text-sm text-slate-500">No manual data available</p>
              </div>
            )}

            {selectedComponent.wiring && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Wiring Reference
                </label>
                <div className="p-4 bg-slate-800/80 backdrop-blur rounded-2xl border border-slate-700/50 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">
                      {selectedComponent.wiring.pdf}
                    </span>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded">
                      Page {selectedComponent.wiring.page}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Circuit: <span className="text-emerald-400 font-mono">{selectedComponent.wiring.circuit}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'torque' && (
          <div>
            {torqueSpecs.length > 0 ? (
              <div className="space-y-3">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <div className="text-emerald-400 text-sm font-semibold mb-1">1MZ-FE Torque Specs</div>
                  <div className="text-emerald-500/70 text-xs">Official Toyota/Lexus specifications</div>
                </div>
                <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[10px] font-semibold text-slate-500 uppercase bg-slate-800/80">
                        <th className="p-3">Fastener</th>
                        <th className="p-3 text-right">N·m</th>
                        <th className="p-3 text-right">ft·lbf</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {torqueSpecs.map((spec, i) => (
                        <tr key={i} className="hover:bg-slate-700/50 transition-colors">
                          <td className="p-3 text-slate-300">
                            {spec.name}
                            {spec.note && (
                              <span className="block text-[10px] text-emerald-400 mt-0.5 font-medium">
                                {spec.note}
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-white">
                            {spec.nm || '—'}
                          </td>
                          <td className="p-3 text-right font-mono text-slate-400">
                            {spec.ftlbf || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-800/50 rounded-xl text-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" className="mx-auto mb-3">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94"/>
                </svg>
                <p className="text-sm text-slate-500">No torque specs available</p>
                <p className="text-xs text-slate-600 mt-1">Check the Haynes manual</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'obd' && (
          <div>
            {selectedComponent.obd ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Related PIDs
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedComponent.obd.pids.map((pid) => (
                      <code
                        key={pid}
                        className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm font-mono text-emerald-400"
                      >
                        {pid}
                      </code>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Expected Range
                  </label>
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <p className="text-sm text-emerald-400 font-medium">
                      {selectedComponent.obd.expectedRange}
                    </p>
                  </div>
                </div>

                {selectedComponent.obd.redFlags.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Red Flags
                    </label>
                    <ul className="space-y-2">
                      {selectedComponent.obd.redFlags.map((flag, i) => (
                        <li
                          key={i}
                          className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400"
                        >
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 bg-slate-800/50 rounded-xl text-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" className="mx-auto mb-3">
                  <rect x="2" y="6" width="20" height="12" rx="2"/>
                  <path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01"/>
                </svg>
                <p className="text-sm text-slate-500">No OBD data available</p>
              </div>
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
                placeholder="Add a diagnostic note..."
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                rows={3}
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {NOTE_TAGS.map((tag) => (
                  <button
                    key={tag.value}
                    onClick={() => toggleTag(tag.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[32px] ${
                      selectedTags.includes(tag.value)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleAddNote}
                disabled={!noteText.trim()}
                className="mt-3 w-full px-4 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
              >
                Save Note
              </button>
            </div>

            {/* Notes list */}
            {notes.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Notes ({notes.length})
                </label>
                <ul className="space-y-2">
                  {notes.map((note) => (
                    <li
                      key={note.id}
                      className="p-4 bg-slate-800 rounded-xl border border-slate-700"
                    >
                      <p className="text-sm text-slate-300">{note.text}</p>
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {note.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                tag === 'problem'
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-slate-700 text-slate-400'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
                        <span className="text-xs text-slate-500">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => deleteNote(selectedComponent.id, note.id)}
                          className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg font-medium transition-colors min-h-[32px]"
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
