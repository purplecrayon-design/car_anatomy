import { useLayersStore } from '@/stores/useLayersStore';
import { useVehicleStore } from '@/stores/useVehicleStore';

const LAYERS = [
  { id: 'chassis', label: '1. Chassis & Body Structure' },
  { id: 'engine-mechanical', label: '2. Engine Mechanical (1MZ-FE)' },
  { id: 'engine-wiring', label: '3. Engine Bay Wiring' },
  { id: 'full-wiring', label: '4. Full Vehicle Wiring' },
  { id: 'fuel-system', label: '5. Fuel System' },
  { id: 'cooling-system', label: '6. Cooling System' },
  { id: 'intake-exhaust', label: '7. Intake & Exhaust' },
  { id: 'suspension-steering', label: '8. Suspension & Steering' },
  { id: 'brakes', label: '9. Brake System' },
  { id: 'body-electrical', label: '10. Body Electrical' },
  { id: 'hvac', label: '11. HVAC & Climate Control' },
  { id: 'drivetrain', label: '12. Drivetrain & Transmission' },
] as const;

export function LayerControls() {
  const { currentVehicle } = useVehicleStore();

  const {
    activeLayers,
    layerOpacity,
    is3D,
    toggleLayer,
    setOpacity,
    toggleAll,
    isolateLayer,
    toggle3D,
    resetAll,
  } = useLayersStore();

  return (
    <div className="w-72 bg-[#0f172a] border-r border-[#1e2937] h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e2937] flex items-center justify-between">
        <h2 className="text-white font-semibold">Layers</h2>
        <span className="text-emerald-400 text-xs font-mono">{currentVehicle.name}</span>
      </div>

      {/* 3D Z-Axis Toggle */}
      <div className="px-4 py-3 border-b border-[#1e2937]">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={is3D}
            onChange={toggle3D}
            className="w-5 h-5 accent-emerald-500"
          />
          <span className="text-white text-sm">3D Z-Axis View</span>
        </label>
        <p className="text-xs text-gray-400 mt-1">Enables full perspective rotation on all layers</p>
      </div>

      {/* Global Controls */}
      <div className="px-4 py-3 border-b border-[#1e2937] flex gap-2">
        <button
          onClick={() => toggleAll(true)}
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-sm py-2 rounded-lg font-medium"
        >
          All On
        </button>
        <button
          onClick={() => toggleAll(false)}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-sm py-2 rounded-lg font-medium"
        >
          All Off
        </button>
        <button
          onClick={resetAll}
          className="px-4 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg"
        >
          Reset
        </button>
      </div>

      {/* Global Opacity */}
      <div className="px-4 py-3 border-b border-[#1e2937]">
        <div className="text-xs text-gray-400 mb-2">Global Opacity</div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={layerOpacity.global ?? 1}
          onChange={(e) => setOpacity(parseFloat(e.target.value))}
          className="w-full accent-emerald-500"
        />
      </div>

      {/* Layer List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {LAYERS.map((layer) => {
          const isActive = activeLayers.includes(layer.id);
          return (
            <div
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-colors ${
                isActive ? 'bg-[#1e2937] text-white' : 'text-gray-400 hover:bg-[#1e2937]'
              }`}
            >
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleLayer(layer.id);
                }}
                className="w-4 h-4 accent-emerald-500"
              />
              <span className="text-sm flex-1">{layer.label}</span>

              {isActive && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    isolateLayer(layer.id);
                  }}
                  className="text-[10px] bg-emerald-900 hover:bg-emerald-800 px-3 py-1 rounded-lg text-emerald-200"
                >
                  Isolate
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 text-xs text-gray-500 border-t border-[#1e2937]">
        12 layers • Fully functional • 3D Z-axis enabled
      </div>
    </div>
  );
}
