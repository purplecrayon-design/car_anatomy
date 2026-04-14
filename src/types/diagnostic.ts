export type DiagnosticStatus = 'untested' | 'testing' | 'good' | 'suspected' | 'bad';

export interface StatusConfig {
  color: string;
  icon: string;
  label: string;
  bg: string;
  border: string;
}

export const STATUS_MAP: Record<DiagnosticStatus, StatusConfig> = {
  untested: { color: '#555', icon: '?', label: 'Not Tested', bg: '#161618', border: '#252530' },
  testing: { color: '#4FC3F7', icon: '~', label: 'Testing', bg: '#0e1e2e', border: '#1a3a5a' },
  good: { color: '#66BB6A', icon: '\u2713', label: 'Tested Good', bg: '#0e2e1a', border: '#1a4a2a' },
  suspected: { color: '#FFA726', icon: '!', label: 'Suspected', bg: '#2e1e0a', border: '#5a3a1a' },
  bad: { color: '#EF5350', icon: 'X', label: 'Confirmed Bad', bg: '#2e0e0e', border: '#5a1a1a' },
};

export interface ComponentStatusEntry {
  id?: number;
  sessionId: string;
  componentId: string;
  status: DiagnosticStatus;
  notes?: string;
  updatedAt: number;
}

export interface VoltageReading {
  id?: number;
  sessionId: string;
  testPointId: string;
  expected: number;
  actual: number;
  condition: TestCondition;
  result: VoltageResult;
  timestamp: number;
}

export type TestCondition = 'key_off' | 'koeo' | 'koer' | 'cranking';

export type VoltageResult = 'pass' | 'warning' | 'fail';

export interface Annotation {
  id?: number;
  sessionId: string;
  svgX: number;
  svgY: number;
  pageId: string;
  text: string;
  createdAt: number;
}
