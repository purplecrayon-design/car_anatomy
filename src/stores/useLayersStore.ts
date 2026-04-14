import { create } from 'zustand';

const LAYERS = [
  'chassis', 'engine-mechanical', 'engine-wiring', 'full-wiring',
  'fuel-system', 'cooling-system', 'intake-exhaust', 'suspension-steering',
  'brakes', 'body-electrical', 'hvac', 'drivetrain'
] as const;

interface LayersStore {
  activeLayers: string[];
  layerOpacity: Record<string, number>;
  globalOpacity: number;
  is3D: boolean;
  rotation3D: { x: number; y: number; z: number };
  isolatedLayer: string | null;

  toggleLayer: (id: string) => void;
  setOpacity: (layerId: string, value: number) => void;
  setGlobalOpacity: (value: number) => void;
  toggleAll: (on: boolean) => void;
  isolateLayer: (id: string | null) => void;
  toggle3D: () => void;
  set3DRotation: (rotation: { x: number; y: number; z: number }) => void;
  resetAll: () => void;
}

export const useLayersStore = create<LayersStore>((set) => ({
  activeLayers: ['engine-mechanical', 'full-wiring'],
  layerOpacity: {},
  globalOpacity: 100,
  is3D: false,
  rotation3D: { x: 0, y: 0, z: 0 },
  isolatedLayer: null,

  toggleLayer: (id) =>
    set((state) => ({
      activeLayers: state.activeLayers.includes(id)
        ? state.activeLayers.filter((l) => l !== id)
        : [...state.activeLayers, id],
      isolatedLayer: null,
    })),

  setOpacity: (layerId, value) =>
    set((state) => ({
      layerOpacity: { ...state.layerOpacity, [layerId]: value },
    })),

  setGlobalOpacity: (value) => set({ globalOpacity: value }),

  toggleAll: (on) =>
    set({
      activeLayers: on ? [...LAYERS] : [],
      isolatedLayer: null,
    }),

  isolateLayer: (id) =>
    set((state) => ({
      isolatedLayer: id,
      activeLayers: id && !state.activeLayers.includes(id)
        ? [...state.activeLayers, id]
        : state.activeLayers,
    })),

  toggle3D: () =>
    set((state) => ({
      is3D: !state.is3D,
      rotation3D: state.is3D ? { x: 0, y: 0, z: 0 } : state.rotation3D,
    })),

  set3DRotation: (rotation) => set({ rotation3D: rotation }),

  resetAll: () =>
    set({
      activeLayers: ['engine-mechanical', 'full-wiring'],
      layerOpacity: {},
      globalOpacity: 100,
      is3D: false,
      rotation3D: { x: 0, y: 0, z: 0 },
      isolatedLayer: null,
    }),
}));
