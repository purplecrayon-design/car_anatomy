export interface DiagnosticSession {
  id?: number;
  name: string;
  vehicleId: string;
  symptom?: string;
  createdAt: number;
  updatedAt: number;
}

export interface SessionExport {
  version: number;
  session: DiagnosticSession;
  statuses: Record<string, string>;
  voltageReadings: Array<{ testPointId: string; expected: number; actual: number; condition: string }>;
  annotations: Array<{ svgX: number; svgY: number; pageId: string; text: string }>;
  layerState: Record<string, { visible: boolean; opacity: number }>;
}
