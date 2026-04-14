import { useMemo } from 'react';
import Fuse from 'fuse.js';
import type { CircuitNode } from '@/types/circuit';

export function useSearch(items: CircuitNode[], query: string) {
  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: [
          { name: 'label', weight: 3 },
          { name: 'toyotaCode', weight: 2 },
          { name: 'system', weight: 1.5 },
          { name: 'type', weight: 1 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
        includeScore: true,
        minMatchCharLength: 2,
      }),
    [items],
  );

  return useMemo(() => {
    if (!query || query.length < 2) return [];
    return fuse.search(query).slice(0, 8).map((r) => r.item);
  }, [fuse, query]);
}
