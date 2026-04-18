import type { SessionExport } from '@/types/session';

export function exportSession(data: SessionExport): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'car-anatomy-session-' + Date.now() + '.json';
  a.click();
  URL.revokeObjectURL(url);
}
