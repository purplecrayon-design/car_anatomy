import type { StateCreator } from 'zustand';

export type NoteTag = 'diagnostic' | 'concept' | 'torque' | 'obd' | 'problem';

export interface Note {
  id: string;
  componentId: string;
  vehicleId: 'es300' | 'camry';
  text: string;
  tags: NoteTag[];
  createdAt: Date;
}

export interface NotesSlice {
  notes: Record<string, Note[]>;  // Keyed by componentId
  recentComponents: string[];     // Last 10 components visited

  addNote: (componentId: string, vehicleId: 'es300' | 'camry', text: string, tags: NoteTag[]) => void;
  deleteNote: (componentId: string, noteId: string) => void;
  getNotesForComponent: (componentId: string) => Note[];
  getFlaggedNotes: () => Note[];
  trackComponentVisit: (componentId: string) => void;
}

export const createNotesSlice: StateCreator<NotesSlice> = (set, get) => ({
  notes: {},
  recentComponents: [],

  addNote: (componentId, vehicleId, text, tags) => {
    const note: Note = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      componentId,
      vehicleId,
      text,
      tags,
      createdAt: new Date(),
    };
    set((s) => ({
      notes: {
        ...s.notes,
        [componentId]: [...(s.notes[componentId] || []), note],
      },
    }));
  },

  deleteNote: (componentId, noteId) => {
    set((s) => ({
      notes: {
        ...s.notes,
        [componentId]: (s.notes[componentId] || []).filter((n) => n.id !== noteId),
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

  trackComponentVisit: (componentId) => {
    set((s) => {
      const recent = s.recentComponents.filter((id) => id !== componentId);
      return {
        recentComponents: [componentId, ...recent].slice(0, 10),
      };
    });
  },
});
