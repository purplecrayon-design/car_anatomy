import { create } from 'zustand';
import { useVehicleStore } from './useVehicleStore';

const ALL_LAYER_IDS = [
  'chassis',
  'engine-mechanical',
  'engine-wiring',
  'full-wiring',
  'fuel-system',
  'cooling-system',
  'intake-exhaust',
  'suspension-steering',
  'brakes',
  'body-electrical',
  'hvac',
  'drivetrain',
];

interface LayersState {
  activeLayers: string[];
  layerOpacity: Record<string, number>;
  globalOpacity: number;
  isolatedLayer: string | null;
  is3D: boolean;
  rotation3D: { x: number; y: number; z: number };

  toggleLayer: (layerId: string) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  setOpacity: (opacity: number) => void;
  setGlobalOpacity: (opacity: number) => void;
  isolateLayer: (layerId: string | null) => void;
  showAllLayers: () => void;
  hideAllLayers: () => void;
  toggleAll: (show: boolean) => void;
  toggle3D: () => void;
  set3DRotation: (rotation: { x: number; y: number; z: number }) => void;
  resetAll: () => void;
  resetToDefaults: () => void;
}

export const useLayersStore = create<LayersState>((set) => ({
  activeLayers: ['engine-mechanical', 'full-wiring'],
  layerOpacity: { global: 1 },
  globalOpacity: 100,
  isolatedLayer: null,
  is3D: false,
  rotation3D: { x: 0, y: 0, z: 0 },

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

  setOpacity: (opacity: number) => {
    set((state) => ({
      layerOpacity: {
        ...state.layerOpacity,
        global: Math.max(0, Math.min(1, opacity)),
      },
      globalOpacity: Math.round(opacity * 100),
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
    set({
      activeLayers: ALL_LAYER_IDS,
      isolatedLayer: null,
    });
  },

  hideAllLayers: () => {
    set({
      activeLayers: [],
      isolatedLayer: null,
    });
  },

  toggleAll: (show: boolean) => {
    set({
      activeLayers: show ? ALL_LAYER_IDS : [],
      isolatedLayer: null,
    });
  },

  toggle3D: () => {
    set((state) => ({
      is3D: !state.is3D,
      rotation3D: state.is3D ? { x: 0, y: 0, z: 0 } : state.rotation3D,
    }));
  },

  set3DRotation: (rotation: { x: number; y: number; z: number }) => {
    set({ rotation3D: rotation });
  },

  resetAll: () => {
    set({
      activeLayers: ['engine-mechanical', 'full-wiring'],
      layerOpacity: { global: 1 },
      globalOpacity: 100,
      isolatedLayer: null,
      is3D: false,
      rotation3D: { x: 0, y: 0, z: 0 },
    });
  },

  resetToDefaults: () => {
    const vehicle = useVehicleStore.getState().currentVehicle;
    set({
      activeLayers: vehicle.layers
        .filter((l) => l.defaultVisible)
        .map((l) => l.id),
      layerOpacity: { global: 1 },
      globalOpacity: 100,
      isolatedLayer: null,
      is3D: false,
      rotation3D: { x: 0, y: 0, z: 0 },
    });
  },
}));
