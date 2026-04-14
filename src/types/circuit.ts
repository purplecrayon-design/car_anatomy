export interface CircuitNode {
  id: string;
  type: NodeType;
  label: string;
  toyotaCode: string;
  position: { x: number; y: number };
  diagramPage: number;
  system: string[];
  physicalLocation?: string;
  expectedVoltage?: string;
  pins?: string;
  education?: {
    purpose: string;
    failureModes?: string[];
    testProcedure?: { tool: string; steps: string[] };
  };
}

export type NodeType =
  | 'power_source'
  | 'fuse'
  | 'relay'
  | 'ecu'
  | 'switch'
  | 'actuator'
  | 'ground'
  | 'splice'
  | 'junction_block'
  | 'sensor'
  | 'connector';

export interface WireEdge {
  id: string;
  source: string;
  target: string;
  primaryColor: WireColorCode;
  stripeColor?: WireColorCode;
  colorLabel: string;
  gauge?: string;
  circuitId: string;
  sourcePin?: string;
  targetPin?: string;
  diagramPage: number;
  crossRef?: { targetPage: number; targetWireId: string };
  controlPoints: { cx: number; cy: number };
}

export type WireColorCode =
  | 'B' | 'BR' | 'G' | 'GR' | 'L' | 'LG'
  | 'O' | 'P' | 'R' | 'V' | 'W' | 'Y';

export interface SystemDef {
  id: string;
  label: string;
  color: string;
  category: SystemCategory;
  diagramPages: number[];
  description: string;
}

export type SystemCategory =
  | 'engine'
  | 'safety'
  | 'lighting'
  | 'body'
  | 'comfort'
  | 'optional';

export interface FuseEntry {
  id: string;
  label: string;
  rating: string;
  location: 'engine_jb' | 'cabin_fb';
  affectedSystems: string[];
}

export interface GroundPoint {
  id: string;
  code: string;
  location: string;
  connectedSystems: string[];
}

export interface TraceResult {
  nodes: Set<string>;
  edges: Set<string>;
  path: string[];
}

export interface GraphData {
  nodes: CircuitNode[];
  edges: WireEdge[];
}
