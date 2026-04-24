import { useRef, useCallback, useState } from 'react';
import { useVehicleStore } from '@/stores/useVehicleStore';
import { useLayersStore } from '@/stores/useLayersStore';
import { useSelectedComponentStore } from '@/stores/useSelectedComponentStore';
import { useManualStore } from '@/stores/useManualStore';
import { useNotesStore } from '@/stores/useNotesStore';

const VIEWBOX = { width: 2000, height: 800 };

// Clickable component hotspots positioned over the car diagram
const COMPONENT_HOTSPOTS = [
  // Engine bay area (front of car)
  { id: 'engine-block', x: 380, y: 340, w: 120, h: 100, label: 'Engine' },
  { id: 'cylinder-head', x: 360, y: 280, w: 80, h: 60, label: 'Cylinder Head' },
  { id: 'alternator', x: 280, y: 360, w: 60, h: 50, label: 'Alternator' },
  { id: 'starter-motor', x: 480, y: 420, w: 60, h: 40, label: 'Starter' },
  { id: 'throttle-body', x: 420, y: 300, w: 50, h: 40, label: 'Throttle' },
  { id: 'water-pump', x: 320, y: 380, w: 50, h: 40, label: 'Water Pump' },
  { id: 'thermostat', x: 340, y: 320, w: 40, h: 30, label: 'Thermostat' },
  { id: 'fuel-rail', x: 400, y: 320, w: 60, h: 30, label: 'Fuel Rail' },

  // Front components
  { id: 'radiator', x: 180, y: 340, w: 80, h: 120, label: 'Radiator' },
  { id: 'battery', x: 240, y: 300, w: 60, h: 50, label: 'Battery' },
  { id: 'headlight-left', x: 140, y: 360, w: 50, h: 60, label: 'Headlight' },

  // Front suspension/brakes
  { id: 'front-strut', x: 280, y: 480, w: 60, h: 80, label: 'Front Strut' },
  { id: 'front-brake-caliper', x: 240, y: 540, w: 50, h: 50, label: 'Brake Caliper' },
  { id: 'front-brake-rotor', x: 220, y: 520, w: 70, h: 70, label: 'Brake Rotor' },

  // Underbody / exhaust
  { id: 'catalytic-converter', x: 600, y: 560, w: 100, h: 40, label: 'Catalytic Converter' },

  // Cabin area
  { id: 'ecu', x: 750, y: 360, w: 60, h: 40, label: 'ECU' },

  // Rear / fuel system
  { id: 'fuel-pump', x: 1500, y: 440, w: 80, h: 60, label: 'Fuel Pump' },
];

