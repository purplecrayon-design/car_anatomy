import { createContext, useContext, type ReactNode } from 'react';
import { useReducedMotion as useReducedMotionHook } from '@/hooks/useReducedMotion';

interface ReducedMotionContextValue {
  prefersReducedMotion: boolean;
  animationDuration: number;
  transitionDuration: string;
}

const ReducedMotionContext = createContext<ReducedMotionContextValue>({
  prefersReducedMotion: false,
  animationDuration: 300,
  transitionDuration: '0.3s',
});

interface Props {
  children: ReactNode;
}

export function ReducedMotionProvider({ children }: Props) {
  const prefersReducedMotion = useReducedMotionHook();

  const value: ReducedMotionContextValue = {
    prefersReducedMotion,
    animationDuration: prefersReducedMotion ? 0 : 300,
    transitionDuration: prefersReducedMotion ? '0s' : '0.3s',
  };

  return (
    <ReducedMotionContext.Provider value={value}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotionContext() {
  return useContext(ReducedMotionContext);
}

export function ReducedMotion({ children }: Props) {
  return <ReducedMotionProvider>{children}</ReducedMotionProvider>;
}
