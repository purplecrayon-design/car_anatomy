import { create } from 'zustand';
import type { ComponentData } from './useManualStore';

export interface SelectedComponent extends Partial<ComponentData> {
  id: string;
  label: string;
}

interface SelectedComponentState {
  selectedComponent: SelectedComponent | null;
  setSelectedComponent: (component: SelectedComponent | null) => void;
  clearSelection: () => void;
}

export const useSelectedComponentStore = create<SelectedComponentState>((set) => ({
  selectedComponent: null,

  setSelectedComponent: (component) => {
    set({ selectedComponent: component });
  },

  clearSelection: () => {
    set({ selectedComponent: null });
  },
}));
