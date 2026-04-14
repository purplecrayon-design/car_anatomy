import type { StateCreator } from 'zustand';
import pdfIndexData from '@/data/pdf-index.json';

export interface TorqueSpec {
  name: string;
  nm: number;
  kgfcm: number;
  ftlbf: number;
  note?: string;
}

export interface ManualReference {
  pdf: string;
  page: number;
  excerpt: string;
}

export interface WiringReference {
  pdf: string;
  page: number;
  circuit: string;
}

export interface OBDReference {
  pids: string[];
  expectedRange: string;
  redFlags: string[];
}

export interface ComponentData {
  id: string;
  label: string;
  systems: string[];
  manual?: ManualReference;
  wiring?: WiringReference;
  torque?: TorqueSpec[] | null;
  obd?: OBDReference | null;
  shared?: boolean;
}

export interface ManualSlice {
  pdfIndex: Record<string, ComponentData>;
  getComponentData: (componentId: string) => ComponentData | null;
}

export const createManualSlice: StateCreator<ManualSlice> = () => ({
  pdfIndex: (pdfIndexData as { components: Record<string, ComponentData> }).components,
  getComponentData: (componentId: string) => {
    const index = (pdfIndexData as { components: Record<string, ComponentData> }).components;
    return index[componentId] || null;
  },
});
