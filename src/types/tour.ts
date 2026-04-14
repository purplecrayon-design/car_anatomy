export interface TourStep {
  nodeId: string;
  title: string;
  text: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface TourProgress {
  id?: number;
  systemId: string;
  difficultyLevel: string;
  lastStepIndex: number;
  completed: boolean;
}
