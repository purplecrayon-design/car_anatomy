import { useEffect, useState } from 'react';

interface Props {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase('hold'), 600);
    const exitTimer = setTimeout(() => setPhase('exit'), 2000);
    const completeTimer = setTimeout(onComplete, 2600);

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
        background: '#F8F6F0',
        opacity: phase === 'exit' ? 0 : 1,
        transition: 'opacity 0.6s ease-out',
      }}
    >
      {/* Year badge */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          opacity: phase === 'enter' ? 0 : 1,
          transform: phase === 'enter' ? 'translateY(20px)' : 'translateY(0)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* 97 */}
        <div
          style={{
            fontSize: 'clamp(72px, 18vw, 160px)',
            fontWeight: 300,
            fontFamily: "'Inter', sans-serif",
            color: '#111111',
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          97
        </div>

        {/* Lexus ES300 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 'clamp(11px, 2vw, 14px)',
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
              color: '#006D8C',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Lexus ES300
          </div>
          <div
            style={{
              width: 40,
              height: 1,
              background: '#B8A47E',
            }}
          />
          <div
            style={{
              fontSize: 'clamp(10px, 1.5vw, 12px)',
              fontWeight: 400,
              fontFamily: "'Inter', sans-serif",
              color: '#666666',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Vehicle Explorer
          </div>
        </div>
      </div>
    </div>
  );
}
