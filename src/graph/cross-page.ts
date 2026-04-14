import type { WireEdge } from '@/types/circuit';

export interface CrossPageRef {
  edgeId: string;
  fromPage: number;
  toPage: number;
  targetWireId: string;
}

export function findCrossPageRefs(edges: WireEdge[]): CrossPageRef[] {
  return edges
    .filter((e) => e.crossRef != null)
    .map((e) => ({
      edgeId: e.id,
      fromPage: e.diagramPage,
      toPage: e.crossRef!.targetPage,
      targetWireId: e.crossRef!.targetWireId,
    }));
}
