import type { StateCreator } from 'zustand';
import type { DiagnosticStatus, VoltageReading, Annotation } from '@/types/diagnostic';

export interface DiagnosticSlice {
  componentStatuses: Record<string, DiagnosticStatus>;
  voltageReadings: Record<string, VoltageReading>;
  annotations: Annotation[];
  setComponentStatus: (id: string, status: DiagnosticStatus) => void;
  addVoltageReading: (reading: VoltageReading) => void;
  addAnnotation: (annotation: Annotation) => void;
  removeAnnotation: (index: number) => void;
  resetAllStatuses: () => void;
  initStatuses: (nodeIds: string[]) => void;
}

export const createDiagnosticSlice: StateCreator<DiagnosticSlice> = (set) => ({
  componentStatuses: {},
  voltageReadings: {},
  annotations: [],
  setComponentStatus: (id, status) =>
    set((s) => ({ componentStatuses: { ...s.componentStatuses, [id]: status } })),
  addVoltageReading: (reading) =>
    set((s) => ({ voltageReadings: { ...s.voltageReadings, [reading.testPointId]: reading } })),
  addAnnotation: (annotation) => set((s) => ({ annotations: [...s.annotations, annotation] })),
  removeAnnotation: (index) =>
    set((s) => ({ annotations: s.annotations.filter((_, i) => i !== index) })),
  resetAllStatuses: () =>
    set((s) => {
      const r: Record<string, DiagnosticStatus> = {};
      for (const k of Object.keys(s.componentStatuses)) r[k] = 'untested';
      return { componentStatuses: r };
    }),
  initStatuses: (ids) =>
    set({ componentStatuses: Object.fromEntries(ids.map((id) => [id, 'untested' as DiagnosticStatus])) }),
});
