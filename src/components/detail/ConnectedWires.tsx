import { useCallback } from 'react';
import type { WireEdge } from '@/types/circuit';
import { wireColorToHex, wireColorName } from '@/utils/wireColors';

interface Props {
  nodeId: string;
  wires: WireEdge[];
  onWireSelect?: (wireId: string) => void;
  onNodeSelect?: (nodeId: string) => void;
}

export function ConnectedWires({ nodeId, wires, onWireSelect, onNodeSelect }: Props) {
  const handleWireClick = useCallback(
    (wireId: string) => {
      onWireSelect?.(wireId);
    },
    [onWireSelect]
  );

  const handleNodeClick = useCallback(
    (targetNodeId: string) => {
      onNodeSelect?.(targetNodeId);
    },
    [onNodeSelect]
  );

  if (wires.length === 0) {
    return (
      <div
        style={{
          padding: 12,
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <p style={{ fontSize: 9, color: 'var(--text-muted)', margin: 0, textAlign: 'center' }}>
          No connected wires
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <h4
        style={{
          fontSize: 8,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 2,
        }}
      >
        Connected Wires ({wires.length})
      </h4>

      {wires.map((wire) => {
        const isSource = wire.source === nodeId;
        const connectedNodeId = isSource ? wire.target : wire.source;
        const pin = isSource ? wire.sourcePin : wire.targetPin;
        const primaryHex = wireColorToHex(wire.primaryColor);
        const stripeHex = wire.stripeColor ? wireColorToHex(wire.stripeColor) : undefined;

        return (
          <div
            key={wire.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 8px',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              cursor: onWireSelect ? 'pointer' : 'default',
              transition: 'border-color var(--transition-fast)',
            }}
            onClick={() => handleWireClick(wire.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleWireClick(wire.id);
              }
            }}
            tabIndex={onWireSelect ? 0 : -1}
            role={onWireSelect ? 'button' : undefined}
            aria-label={`Wire ${wire.colorLabel} to ${connectedNodeId}`}
          >
            {/* Wire color indicator */}
            <div
              style={{
                width: 20,
                height: 6,
                borderRadius: 3,
                background: stripeHex
                  ? `repeating-linear-gradient(90deg, ${primaryHex} 0px, ${primaryHex} 4px, ${stripeHex} 4px, ${stripeHex} 8px)`
                  : primaryHex,
                flexShrink: 0,
              }}
              title={wireColorName(wire.colorLabel)}
            />

            {/* Wire info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span
                  style={{
                    fontSize: 9,
                    color: 'var(--text-secondary)',
                    fontWeight: 500,
                  }}
                >
                  {wire.colorLabel}
                </span>
                {wire.gauge && (
                  <span
                    style={{
                      fontSize: 8,
                      color: 'var(--text-ghost)',
                    }}
                  >
                    {wire.gauge}
                  </span>
                )}
                {pin && (
                  <span
                    style={{
                      fontSize: 8,
                      color: 'var(--text-muted)',
                      padding: '1px 4px',
                      background: 'var(--bg-base)',
                      borderRadius: 2,
                    }}
                  >
                    Pin {pin}
                  </span>
                )}
              </div>
            </div>

            {/* Connected node link */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNodeClick(connectedNodeId);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent)',
                fontSize: 8,
                cursor: 'pointer',
                padding: '2px 4px',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
              aria-label={`Navigate to ${connectedNodeId}`}
              title={`Go to ${connectedNodeId}`}
            >
              <span style={{ maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {connectedNodeId}
              </span>
              <span style={{ fontSize: 10 }}>&#8594;</span>
            </button>

            {/* Cross-page indicator */}
            {wire.crossRef && (
              <span
                style={{
                  fontSize: 7,
                  color: 'var(--warning)',
                  padding: '1px 4px',
                  background: 'rgba(255, 167, 38, 0.1)',
                  borderRadius: 2,
                }}
                title={`Continues on page ${wire.crossRef.targetPage}`}
              >
                P{wire.crossRef.targetPage}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
