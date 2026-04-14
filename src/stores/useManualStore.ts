import { create } from 'zustand';
import pdfIndex from '@/data/pdf-index.json';

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

interface ManualState {
  pdfIndex: Record<string, ComponentData>;
  getData: (componentId: string) => ComponentData | null;
  searchComponents: (query: string) => ComponentData[];
}

const components = (pdfIndex as { components: Record<string, ComponentData> }).components;

export const useManualStore = create<ManualState>(() => ({
  pdfIndex: components,

  getData: (componentId: string) => {
    return components[componentId] || null;
  },

  searchComponents: (query: string) => {
    const lowerQuery = query.toLowerCase();
    return Object.values(components).filter(
      (c) =>
        c.id.toLowerCase().includes(lowerQuery) ||
        c.label.toLowerCase().includes(lowerQuery) ||
        c.systems.some((s) => s.toLowerCase().includes(lowerQuery))
    );
  },
}));
