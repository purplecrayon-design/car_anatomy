import { LayerPanel } from '../layers/LayerPanel';
import { ProgressTracker } from '../notepad/ProgressTracker';

export function Sidebar() {
  return (
    <aside style={{
      background: 'var(--bg-surface)', borderRight: '1px solid var(--border)',
      padding: '10px 8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <LayerPanel />
      <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }} />
      <ProgressTracker />
    </aside>
  );
}
