import { useCallback, useMemo } from 'react';
import { useStore } from '@/store';
import { usePanZoom } from '@/hooks/usePanZoom';
import { Minimap } from './Minimap';
import { ANATOMY_LAYERS } from '@/types/anatomy';
import type { CircuitNode } from '@/types/circuit';

const VIEWBOX = { minX: 0, minY: 0, width: 1200, height: 800 };

export function VehicleCanvas() {
  const currentVehicle = useStore((s) => s.currentVehicle);
  const currentView = useStore((s) => s.currentView);
  const layers = useStore((s) => s.layers);
  const globalOpacity = useStore((s) => s.globalOpacity);
  const soloLayer = useStore((s) => s.soloLayer);
  const setSelectedNode = useStore((s) => s.setSelectedNode);
  const selectedNodeId = useStore((s) => s.selectedNodeId);
  const trackComponentVisit = useStore((s) => s.trackComponentVisit);

  const {
    x: panX,
    y: panY,
    scale,
    onWheel,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  } = usePanZoom(1);

  // Handle component click
  const handleClick = useCallback((e: React.MouseEvent<SVGElement>) => {
    const target = e.target as SVGElement;
    const componentId = target.dataset.componentId || target.closest('[data-component-id]')?.getAttribute('data-component-id');

    if (componentId) {
      e.stopPropagation();
      if (componentId !== selectedNodeId) {
        setSelectedNode(componentId);
        trackComponentVisit(componentId);
      } else {
        setSelectedNode(null);
      }
    }
  }, [setSelectedNode, selectedNodeId, trackComponentVisit]);

  // Deselect on canvas click
  const handleCanvasClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  // Filter visible layers
  const visibleLayers = useMemo(() => {
    return ANATOMY_LAYERS.filter((layer) => {
      if (soloLayer) return layer.id === soloLayer;
      return layers[layer.id]?.visible;
    });
  }, [layers, soloLayer]);

  // Placeholder nodes for minimap (empty for now - minimap won't render)
  const minimapNodes: CircuitNode[] = [];

  return (
    <main
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-base)',
        gridColumn: 2,
        gridRow: 2,
      }}
      role="application"
      aria-label="Vehicle anatomy canvas"
    >
      <svg
        viewBox={`${VIEWBOX.minX} ${VIEWBOX.minY} ${VIEWBOX.width} ${VIEWBOX.height}`}
        width="100%"
        height="100%"
        style={{
          display: 'block',
          cursor: 'grab',
          transform: `translate(${panX}px, ${panY}px) scale(${scale})`,
          transformOrigin: 'center',
        }}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onClick={handleCanvasClick}
        aria-label="Interactive vehicle diagram"
      >
        {/* Background - clean gradient */}
        <defs>
          <linearGradient id="canvasBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F8F6F0" />
            <stop offset="100%" stopColor="#EDEBE6" />
          </linearGradient>
        </defs>
        <rect
          x={VIEWBOX.minX}
          y={VIEWBOX.minY}
          width={VIEWBOX.width}
          height={VIEWBOX.height}
          fill="url(#canvasBg)"
        />

        {/* Base silhouette */}
        <g opacity={globalOpacity / 100}>
          <image
            href={`/data/vehicles/${currentVehicle}/silhouettes/${currentView}-view.svg`}
            x={0}
            y={0}
            width={VIEWBOX.width}
            height={VIEWBOX.height}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>

        {/* Layer stack */}
        {visibleLayers.map((layer) => {
          const layerState = layers[layer.id];
          const opacity = ((layerState?.opacity ?? 100) / 100) * (globalOpacity / 100);

          return (
            <g
              key={layer.id}
              opacity={opacity}
              onClick={handleClick}
              style={{ cursor: 'pointer' }}
            >
              <image
                href={`/data/vehicles/${currentVehicle}/silhouettes/layers/${layer.svgFile}`}
                x={0}
                y={0}
                width={VIEWBOX.width}
                height={VIEWBOX.height}
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          );
        })}

        {/* Selection highlight */}
        {selectedNodeId && (
          <g className="selection-highlight">
            <circle
              cx={600}
              cy={400}
              r={30}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={3}
              style={{
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          </g>
        )}
      </svg>

      {/* Minimap */}
      <Minimap
        viewBox={VIEWBOX}
        nodes={minimapNodes}
        panX={panX}
        panY={panY}
        scale={scale}
      />

      {/* Zoom controls */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <button
          onClick={() => onWheel({ deltaY: -100, preventDefault: () => {} } as React.WheelEvent)}
          style={{
            width: 28,
            height: 28,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 4,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Zoom in"
        >
          +
        </button>
        <div
          style={{
            width: 28,
            height: 20,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 2,
            color: 'var(--text-ghost)',
            fontSize: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {Math.round(scale * 100)}%
        </div>
        <button
          onClick={() => onWheel({ deltaY: 100, preventDefault: () => {} } as React.WheelEvent)}
          style={{
            width: 28,
            height: 28,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 4,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Zoom out"
        >
          -
        </button>
      </div>

      {/* Empty state */}
      {visibleLayers.length === 0 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'var(--text-ghost)',
            fontSize: 12,
            textAlign: 'center',
          }}
        >
          <div>No layers visible</div>
          <div style={{ fontSize: 10, marginTop: 4, color: 'var(--text-muted)' }}>
            Enable a layer in the sidebar
          </div>
        </div>
      )}

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
      `}</style>
    </main>
  );
}
