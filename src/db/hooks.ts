import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './database';
import type { DiagnosticSession } from '@/types/session';

export function useSessions(): DiagnosticSession[] | undefined {
  return useLiveQuery(() => db.sessions.orderBy('updatedAt').reverse().toArray());
}

export function useAnnotations(sessionId: string) {
  return useLiveQuery(() => db.annotations.where('sessionId').equals(sessionId).toArray(), [sessionId]);
}

export function useVoltageReadings(sessionId: string) {
  return useLiveQuery(() => db.voltageReadings.where('sessionId').equals(sessionId).toArray(), [sessionId]);
}
