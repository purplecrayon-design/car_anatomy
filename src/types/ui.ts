export type InteractionMode = 'trace' | 'xray' | 'isolation' | 'ghost' | 'dependency' | 'exploded';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type LayoutBreakpoint = 'desktop' | 'tablet' | 'mobile';

export interface BreadcrumbEntry {
  label: string;
  pageId?: string;
  systemId?: string;
  wireColor?: string;
}

export interface LayerState {
  visible: boolean;
  opacity: number;
}
