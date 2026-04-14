import type { StateCreator } from 'zustand';

export type VehicleId = 'es300' | 'camry';
export type ViewType = 'side' | 'top';

export interface VehicleSlice {
  currentVehicle: VehicleId;
  currentView: ViewType;
  setVehicle: (vehicle: VehicleId) => void;
  setView: (view: ViewType) => void;
}

export const createVehicleSlice: StateCreator<VehicleSlice> = (set) => ({
  currentVehicle: 'es300',
  currentView: 'side',
  setVehicle: (currentVehicle) => set({ currentVehicle }),
  setView: (currentView) => set({ currentView }),
});
