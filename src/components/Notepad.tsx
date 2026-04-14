import { useNotesStore } from '@/stores/useNotesStore';
import { useManualStore } from '@/stores/useManualStore';
import { useSelectedComponentStore } from '@/stores/useSelectedComponentStore';

export function Notepad() {
  const { recentComponents, getFlaggedNotes, componentStatuses } = useNotesStore();
  const { getData } = useManualStore();
  const { setSelectedComponent } = useSelectedComponentStore();

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

  return (
    <div className="p-5 space-y-6">
      {/* Status summary */}
      <div>
        <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Component Status Summary
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { key: 'ok', label: 'OK', color: '#10B981' },
            { key: 'suspect', label: 'Suspect', color: '#F59E0B' },
            { key: 'failed', label: 'Failed', color: '#EF4444' },
            { key: 'untested', label: 'Untested', color: '#9CA3AF' },
          ].map((item) => (
            <div
              key={item.key}
              className="p-3 bg-gray-50 rounded-lg text-center"
            >
              <div
                className="text-2xl font-light"
                style={{ color: item.color }}
              >
                {statusCounts[item.key] || 0}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Flagged issues */}
      {flaggedNotes.length > 0 && (
        <div>
          <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Flagged Issues ({flaggedNotes.length})
          </h3>
          <ul className="space-y-2">
            {flaggedNotes.slice(0, 5).map((note) => {
              const data = getData(note.componentId);
              return (
                <li key={note.id}>
                  <button
                    onClick={() => handleComponentClick(note.componentId)}
                    className="w-full p-3 bg-red-50 border border-red-200 rounded-lg text-left hover:bg-red-100 transition-colors"
                  >
                    <div className="text-sm font-medium text-red-800">
                      {data?.label || note.componentId}
                    </div>
                    <div className="text-xs text-red-600 mt-1">
                      {note.text.slice(0, 80)}
                      {note.text.length > 80 ? '...' : ''}
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
          <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Recent Components
          </h3>
          <ul className="space-y-1">
            {recentComponents.slice(0, 10).map((componentId) => {
              const data = getData(componentId);
              const status = componentStatuses[componentId];
              return (
                <li key={componentId}>
                  <button
                    onClick={() => handleComponentClick(componentId)}
                    className="w-full px-3 py-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="text-sm text-gray-700">
                      {data?.label || componentId}
                    </span>
                    {status && status !== 'untested' && (
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            status === 'ok'
                              ? '#10B981'
                              : status === 'suspect'
                              ? '#F59E0B'
                              : '#EF4444',
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
    </div>
  );
}
