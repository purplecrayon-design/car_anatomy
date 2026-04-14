import { create } from 'zustand';
import { createUISlice, type UISlice } from './uiSlice';
import { createDiagramSlice, type DiagramSlice } from './diagramSlice';
import { createLayerSlice, type LayerSlice } from './layerSlice';
import { createDiagnosticSlice, type DiagnosticSlice } from './diagnosticSlice';
import { createSearchSlice, type SearchSlice } from './searchSlice';
import { createNavigationSlice, type NavigationSlice } from './navigationSlice';
import { createTourSlice, type TourSlice } from './tourSlice';
import { createQuizSlice, type QuizSlice } from './quizSlice';
import { createSessionSlice, type SessionSlice } from './sessionSlice';
import { createVehicleSlice, type VehicleSlice } from './vehicleSlice';
import { createManualSlice, type ManualSlice } from './manualSlice';
import { createNotesSlice, type NotesSlice } from './notesSlice';

export type AppStore = UISlice & DiagramSlice & LayerSlice & DiagnosticSlice &
  SearchSlice & NavigationSlice & TourSlice & QuizSlice & SessionSlice & VehicleSlice & ManualSlice & NotesSlice;

export const useStore = create<AppStore>()((...a) => ({
  ...createUISlice(...a),
  ...createDiagramSlice(...a),
  ...createLayerSlice(...a),
  ...createDiagnosticSlice(...a),
  ...createSearchSlice(...a),
  ...createNavigationSlice(...a),
  ...createTourSlice(...a),
  ...createQuizSlice(...a),
  ...createSessionSlice(...a),
  ...createVehicleSlice(...a),
  ...createManualSlice(...a),
  ...createNotesSlice(...a),
}));
