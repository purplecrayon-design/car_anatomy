import type { CircuitNode } from '@/types/circuit';

interface Props {
  node: CircuitNode;
}

const TYPE_LABELS: Record<string, string> = {
  power_source: 'Power Source',
  fuse: 'Fuse',
  relay: 'Relay',
  ecu: 'ECU',
  switch: 'Switch',
  actuator: 'Actuator',
  ground: 'Ground',
  splice: 'Splice',
  junction_block: 'Junction Block',
  sensor: 'Sensor',
  connector: 'Connector',
};

const TYPE_ICONS: Record<string, string> = {
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

export function SearchResult({ node }: Props) {
  const typeLabel = TYPE_LABELS[node.type] || node.type;
  const icon = TYPE_ICONS[node.type] || '?';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {/* Type icon */}
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-base)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          color: 'var(--text-muted)',
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            color: 'var(--text-primary)',
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {node.label}
        </div>
        <div
          style={{
            fontSize: 9,
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 2,
          }}
        >
          <span>{typeLabel}</span>
          {node.toyotaCode && (
            <>
              <span style={{ color: 'var(--text-ghost)' }}>/</span>
              <span>{node.toyotaCode}</span>
            </>
          )}
        </div>
      </div>

      {/* System badge */}
      {node.system.length > 0 && (
        <div
          style={{
            padding: '2px 6px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 8,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {node.system[0]}
        </div>
      )}
    </div>
  );
}
