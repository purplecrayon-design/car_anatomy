import { useEffect } from 'react';
import { useStore } from '@/store';

export function useKeyboardNav() {
  const toggleCommandPalette = useStore((s) => s.toggleCommandPalette);
  const clearTrace = useStore((s) => s.clearTrace);
  const endTour = useStore((s) => s.endTour);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
      if (e.key === 'Escape') {
        clearTrace();
        endTour();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleCommandPalette, clearTrace, endTour]);
}
