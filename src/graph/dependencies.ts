import { bfsTrace } from './tracing';
import type { CircuitNode, WireEdge } from '@/types/circuit';

export function fuseImpact(
  nodes: Record<string, CircuitNode>,
  edges: WireEdge[],
  fuseId: string,
): string[] {
  const result = bfsTrace(
    nodes,
    edges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
    fuseId,
  );
  const systems = new Set<string>();
  for (const nodeId of result.nodes) {
    const node = nodes[nodeId];
    if (node) {
      for (const s of node.system) {
        systems.add(s);
      }
    }
  }
  return Array.from(systems);
}

export function sharedComponents(
  nodes: Record<string, CircuitNode>,
  systemA: string,
  systemB: string,
): CircuitNode[] {
  return Object.values(nodes).filter(
    (n) => n.system.includes(systemA) && n.system.includes(systemB),
  );
}
