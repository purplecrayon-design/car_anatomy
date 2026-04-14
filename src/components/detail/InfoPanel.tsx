import { useState } from 'react';
import { useStore } from '@/store';
import { ManualTab } from './ManualTab';
import { WiringTab } from './WiringTab';
import { OBDTab } from './OBDTab';
import { TorqueTab } from './TorqueTab';
import { NotesTab } from './NotesTab';
import { StatusSelector } from '../notepad/StatusSelector';

const TABS = ['manual', 'wiring', 'obd', 'torque', 'notes'] as const;
type TabId = typeof TABS[number];

const TAB_LABELS: Record<TabId, string> = {
  manual: 'Manual',
  wiring: 'Wiring',
  obd: 'OBD-II',
  torque: 'Torque',
  notes: 'Notes',
};

interface Props {
  componentId: string;
}

export function InfoPanel({ componentId }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('manual');

  const getComponentData = useStore((s) => s.getComponentData);
  const statuses = useStore((s) => s.componentStatuses);
  const setComponentStatus = useStore((s) => s.setComponentStatus);

  const data = getComponentData(componentId);

  if (!data) {
    return (
      <div style={{ padding: 24 }}>
        <div
          style={{
            padding: 24,
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>
            {componentId}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            No data available for this component.
          </p>
        </div>

        <div style={{ marginTop: 16 }}>
          <StatusSelector
            componentId={componentId}
            componentLabel={componentId}
            status={statuses[componentId] || 'untested'}
            onStatusChange={setComponentStatus}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>
          {data.label}
        </h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {data.systems.map((sys) => (
            <span
              key={sys}
              style={{
                padding: '4px 10px',
                background: 'var(--bg-base)',
                borderRadius: 'var(--radius-full)',
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {sys.replace('-', ' ')}
            </span>
          ))}
        </div>
      </div>

      {/* Shared parts notice */}
      {data.shared && (
        <div
          style={{
            padding: '12px 24px',
            background: 'var(--accent)',
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          Shared with 1997 Toyota Camry (1MZ-FE)
        </div>
      )}

      {/* Tab bar */}
      <nav
        style={{
          display: 'flex',
          padding: '0 24px',
          borderBottom: '1px solid var(--border)',
          gap: 8,
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          const hasData =
            (tab === 'manual' && data.manual) ||
            (tab === 'wiring' && data.wiring) ||
            (tab === 'obd' && data.obd) ||
            (tab === 'torque' && data.torque) ||
            tab === 'notes';

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 4px',
                background: 'transparent',
                color: isActive ? 'var(--accent)' : hasData ? 'var(--text-secondary)' : 'var(--text-ghost)',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                marginBottom: -1,
                transition: 'all 0.15s ease',
              }}
            >
              {TAB_LABELS[tab]}
            </button>
          );
        })}
      </nav>

      {/* Tab content */}
      <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
        {activeTab === 'manual' && <ManualTab data={data.manual} />}
        {activeTab === 'wiring' && <WiringTab data={data.wiring} />}
        {activeTab === 'obd' && <OBDTab data={data.obd} />}
        {activeTab === 'torque' && <TorqueTab data={data.torque} />}
        {activeTab === 'notes' && (
          <NotesTab componentId={componentId} componentLabel={data.label} />
        )}
      </div>
    </div>
  );
}
