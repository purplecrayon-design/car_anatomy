import { useState, useCallback, useRef } from 'react';

interface PanZoomState {
  x: number;
  y: number;
  scale: number;
}

export function usePanZoom(initialScale = 1) {
  const [state, setState] = useState<PanZoomState>({ x: 0, y: 0, scale: initialScale });
  const isPanning = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setState((s) => ({ ...s, scale: Math.min(5, Math.max(0.1, s.scale * delta)) }));
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isPanning.current = true;
    startPos.current = { x: e.clientX - state.x, y: e.clientY - state.y };
  }, [state.x, state.y]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    setState((s) => ({ ...s, x: e.clientX - startPos.current.x, y: e.clientY - startPos.current.y }));
  }, []);

  const onMouseUp = useCallback(() => { isPanning.current = false; }, []);

  const zoomToFit = useCallback(() => setState({ x: 0, y: 0, scale: 1 }), []);

  return { ...state, onWheel, onMouseDown, onMouseMove, onMouseUp, zoomToFit };
}
