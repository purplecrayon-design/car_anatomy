import { useRef, useCallback, useState } from 'react';
import { useVehicleStore } from '@/stores/useVehicleStore';
import { useLayersStore } from '@/stores/useLayersStore';
import { useSelectedComponentStore } from '@/stores/useSelectedComponentStore';
import { useManualStore } from '@/stores/useManualStore';
import { useNotesStore } from '@/stores/useNotesStore';

const VIEWBOX = { width: 1200, height: 800 };

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

  // Zoom handler
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform((t) => ({
      ...t,
      scale: Math.max(0.5, Math.min(3, t.scale * delta)),
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
        background: '#F8F6F0',
        perspective: is3D ? '1200px' : 'none',
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
        }}
      >
        {/* Background gradient */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F8F6F0" />
            <stop offset="100%" stopColor="#EDEBE6" />
          </linearGradient>
        </defs>
        <rect width={VIEWBOX.width} height={VIEWBOX.height} fill="url(#bgGradient)" />

        {/* Vehicle silhouette */}
        <g opacity={globalOpacity / 100}>
          <image
            href={`/data/vehicles/${currentVehicle.id}/silhouette-side.svg`}
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
      </svg>

      {/* Controls overlay */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2">
        <button
          onClick={() => setTransform((t) => ({ ...t, scale: Math.min(3, t.scale * 1.2) }))}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          +
        </button>
        <div className="w-10 h-8 bg-white rounded-lg shadow-md flex items-center justify-center text-xs text-gray-500">
          {Math.round(transform.scale * 100)}%
        </div>
        <button
          onClick={() => setTransform((t) => ({ ...t, scale: Math.max(0.5, t.scale * 0.8) }))}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          −
        </button>
        <button
          onClick={resetView}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-xs text-gray-500 hover:bg-gray-50 transition-colors mt-2"
          title="Reset view"
        >
          ⟲
        </button>
      </div>

      {/* 3D Rotation Controls */}
      {is3D && (
        <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur rounded-xl shadow-lg p-4">
          <div className="text-xs font-semibold text-gray-600 mb-3">3D View</div>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => set3DRotation({ x: 0, y: 0, z: 0 })}
              className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Side
            </button>
            <button
              onClick={() => set3DRotation({ x: 15, y: -30, z: 0 })}
              className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              3/4 Front
            </button>
            <button
              onClick={() => set3DRotation({ x: 15, y: 30, z: 0 })}
              className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              3/4 Rear
            </button>
          </div>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => set3DRotation({ x: 45, y: 0, z: 0 })}
              className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Top
            </button>
            <button
              onClick={() => set3DRotation({ x: -30, y: 0, z: 0 })}
              className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Under
            </button>
            <button
              onClick={() => set3DRotation({ x: 0, y: -90, z: 0 })}
              className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Front
            </button>
          </div>
          <div className="text-[10px] text-gray-400">Hold Shift + drag to rotate</div>
        </div>
      )}

      {/* Layer indicator */}
      {visibleLayers.length > 0 && (
        <div className="absolute top-6 left-6 flex flex-wrap gap-2">
          {visibleLayers.map((layer) => (
            <span
              key={layer.id}
              className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 shadow-sm"
            >
              {layer.name}
            </span>
          ))}
        </div>
      )}

      {/* Empty state */}
      {visibleLayers.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-gray-400 text-sm">No layers visible</p>
            <p className="text-gray-300 text-xs mt-1">Enable layers in the sidebar</p>
          </div>
        </div>
      )}
    </div>
  );
}
