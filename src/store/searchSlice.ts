import type { StateCreator } from 'zustand';

export interface SearchSlice {
  searchQuery: string;
  commandPaletteOpen: boolean;
  setSearchQuery: (q: string) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
}

export const createSearchSlice: StateCreator<SearchSlice> = (set) => ({
  searchQuery: '',
  commandPaletteOpen: false,
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
  toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
});
