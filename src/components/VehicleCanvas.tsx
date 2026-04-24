import { useRef, useCallback, useState } from 'react';
import { useVehicleStore } from '@/stores/useVehicleStore';
import { useLayersStore } from '@/stores/useLayersStore';
import { useSelectedComponentStore } from '@/stores/useSelectedComponentStore';
import { useManualStore } from '@/stores/useManualStore';
import { useNotesStore } from '@/stores/useNotesStore';

const VIEWBOX_WIDTH = 2000;
const VIEWBOX_HEIGHT = 800;

// Clickable component hotspots
const COMPONENT_HOTSPOTS = [
  { id: 'engine-block', x: 380, y: 340, w: 120, h: 100 },
  { id: 'cylinder-head', x: 360, y: 280, w: 80, h: 60 },
  { id: 'alternator', x: 280, y: 360, w: 60, h: 50 },
  { id: 'starter-motor', x: 480, y: 420, w: 60, h: 40 },
  { id: 'throttle-body', x: 420, y: 300, w: 50, h: 40 },
  { id: 'water-pump', x: 320, y: 380, w: 50, h: 40 },
  { id: 'thermostat', x: 340, y: 320, w: 40, h: 30 },
  { id: 'fuel-rail', x: 400, y: 320, w: 60, h: 30 },
  { id: 'radiator', x: 180, y: 340, w: 80, h: 120 },
  { id: 'battery', x: 240, y: 300, w: 60, h: 50 },
  { id: 'headlight-left', x: 140, y: 360, w: 50, h: 60 },
  { id: 'front-strut', x: 280, y: 480, w: 60, h: 80 },
  { id: 'front-brake-caliper', x: 240, y: 540, w: 50, h: 50 },
  { id: 'front-brake-rotor', x: 220, y: 520, w: 70, h: 70 },
  { id: 'catalytic-converter', x: 600, y: 560, w: 100, h: 40 },
  { id: 'ecu', x: 750, y: 360, w: 60, h: 40 },
  { id: 'fuel-pump', x: 1500, y: 440, w: 80, h: 60 },
];

