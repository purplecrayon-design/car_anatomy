import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NoteTag = 'diagnostic' | 'repair' | 'torque' | 'obd' | 'wiring' | 'problem' | 'tip';

export interface Note {
  id: string;
  componentId: string;
  vehicleId: string;
  text: string;
  tags: NoteTag[];
  createdAt: string;
  updatedAt: string;
}

export type ComponentStatus = 'untested' | 'ok' | 'suspect' | 'failed';

interface NotesState {
  notes: Record<string, Note[]>;
  componentStatuses: Record<string, ComponentStatus>;
  recentComponents: string[];

  addNote: (componentId: string, vehicleId: string, text: string, tags: NoteTag[]) => void;
  updateNote: (componentId: string, noteId: string, text: string, tags: NoteTag[]) => void;
  deleteNote: (componentId: string, noteId: string) => void;
  getNotesForComponent: (componentId: string) => Note[];
  getFlaggedNotes: () => Note[];

  setComponentStatus: (componentId: string, status: ComponentStatus) => void;
  getComponentStatus: (componentId: string) => ComponentStatus;

  trackComponentVisit: (componentId: string) => void;
  clearHistory: () => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: {},
      componentStatuses: {},
      recentComponents: [],

      addNote: (componentId, vehicleId, text, tags) => {
        const note: Note = {
          id: crypto.randomUUID(),
          componentId,
          vehicleId,
          text,
          tags,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          notes: {
            ...state.notes,
            [componentId]: [...(state.notes[componentId] || []), note],
          },
        }));
      },

      updateNote: (componentId, noteId, text, tags) => {
        set((state) => ({
          notes: {
            ...state.notes,
            [componentId]: (state.notes[componentId] || []).map((n) =>
              n.id === noteId
                ? { ...n, text, tags, updatedAt: new Date().toISOString() }
                : n
            ),
          },
        }));
      },

      deleteNote: (componentId, noteId) => {
        set((state) => ({
          notes: {
            ...state.notes,
            [componentId]: (state.notes[componentId] || []).filter(
              (n) => n.id !== noteId
            ),
          },
        }));
      },

      getNotesForComponent: (componentId) => {
        return get().notes[componentId] || [];
      },

      getFlaggedNotes: () => {
        const allNotes = Object.values(get().notes).flat();
        return allNotes.filter((n) => n.tags.includes('problem'));
      },

      setComponentStatus: (componentId, status) => {
        set((state) => ({
          componentStatuses: {
            ...state.componentStatuses,
            [componentId]: status,
          },
        }));
      },

      getComponentStatus: (componentId) => {
        return get().componentStatuses[componentId] || 'untested';
      },

      trackComponentVisit: (componentId) => {
        set((state) => {
          const recent = state.recentComponents.filter((id) => id !== componentId);
          return {
            recentComponents: [componentId, ...recent].slice(0, 20),
          };
        });
      },

      clearHistory: () => {
        set({ recentComponents: [] });
      },
    }),
    {
      name: 'car-anatomy-notes',
      partialize: (state) => ({
        notes: state.notes,
        componentStatuses: state.componentStatuses,
        recentComponents: state.recentComponents,
      }),
    }
  )
);
