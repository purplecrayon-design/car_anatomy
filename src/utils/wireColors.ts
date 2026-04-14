export const WIRE_HEX: Record<string, string> = {
  R: '#ef4444', B: '#94a3b8', W: '#d1d5db', Y: '#eab308', G: '#22c55e',
  BR: '#92400e', GR: '#6b7280', L: '#3b82f6', LG: '#86efac', O: '#f97316',
  P: '#ec4899', V: '#8b5cf6',
};

export const WIRE_NAMES: Record<string, string> = {
  R: 'Red', B: 'Black', W: 'White', Y: 'Yellow', G: 'Green',
  BR: 'Brown', GR: 'Gray', L: 'Blue', LG: 'Light Green', O: 'Orange',
  P: 'Pink', V: 'Violet',
};

export function wireColorToHex(code: string): string {
  const [base] = code.split('-');
  return WIRE_HEX[base] || '#555';
}

export function wireColorName(code: string): string {
  const parts = code.split('-');
  return parts.map((p) => WIRE_NAMES[p] || p).join('/');
}
