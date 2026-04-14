export interface QuizQuestion {
  id: string;
  systemId: string;
  type: 'fuse_impact' | 'ground_impact' | 'wire_trace' | 'component_id';
  prompt: string;
  sourceNodeId: string;
  correctNodeIds: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface QuizResult {
  questionId: string;
  selectedNodeIds: string[];
  correctNodeIds: string[];
  score: number;
}

export interface QuizScore {
  id?: number;
  systemId: string;
  difficultyLevel: string;
  score: number;
  totalQuestions: number;
  timestamp: number;
}
