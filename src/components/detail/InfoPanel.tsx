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
  obd: 'OBD',
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

  // If no data found, show basic info
  if (!data) {
    return (
      <div style={{ padding: 16 }}>
        <div
          style={{
            padding: 12,
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            marginBottom: 12,
          }}
        >
          <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
            {componentId}
          </h2>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
            No manual data available for this component.
          </p>
        </div>

        <StatusSelector
          componentId={componentId}
          componentLabel={componentId}
          status={statuses[componentId] || 'untested'}
          onStatusChange={setComponentStatus}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div
        style={{
          padding: 12,
          background: 'var(--bg-elevated)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <h2 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
          {data.label}
        </h2>
        <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
          {data.systems.map((sys) => (
            <span
              key={sys}
              style={{
                padding: '2px 6px',
                background: 'var(--bg-base)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 8,
                color: 'var(--text-muted)',
              }}
            >
              {sys}
            </span>
          ))}
        </div>
      </div>

      {/* Shared parts banner */}
      {data.shared && (
        <div
          style={{
            padding: '8px 12px',
            background: 'var(--accent)',
            color: 'var(--bg-base)',
            fontSize: 9,
            fontWeight: 500,
          }}
        >
          Also fits 1997 Toyota Camry (1MZ-FE). Consider both when replacing.
        </div>
      )}

      {/* Tab bar */}
      <nav
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-surface)',
        }}
        role="tablist"
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
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '8px 4px',
                background: isActive ? 'var(--bg-elevated)' : 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                color: isActive ? 'var(--text-primary)' : hasData ? 'var(--text-muted)' : 'var(--text-ghost)',
                fontSize: 9,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {TAB_LABELS[tab]}
            </button>
          );
        })}
      </nav>

      {/* Tab content */}
      <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
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
