import type { StateCreator } from 'zustand';
import type { TraceResult } from '@/types/circuit';

export interface DiagramSlice {
  currentPage: string;
  selectedNodeId: string | null;
  traceResult: TraceResult | null;
  zoom: number;
  panX: number;
  panY: number;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
  setCurrentPage: (page: string) => void;
  setSelectedNode: (id: string | null) => void;
  setTraceResult: (result: TraceResult | null) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  clearTrace: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHydrated: (hydrated: boolean) => void;
  clearError: () => void;
}

export const createDiagramSlice: StateCreator<DiagramSlice> = (set) => ({
  currentPage: 'charging',
  selectedNodeId: null,
  traceResult: null,
  zoom: 1,
  panX: 0,
  panY: 0,
  isLoading: false,
  error: null,
  isHydrated: false,
  setCurrentPage: (currentPage) => set({ currentPage }),
  setSelectedNode: (selectedNodeId) => set({ selectedNodeId }),
  setTraceResult: (traceResult) => set({ traceResult }),
  setZoom: (zoom) => set({ zoom }),
  setPan: (panX, panY) => set({ panX, panY }),
  clearTrace: () => set({ traceResult: null, selectedNodeId: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  setHydrated: (isHydrated) => set({ isHydrated }),
  clearError: () => set({ error: null }),
});
