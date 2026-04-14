import { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import { useStore } from '@/store';
import { usePanZoom } from '@/hooks/usePanZoom';
import { NodeElement } from './NodeElement';
import { WireElement } from './WireElement';
import { SvgDefs } from './SvgDefs';
import { Minimap } from './Minimap';
import { TouchTargets } from './TouchTargets';
import { ScreenReaderTable } from '@/components/accessibility/ScreenReaderTable';
import { AnnotationMarker } from '@/components/notepad/AnnotationMarker';
import { bfsTrace } from '@/graph/tracing';
import type { GraphData, CircuitNode } from '@/types/circuit';
import type { DiagnosticStatus } from '@/types/diagnostic';

// Import graph data - in production would load dynamically
import chargingData from '@/data/vehicles/es300-1997/graphs/charging.json';

const STATUS_ORDER: DiagnosticStatus[] = ['untested', 'testing', 'good', 'suspected', 'bad'];

export function DiagramCanvas() {
  const canvasRef = useRef<SVGSVGElement>(null);

  // Store state
  const selectedNodeId = useStore((s) => s.selectedNodeId);
  const setSelectedNode = useStore((s) => s.setSelectedNode);
  const traceResult = useStore((s) => s.traceResult);
  const setTraceResult = useStore((s) => s.setTraceResult);
  const layers = useStore((s) => s.layers);
  const soloLayer = useStore((s) => s.soloLayer);
  const statuses = useStore((s) => s.componentStatuses);
  const setStatus = useStore((s) => s.setComponentStatus);
  const initStatuses = useStore((s) => s.initStatuses);
  const annotations = useStore((s) => s.annotations);
  const removeAnnotation = useStore((s) => s.removeAnnotation);
  const currentPage = useStore((s) => s.currentPage);

  // Selected annotation for editing
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<number | null>(null);

  // Pan/zoom controls
  const {
    x: panX,
    y: panY,
    scale,
    onWheel,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  } = usePanZoom(1);

  // Load graph data
  const graphData: GraphData = useMemo(() => chargingData as GraphData, []);

  // Create node map for quick lookups
  const nodeMap = useMemo(() => {
    const map: Record<string, CircuitNode> = {};
    for (const node of graphData.nodes) {
      map[node.id] = node;
    }
    return map;
  }, [graphData.nodes]);

  // Initialize component statuses on mount
  useEffect(() => {
    if (graphData.nodes.length > 0) {
      initStatuses(graphData.nodes.map((n) => n.id));
    }
  }, [graphData.nodes, initStatuses]);

  // Filter nodes/edges by visible layers
  const visibleNodes = useMemo(() => {
    return graphData.nodes.filter((node) => {
      if (soloLayer) {
        return node.system.includes(soloLayer);
      }
      return node.system.some((sys) => layers[sys]?.visible);
    });
  }, [graphData.nodes, layers, soloLayer]);

  const visibleEdges = useMemo(() => {
    const nodeIds = new Set(visibleNodes.map((n) => n.id));
    return graphData.edges.filter(
      (edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target)
    );
  }, [graphData.edges, visibleNodes]);

  // Handle node selection and tracing
  const handleNodeSelect = useCallback(
    (nodeId: string) => {
      if (selectedNodeId === nodeId) {
        // Deselect
        setSelectedNode(null);
        setTraceResult(null);
      } else {
        setSelectedNode(nodeId);
        // Run BFS trace from selected node
        const trace = bfsTrace(nodeMap, graphData.edges, nodeId);
        setTraceResult(trace);
      }
    },
    [selectedNodeId, setSelectedNode, setTraceResult, nodeMap, graphData.edges]
  );

  // Cycle through diagnostic statuses
  const handleStatusCycle = useCallback(
    (nodeId: string) => {
      const current = statuses[nodeId] || 'untested';
      const idx = STATUS_ORDER.indexOf(current);
      const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
      setStatus(nodeId, next);
    },
    [statuses, setStatus]
  );

  // Handle canvas click to deselect
  const handleCanvasClick = useCallback(() => {
    setSelectedNode(null);
    setTraceResult(null);
  }, [setSelectedNode, setTraceResult]);

  // Calculate viewBox dimensions
  const viewBox = useMemo(() => {
    if (visibleNodes.length === 0) {
      return { minX: 0, minY: 80, width: 860, height: 700 };
    }
    const xs = visibleNodes.map((n) => n.position.x);
    const ys = visibleNodes.map((n) => n.position.y);
    const minX = Math.min(...xs) - 80;
    const minY = Math.min(...ys) - 80;
    const maxX = Math.max(...xs) + 80;
    const maxY = Math.max(...ys) + 80;
    return { minX, minY, width: maxX - minX, height: maxY - minY };
  }, [visibleNodes]);

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
      aria-label="Circuit diagram canvas"
    >
      <svg
        ref={canvasRef}
        viewBox={`${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`}
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
        aria-label="Interactive wiring diagram"
      >
        <SvgDefs />

        {/* Background - clean gradient */}
        <defs>
          <linearGradient id="diagramBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F8F6F0" />
            <stop offset="100%" stopColor="#EDEBE6" />
          </linearGradient>
        </defs>
        <rect
          x={viewBox.minX}
          y={viewBox.minY}
          width={viewBox.width}
          height={viewBox.height}
          fill="url(#diagramBg)"
          onClick={handleCanvasClick}
        />

        {/* Wires layer - render first so nodes appear on top */}
        <g className="wires-layer" aria-label="Wire connections">
          {visibleEdges.map((edge) => {
            const sourceNode = nodeMap[edge.source];
            const targetNode = nodeMap[edge.target];
            if (!sourceNode || !targetNode) return null;

            const isHighlighted = traceResult?.edges.has(edge.id) ?? false;
            const isDimmed = traceResult && !isHighlighted;

            return (
              <WireElement
                key={edge.id}
                edge={edge}
                sourceNode={sourceNode}
                targetNode={targetNode}
                isHighlighted={isHighlighted}
                isDimmed={!!isDimmed}
                isAnimated={isHighlighted}
              />
            );
          })}
        </g>

        {/* Nodes layer */}
        <g className="nodes-layer" aria-label="Circuit components">
          {visibleNodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isHighlighted = traceResult?.nodes.has(node.id) ?? false;
            const isDimmed = traceResult && !isHighlighted && !isSelected;

            return (
              <NodeElement
                key={node.id}
                node={node}
                isSelected={isSelected}
                isHighlighted={isHighlighted || isSelected}
                isDimmed={!!isDimmed}
                status={statuses[node.id] || 'untested'}
                onSelect={handleNodeSelect}
                onStatusCycle={handleStatusCycle}
              />
            );
          })}
        </g>

        {/* Touch targets for mobile - larger invisible hit areas */}
        <TouchTargets
          nodes={visibleNodes}
          onNodeSelect={handleNodeSelect}
          onNodeLongPress={handleStatusCycle}
        />

        {/* Minimap */}
        <Minimap
          viewBox={viewBox}
          nodes={visibleNodes}
          panX={panX}
          panY={panY}
          scale={scale}
        />
      </svg>

      {/* Annotation markers overlay */}
      {annotations
        .filter((a) => a.pageId === currentPage)
        .map((annotation) => (
          <AnnotationMarker
            key={annotation.id}
            annotation={annotation}
            isSelected={selectedAnnotationId === annotation.id}
            onSelect={setSelectedAnnotationId}
            onDelete={(id) => removeAnnotation(id)}
          />
        ))}

      {/* Screen reader accessible table */}
      <ScreenReaderTable
        nodes={visibleNodes}
        edges={visibleEdges}
        statuses={statuses}
        selectedNodeId={selectedNodeId}
      />

      {/* Empty state */}
      {visibleNodes.length === 0 && (
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
          <div>No components visible</div>
          <div style={{ fontSize: 10, marginTop: 4, color: 'var(--text-muted)' }}>
            Enable a layer in the sidebar
          </div>
        </div>
      )}

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

      {/* Trace animation keyframes */}
      <style>{`
        @keyframes traceDash {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: 30; }
        }
      `}</style>
    </main>
  );
}
