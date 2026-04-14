import type { StateCreator } from 'zustand';
import type { LayerState } from '@/types/ui';

export interface LayerSlice {
  layers: Record<string, LayerState>;
  soloLayer: string | null;
  globalOpacity: number;
  setLayerVisibility: (id: string, visible: boolean) => void;
  setLayerOpacity: (id: string, opacity: number) => void;
  setSoloLayer: (id: string | null) => void;
  setGlobalOpacity: (opacity: number) => void;
  showAllLayers: () => void;
  hideAllLayers: () => void;
  initLayers: (systemIds: string[]) => void;
}

export const createLayerSlice: StateCreator<LayerSlice> = (set) => ({
  layers: {},
  soloLayer: null,
  globalOpacity: 100,
  setLayerVisibility: (id, visible) =>
    set((s) => ({ layers: { ...s.layers, [id]: { ...s.layers[id], visible } } })),
  setLayerOpacity: (id, opacity) =>
    set((s) => ({ layers: { ...s.layers, [id]: { ...s.layers[id], opacity } } })),
  setSoloLayer: (soloLayer) => set({ soloLayer }),
  setGlobalOpacity: (globalOpacity) => set({ globalOpacity }),
  showAllLayers: () =>
    set((s) => {
      const layers = { ...s.layers };
      for (const k of Object.keys(layers)) layers[k] = { ...layers[k], visible: true };
      return { layers, soloLayer: null };
    }),
  hideAllLayers: () =>
    set((s) => {
      const layers = { ...s.layers };
      for (const k of Object.keys(layers)) layers[k] = { ...layers[k], visible: false };
      return { layers };
    }),
  initLayers: (ids) =>
    set({ layers: Object.fromEntries(ids.map((id) => [id, { visible: true, opacity: 100 }])), soloLayer: null }),
});
