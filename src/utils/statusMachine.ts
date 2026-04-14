import type { DiagnosticStatus } from '@/types/diagnostic';

const ORDER: DiagnosticStatus[] = ['untested', 'testing', 'good', 'suspected', 'bad'];

export function cycleStatus(current: DiagnosticStatus): DiagnosticStatus {
  const idx = ORDER.indexOf(current);
  return ORDER[(idx + 1) % ORDER.length];
}
