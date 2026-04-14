import type { CircuitNode } from '@/types/circuit';

interface Props {
  viewBox: { minX: number; minY: number; width: number; height: number };
  nodes: CircuitNode[];
  panX: number;
  panY: number;
  scale: number;
}

const MINIMAP_SIZE = 120;
const MINIMAP_PADDING = 8;

export function Minimap({ viewBox, nodes, panX, panY, scale }: Props) {
  if (nodes.length === 0) return null;

  // Calculate scale to fit diagram in minimap
  const minimapScale = Math.min(
    MINIMAP_SIZE / viewBox.width,
    MINIMAP_SIZE / viewBox.height
  );

  // Calculate viewport rectangle
  const viewportWidth = (viewBox.width / scale) * minimapScale;
  const viewportHeight = (viewBox.height / scale) * minimapScale;
  const viewportX = (-panX / scale) * minimapScale;
  const viewportY = (-panY / scale) * minimapScale;

  return (
    <g
      transform={`translate(${viewBox.minX + viewBox.width - MINIMAP_SIZE - MINIMAP_PADDING}, ${
        viewBox.minY + MINIMAP_PADDING
      })`}
      aria-label="Diagram minimap"
      role="img"
    >
      {/* Background */}
      <rect
        width={MINIMAP_SIZE}
        height={MINIMAP_SIZE}
        fill="var(--bg-surface)"
        stroke="var(--border)"
        strokeWidth={1}
        rx={4}
        opacity={0.9}
      />

      {/* Node dots */}
      <g
        transform={`translate(${
          (MINIMAP_SIZE - viewBox.width * minimapScale) / 2
        }, ${(MINIMAP_SIZE - viewBox.height * minimapScale) / 2})`}
      >
        {nodes.map((node) => (
          <circle
            key={node.id}
            cx={(node.position.x - viewBox.minX) * minimapScale}
            cy={(node.position.y - viewBox.minY) * minimapScale}
            r={2}
            fill="var(--text-muted)"
          />
        ))}

        {/* Viewport indicator */}
        <rect
          x={viewportX}
          y={viewportY}
          width={Math.min(viewportWidth, MINIMAP_SIZE)}
          height={Math.min(viewportHeight, MINIMAP_SIZE)}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1}
          strokeOpacity={0.7}
          rx={2}
        />
      </g>
    </g>
  );
}
