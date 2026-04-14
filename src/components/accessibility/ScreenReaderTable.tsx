import type { CircuitNode, WireEdge } from '@/types/circuit';
import type { DiagnosticStatus } from '@/types/diagnostic';
import { STATUS_MAP } from '@/types/diagnostic';
import { wireColorName } from '@/utils/wireColors';

interface Props {
  nodes: CircuitNode[];
  edges: WireEdge[];
  statuses: Record<string, DiagnosticStatus>;
  selectedNodeId: string | null;
}

export function ScreenReaderTable({ nodes, edges, statuses, selectedNodeId }: Props) {
  return (
    <div
      className="sr-only"
      style={{
        position: 'absolute',
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
      aria-live="polite"
    >
      {/* Current selection announcement */}
      {selectedNodeId && (
        <div role="status" aria-atomic="true">
          Selected: {nodes.find((n) => n.id === selectedNodeId)?.label || selectedNodeId}
        </div>
      )}

      {/* Components table */}
      <table aria-label="Circuit components">
        <caption>Wiring diagram components and their status</caption>
        <thead>
          <tr>
            <th scope="col">Component</th>
            <th scope="col">Type</th>
            <th scope="col">Status</th>
            <th scope="col">Location</th>
            <th scope="col">Systems</th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((node) => {
            const status = statuses[node.id] || 'untested';
            const statusConfig = STATUS_MAP[status];

            return (
              <tr key={node.id} aria-selected={node.id === selectedNodeId}>
                <th scope="row">{node.label}</th>
                <td>{node.type.replace(/_/g, ' ')}</td>
                <td>{statusConfig.label}</td>
                <td>{node.physicalLocation || 'Unknown'}</td>
                <td>{node.system.join(', ')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Connections table */}
      <table aria-label="Wire connections">
        <caption>Wire connections between components</caption>
        <thead>
          <tr>
            <th scope="col">From</th>
            <th scope="col">To</th>
            <th scope="col">Wire Color</th>
            <th scope="col">Gauge</th>
          </tr>
        </thead>
        <tbody>
          {edges.map((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.source);
            const targetNode = nodes.find((n) => n.id === edge.target);
            const colorName = wireColorName(edge.colorLabel);

            return (
              <tr key={edge.id}>
                <td>{sourceNode?.label || edge.source}</td>
                <td>{targetNode?.label || edge.target}</td>
                <td>{colorName}</td>
                <td>{edge.gauge || 'N/A'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
