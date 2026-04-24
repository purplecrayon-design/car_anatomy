export interface AnatomyLayer {
  id: string;
  label: string;
  category: 'mechanical' | 'electrical' | 'fluid' | 'structural';
  color: string;
  svgFile: string;
}

export const ANATOMY_LAYERS: AnatomyLayer[] = [
  { id: 'chassis', label: 'Chassis', category: 'structural', color: '#7F8C8D', svgFile: 'chassis.svg' },
  { id: 'engine-mechanical', label: 'Engine Mechanical', category: 'mechanical', color: '#E74C3C', svgFile: 'engine-mechanical.svg' },
  { id: 'engine-wiring', label: 'Engine Wiring', category: 'electrical', color: '#3498DB', svgFile: 'engine-wiring.svg' },
  { id: 'full-wiring', label: 'Full Wiring', category: 'electrical', color: '#2980B9', svgFile: 'full-wiring.svg' },
  { id: 'fuel-system', label: 'Fuel System', category: 'fluid', color: '#F39C12', svgFile: 'fuel-system.svg' },
  { id: 'cooling-system', label: 'Cooling System', category: 'fluid', color: '#1ABC9C', svgFile: 'cooling-system.svg' },
  { id: 'intake-exhaust', label: 'Intake/Exhaust', category: 'mechanical', color: '#9B59B6', svgFile: 'intake-exhaust.svg' },
  { id: 'suspension-steering', label: 'Suspension & Steering', category: 'structural', color: '#34495E', svgFile: 'suspension-steering.svg' },
  { id: 'brakes', label: 'Brakes', category: 'structural', color: '#C0392B', svgFile: 'brakes.svg' },
  { id: 'body-electrical', label: 'Body Electrical', category: 'electrical', color: '#E67E22', svgFile: 'body-electrical.svg' },
  { id: 'hvac', label: 'HVAC', category: 'mechanical', color: '#16A085', svgFile: 'hvac.svg' },
  { id: 'drivetrain', label: 'Drivetrain', category: 'mechanical', color: '#8E44AD', svgFile: 'drivetrain.svg' },
];

export const ANATOMY_LAYER_IDS = ANATOMY_LAYERS.map(l => l.id);
