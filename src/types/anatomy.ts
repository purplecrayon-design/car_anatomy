export interface AnatomyLayer {
  id: string;
  label: string;
  category: 'mechanical' | 'electrical' | 'fluid' | 'structural';
  color: string;
  svgFile: string;
}

export const ANATOMY_LAYERS: AnatomyLayer[] = [
  { id: 'engine-mechanical', label: 'Engine Mechanical', category: 'mechanical', color: '#E74C3C', svgFile: 'engine-mechanical.svg' },
  { id: 'wiring-harnesses', label: 'Wiring Harnesses', category: 'electrical', color: '#3498DB', svgFile: 'wiring-harnesses.svg' },
  { id: 'fuel-system', label: 'Fuel System', category: 'fluid', color: '#F39C12', svgFile: 'fuel-system.svg' },
  { id: 'cooling-system', label: 'Cooling System', category: 'fluid', color: '#1ABC9C', svgFile: 'cooling-system.svg' },
  { id: 'intake-exhaust', label: 'Intake/Exhaust', category: 'mechanical', color: '#9B59B6', svgFile: 'intake-exhaust.svg' },
  { id: 'suspension-brakes', label: 'Suspension & Brakes', category: 'structural', color: '#34495E', svgFile: 'suspension-brakes.svg' },
  { id: 'body-electrical', label: 'Body Electrical', category: 'electrical', color: '#E67E22', svgFile: 'body-electrical.svg' },
];

export const ANATOMY_LAYER_IDS = ANATOMY_LAYERS.map(l => l.id);
