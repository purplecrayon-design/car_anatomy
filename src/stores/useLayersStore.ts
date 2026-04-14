import { create } from 'zustand';
import { useVehicleStore } from './useVehicleStore';

interface LayersState {
  activeLayers: string[];
  layerOpacity: Record<string, number>;
  globalOpacity: number;
  isolatedLayer: string | null;

  toggleLayer: (layerId: string) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  setGlobalOpacity: (opacity: number) => void;
  isolateLayer: (layerId: string | null) => void;
  showAllLayers: () => void;
  hideAllLayers: () => void;
  resetToDefaults: () => void;
}

export const useLayersStore = create<LayersState>((set) => ({
  activeLayers: ['engine-mechanical', 'full-wiring'],
  layerOpacity: {},
  globalOpacity: 100,
  isolatedLayer: null,

  toggleLayer: (layerId: string) => {
    set((state) => {
      const isActive = state.activeLayers.includes(layerId);
      return {
        activeLayers: isActive
          ? state.activeLayers.filter((id) => id !== layerId)
          : [...state.activeLayers, layerId],
        isolatedLayer: null,
      };
    });
  },

  setLayerOpacity: (layerId: string, opacity: number) => {
    set((state) => ({
      layerOpacity: {
        ...state.layerOpacity,
        [layerId]: Math.max(0, Math.min(100, opacity)),
      },
    }));
  },

  setGlobalOpacity: (opacity: number) => {
    set({ globalOpacity: Math.max(0, Math.min(100, opacity)) });
  },

  isolateLayer: (layerId: string | null) => {
    if (layerId === null) {
      set({ isolatedLayer: null });
      return;
    }

    set((state) => ({
      isolatedLayer: layerId,
      activeLayers: state.activeLayers.includes(layerId)
        ? state.activeLayers
        : [...state.activeLayers, layerId],
    }));
  },

  showAllLayers: () => {
    const vehicle = useVehicleStore.getState().currentVehicle;
    set({
      activeLayers: vehicle.layers.map((l) => l.id),
      isolatedLayer: null,
    });
  },

  hideAllLayers: () => {
    set({
      activeLayers: [],
      isolatedLayer: null,
    });
  },

  resetToDefaults: () => {
    const vehicle = useVehicleStore.getState().currentVehicle;
    set({
      activeLayers: vehicle.layers
        .filter((l) => l.defaultVisible)
        .map((l) => l.id),
      layerOpacity: {},
      globalOpacity: 100,
      isolatedLayer: null,
    });
  },
}));
