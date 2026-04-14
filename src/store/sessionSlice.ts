import type { StateCreator } from 'zustand';

export interface SessionSlice {
  activeSessionId: string;
  sessionName: string;
  lastSavedAt: number | null;
  isSaving: boolean;
  saveError: string | null;
  setActiveSession: (id: string, name: string) => void;
  setSessionName: (name: string) => void;
  setLastSavedAt: (timestamp: number) => void;
  setSaving: (saving: boolean) => void;
  setSaveError: (error: string | null) => void;
}

export const createSessionSlice: StateCreator<SessionSlice> = (set) => ({
  activeSessionId: 'default',
  sessionName: 'New Session',
  lastSavedAt: null,
  isSaving: false,
  saveError: null,
  setActiveSession: (activeSessionId, sessionName) => set({ activeSessionId, sessionName }),
  setSessionName: (sessionName) => set({ sessionName }),
  setLastSavedAt: (lastSavedAt) => set({ lastSavedAt }),
  setSaving: (isSaving) => set({ isSaving }),
  setSaveError: (saveError) => set({ saveError, isSaving: false }),
});
