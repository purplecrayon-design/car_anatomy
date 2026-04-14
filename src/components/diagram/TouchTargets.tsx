import { useCallback } from 'react';
import type { CircuitNode } from '@/types/circuit';
import { TOUCH_TARGET_PX } from '@/utils/constants';

interface Props {
  nodes: CircuitNode[];
  onNodeSelect: (nodeId: string) => void;
  onNodeLongPress?: (nodeId: string) => void;
}

export function TouchTargets({ nodes, onNodeSelect, onNodeLongPress }: Props) {
  const handlePointerDown = useCallback(
    (nodeId: string, e: React.PointerEvent) => {
      if (!onNodeLongPress) return;

      const timeoutId = window.setTimeout(() => {
        onNodeLongPress(nodeId);
      }, 500);

      const cleanup = () => {
        window.clearTimeout(timeoutId);
        e.currentTarget.removeEventListener('pointerup', cleanup);
        e.currentTarget.removeEventListener('pointerleave', cleanup);
        e.currentTarget.removeEventListener('pointermove', cleanup);
      };

      e.currentTarget.addEventListener('pointerup', cleanup);
      e.currentTarget.addEventListener('pointerleave', cleanup);
      e.currentTarget.addEventListener('pointermove', cleanup);
    },
    [onNodeLongPress]
  );

  return (
    <g className="touch-targets" aria-hidden="true">
      {nodes.map((node) => (
        <circle
          key={`touch-${node.id}`}
          cx={node.position.x}
          cy={node.position.y}
          r={TOUCH_TARGET_PX / 2}
          fill="transparent"
          stroke="none"
          style={{
            cursor: 'pointer',
            touchAction: 'manipulation',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onNodeSelect(node.id);
          }}
          onPointerDown={(e) => handlePointerDown(node.id, e)}
          role="button"
          aria-label={`Select ${node.label}`}
          tabIndex={-1}
        />
      ))}
    </g>
  );
}
