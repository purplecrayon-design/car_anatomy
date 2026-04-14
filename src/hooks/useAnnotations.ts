import { useCallback } from 'react';
import { useStore } from '@/store';
import type { Annotation } from '@/types/diagnostic';

export function useAnnotations() {
  const annotations = useStore((s) => s.annotations);
  const addAnnotation = useStore((s) => s.addAnnotation);
  const removeAnnotation = useStore((s) => s.removeAnnotation);
  const sessionId = useStore((s) => s.activeSessionId);

  const createAnnotation = useCallback(
    (svgX: number, svgY: number, pageId: string, text: string) => {
      const annotation: Annotation = { sessionId, svgX, svgY, pageId, text, createdAt: Date.now() };
      addAnnotation(annotation);
    },
    [addAnnotation, sessionId],
  );

  return { annotations, createAnnotation, removeAnnotation };
}
