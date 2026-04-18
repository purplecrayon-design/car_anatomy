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

        {/* Car Anatomy branding */}
        <div className="flex flex-col items-center -mt-8">
          <div
            className={`text-emerald-400 text-2xl font-bold tracking-[0.2em] uppercase transition-all duration-1000 ${
              phase === 'enter' ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
            }`}
          >
            CAR ANATOMY
          </div>

          <div className="h-px w-48 bg-gradient-to-r from-transparent via-emerald-400 to-transparent my-4" />

          <div
            className={`text-3xl font-light text-white tracking-widest transition-all duration-1000 delay-100 ${
              phase === 'enter' ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
            }`}
          >
            LEXUS ES300
          </div>

          <div
            className={`text-sm font-medium text-slate-400 tracking-[0.15em] uppercase mt-2 transition-all duration-1000 delay-200 ${
              phase === 'enter' ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
            }`}
          >
            1MZ-FE V6 • Interactive Explorer
          </div>
        </div>

        {/* Subtle vehicle silhouette in background */}
        <div
          className={`absolute -bottom-16 left-1/2 -translate-x-1/2 w-[500px] opacity-10 transition-all duration-1000 ${
            phase === 'enter' ? 'scale-75' : 'scale-100'
          }`}
        >
          <svg width="500" height="150" viewBox="0 0 500 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M50 110 Q80 65 150 60 L350 60 Q400 65 430 110 L460 110 Q475 115 475 130 L25 130 Q25 115 40 110 Z"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="125" cy="130" r="22" stroke="#10b981" strokeWidth="2" fill="none" />
            <circle cx="375" cy="130" r="22" stroke="#10b981" strokeWidth="2" fill="none" />
            {/* Window line */}
            <path d="M150 60 Q165 35 200 32 L300 32 Q335 35 350 60" stroke="#10b981" strokeWidth="1" fill="none" opacity="0.5" />
          </svg>
        </div>

        {/* Loading indicator */}
        <div className="mt-20 flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <div className="text-xs font-mono tracking-widest text-emerald-400/70">LOADING VEHICLE DATA</div>
        </div>

        {/* Also fits Toyota Camry note */}
        <div
          className={`mt-6 text-xs text-slate-500 transition-all duration-1000 delay-300 ${
            phase === 'enter' ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Also compatible with 1997 Toyota Camry
        </div>
      </div>
    </div>
  );
}
