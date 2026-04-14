import { describe, it, expect } from 'vitest';
import { validateGraph } from '../../src/graph/validation';

describe('validateGraph', () => {
  it('detects orphan nodes', () => {
    const nodes = { A: { id: 'A', type: 'fuse', system: [] } as any, B: { id: 'B', type: 'ground', system: [] } as any };
    const result = validateGraph(nodes, []);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
