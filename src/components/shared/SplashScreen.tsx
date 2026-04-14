import { useEffect, useState } from 'react';

interface Props {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase('hold'), 400);
    const exitTimer = setTimeout(() => setPhase('exit'), 2200);
    const completeTimer = setTimeout(onComplete, 2800);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        opacity: phase === 'exit' ? 0 : 1,
        transition: 'opacity 0.6s ease-out',
      }}
    >
      {/* Animated background grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridPulse 4s ease-in-out infinite',
        }}
      />

      {/* Glow effect */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'glowPulse 3s ease-in-out infinite',
        }}
      />

      {/* Main content */}
      <div
        className="relative z-10 flex flex-col items-center gap-8"
        style={{
          opacity: phase === 'enter' ? 0 : 1,
          transform: phase === 'enter' ? 'translateY(30px) scale(0.95)' : 'translateY(0) scale(1)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Year badge with glow */}
        <div className="relative">
          <div
            className="absolute inset-0 blur-2xl opacity-50"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              transform: 'scale(0.8)',
            }}
          />
          <div
            className="relative text-transparent bg-clip-text font-light tracking-tighter"
            style={{
              fontSize: 'clamp(100px, 25vw, 200px)',
              fontFamily: "'Inter', sans-serif",
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              lineHeight: 0.85,
            }}
          >
            97
          </div>
        </div>

        {/* Vehicle name */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="text-emerald-400 font-medium tracking-[0.3em] uppercase"
            style={{
              fontSize: 'clamp(12px, 2vw, 16px)',
              fontFamily: "'Inter', sans-serif",
              textShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
            }}
          >
            Lexus ES300
          </div>

          {/* Animated line */}
          <div
            className="h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
            style={{
              width: phase === 'hold' ? '120px' : '0px',
              transition: 'width 0.8s ease-out 0.3s',
            }}
          />

          <div
            className="flex items-center gap-3 text-slate-500 font-medium tracking-[0.2em] uppercase"
            style={{
              fontSize: 'clamp(10px, 1.5vw, 12px)',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <span>1MZ-FE</span>
            <span className="w-1 h-1 rounded-full bg-emerald-500" />
            <span>Vehicle Explorer</span>
          </div>
        </div>

        {/* Loading indicator */}
        <div
          className="flex items-center gap-2 mt-4"
          style={{
            opacity: phase === 'hold' ? 1 : 0,
            transition: 'opacity 0.4s ease-out 0.5s',
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>
      </div>

      {/* Bottom corner branding */}
      <div
        className="absolute bottom-6 right-6 flex items-center gap-2 text-slate-600 text-xs"
        style={{
          opacity: phase === 'enter' ? 0 : 0.5,
          transition: 'opacity 0.6s ease-out 0.4s',
        }}
      >
        <span>LexWire</span>
        <span>v2.0</span>
      </div>

      {/* Skip hint */}
      <button
        onClick={onComplete}
        className="absolute bottom-6 left-6 text-slate-600 text-xs hover:text-emerald-400 transition-colors"
        style={{
          opacity: phase === 'enter' ? 0 : 0.5,
          transition: 'opacity 0.6s ease-out 0.4s',
        }}
      >
        Press any key to skip
      </button>

      <style>{`
        @keyframes gridPulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
        @keyframes glowPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
