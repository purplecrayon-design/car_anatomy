import type { VoltageResult } from '@/types/diagnostic';

export function checkVoltage(expected: number, actual: number): VoltageResult {
  if (expected === 0) return actual === 0 ? 'pass' : 'fail';
  const pct = Math.abs((actual - expected) / expected) * 100;
  if (pct <= 10) return 'pass';
  if (pct <= 25) return 'warning';
  return 'fail';
}
