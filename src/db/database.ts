import Dexie, { type Table } from 'dexie';
import type { DiagnosticSession } from '@/types/session';
import type { ComponentStatusEntry, VoltageReading, Annotation } from '@/types/diagnostic';
import type { TourProgress } from '@/types/tour';
import type { QuizScore } from '@/types/quiz';

export class LexWireDB extends Dexie {
  sessions!: Table<DiagnosticSession>;
  componentStatuses!: Table<ComponentStatusEntry>;
  voltageReadings!: Table<VoltageReading>;
  annotations!: Table<Annotation>;
  tourProgress!: Table<TourProgress>;
  quizScores!: Table<QuizScore>;

  constructor() {
    super('LexWireDB');
    this.version(1).stores({
      sessions: '++id, name, vehicleId, createdAt, updatedAt',
      componentStatuses: '++id, sessionId, componentId, status, updatedAt',
      voltageReadings: '++id, sessionId, testPointId, timestamp',
      annotations: '++id, sessionId, pageId, createdAt',
      tourProgress: '++id, systemId, difficultyLevel',
      quizScores: '++id, systemId, difficultyLevel, timestamp',
    });
  }
}

export const db = new LexWireDB();
