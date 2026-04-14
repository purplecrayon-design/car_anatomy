import { useStore } from '@/store';
import { InfoPanel } from '../detail/InfoPanel';
import { EmptyState } from '../detail/EmptyState';

export function DetailPanel() {
  const selectedNodeId = useStore((s) => s.selectedNodeId);

  return (
    <aside
      style={{
        background: 'var(--bg-surface)',
        borderLeft: '1px solid var(--border)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {selectedNodeId ? <InfoPanel componentId={selectedNodeId} /> : <EmptyState />}
    </aside>
  );
}
