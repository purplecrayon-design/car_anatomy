import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '@/store';
import { db } from '@/db/database';
import type { DiagnosticStatus } from '@/types/diagnostic';

const AUTOSAVE_INTERVAL = 30_000;

export function useDiagnosticSession() {
  const statuses = useStore((s) => s.componentStatuses);
  const voltageReadings = useStore((s) => s.voltageReadings);
  const annotations = useStore((s) => s.annotations);
  const sessionId = useStore((s) => s.activeSessionId);
  const setStatus = useStore((s) => s.setComponentStatus);
  const addVoltageReading = useStore((s) => s.addVoltageReading);
  const addAnnotation = useStore((s) => s.addAnnotation);
  const setLastSavedAt = useStore((s) => s.setLastSavedAt);
  const setSaving = useStore((s) => s.setSaving);
  const setSaveError = useStore((s) => s.setSaveError);
  const setHydrated = useStore((s) => s.setHydrated);
  const isHydrated = useStore((s) => s.isHydrated);

  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const lastSaveRef = useRef<string>('');

  // Hydrate session from IndexedDB on mount
  useEffect(() => {
    const hydrate = async () => {
      try {
        // Load component statuses
        const savedStatuses = await db.componentStatuses
          .where('sessionId')
          .equals(sessionId)
          .toArray();

        for (const entry of savedStatuses) {
          setStatus(entry.componentId, entry.status as DiagnosticStatus);
        }

        // Load voltage readings
        const savedReadings = await db.voltageReadings
          .where('sessionId')
          .equals(sessionId)
          .toArray();

        for (const reading of savedReadings) {
          addVoltageReading(reading);
        }

        // Load annotations
        const savedAnnotations = await db.annotations
          .where('sessionId')
          .equals(sessionId)
          .toArray();

        for (const annotation of savedAnnotations) {
          addAnnotation(annotation);
        }

        setHydrated(true);
      } catch (e) {
        console.error('Session hydration failed:', e);
        setHydrated(true); // Still mark as hydrated to allow app to function
      }
    };

    if (!isHydrated) {
      hydrate();
    }
  }, [sessionId, isHydrated, setStatus, addVoltageReading, addAnnotation, setHydrated]);

  // Save function
  const save = useCallback(async () => {
    // Create a hash of current state to avoid unnecessary saves
    const stateHash = JSON.stringify({ statuses, voltageReadings, annotations });
    if (stateHash === lastSaveRef.current) {
      return; // No changes to save
    }

    setSaving(true);
    setSaveError(null);

    try {
      // Save component statuses
      const statusEntries = Object.entries(statuses).map(([componentId, status]) => ({
        sessionId,
        componentId,
        status,
        updatedAt: Date.now(),
      }));

      await db.componentStatuses.where('sessionId').equals(sessionId).delete();
      if (statusEntries.length > 0) {
        await db.componentStatuses.bulkAdd(statusEntries);
      }

      // Save voltage readings
      const readingEntries = Object.values(voltageReadings).map((reading) => ({
        ...reading,
        sessionId,
      }));

      await db.voltageReadings.where('sessionId').equals(sessionId).delete();
      if (readingEntries.length > 0) {
        await db.voltageReadings.bulkAdd(readingEntries);
      }

      // Save annotations
      const annotationEntries = annotations.map((annotation) => ({
        ...annotation,
        sessionId,
      }));

      await db.annotations.where('sessionId').equals(sessionId).delete();
      if (annotationEntries.length > 0) {
        await db.annotations.bulkAdd(annotationEntries);
      }

      lastSaveRef.current = stateHash;
      setLastSavedAt(Date.now());
      setSaving(false);
    } catch (e) {
      console.error('Autosave failed:', e);
      setSaveError(e instanceof Error ? e.message : 'Save failed');
    }
  }, [statuses, voltageReadings, annotations, sessionId, setLastSavedAt, setSaving, setSaveError]);

  // Auto-save on interval
  useEffect(() => {
    timerRef.current = setInterval(save, AUTOSAVE_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [save]);

  // Save on unmount
  useEffect(() => {
    return () => {
      save();
    };
  }, [save]);

  // Manual save function
  return { save };
}