export function VehicleCanvas() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Stores
  const { currentVehicle } = useVehicleStore();
  const { activeLayers, layerOpacity, globalOpacity, isolatedLayer, is3D, rotation3D, set3DRotation } = useLayersStore();
  const { setSelectedComponent } = useSelectedComponentStore();
  const { getData } = useManualStore();
  const { trackComponentVisit } = useNotesStore();

  // Pan & zoom state
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const rotateStart = useRef({ x: 0, y: 0, rx: 0, ry: 0 });

  // Handle component click
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

  // Pan handlers (or 3D rotation when in 3D mode)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;

      if (is3D && e.shiftKey) {
        // 3D rotation mode (hold shift)
        setIsRotating(true);
        rotateStart.current = {
          x: e.clientX,
          y: e.clientY,
          rx: rotation3D.x,
          ry: rotation3D.y,
        };
      } else {
        setIsDragging(true);
        dragStart.current = {
          x: e.clientX,
          y: e.clientY,
          tx: transform.x,
          ty: transform.y,
        };
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
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setTransform((t) => ({
        ...t,
        x: dragStart.current.tx + dx,
        y: dragStart.current.ty + dy,
      }));
    },
    [isDragging, isRotating, is3D, rotation3D.z, set3DRotation]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsRotating(false);
  }, []);

  // Zoom handler - normalized for trackpad vs mouse wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Normalize deltaY - trackpads send many small events, mouse wheels send fewer large ones
    // ctrlKey is true for pinch-to-zoom gestures on trackpads
    const isPinchGesture = e.ctrlKey;
    const rawDelta = e.deltaY;

    // Much gentler zoom: 0.5-2% per event depending on input type
    let zoomIntensity: number;
    if (isPinchGesture) {
      // Pinch gestures - very gentle
      zoomIntensity = 0.005;
    } else if (Math.abs(rawDelta) > 50) {
      // Mouse wheel (typically 100+ per notch)
      zoomIntensity = 0.03;
    } else {
      // Trackpad scroll (typically 1-10 per event)
      zoomIntensity = 0.008;
    }

    // Calculate zoom factor based on normalized delta
    const normalizedDelta = Math.sign(rawDelta) * Math.min(Math.abs(rawDelta), 100);
    const zoomFactor = 1 - (normalizedDelta * zoomIntensity);

    setTransform((t) => ({
      ...t,
      scale: Math.max(0.3, Math.min(4, t.scale * zoomFactor)),
    }));
  }, []);

  // Reset view
  const resetView = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
    if (is3D) {
      set3DRotation({ x: 0, y: 0, z: 0 });
    }
  }, [is3D, set3DRotation]);

  // Get visible layers
  const visibleLayers = isolatedLayer
    ? currentVehicle.layers.filter((l) => l.id === isolatedLayer)
    : currentVehicle.layers.filter((l) => activeLayers.includes(l.id));

  // Build 3D transform string
  const transform3D = is3D
    ? `perspective(1200px) rotateX(${rotation3D.x}deg) rotateY(${rotation3D.y}deg) rotateZ(${rotation3D.z}deg)`
    : '';

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        perspective: is3D ? '1200px' : 'none',
        touchAction: 'none', // Prevent browser handling of touch/trackpad gestures
        isolation: 'isolate', // Create new stacking context
      }}
      onWheel={(e) => e.preventDefault()} // Prevent scroll from bubbling to parent
    >
      {/* Inner canvas wrapper - transforms are contained here */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          contain: 'layout paint', // CSS containment for performance
        }}
      >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          cursor: isDragging || isRotating ? 'grabbing' : 'grab',
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale}) ${transform3D}`,
          transformOrigin: 'center',
          transformStyle: is3D ? 'preserve-3d' : 'flat',
          transition: isRotating || isDragging ? 'none' : 'transform 0.1s ease-out',
          shapeRendering: 'geometricPrecision',
          imageRendering: 'auto',
        }}
      >
        {/* Background gradient */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect width={VIEWBOX.width} height={VIEWBOX.height} fill="url(#bgGradient)" />

        {/* Grid pattern for depth */}
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.3"/>
        </pattern>
        <rect width={VIEWBOX.width} height={VIEWBOX.height} fill="url(#grid)" />

        {/* Vehicle silhouette */}
        <g opacity={globalOpacity / 100}>
          <image
            href={`/data/vehicles/${currentVehicle.id}/${currentVehicle.silhouette}`}
            width={VIEWBOX.width}
            height={VIEWBOX.height}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>

        {/* Layer overlays */}
        {visibleLayers.map((layer) => {
          const opacity = ((layerOpacity[layer.id] ?? 100) / 100) * (globalOpacity / 100);
          return (
            <g key={layer.id} opacity={opacity}>
              <image
                href={`/data/vehicles/${currentVehicle.id}/layers/${layer.file}`}
                width={VIEWBOX.width}
                height={VIEWBOX.height}
                preserveAspectRatio="xMidYMid meet"
                style={{ pointerEvents: 'none' }}
              />
            </g>
          );
        })}

        {/* Clickable component hotspots */}
        <g className="component-hotspots">
          {COMPONENT_HOTSPOTS.map((hotspot) => (
            <rect
              key={hotspot.id}
              data-component-id={hotspot.id}
              x={hotspot.x}
              y={hotspot.y}
              width={hotspot.w}
              height={hotspot.h}
              rx={8}
              fill="transparent"
              stroke="transparent"
              strokeWidth={2}
              style={{ cursor: 'pointer' }}
              className="hotspot-rect"
              onMouseEnter={(e) => {
                (e.target as SVGRectElement).setAttribute('stroke', '#10b981');
                (e.target as SVGRectElement).setAttribute('fill', 'rgba(16, 185, 129, 0.1)');
              }}
              onMouseLeave={(e) => {
                (e.target as SVGRectElement).setAttribute('stroke', 'transparent');
                (e.target as SVGRectElement).setAttribute('fill', 'transparent');
              }}
            />
          ))}
        </g>
      </svg>
      </div>

      {/* Controls overlay - positioned outside the transform container */}
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex flex-col gap-2">
        <button
          onClick={() => setTransform((t) => ({ ...t, scale: Math.min(4, t.scale * 1.15) }))}
          className="w-12 h-12 md:w-11 md:h-11 bg-slate-800/85 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl flex items-center justify-center text-lg font-medium text-white hover:bg-slate-700 hover:border-emerald-500/50 hover:shadow-emerald-500/20 active:scale-95 transition-all"
        >
          +
        </button>
        <div className="w-12 h-10 md:w-11 md:h-9 bg-slate-800/85 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl flex items-center justify-center text-xs font-mono text-emerald-400">
          {Math.round(transform.scale * 100)}%
        </div>
        <button
          onClick={() => setTransform((t) => ({ ...t, scale: Math.max(0.3, t.scale * 0.85) }))}
          className="w-12 h-12 md:w-11 md:h-11 bg-slate-800/85 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl flex items-center justify-center text-lg font-medium text-white hover:bg-slate-700 hover:border-emerald-500/50 hover:shadow-emerald-500/20 active:scale-95 transition-all"
        >
          −
        </button>
        <button
          onClick={resetView}
          className="w-12 h-12 md:w-11 md:h-11 bg-slate-800/85 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl flex items-center justify-center text-sm text-slate-400 hover:text-emerald-400 hover:bg-slate-700 hover:shadow-emerald-500/20 active:scale-95 transition-all mt-2"
          title="Reset view"
        >
          ⟲
        </button>
      </div>

      {/* 3D Rotation Controls */}
      {is3D && (
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-slate-800/85 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-4">
          <div className="text-xs font-semibold text-emerald-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            3D View Active
          </div>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => set3DRotation({ x: 0, y: 0, z: 0 })}
              className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg transition-all"
            >
              Side
            </button>
            <button
              onClick={() => set3DRotation({ x: 15, y: -30, z: 0 })}
              className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg transition-all"
            >
              3/4 Front
            </button>
            <button
              onClick={() => set3DRotation({ x: 15, y: 30, z: 0 })}
              className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg transition-all"
            >
              3/4 Rear
            </button>
          </div>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => set3DRotation({ x: 45, y: 0, z: 0 })}
              className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg transition-all"
            >
              Top
            </button>
            <button
              onClick={() => set3DRotation({ x: -30, y: 0, z: 0 })}
              className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg transition-all"
            >
              Under
            </button>
            <button
              onClick={() => set3DRotation({ x: 0, y: -90, z: 0 })}
              className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg transition-all"
            >
              Front
            </button>
          </div>
          <div className="text-[10px] text-slate-500">Hold Shift + drag to rotate</div>
        </div>
      )}

      {/* Layer indicator */}
      {visibleLayers.length > 0 && (
        <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-wrap gap-2">
          {visibleLayers.map((layer) => (
            <span
              key={layer.id}
              className="px-3 py-1.5 bg-slate-800/85 backdrop-blur-xl border border-slate-700/50 rounded-full text-xs font-medium text-slate-300 shadow-xl"
            >
              {layer.name}
            </span>
          ))}
        </div>
      )}

      {/* Empty state */}
      {visibleLayers.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/60 flex items-center justify-center shadow-lg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5">
                <path d="M3 7l6 3 6-3 6 3V17l-6 3-6-3-6 3V7z" />
                <path d="M9 10v10M15 7v10" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm font-medium">No layers visible</p>
            <p className="text-slate-500 text-xs mt-1">Enable layers in the sidebar to explore</p>
          </div>
        </div>
      )}
    </div>
  );
}
