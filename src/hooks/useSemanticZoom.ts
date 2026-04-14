import { useMemo } from 'react';

export type ZoomLevel = 'overview' | 'standard' | 'detailed';

export function useSemanticZoom(scale: number): ZoomLevel {
  return useMemo(() => {
    if (scale < 0.25) return 'overview';
    if (scale > 1.0) return 'detailed';
    return 'standard';
  }, [scale]);
}
