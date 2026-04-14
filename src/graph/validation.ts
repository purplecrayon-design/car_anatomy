import type { CircuitNode, WireEdge } from '@/types/circuit';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateGraph(
  nodes: Record<string, CircuitNode>,
  edges: WireEdge[],
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const edgeNodeIds = new Set<string>();
  for (const e of edges) {
    edgeNodeIds.add(e.source);
    edgeNodeIds.add(e.target);
  }

  // Check for orphan nodes
  for (const id of Object.keys(nodes)) {
    if (!edgeNodeIds.has(id)) {
      errors.push('Orphan node (no connections): ' + id);
    }
  }

  // Check for edges referencing missing nodes
  for (const e of edges) {
    if (!nodes[e.source]) errors.push('Edge ' + e.id + ' references missing source: ' + e.source);
    if (!nodes[e.target]) errors.push('Edge ' + e.id + ' references missing target: ' + e.target);
  }

  // Check for ground reachability
  const grounds = Object.values(nodes).filter((n) => n.type === 'ground');
  if (grounds.length === 0) warnings.push('No ground nodes found');

  const powers = Object.values(nodes).filter((n) => n.type === 'power_source');
  if (powers.length === 0) warnings.push('No power source nodes found');

  return { valid: errors.length === 0, errors, warnings };
}
