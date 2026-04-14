import type { WireEdge, CircuitNode } from '@/types/circuit';
import { WIRE_HEX } from '@/utils/wireColors';

interface Props {
  edge: WireEdge;
  sourceNode: CircuitNode;
  targetNode: CircuitNode;
  isHighlighted: boolean;
  isDimmed: boolean;
  isAnimated?: boolean;
}

export function WireElement({
  edge,
  sourceNode,
  targetNode,
  isHighlighted,
  isDimmed,
  isAnimated = false,
}: Props) {
  const primaryHex = WIRE_HEX[edge.primaryColor] || '#555';
  const stripeHex = edge.stripeColor ? WIRE_HEX[edge.stripeColor] : undefined;

  const x1 = sourceNode.position.x;
  const y1 = sourceNode.position.y;
  const x2 = targetNode.position.x;
  const y2 = targetNode.position.y;
  const cx = edge.controlPoints?.cx ?? (x1 + x2) / 2;
  const cy = edge.controlPoints?.cy ?? (y1 + y2) / 2;

  // Create quadratic bezier path
  const pathD = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

  const opacity = isDimmed ? 0.25 : 1;
  const strokeWidth = isHighlighted ? 2.5 : 1.5;

  return (
    <g
      className={`wire ${isHighlighted ? 'highlighted' : ''} ${isDimmed ? 'dimmed' : ''}`}
      style={{ opacity }}
      aria-label={`Wire ${edge.colorLabel} from ${sourceNode.label} to ${targetNode.label}`}
    >
      {/* Main wire path */}
      <path
        d={pathD}
        fill="none"
        stroke={primaryHex}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transition: 'stroke-width 0.2s ease, opacity 0.3s ease',
        }}
      />

      {/* Stripe overlay for two-color wires */}
      {stripeHex && (
        <path
          d={pathD}
          fill="none"
          stroke={stripeHex}
          strokeWidth={strokeWidth * 0.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 8"
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Animated trace effect */}
      {isHighlighted && isAnimated && (
        <path
          d={pathD}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={strokeWidth + 2}
          strokeLinecap="round"
          strokeOpacity={0.3}
          strokeDasharray="10 5"
          style={{
            animation: 'traceDash 1s linear infinite',
          }}
        />
      )}

      {/* Wire label at midpoint */}
      {isHighlighted && (
        <g transform={`translate(${cx}, ${cy})`}>
          <rect
            x={-14}
            y={-8}
            width={28}
            height={14}
            rx={3}
            fill="var(--bg-elevated)"
            stroke="var(--border)"
            strokeWidth={0.5}
          />
          <text
            x={0}
            y={3}
            textAnchor="middle"
            fill="var(--text-secondary)"
            fontSize={7}
            fontFamily="var(--font-mono)"
            style={{ pointerEvents: 'none' }}
          >
            {edge.colorLabel}
          </text>
        </g>
      )}

      {/* Gauge indicator (shown on hover/highlight) */}
      {isHighlighted && edge.gauge && (
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fill="var(--text-ghost)"
          fontSize={6}
          fontFamily="var(--font-mono)"
          style={{ pointerEvents: 'none' }}
        >
          {edge.gauge}mm
        </text>
      )}
    </g>
  );
}
