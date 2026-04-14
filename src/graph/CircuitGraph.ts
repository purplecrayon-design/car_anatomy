import Graph from 'graphology';
import type { CircuitNode, WireEdge, GraphData } from '@/types/circuit';

export class CircuitGraph {
  private graph: Graph;

  constructor() {
    this.graph = new Graph({ multi: false, type: 'undirected' });
  }

  load(data: GraphData): void {
    this.graph.clear();
    for (const node of data.nodes) {
      this.graph.addNode(node.id, node);
    }
    for (const edge of data.edges) {
      this.graph.addEdge(edge.source, edge.target, edge);
    }
  }

  getNode(id: string): CircuitNode | undefined {
    try {
      return this.graph.getNodeAttributes(id) as CircuitNode;
    } catch {
      return undefined;
    }
  }

  getEdge(id: string): WireEdge | undefined {
    try {
      return this.graph.getEdgeAttributes(id) as WireEdge;
    } catch {
      return undefined;
    }
  }

  getAllNodes(): CircuitNode[] {
    return this.graph.mapNodes((_id, attrs) => attrs as CircuitNode);
  }

  getAllEdges(): WireEdge[] {
    return this.graph.mapEdges((_id, attrs) => attrs as WireEdge);
  }

  getNodesBySystem(systemId: string): CircuitNode[] {
    return this.getAllNodes().filter((n) => n.system.includes(systemId));
  }

  getConnectedEdges(nodeId: string): WireEdge[] {
    try {
      return this.graph.mapEdges(nodeId, (_id, attrs) => attrs as WireEdge);
    } catch {
      return [];
    }
  }

  getNeighbors(nodeId: string): string[] {
    try {
      return this.graph.neighbors(nodeId);
    } catch {
      return [];
    }
  }

  get nodeCount(): number {
    return this.graph.order;
  }

  get edgeCount(): number {
    return this.graph.size;
  }

  export(): string {
    return JSON.stringify(this.graph.export());
  }
}
