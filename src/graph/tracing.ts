import type { TraceResult } from '@/types/circuit';

interface AdjEntry {
  node: string;
  edge: string;
}

export function bfsTrace(
  nodes: Record<string, { id: string }>,
  edges: Array<{ id: string; source: string; target: string }>,
  startId: string,
): TraceResult {
  const adj: Record<string, AdjEntry[]> = {};
  for (const id of Object.keys(nodes)) {
    adj[id] = [];
  }
  for (const e of edges) {
    adj[e.source]?.push({ node: e.target, edge: e.id });
    adj[e.target]?.push({ node: e.source, edge: e.id });
  }

  const visitedNodes = new Set<string>();
  const visitedEdges = new Set<string>();
  const path: string[] = [];
  const queue: string[] = [startId];
  visitedNodes.add(startId);

  while (queue.length > 0) {
    const cur = queue.shift()!;
    path.push(cur);
    for (const link of adj[cur] || []) {
      if (!visitedNodes.has(link.node)) {
        visitedNodes.add(link.node);
        visitedEdges.add(link.edge);
        queue.push(link.node);
      }
    }
  }

  return { nodes: visitedNodes, edges: visitedEdges, path };
}

export function directedTrace(
  nodes: Record<string, { id: string; type: string }>,
  edges: Array<{ id: string; source: string; target: string }>,
  startId: string,
  direction: 'upstream' | 'downstream',
): TraceResult {
  const adj: Record<string, AdjEntry[]> = {};
  for (const id of Object.keys(nodes)) {
    adj[id] = [];
  }
  for (const e of edges) {
    if (direction === 'downstream') {
      adj[e.source]?.push({ node: e.target, edge: e.id });
    } else {
      adj[e.target]?.push({ node: e.source, edge: e.id });
    }
  }

  const visitedNodes = new Set<string>();
  const visitedEdges = new Set<string>();
  const path: string[] = [];
  const queue: string[] = [startId];
  visitedNodes.add(startId);

  while (queue.length > 0) {
    const cur = queue.shift()!;
    path.push(cur);
    for (const link of adj[cur] || []) {
      if (!visitedNodes.has(link.node)) {
        visitedNodes.add(link.node);
        visitedEdges.add(link.edge);
        queue.push(link.node);
      }
    }
  }

  return { nodes: visitedNodes, edges: visitedEdges, path };
}
