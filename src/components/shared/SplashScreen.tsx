import { useEffect, useState } from 'react';

interface Props {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

  useEffect(() => {
    // Phase 1: Enter animation
    const holdTimer = setTimeout(() => setPhase('hold'), 800);

    // Phase 2: Hold
    const exitTimer = setTimeout(() => setPhase('exit'), 2400);

    // Phase 3: Complete and remove splash
    const completeTimer = setTimeout(onComplete, 3100);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center bg-[#0f172a] transition-opacity duration-700 ${
        phase === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Year badge */}
        <div
          className={`text-[180px] font-light tracking-[-0.08em] text-white leading-none transition-all duration-1000 ${
            phase === 'enter' ? 'scale-75 opacity-30' : 'scale-100 opacity-100'
          }`}
        >
          97
        </div>

        {/* Lexus ES300 branding */}
        <div className="flex flex-col items-center -mt-8">
          <div
            className={`text-emerald-400 text-xl font-medium tracking-[0.25em] uppercase transition-all duration-1000 ${
              phase === 'enter' ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
            }`}
          >
            LEXUS
          </div>

          <div
            className={`text-4xl font-light text-white tracking-widest mt-1 transition-all duration-1000 ${
              phase === 'enter' ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
            }`}
          >
            ES300
          </div>

          <div className="h-px w-40 bg-gradient-to-r from-transparent via-emerald-400 to-transparent my-3" />

          <div
            className={`text-xs font-medium text-slate-400 tracking-[0.125em] uppercase transition-all duration-1000 ${
              phase === 'enter' ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
            }`}
          >
            1MZ-FE • INTERACTIVE ANATOMY
          </div>
        </div>

        {/* Subtle vehicle silhouette in background */}
        <div
          className={`absolute -bottom-12 left-1/2 -translate-x-1/2 w-96 opacity-10 transition-all duration-1000 ${
            phase === 'enter' ? 'scale-75' : 'scale-100'
          }`}
        >
          <svg width="400" height="120" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 90 Q60 55 120 50 L280 50 Q320 55 340 90 L360 90 Q370 95 370 105 L30 105 Q30 95 40 90Z" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
            <circle cx="100" cy="105" r="18" stroke="#10b981" strokeWidth="12" />
            <circle cx="300" cy="105" r="18" stroke="#10b981" strokeWidth="12" />
          </svg>
        </div>

        {/* Loading indicator */}
        <div className="mt-16 flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          <div className="text-xs font-mono tracking-widest text-emerald-400/70">LOADING 1997 LEXUS ES300</div>
        </div>
      </div>
    </div>
  );
}
