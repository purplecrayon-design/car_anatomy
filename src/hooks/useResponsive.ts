import { useState, useEffect } from 'react';
import type { LayoutBreakpoint } from '@/types/ui';

export function useResponsive(): LayoutBreakpoint {
  const [bp, setBp] = useState<LayoutBreakpoint>('desktop');

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setBp(w < 768 ? 'mobile' : w < 1200 ? 'tablet' : 'desktop');
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return bp;
}
