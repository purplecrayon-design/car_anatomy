import { useState } from 'react';
import { useLayersStore } from '@/stores/useLayersStore';
import { useVehicleStore } from '@/stores/useVehicleStore';

const LAYERS = [
  { id: 'chassis', label: '1. Chassis & Body' },
  { id: 'engine-mechanical', label: '2. Engine (1MZ-FE)' },
  { id: 'engine-wiring', label: '3. Engine Wiring' },
  { id: 'full-wiring', label: '4. Full Wiring' },
  { id: 'fuel-system', label: '5. Fuel System' },
  { id: 'cooling-system', label: '6. Cooling System' },
  { id: 'intake-exhaust', label: '7. Intake & Exhaust' },
  { id: 'suspension-steering', label: '8. Suspension & Steering' },
  { id: 'brakes', label: '9. Brakes' },
  { id: 'body-electrical', label: '10. Body Electrical' },
  { id: 'hvac', label: '11. HVAC' },
  { id: 'drivetrain', label: '12. Drivetrain' },
] as const;

export function LayerControls() {
  const { currentVehicle, availableVehicles, setVehicle } = useVehicleStore();
  const [vehicleOpen, setVehicleOpen] = useState(false);

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
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#0f172a',
        borderRight: '1px solid #1e293b',
        overflow: 'hidden',
      }}
    >
      {/* Vehicle Selector */}
      <div style={{ padding: 16, borderBottom: '1px solid #1e293b' }}>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setVehicleOpen(!vehicleOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 12,
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'rgba(16,185,129,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#10b981', fontSize: 12, fontWeight: 700,
              }}>
                {currentVehicle.year.toString().slice(-2)}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>
                  {currentVehicle.make} {currentVehicle.model}
                </div>
                <div style={{ color: '#64748b', fontSize: 11 }}>
                  {currentVehicle.engine.code}
                </div>
              </div>
            </div>
            <span style={{ color: '#64748b', transform: vehicleOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
          </button>

          {vehicleOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0, right: 0,
              marginTop: 8,
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 12,
              overflow: 'hidden',
              zIndex: 100,
            }}>
              {availableVehicles.map((v) => (
                <button
                  key={v.id}
                  onClick={() => { setVehicle(v.id); setVehicleOpen(false); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    background: v.id === currentVehicle.id ? 'rgba(16,185,129,0.1)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 6,
                    background: v.id === currentVehicle.id ? 'rgba(16,185,129,0.3)' : '#334155',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: v.id === currentVehicle.id ? '#10b981' : '#94a3b8',
                    fontSize: 11, fontWeight: 700,
                  }}>
                    {v.year.toString().slice(-2)}
                  </div>
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <div style={{ color: v.id === currentVehicle.id ? '#10b981' : '#fff', fontSize: 13 }}>
                      {v.make} {v.model}
                    </div>
                    <div style={{ color: '#64748b', fontSize: 11 }}>{v.engine.code}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>Layers</span>
        <span style={{ color: '#10b981', fontSize: 12, fontFamily: 'monospace' }}>
          {activeLayers.length}/12
        </span>
      </div>

      {/* 3D Toggle */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e293b' }}>
        <button
          onClick={toggle3D}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            background: is3D ? 'rgba(16,185,129,0.15)' : '#1e293b',
            border: is3D ? '1px solid rgba(16,185,129,0.4)' : '1px solid #334155',
            borderRadius: 12,
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: is3D ? 'rgba(16,185,129,0.3)' : '#334155',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: is3D ? '#10b981' : '#64748b' }}>3D</span>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: is3D ? '#10b981' : '#fff', fontSize: 13, fontWeight: 500 }}>
                3D Z-Axis View
              </div>
              <div style={{ color: '#64748b', fontSize: 11 }}>Perspective mode</div>
            </div>
          </div>
          <div style={{
            width: 40, height: 22, borderRadius: 11,
            background: is3D ? '#10b981' : '#334155',
            position: 'relative',
            transition: 'background 0.2s',
          }}>
            <div style={{
              position: 'absolute',
              top: 3, left: is3D ? 21 : 3,
              width: 16, height: 16, borderRadius: 8,
              background: '#fff',
              transition: 'left 0.2s',
            }} />
          </div>
        </button>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e293b', display: 'flex', gap: 8 }}>
        <button
          onClick={() => toggleAll(true)}
          style={{
            flex: 1, padding: '10px 0', borderRadius: 10,
            background: '#059669', border: 'none',
            color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
        >All On</button>
        <button
          onClick={() => toggleAll(false)}
          style={{
            flex: 1, padding: '10px 0', borderRadius: 10,
            background: '#334155', border: 'none',
            color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
        >All Off</button>
        <button
          onClick={resetAll}
          style={{
            padding: '10px 14px', borderRadius: 10,
            background: '#1e293b', border: '1px solid #334155',
            color: '#94a3b8', fontSize: 14, cursor: 'pointer',
          }}
        >⟲</button>
      </div>

      {/* Opacity Slider */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: '#64748b', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1 }}>
            Opacity
          </span>
          <span style={{ color: '#10b981', fontSize: 12, fontFamily: 'monospace' }}>{globalOpacity}%</span>
        </div>
        <input
          type="range"
          min={0} max={100} step={1}
          value={globalOpacity}
          onChange={(e) => setGlobalOpacity(Number(e.target.value))}
          style={{
            width: '100%',
            height: 6,
            borderRadius: 3,
            appearance: 'none',
            background: `linear-gradient(to right, #10b981 0%, #10b981 ${globalOpacity}%, #334155 ${globalOpacity}%, #334155 100%)`,
            cursor: 'pointer',
          }}
        />
      </div>

      {/* Layer List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
        {LAYERS.map((layer) => {
          const active = activeLayers.includes(layer.id);
          return (
            <div
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                marginBottom: 4,
                borderRadius: 10,
                background: active ? 'rgba(30,41,59,0.8)' : 'transparent',
                border: active ? '1px solid #334155' : '1px solid transparent',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 5,
                background: active ? '#10b981' : '#334155',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {active && <span style={{ color: '#fff', fontSize: 12 }}>✓</span>}
              </div>
              <span style={{
                flex: 1,
                color: active ? '#fff' : '#94a3b8',
                fontSize: 13,
                fontWeight: active ? 500 : 400,
              }}>{layer.label}</span>
              {active && (
                <button
                  onClick={(e) => { e.stopPropagation(); isolateLayer(layer.id); }}
                  style={{
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: 'rgba(16,185,129,0.2)',
                    border: 'none',
                    color: '#10b981',
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >Solo</button>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ color: '#64748b', fontSize: 11 }}>Car Anatomy v3</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            width: 6, height: 6, borderRadius: 3,
            background: '#10b981',
            animation: 'pulse 2s infinite',
          }} />
          <span style={{ color: '#10b981', fontSize: 11 }}>Ready</span>
        </div>
      </div>
    </div>
  );
}
