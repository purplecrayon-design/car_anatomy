import { useState } from 'react';
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
  const { currentVehicle, availableVehicles, setVehicle } = useVehicleStore();
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);

  const {
    activeLayers,
    globalOpacity,
    is3D,
    toggleLayer,
    setGlobalOpacity,
    toggleAll,
    isolateLayer,
    toggle3D,
    resetAll,
  } = useLayersStore();

  return (
    <div className="w-full md:w-80 bg-slate-900/95 backdrop-blur-xl md:border-r border-slate-800/50 h-full flex flex-col overflow-hidden shadow-xl">
      {/* Vehicle Selector */}
      <div className="px-4 py-4 border-b border-slate-800">
        <div className="relative">
          <button
            onClick={() => setIsVehicleDropdownOpen(!isVehicleDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-800/80 backdrop-blur border border-slate-700/50 rounded-2xl hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <span className="text-emerald-400 text-xs font-bold">
                  {currentVehicle.year.toString().slice(-2)}
                </span>
              </div>
              <div className="text-left">
                <div className="text-white text-sm font-medium">{currentVehicle.make} {currentVehicle.model}</div>
                <div className="text-slate-500 text-xs">{currentVehicle.engine.code}</div>
              </div>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
              className={`transition-transform ${isVehicleDropdownOpen ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {/* Dropdown */}
          {isVehicleDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden z-50">
              {availableVehicles.map((vehicle) => (
                <button
                  key={vehicle.id}
                  onClick={() => {
                    setVehicle(vehicle.id);
                    setIsVehicleDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700 transition-colors ${
                    vehicle.id === currentVehicle.id ? 'bg-emerald-500/10' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    vehicle.id === currentVehicle.id ? 'bg-emerald-500/30' : 'bg-slate-700'
                  }`}>
                    <span className={`text-xs font-bold ${
                      vehicle.id === currentVehicle.id ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      {vehicle.year.toString().slice(-2)}
                    </span>
                  </div>
                  <div className="text-left flex-1">
                    <div className={`text-sm font-medium ${
                      vehicle.id === currentVehicle.id ? 'text-emerald-400' : 'text-white'
                    }`}>
                      {vehicle.make} {vehicle.model}
                    </div>
                    <div className="text-slate-500 text-xs">{vehicle.engine.code}</div>
                  </div>
                  {vehicle.id === currentVehicle.id && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-white font-semibold">Layers</h2>
        <span className="text-emerald-400 text-xs font-mono">{activeLayers.length}/12</span>
      </div>

      {/* 3D Z-Axis Toggle */}
      <div className="px-4 py-3 border-b border-slate-800">
        <button
          onClick={toggle3D}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl transition-all ${
            is3D
              ? 'bg-emerald-500/20 border border-emerald-500/50 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-800/80 backdrop-blur border border-slate-700/50 hover:border-slate-600 hover:shadow-md'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              is3D ? 'bg-emerald-500/30' : 'bg-slate-700'
            }`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={is3D ? '#10b981' : '#64748b'} strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="text-left">
              <div className={`text-sm font-medium ${is3D ? 'text-emerald-400' : 'text-white'}`}>
                3D Z-Axis View
              </div>
              <div className="text-xs text-slate-500">Perspective rotation</div>
            </div>
          </div>
          <div className={`w-10 h-6 rounded-full transition-all relative ${
            is3D ? 'bg-emerald-500' : 'bg-slate-700'
          }`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
              is3D ? 'left-5' : 'left-1'
            }`} />
          </div>
        </button>
      </div>

      {/* Global Controls */}
      <div className="px-4 py-3 border-b border-slate-800 flex gap-2">
        <button
          onClick={() => toggleAll(true)}
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-sm py-2.5 rounded-2xl font-semibold active:scale-95 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/40 transition-all"
        >
          All On
        </button>
        <button
          onClick={() => toggleAll(false)}
          className="flex-1 bg-slate-700/80 backdrop-blur hover:bg-slate-600 text-white text-sm py-2.5 rounded-2xl font-semibold active:scale-95 transition-all"
        >
          All Off
        </button>
        <button
          onClick={resetAll}
          className="px-3 bg-slate-800/80 backdrop-blur hover:bg-slate-700 text-slate-400 hover:text-white text-sm rounded-2xl active:scale-95 transition-all"
          title="Reset to defaults"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
        </button>
      </div>

      {/* Global Opacity */}
      <div className="px-4 py-3 border-b border-slate-800">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-slate-500 font-medium uppercase tracking-wide">Opacity</span>
          <span className="text-emerald-400 font-mono">{globalOpacity}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={globalOpacity}
          onChange={(e) => setGlobalOpacity(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-emerald-500"
          style={{
            background: `linear-gradient(to right, #10b981 0%, #10b981 ${globalOpacity}%, #334155 ${globalOpacity}%, #334155 100%)`
          }}
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
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-2xl cursor-pointer transition-all ${
                isActive
                  ? 'bg-slate-800/80 backdrop-blur border border-slate-700/50 shadow-sm'
                  : 'hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              {/* Checkbox */}
              <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-emerald-500'
                  : 'bg-slate-700 group-hover:bg-slate-600'
              }`}>
                {isActive && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>

              {/* Label */}
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-medium block truncate ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`}>
                  {layer.label}
                </span>
              </div>

              {/* Isolate button */}
              {isActive && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    isolateLayer(layer.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-[10px] bg-emerald-500/20 hover:bg-emerald-500 px-2.5 py-1 rounded-lg text-emerald-400 hover:text-white font-semibold transition-all"
                >
                  Solo
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Car Anatomy v3.0</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400">{is3D ? '3D Active' : 'Ready'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