export function VehicleCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { currentVehicle } = useVehicleStore();
  const { activeLayers, layerOpacity, globalOpacity, isolatedLayer, is3D, rotation3D, set3DRotation } = useLayersStore();
  const { selectedComponent, setSelectedComponent } = useSelectedComponentStore();
  const { getData } = useManualStore();
  const { trackComponentVisit } = useNotesStore();

  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const rotateStart = useRef({ x: 0, y: 0, rx: 0, ry: 0 });

  const handleClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (isDragging) return;
      const target = e.target as SVGElement;
      const componentId =
        target.getAttribute('data-component-id') ||
        target.closest('[data-component-id]')?.getAttribute('data-component-id');

      if (componentId) {
        const data = getData(componentId);
        trackComponentVisit(componentId);
        setSelectedComponent({
          id: componentId,
          label: data?.label || componentId,
          ...data,
        });
      }
    },
    [isDragging, getData, setSelectedComponent, trackComponentVisit]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      if (is3D && e.shiftKey) {
        setIsRotating(true);
        rotateStart.current = { x: e.clientX, y: e.clientY, rx: rotation3D.x, ry: rotation3D.y };
      } else {
        setIsDragging(true);
        dragStart.current = { x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y };
      }
    },
    [transform, is3D, rotation3D]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isRotating && is3D) {
        const dx = e.clientX - rotateStart.current.x;
        const dy = e.clientY - rotateStart.current.y;
        set3DRotation({
          x: Math.max(-45, Math.min(45, rotateStart.current.rx - dy * 0.3)),
          y: Math.max(-60, Math.min(60, rotateStart.current.ry + dx * 0.3)),
          z: rotation3D.z,
        });
        return;
      }
      if (!isDragging) return;
      setTransform((t) => ({
        ...t,
        x: dragStart.current.tx + (e.clientX - dragStart.current.x),
        y: dragStart.current.ty + (e.clientY - dragStart.current.y),
      }));
    },
    [isDragging, isRotating, is3D, rotation3D.z, set3DRotation]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsRotating(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform((t) => ({
      ...t,
      scale: Math.max(0.2, Math.min(5, t.scale * delta)),
    }));
  }, []);

  const resetView = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
    if (is3D) set3DRotation({ x: 0, y: 0, z: 0 });
  }, [is3D, set3DRotation]);

  const visibleLayers = isolatedLayer
    ? currentVehicle.layers.filter((l) => l.id === isolatedLayer)
    : currentVehicle.layers.filter((l) => activeLayers.includes(l.id));

  const transform3D = is3D
    ? `rotateX(${rotation3D.x}deg) rotateY(${rotation3D.y}deg) rotateZ(${rotation3D.z}deg)`
    : '';

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        overflow: 'hidden',
      }}
      onWheel={handleWheel}
    >
      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: isDragging ? 'grabbing' : 'grab',
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale}) ${transform3D}`,
          transformOrigin: 'center center',
          transition: isDragging || isRotating ? 'none' : 'transform 0.1s ease-out',
        }}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Background */}
        <defs>
          <linearGradient id="canvasBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.3" />
          </pattern>
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feFlood floodColor="#10b981" floodOpacity="0.5" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="url(#canvasBg)" />
        <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="url(#grid)" />

        {/* Vehicle silhouette */}
        <g opacity={globalOpacity / 100}>
          <image
            href={`/data/vehicles/${currentVehicle.id}/${currentVehicle.silhouette}`}
            width={VIEWBOX_WIDTH}
            height={VIEWBOX_HEIGHT}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>

        {/* Layers */}
        {visibleLayers.map((layer) => {
          const opacity = ((layerOpacity[layer.id] ?? 100) / 100) * (globalOpacity / 100);
          return (
            <g key={layer.id} opacity={opacity}>
              <image
                href={`/data/vehicles/${currentVehicle.id}/layers/${layer.file}`}
                width={VIEWBOX_WIDTH}
                height={VIEWBOX_HEIGHT}
                preserveAspectRatio="xMidYMid meet"
                style={{ pointerEvents: 'none' }}
              />
            </g>
          );
        })}

        {/* Hotspots */}
        {COMPONENT_HOTSPOTS.map((h) => {
          const isSelected = selectedComponent?.id === h.id;
          return (
            <g key={h.id}>
              {isSelected && (
                <rect
                  x={h.x - 4} y={h.y - 4} width={h.w + 8} height={h.h + 8}
                  rx={10} fill="none" stroke="#10b981" strokeWidth={3}
                  filter="url(#glow)"
                />
              )}
              <rect
                data-component-id={h.id}
                x={h.x} y={h.y} width={h.w} height={h.h}
                rx={6}
                fill={isSelected ? 'rgba(16,185,129,0.15)' : 'transparent'}
                stroke={isSelected ? '#10b981' : 'transparent'}
                strokeWidth={2}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    (e.target as SVGRectElement).setAttribute('fill', 'rgba(16,185,129,0.1)');
                    (e.target as SVGRectElement).setAttribute('stroke', '#10b981');
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    (e.target as SVGRectElement).setAttribute('fill', 'transparent');
                    (e.target as SVGRectElement).setAttribute('stroke', 'transparent');
                  }
                }}
              />
            </g>
          );
        })}
      </svg>

      {/* Zoom Controls */}
      <div style={{ position: 'absolute', bottom: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          onClick={() => setTransform((t) => ({ ...t, scale: Math.min(5, t.scale * 1.25) }))}
          style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(30,41,59,0.9)', border: '1px solid #334155',
            color: '#fff', fontSize: 20, cursor: 'pointer',
          }}
        >+</button>
        <div style={{
          width: 40, height: 32, borderRadius: 10,
          background: 'rgba(30,41,59,0.9)', border: '1px solid #334155',
          color: '#10b981', fontSize: 11, fontFamily: 'monospace',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{Math.round(transform.scale * 100)}%</div>
        <button
          onClick={() => setTransform((t) => ({ ...t, scale: Math.max(0.2, t.scale * 0.8) }))}
          style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(30,41,59,0.9)', border: '1px solid #334155',
            color: '#fff', fontSize: 20, cursor: 'pointer',
          }}
        >−</button>
        <button
          onClick={resetView}
          style={{
            width: 40, height: 40, borderRadius: 10, marginTop: 8,
            background: 'rgba(30,41,59,0.9)', border: '1px solid #334155',
            color: '#94a3b8', fontSize: 16, cursor: 'pointer',
          }}
        >⟲</button>
      </div>

      {/* Layer badges */}
      {visibleLayers.length > 0 && (
        <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', flexWrap: 'wrap', gap: 6, maxWidth: 300 }}>
          {visibleLayers.slice(0, 4).map((l) => (
            <span key={l.id} style={{
              padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500,
              background: 'rgba(30,41,59,0.9)', border: '1px solid #334155', color: '#cbd5e1',
            }}>{l.name}</span>
          ))}
          {visibleLayers.length > 4 && (
            <span style={{
              padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
              background: '#059669', color: '#fff',
            }}>+{visibleLayers.length - 4}</span>
          )}
        </div>
      )}

      {/* 3D controls */}
      {is3D && (
        <div style={{
          position: 'absolute', bottom: 20, left: 20, padding: 12, borderRadius: 12,
          background: 'rgba(30,41,59,0.95)', border: '1px solid #334155',
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#10b981', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: '#10b981' }} />
            3D Mode
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { label: 'Side', r: { x: 0, y: 0, z: 0 } },
              { label: '3/4', r: { x: 15, y: -30, z: 0 } },
              { label: 'Top', r: { x: 40, y: 0, z: 0 } },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => set3DRotation(p.r)}
                style={{
                  padding: '6px 12px', borderRadius: 6, fontSize: 11,
                  background: '#334155', border: 'none', color: '#cbd5e1', cursor: 'pointer',
                }}
              >{p.label}</button>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {visibleLayers.length === 0 && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          textAlign: 'center', padding: 32, borderRadius: 16,
          background: 'rgba(30,41,59,0.9)', border: '1px solid #334155',
        }}>
          <div style={{ fontSize: 14, color: '#cbd5e1', fontWeight: 500 }}>No layers visible</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Enable layers in the sidebar</div>
        </div>
      )}
    </div>
  );
}
