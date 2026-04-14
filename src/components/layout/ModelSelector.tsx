import { useStore } from '@/store';
import type { VehicleId } from '@/store/vehicleSlice';

const VEHICLES: { id: VehicleId; label: string; make: string }[] = [
  { id: 'es300', label: 'ES300', make: 'Lexus' },
  { id: 'camry', label: 'Camry', make: 'Toyota' },
];

export function ModelSelector() {
  const currentVehicle = useStore((s) => s.currentVehicle);
  const setVehicle = useStore((s) => s.setVehicle);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        background: 'var(--bg-base)',
        borderRadius: 'var(--radius-sm)',
        padding: 2,
      }}
      role="radiogroup"
      aria-label="Vehicle selector"
    >
      {VEHICLES.map((v) => {
        const isActive = currentVehicle === v.id;
        return (
          <button
            key={v.id}
            onClick={() => setVehicle(v.id)}
            style={{
              padding: '4px 8px',
              background: isActive ? 'var(--bg-elevated)' : 'transparent',
              border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
              borderRadius: 'var(--radius-sm)',
              color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: 9,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            role="radio"
            aria-checked={isActive}
            aria-label={`${v.make} ${v.label}`}
          >
            {v.label}
          </button>
        );
      })}
    </div>
  );
}
