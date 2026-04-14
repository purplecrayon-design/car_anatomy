import { useVehicleStore } from '@/stores/useVehicleStore';
import { useLayersStore } from '@/stores/useLayersStore';

const LAYER_COLORS: Record<string, string> = {
  'chassis': '#6B7280',
  'engine-mechanical': '#DC2626',
  'engine-wiring': '#F59E0B',
  'full-wiring': '#3B82F6',
  'fuel-system': '#F97316',
  'cooling-system': '#06B6D4',
  'intake-exhaust': '#8B5CF6',
  'suspension-steering': '#10B981',
  'brakes': '#EF4444',
  'body-electrical': '#FBBF24',
  'hvac': '#14B8A6',
  'drivetrain': '#6366F1',
};

export function LayerControls() {
  const { currentVehicle, availableVehicles, setVehicle } = useVehicleStore();
  const {
    activeLayers,
    layerOpacity,
    globalOpacity,
    isolatedLayer,
    toggleLayer,
    setLayerOpacity,
    setGlobalOpacity,
    isolateLayer,
    showAllLayers,
    hideAllLayers,
    resetToDefaults,
  } = useLayersStore();

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <h1 className="text-lg font-light text-gray-900 tracking-tight">
          {currentVehicle.year} {currentVehicle.make}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">{currentVehicle.model}</p>
      </div>

      {/* Vehicle selector */}
      <div className="px-5 py-3 border-b border-gray-100">
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Vehicle
        </label>
        <select
          value={currentVehicle.id}
          onChange={(e) => setVehicle(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        >
          {availableVehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.year} {v.make} {v.model}
            </option>
          ))}
        </select>
      </div>

      {/* Global opacity */}
      <div className="px-5 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Global Opacity
          </label>
          <span className="text-xs text-gray-500">{globalOpacity}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={globalOpacity}
          onChange={(e) => setGlobalOpacity(Number(e.target.value))}
          className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Quick actions */}
      <div className="px-5 py-3 border-b border-gray-100 flex gap-2">
        <button
          onClick={showAllLayers}
          className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Show All
        </button>
        <button
          onClick={hideAllLayers}
          className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Hide All
        </button>
        <button
          onClick={resetToDefaults}
          className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          title="Reset to defaults"
        >
          ↺
        </button>
      </div>

      {/* Layers list */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 py-3">
          <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Layers ({activeLayers.length} active)
          </label>

          <ul className="space-y-1">
            {currentVehicle.layers.map((layer) => {
              const isActive = activeLayers.includes(layer.id);
              const isIsolated = isolatedLayer === layer.id;
              const color = LAYER_COLORS[layer.id] || '#6B7280';
              const opacity = layerOpacity[layer.id] ?? 100;

              return (
                <li key={layer.id}>
                  <div
                    className={`p-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gray-50 border border-gray-200'
                        : 'hover:bg-gray-50'
                    } ${isIsolated ? 'ring-2 ring-blue-500/30' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Color indicator */}
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: isActive ? color : '#D1D5DB',
                        }}
                      />

                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => toggleLayer(layer.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20"
                      />

                      {/* Label */}
                      <button
                        onClick={() => toggleLayer(layer.id)}
                        className="flex-1 text-left"
                      >
                        <span
                          className={`text-sm ${
                            isActive ? 'text-gray-900 font-medium' : 'text-gray-500'
                          }`}
                        >
                          {layer.name}
                        </span>
                        {layer.shared && (
                          <span className="ml-2 text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">
                            SHARED
                          </span>
                        )}
                      </button>

                      {/* Isolate button */}
                      <button
                        onClick={() => isolateLayer(isIsolated ? null : layer.id)}
                        className={`p-1 rounded ${
                          isIsolated
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                        }`}
                        title={isIsolated ? 'Exit isolation' : 'Isolate layer'}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <circle cx="7" cy="7" r="5" />
                          <circle cx="7" cy="7" r="2" fill="currentColor" />
                        </svg>
                      </button>
                    </div>

                    {/* Opacity slider (when active) */}
                    {isActive && (
                      <div className="mt-2 pl-6 flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={opacity}
                          onChange={(e) =>
                            setLayerOpacity(layer.id, Number(e.target.value))
                          }
                          className="flex-1 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                        />
                        <span className="text-[10px] text-gray-400 w-8 text-right">
                          {opacity}%
                        </span>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Engine info */}
      <div className="p-5 border-t border-gray-100 bg-gray-50">
        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Engine
        </div>
        <div className="text-sm font-medium text-gray-900">
          {currentVehicle.engine.code}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          {currentVehicle.engine.displacement} {currentVehicle.engine.configuration}
        </div>
      </div>
    </aside>
  );
}
