import type { StateCreator } from 'zustand';
import type { QuizScore } from '@/types/quiz';

export interface QuizSlice {
  activeQuizSystem: string | null;
  quizScores: QuizScore[];
  startQuiz: (systemId: string) => void;
  endQuiz: () => void;
  addScore: (score: QuizScore) => void;
}

export const createQuizSlice: StateCreator<QuizSlice> = (set) => ({
  activeQuizSystem: null,
  quizScores: [],
  startQuiz: (systemId) => set({ activeQuizSystem: systemId }),
  endQuiz: () => set({ activeQuizSystem: null }),
  addScore: (score) => set((s) => ({ quizScores: [...s.quizScores, score] })),
});
