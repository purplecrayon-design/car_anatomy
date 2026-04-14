import { useEffect, useState } from 'react';

interface Props {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

  useEffect(() => {
    // Enter animation
    const holdTimer = setTimeout(() => setPhase('hold'), 800);
    // Hold for a moment
    const exitTimer = setTimeout(() => setPhase('exit'), 2500);
    // Complete and unmount
    const completeTimer = setTimeout(onComplete, 3200);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0f',
        opacity: phase === 'exit' ? 0 : 1,
        transition: 'opacity 0.7s ease-out',
      }}
    >
      {/* 97' Text */}
      <div
        style={{
          fontSize: 'clamp(80px, 20vw, 200px)',
          fontWeight: 700,
          color: '#fff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-0.02em',
          opacity: phase === 'enter' ? 0 : 1,
          transform: phase === 'enter' ? 'translateY(20px)' : 'translateY(0)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        97'
      </div>

      {/* Aviator Sunglasses SVG */}
      <svg
        viewBox="0 0 200 80"
        style={{
          width: 'clamp(150px, 40vw, 300px)',
          marginTop: 20,
          opacity: phase === 'enter' ? 0 : 1,
          transform: phase === 'enter' ? 'translateY(20px) scale(0.9)' : 'translateY(0) scale(1)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
        }}
      >
        {/* Bridge */}
        <path
          d="M 85 35 Q 100 28 115 35"
          fill="none"
          stroke="#c9a227"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Left temple arm hint */}
        <path
          d="M 15 32 L 35 35"
          fill="none"
          stroke="#c9a227"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Right temple arm hint */}
        <path
          d="M 185 32 L 165 35"
          fill="none"
          stroke="#c9a227"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Left lens frame */}
        <ellipse
          cx="55"
          cy="45"
          rx="38"
          ry="28"
          fill="none"
          stroke="#c9a227"
          strokeWidth="3"
        />

        {/* Right lens frame */}
        <ellipse
          cx="145"
          cy="45"
          rx="38"
          ry="28"
          fill="none"
          stroke="#c9a227"
          strokeWidth="3"
        />

        {/* Left lens gradient */}
        <defs>
          <linearGradient id="lensGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1a2e" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#2d2d44" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Left lens fill */}
        <ellipse
          cx="55"
          cy="45"
          rx="35"
          ry="25"
          fill="url(#lensGradient)"
        />

        {/* Right lens fill */}
        <ellipse
          cx="145"
          cy="45"
          rx="35"
          ry="25"
          fill="url(#lensGradient)"
        />

        {/* Left lens shine */}
        <ellipse
          cx="45"
          cy="38"
          rx="15"
          ry="10"
          fill="url(#shineGradient)"
          style={{
            animation: 'shimmer 2s ease-in-out infinite',
          }}
        />

        {/* Right lens shine */}
        <ellipse
          cx="135"
          cy="38"
          rx="15"
          ry="10"
          fill="url(#shineGradient)"
          style={{
            animation: 'shimmer 2s ease-in-out infinite 0.3s',
          }}
        />

        {/* Nose pads */}
        <ellipse cx="75" cy="58" rx="4" ry="6" fill="#c9a227" />
        <ellipse cx="125" cy="58" rx="4" ry="6" fill="#c9a227" />
      </svg>

      {/* Shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; transform: translateX(0); }
          50% { opacity: 0.6; transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
}
