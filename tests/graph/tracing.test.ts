import { describe, it, expect } from 'vitest';
import { bfsTrace } from '../../src/graph/tracing';

describe('bfsTrace', () => {
  const nodes = { A: { id: 'A' }, B: { id: 'B' }, C: { id: 'C' } };
  const edges = [
    { id: 'e1', source: 'A', target: 'B' },
    { id: 'e2', source: 'B', target: 'C' },
  ];

  it('traces all connected nodes from start', () => {
    const result = bfsTrace(nodes, edges, 'A');
    expect(result.nodes.has('A')).toBe(true);
    expect(result.nodes.has('B')).toBe(true);
    expect(result.nodes.has('C')).toBe(true);
    expect(result.edges.size).toBe(2);
  });

  it('traces from middle node in both directions', () => {
    const result = bfsTrace(nodes, edges, 'B');
    expect(result.nodes.size).toBe(3);
  });
});
