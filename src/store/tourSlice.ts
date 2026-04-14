import type { StateCreator } from 'zustand';

export interface TourSlice {
  tourIndex: number;
  tourSystemId: string | null;
  startTour: (systemId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
}

export const createTourSlice: StateCreator<TourSlice> = (set) => ({
  tourIndex: -1,
  tourSystemId: null,
  startTour: (systemId) => set({ tourSystemId: systemId, tourIndex: 0 }),
  nextStep: () => set((s) => ({ tourIndex: s.tourIndex + 1 })),
  prevStep: () => set((s) => ({ tourIndex: Math.max(0, s.tourIndex - 1) })),
  endTour: () => set({ tourIndex: -1, tourSystemId: null }),
});
