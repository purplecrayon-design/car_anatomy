import { create } from 'zustand';
import es300Manifest from '@/data/vehicles/es300-1997/manifest.json';
import camryManifest from '@/data/vehicles/camry-1997/manifest.json';

export interface VehicleManifest {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  generation: string;
  engine: {
    code: string;
    displacement: string;
    configuration: string;
    power: string;
    torque: string;
  };
  transmission: string;
  drivetrain: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    wheelbase: number;
  };
  colors: Record<string, string>;
  defaultColor: string;
  silhouette: string;
  layers: LayerDefinition[];
}

export interface LayerDefinition {
  id: string;
  name: string;
  file: string;
  description?: string;
  shared: boolean;
  defaultVisible: boolean;
}

interface VehicleState {
  currentVehicle: VehicleManifest;
  availableVehicles: VehicleManifest[];
  setVehicle: (vehicleId: string) => void;
}

const vehicles: VehicleManifest[] = [
  es300Manifest as VehicleManifest,
  camryManifest as VehicleManifest,
];

export const useVehicleStore = create<VehicleState>((set) => ({
  currentVehicle: vehicles[0],
  availableVehicles: vehicles,
  setVehicle: (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (vehicle) {
      set({ currentVehicle: vehicle });
    }
  },
}));
