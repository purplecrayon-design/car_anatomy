import { create } from 'zustand';

export interface GraphNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
  type?: string;
  system?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  sourceX?: number;
  sourceY?: number;
  targetX?: number;
  targetY?: number;
  wireColor?: string;
  gauge?: string;
}

interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  setGraph: (nodes: GraphNode[], edges: GraphEdge[]) => void;
  addNode: (node: GraphNode) => void;
  removeNode: (nodeId: string) => void;
  getNodeById: (nodeId: string) => GraphNode | undefined;
  getConnectedNodes: (nodeId: string) => GraphNode[];
}

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: [],
  edges: [],

  setGraph: (nodes, edges) => {
    set({ nodes, edges });
  },

  addNode: (node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
    }));
  },

  removeNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      ),
    }));
  },

  getNodeById: (nodeId) => {
    return get().nodes.find((n) => n.id === nodeId);
  },

  getConnectedNodes: (nodeId) => {
    const edges = get().edges;
    const nodes = get().nodes;
    const connectedIds = new Set<string>();

    edges.forEach((e) => {
      if (e.source === nodeId) connectedIds.add(e.target);
      if (e.target === nodeId) connectedIds.add(e.source);
    });

    return nodes.filter((n) => connectedIds.has(n.id));
  },
}));
