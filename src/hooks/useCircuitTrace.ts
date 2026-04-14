import { useCallback } from 'react';
import { useStore } from '@/store';
import { bfsTrace } from '@/graph/tracing';

export function useCircuitTrace(nodes: Record<string, any>, edges: any[]) {
  const setTraceResult = useStore((s) => s.setTraceResult);
  const setSelectedNode = useStore((s) => s.setSelectedNode);

  const trace = useCallback(
    (nodeId: string) => {
      const result = bfsTrace(nodes, edges.map((e) => ({ id: e.id, source: e.source, target: e.target })), nodeId);
      setTraceResult(result);
      setSelectedNode(nodeId);
    },
    [nodes, edges, setTraceResult, setSelectedNode],
  );

  const clear = useCallback(() => {
    setTraceResult(null);
    setSelectedNode(null);
  }, [setTraceResult, setSelectedNode]);

  return { trace, clear };
}
