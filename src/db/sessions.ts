import { db } from './database';
import type { DiagnosticSession } from '@/types/session';

export async function createSession(name: string, vehicleId: string): Promise<number> {
  const now = Date.now();
  return db.sessions.add({ name, vehicleId, createdAt: now, updatedAt: now });
}

export async function listSessions(): Promise<DiagnosticSession[]> {
  return db.sessions.orderBy('updatedAt').reverse().toArray();
}

export async function deleteSession(id: number): Promise<void> {
  await db.transaction('rw', [db.sessions, db.componentStatuses, db.voltageReadings, db.annotations], async () => {
    const sid = String(id);
    await db.componentStatuses.where('sessionId').equals(sid).delete();
    await db.voltageReadings.where('sessionId').equals(sid).delete();
    await db.annotations.where('sessionId').equals(sid).delete();
    await db.sessions.delete(id);
  });
}

export async function renameSession(id: number, name: string): Promise<void> {
  await db.sessions.update(id, { name, updatedAt: Date.now() });
}
