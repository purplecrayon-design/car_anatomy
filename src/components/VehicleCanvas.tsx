import { useRef, useCallback, useState, useEffect } from 'react';
import { useVehicleStore } from '@/stores/useVehicleStore';
import { useLayersStore } from '@/stores/useLayersStore';
import { useSelectedComponentStore } from '@/stores/useSelectedComponentStore';
import { useManualStore } from '@/stores/useManualStore';
import { useNotesStore } from '@/stores/useNotesStore';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Stores
  const { currentVehicle } = useVehicleStore();
  const { activeLayers, layerOpacity, globalOpacity, isolatedLayer, is3D, rotation3D, set3DRotation } = useLayersStore();
  const { selectedComponent, setSelectedComponent } = useSelectedComponentStore();
  const { getData } = useManualStore();
  const { trackComponentVisit } = useNotesStore();

  // Pan & zoom state
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const rotateStart = useRef({ x: 0, y: 0, rx: 0, ry: 0 });

  // Track container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

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

  // Pan handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;

      if (is3D && e.shiftKey) {
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

  // Zoom handler
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isPinchGesture = e.ctrlKey;
    const rawDelta = e.deltaY;

    let zoomIntensity: number;
    if (isPinchGesture) {
      zoomIntensity = 0.005;
    } else if (Math.abs(rawDelta) > 50) {
      zoomIntensity = 0.03;
    } else {
      zoomIntensity = 0.008;
    }

    const normalizedDelta = Math.sign(rawDelta) * Math.min(Math.abs(rawDelta), 100);
    const zoomFactor = 1 - normalizedDelta * zoomIntensity;

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
    ? `rotateX(${rotation3D.x}deg) rotateY(${rotation3D.y}deg) rotateZ(${rotation3D.z}deg)`
    : '';

  // Calculate SVG dimensions to fill container while maintaining aspect ratio
  const svgViewBox = { width: 2000, height: 800 };
  const aspectRatio = svgViewBox.width / svgViewBox.height; // 2.5

  let svgWidth = containerSize.width;
  let svgHeight = containerSize.width / aspectRatio;

  // If calculated height is less than container height, scale by height instead
  if (svgHeight < containerSize.height) {
    svgHeight = containerSize.height;
    svgWidth = containerSize.height * aspectRatio;
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onWheel={(e) => e.preventDefault()}
    >
      {/* SVG Canvas */}
      {containerSize.width > 0 && (
        <svg
          viewBox={`0 0 ${svgViewBox.width} ${svgViewBox.height}`}
          width={svgWidth}
          height={svgHeight}
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{
            cursor: isDragging || isRotating ? 'grabbing' : 'grab',
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale}) ${transform3D}`,
            transformOrigin: 'center center',
            transition: isRotating || isDragging ? 'none' : 'transform 0.15s ease-out',
            perspective: is3D ? '1200px' : 'none',
            transformStyle: is3D ? 'preserve-3d' : 'flat',
          }}
        >
          {/* Background */}
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <filter id="selectedGlow">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feFlood floodColor="#10b981" floodOpacity="0.6" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width={svgViewBox.width} height={svgViewBox.height} fill="url(#bgGradient)" />

          {/* Grid pattern */}
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.4" />
          </pattern>
          <rect width={svgViewBox.width} height={svgViewBox.height} fill="url(#grid)" />

          {/* Vehicle silhouette */}
          <g opacity={globalOpacity / 100}>
            <image
              href={`/data/vehicles/${currentVehicle.id}/${currentVehicle.silhouette}`}
              width={svgViewBox.width}
              height={svgViewBox.height}
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
                  width={svgViewBox.width}
                  height={svgViewBox.height}
                  preserveAspectRatio="xMidYMid meet"
                  style={{ pointerEvents: 'none' }}
                />
              </g>
            );
          })}

          {/* Clickable component hotspots */}
          <g className="component-hotspots">
            {COMPONENT_HOTSPOTS.map((hotspot) => {
              const isSelected = selectedComponent?.id === hotspot.id;
              return (
                <g key={hotspot.id}>
                  {isSelected && (
                    <rect
                      x={hotspot.x - 4}
                      y={hotspot.y - 4}
                      width={hotspot.w + 8}
                      height={hotspot.h + 8}
                      rx={12}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth={3}
                      filter="url(#selectedGlow)"
                      className="animate-pulse"
                    />
                  )}
                  <rect
                    data-component-id={hotspot.id}
                    x={hotspot.x}
                    y={hotspot.y}
                    width={hotspot.w}
                    height={hotspot.h}
                    rx={8}
                    fill={isSelected ? 'rgba(16, 185, 129, 0.2)' : 'transparent'}
                    stroke={isSelected ? '#10b981' : 'transparent'}
                    strokeWidth={2}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        (e.target as SVGRectElement).setAttribute('stroke', '#10b981');
                        (e.target as SVGRectElement).setAttribute('fill', 'rgba(16, 185, 129, 0.1)');
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        (e.target as SVGRectElement).setAttribute('stroke', 'transparent');
                        (e.target as SVGRectElement).setAttribute('fill', 'transparent');
                      }
                    }}
                  />
                </g>
              );
            })}
          </g>
        </svg>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={() => setTransform((t) => ({ ...t, scale: Math.min(4, t.scale * 1.2) }))}
          className="w-10 h-10 bg-slate-800/90 backdrop-blur border border-slate-700 rounded-xl flex items-center justify-center text-lg font-medium text-white hover:bg-slate-700 hover:border-emerald-500/50 active:scale-95 transition-all"
        >
          +
        </button>
        <div className="w-10 h-8 bg-slate-800/90 backdrop-blur border border-slate-700 rounded-xl flex items-center justify-center text-[10px] font-mono text-emerald-400">
          {Math.round(transform.scale * 100)}%
        </div>
        <button
          onClick={() => setTransform((t) => ({ ...t, scale: Math.max(0.3, t.scale * 0.8) }))}
          className="w-10 h-10 bg-slate-800/90 backdrop-blur border border-slate-700 rounded-xl flex items-center justify-center text-lg font-medium text-white hover:bg-slate-700 hover:border-emerald-500/50 active:scale-95 transition-all"
        >
          −
        </button>
        <button
          onClick={resetView}
          className="w-10 h-10 bg-slate-800/90 backdrop-blur border border-slate-700 rounded-xl flex items-center justify-center text-sm text-slate-400 hover:text-emerald-400 hover:bg-slate-700 active:scale-95 transition-all mt-1"
          title="Reset view"
        >
          ⟲
        </button>
      </div>

      {/* 3D Controls */}
      {is3D && (
        <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur border border-slate-700 rounded-xl p-3 z-10">
          <div className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            3D View
          </div>
          <div className="flex gap-1.5 mb-2">
            <button
              onClick={() => set3DRotation({ x: 0, y: 0, z: 0 })}
              className="px-2 py-1 text-xs bg-slate-700 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg transition-all"
            >
              Side
            </button>
            <button
              onClick={() => set3DRotation({ x: 15, y: -30, z: 0 })}
              className="px-2 py-1 text-xs bg-slate-700 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg transition-all"
            >
              3/4
            </button>
            <button
              onClick={() => set3DRotation({ x: 35, y: 0, z: 0 })}
              className="px-2 py-1 text-xs bg-slate-700 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg transition-all"
            >
              Top
            </button>
          </div>
          <div className="text-[10px] text-slate-500">Shift+drag to rotate</div>
        </div>
      )}

      {/* Active layers indicator */}
      {visibleLayers.length > 0 && (
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 max-w-[280px] z-10">
          {visibleLayers.slice(0, 3).map((layer) => (
            <span
              key={layer.id}
              className="px-2 py-1 bg-slate-800/90 backdrop-blur border border-slate-700 rounded-full text-[10px] font-medium text-slate-300"
            >
              {layer.name}
            </span>
          ))}
          {visibleLayers.length > 3 && (
            <span className="px-2 py-1 bg-emerald-600/80 rounded-full text-[10px] font-medium text-white">
              +{visibleLayers.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Empty state */}
      {visibleLayers.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-center bg-slate-800/80 backdrop-blur rounded-xl p-6 border border-slate-700">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-700/60 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5">
                <path d="M3 7l6 3 6-3 6 3V17l-6 3-6-3-6 3V7z" />
                <path d="M9 10v10M15 7v10" />
              </svg>
            </div>
            <p className="text-slate-300 text-sm font-medium">No layers visible</p>
            <p className="text-slate-500 text-xs mt-1">Enable layers in the sidebar</p>
          </div>
        </div>
      )}
    </div>
  );
}
