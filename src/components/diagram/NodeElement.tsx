import type { CircuitNode, NodeType } from '@/types/circuit';
import type { DiagnosticStatus } from '@/types/diagnostic';
import { STATUS_MAP } from '@/types/diagnostic';

interface Props {
  node: CircuitNode;
  isSelected: boolean;
  isHighlighted: boolean;
  isDimmed: boolean;
  status: DiagnosticStatus;
  onSelect: (id: string) => void;
  onStatusCycle: (id: string) => void;
}

const NODE_ICONS: Record<NodeType, string> = {
  power_source: '+',
  fuse: 'F',
  relay: 'R',
  ecu: 'E',
  switch: 'S',
  actuator: 'A',
  ground: 'G',
  splice: '*',
  junction_block: 'J',
  sensor: 'O',
  connector: 'C',
};

const NODE_SIZES: Record<NodeType, { w: number; h: number }> = {
  power_source: { w: 50, h: 40 },
  fuse: { w: 30, h: 24 },
  relay: { w: 36, h: 30 },
  ecu: { w: 50, h: 36 },
  switch: { w: 36, h: 28 },
  actuator: { w: 44, h: 32 },
  ground: { w: 28, h: 28 },
  splice: { w: 16, h: 16 },
  junction_block: { w: 48, h: 40 },
  sensor: { w: 32, h: 28 },
  connector: { w: 24, h: 24 },
};

export function NodeElement({
  node,
  isSelected,
  isHighlighted,
  isDimmed,
  status,
  onSelect,
  onStatusCycle,
}: Props) {
  const size = NODE_SIZES[node.type] || { w: 36, h: 28 };
  const icon = NODE_ICONS[node.type] || '?';
  const statusCfg = STATUS_MAP[status];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node.id);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onStatusCycle(node.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(node.id);
    }
  };

  // Calculate visual states
  const opacity = isDimmed ? 0.25 : 1;
  const strokeWidth = isSelected ? 2 : isHighlighted ? 1.5 : 1;
  const fillColor = isSelected
    ? 'var(--bg-elevated)'
    : status !== 'untested'
    ? statusCfg.bg
    : 'var(--bg-elevated)';
  const strokeColor = isSelected
    ? 'var(--accent)'
    : status !== 'untested'
    ? statusCfg.border
    : isHighlighted
    ? 'var(--text-secondary)'
    : 'var(--border-subtle)';
  const textColor = isSelected || isHighlighted ? 'var(--text-primary)' : 'var(--text-muted)';

  return (
    <g
      transform={`translate(${node.position.x - size.w / 2}, ${node.position.y - size.h / 2})`}
      style={{ cursor: 'pointer', opacity }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${node.label} - ${node.type.replace('_', ' ')} - ${statusCfg.label}`}
      aria-pressed={isSelected}
    >
      {/* Node body */}
      <rect
        width={size.w}
        height={size.h}
        rx={node.type === 'ground' ? size.w / 2 : 4}
        ry={node.type === 'ground' ? size.h / 2 : 4}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        className={`node-body ${isHighlighted ? 'highlighted' : ''}`}
      />

      {/* Status indicator */}
      {status !== 'untested' && (
        <circle
          cx={size.w - 4}
          cy={4}
          r={5}
          fill={statusCfg.color}
          stroke="var(--bg-base)"
          strokeWidth={1}
        />
      )}

      {/* Node icon */}
      <text
        x={size.w / 2}
        y={size.h / 2 - 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={status !== 'untested' ? statusCfg.color : textColor}
        fontSize={14}
        fontFamily="var(--font-mono)"
        className={`node-icon ${isHighlighted ? 'highlighted' : ''}`}
        style={{ pointerEvents: 'none' }}
      >
        {icon}
      </text>

      {/* Node label */}
      <text
        x={size.w / 2}
        y={size.h + 10}
        textAnchor="middle"
        fill={textColor}
        fontSize={7.5}
        fontFamily="var(--font-mono)"
        className={`node-label ${isHighlighted ? 'highlighted' : ''}`}
        style={{ pointerEvents: 'none' }}
      >
        {node.label}
      </text>

      {/* Toyota code (small subtitle) */}
      {node.toyotaCode && (
        <text
          x={size.w / 2}
          y={size.h + 18}
          textAnchor="middle"
          fill="var(--text-ghost)"
          fontSize={6}
          fontFamily="var(--font-mono)"
          style={{ pointerEvents: 'none' }}
        >
          {node.toyotaCode}
        </text>
      )}

      {/* Selection glow */}
      {isSelected && (
        <rect
          width={size.w + 8}
          height={size.h + 8}
          x={-4}
          y={-4}
          rx={6}
          ry={6}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1}
          strokeOpacity={0.3}
          filter="url(#glo)"
          style={{ pointerEvents: 'none' }}
        />
      )}
    </g>
  );
}
