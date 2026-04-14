import { useMemo } from 'react';
import type { LayerState } from '@/types/ui';

export function useLayerBlending(layers: Record<string, LayerState>, solo: string | null) {
  return useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    for (const [id, layer] of Object.entries(layers)) {
      const visible = solo ? solo === id : layer.visible;
      styles[id] = {
        opacity: visible ? layer.opacity / 100 : 0,
        mixBlendMode: 'multiply' as const,
        transition: 'opacity 0.3s ease',
        pointerEvents: visible ? 'auto' as const : 'none' as const,
      };
    }
    return styles;
  }, [layers, solo]);
}
