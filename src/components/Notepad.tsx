import { useState } from 'react';
import { useNotesStore } from '@/stores/useNotesStore';
import { useManualStore } from '@/stores/useManualStore';
import { useSelectedComponentStore } from '@/stores/useSelectedComponentStore';

export function Notepad() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { recentComponents, getFlaggedNotes, componentStatuses } = useNotesStore();
  const { getData } = useManualStore();
  const { setSelectedComponent, selectedComponent } = useSelectedComponentStore();

  const flaggedNotes = getFlaggedNotes();

  const handleComponentClick = (componentId: string) => {
    const data = getData(componentId);
    setSelectedComponent({
      id: componentId,
      label: data?.label || componentId,
      ...data,
    });
  };

  // Count by status
  const statusCounts = Object.values(componentStatuses).reduce(
    (acc, status) => {
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalTested = (statusCounts['ok'] || 0) + (statusCounts['suspect'] || 0) + (statusCounts['failed'] || 0);

  return (
    <div
      className={`absolute top-6 right-6 transition-all duration-300 ${
        isExpanded ? 'w-80' : 'w-auto'
      }`}
    >
      {/* Collapsed view - just a pill */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-3 px-4 py-2.5 bg-slate-800/95 backdrop-blur border border-slate-700 rounded-full shadow-xl hover:bg-slate-700 hover:border-emerald-500/50 transition-all group"
        >
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" className="group-hover:scale-110 transition-transform">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            <span className="text-sm font-medium text-slate-300">Notepad</span>
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-1.5">
            {statusCounts['ok'] > 0 && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/20 rounded text-[10px] text-emerald-400 font-semibold">
                {statusCounts['ok']} OK
              </div>
            )}
            {statusCounts['suspect'] > 0 && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/20 rounded text-[10px] text-amber-400 font-semibold">
                {statusCounts['suspect']}
              </div>
            )}
            {statusCounts['failed'] > 0 && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-red-500/20 rounded text-[10px] text-red-400 font-semibold">
                {statusCounts['failed']}
              </div>
            )}
            {flaggedNotes.length > 0 && (
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </div>
        </button>
      )}

      {/* Expanded view */}
      {isExpanded && (
        <div className="bg-slate-800/95 backdrop-blur border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
              <span className="text-sm font-semibold text-white">Diagnostic Notepad</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="4 14 10 14 10 20"/>
                <polyline points="20 10 14 10 14 4"/>
                <line x1="14" y1="10" x2="21" y2="3"/>
                <line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
            </button>
          </div>

          <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Status summary */}
            <div>
              <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Component Status
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: 'ok', label: 'OK', color: '#10b981', bgColor: 'bg-emerald-500/10' },
                  { key: 'suspect', label: 'Suspect', color: '#f59e0b', bgColor: 'bg-amber-500/10' },
                  { key: 'failed', label: 'Failed', color: '#ef4444', bgColor: 'bg-red-500/10' },
                  { key: 'untested', label: 'Untested', color: '#64748b', bgColor: 'bg-slate-700' },
                ].map((item) => (
                  <div
                    key={item.key}
                    className={`p-2.5 ${item.bgColor} rounded-xl text-center border border-slate-700/50`}
                  >
                    <div
                      className="text-xl font-bold"
                      style={{ color: item.color }}
                    >
                      {statusCounts[item.key] || 0}
                    </div>
                    <div className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wide">{item.label}</div>
                  </div>
                ))}
              </div>
              {totalTested > 0 && (
                <div className="mt-2 text-[10px] text-slate-500 text-center">
                  {totalTested} of {totalTested + (statusCounts['untested'] || 0)} components tested
                </div>
              )}
            </div>

            {/* Flagged issues */}
            {flaggedNotes.length > 0 && (
              <div>
                <h3 className="text-[10px] font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Flagged Issues ({flaggedNotes.length})
                </h3>
                <ul className="space-y-2">
                  {flaggedNotes.slice(0, 3).map((note) => {
                    const data = getData(note.componentId);
                    return (
                      <li key={note.id}>
                        <button
                          onClick={() => handleComponentClick(note.componentId)}
                          className="w-full p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-left hover:bg-red-500/20 transition-all active:scale-[0.98]"
                        >
                          <div className="text-sm font-medium text-red-300">
                            {data?.label || note.componentId}
                          </div>
                          <div className="text-xs text-red-400/70 mt-1 line-clamp-2">
                            {note.text}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Recent components */}
            {recentComponents.length > 0 && (
              <div>
                <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Recently Viewed
                </h3>
                <ul className="space-y-1">
                  {recentComponents.slice(0, 6).map((componentId) => {
                    const data = getData(componentId);
                    const status = componentStatuses[componentId];
                    const isSelected = selectedComponent?.id === componentId;
                    return (
                      <li key={componentId}>
                        <button
                          onClick={() => handleComponentClick(componentId)}
                          className={`w-full px-3 py-2 flex items-center justify-between rounded-lg transition-all active:scale-[0.98] ${
                            isSelected
                              ? 'bg-emerald-500/20 border border-emerald-500/30'
                              : 'bg-slate-700/50 hover:bg-slate-700 border border-transparent'
                          }`}
                        >
                          <span className={`text-sm ${isSelected ? 'text-emerald-300' : 'text-slate-300'}`}>
                            {data?.label || componentId}
                          </span>
                          {status && status !== 'untested' && (
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor:
                                  status === 'ok'
                                    ? '#10b981'
                                    : status === 'suspect'
                                    ? '#f59e0b'
                                    : '#ef4444',
                              }}
                            />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Empty state */}
            {recentComponents.length === 0 && flaggedNotes.length === 0 && (
              <div className="py-8 text-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" className="mx-auto mb-3">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <p className="text-sm text-slate-500">No components viewed yet</p>
                <p className="text-xs text-slate-600 mt-1">Click on the diagram to start</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
