import { useStore } from '@/store';
import { ANATOMY_LAYERS } from '@/types/anatomy';
import { OpacitySlider } from './OpacitySlider';

export function LayerPanel() {
  const layers = useStore((s) => s.layers);
  const solo = useStore((s) => s.soloLayer);
  const globalOpacity = useStore((s) => s.globalOpacity);
  const setVis = useStore((s) => s.setLayerVisibility);
  const setSolo = useStore((s) => s.setSoloLayer);
  const showAll = useStore((s) => s.showAllLayers);
  const hideAll = useStore((s) => s.hideAllLayers);
  const setGlobalOpacity = useStore((s) => s.setGlobalOpacity);

  const handleToggle = (key: string) => {
    if (solo) {
      setSolo(null);
      return;
    }
    setVis(key, !layers[key]?.visible);
  };

  const handleSolo = (key: string) => {
    setSolo(solo === key ? null : key);
  };

  const handleKeyDown = (e: React.KeyboardEvent, key: string, action: 'toggle' | 'solo') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (action === 'toggle') {
        handleToggle(key);
      } else {
        handleSolo(key);
      }
    }
  };

  return (
    <section aria-labelledby="layers-heading">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2px 6px',
          marginBottom: 4,
        }}
      >
        <h2
          id="layers-heading"
          style={{
            color: 'var(--text-muted)',
            fontSize: 7.5,
            textTransform: 'uppercase',
            letterSpacing: 2,
            fontWeight: 400,
            margin: 0,
          }}
        >
          Layers
        </h2>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={showAll}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: 7,
              cursor: 'pointer',
              padding: '2px 4px',
              borderRadius: 2,
            }}
            aria-label="Show all layers"
            title="Show all"
          >
            All
          </button>
          <button
            onClick={hideAll}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: 7,
              cursor: 'pointer',
              padding: '2px 4px',
              borderRadius: 2,
            }}
            aria-label="Hide all layers"
            title="Hide all"
          >
            None
          </button>
        </div>
      </div>

      {/* Global opacity slider */}
      <div style={{ padding: '4px 6px', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 8, color: 'var(--text-muted)', minWidth: 32 }}>Global</span>
          <OpacitySlider
            value={globalOpacity}
            onChange={setGlobalOpacity}
            aria-label="Global opacity"
          />
        </div>
      </div>

      <ul
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}
        role="list"
        aria-label="System layers"
      >
        {ANATOMY_LAYERS.map((layer) => {
          const on = solo ? solo === layer.id : layers[layer.id]?.visible;
          const isSoloed = solo === layer.id;

          return (
            <li key={layer.id}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '6px 7px',
                  background: on ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                  border: '1px solid ' + (isSoloed ? layer.color + '50' : 'var(--border-subtle)'),
                  borderRadius: 'var(--radius-sm)',
                  transition: 'background 0.15s ease, border-color 0.15s ease',
                }}
              >
                {/* Visibility toggle */}
                <button
                  onClick={() => handleToggle(layer.id)}
                  onKeyDown={(e) => handleKeyDown(e, layer.id, 'toggle')}
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: 2,
                    cursor: 'pointer',
                    background: on ? layer.color : 'var(--border)',
                    border: 'none',
                    padding: 0,
                    transition: 'background 0.15s ease',
                  }}
                  role="switch"
                  aria-checked={on}
                  aria-label={`Toggle ${layer.label} layer visibility`}
                  title={on ? `Hide ${layer.label}` : `Show ${layer.label}`}
                />

                {/* Label */}
                <span
                  onClick={() => handleToggle(layer.id)}
                  style={{
                    flex: 1,
                    color: on ? 'var(--text-secondary)' : 'var(--text-muted)',
                    fontSize: 9.5,
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  {layer.label}
                </span>

                {/* Solo button */}
                <button
                  onClick={() => handleSolo(layer.id)}
                  onKeyDown={(e) => handleKeyDown(e, layer.id, 'solo')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: isSoloed ? layer.color : 'var(--text-muted)',
                    fontSize: 7,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    padding: '2px 4px',
                    borderRadius: 2,
                    fontWeight: isSoloed ? 600 : 400,
                  }}
                  aria-pressed={isSoloed}
                  aria-label={`Solo ${layer.label} layer`}
                  title={isSoloed ? `Unsolo ${layer.label}` : `Solo ${layer.label}`}
                >
                  S
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Solo mode indicator */}
      {solo && (
        <div
          style={{
            marginTop: 8,
            padding: '4px 6px',
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 8,
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}
          role="status"
          aria-live="polite"
        >
          Solo: {ANATOMY_LAYERS.find(l => l.id === solo)?.label}
        </div>
      )}
    </section>
  );
}
