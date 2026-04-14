import type { StateCreator } from 'zustand';
import type { InteractionMode, DifficultyLevel } from '@/types/ui';

export type ViewMode = 'dashboard' | 'explore';

export interface UISlice {
  viewMode: ViewMode;
  mode: InteractionMode;
  difficulty: DifficultyLevel;
  sidebarOpen: boolean;
  detailPanelOpen: boolean;
  setViewMode: (viewMode: ViewMode) => void;
  setMode: (mode: InteractionMode) => void;
  setDifficulty: (level: DifficultyLevel) => void;
  toggleSidebar: () => void;
  toggleDetailPanel: () => void;
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
  viewMode: 'dashboard',
  mode: 'trace',
  difficulty: 'intermediate',
  sidebarOpen: true,
  detailPanelOpen: true,
  setViewMode: (viewMode) => set({ viewMode }),
  setMode: (mode) => set({ mode }),
  setDifficulty: (difficulty) => set({ difficulty }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleDetailPanel: () => set((s) => ({ detailPanelOpen: !s.detailPanelOpen })),
});
