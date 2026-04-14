import { useState, useRef, useCallback, useEffect } from 'react';

const ANGLES = [
  { id: 'front', label: 'Front', rotation: 0 },
  { id: 'front-quarter', label: '3/4 Front', rotation: 45 },
  { id: 'side', label: 'Side', rotation: 90 },
  { id: 'rear-quarter', label: '3/4 Rear', rotation: 135 },
  { id: 'rear', label: 'Rear', rotation: 180 },
];

// Total frames for smooth 360° rotation
const TOTAL_FRAMES = 36;
const FRAME_STEP = 360 / TOTAL_FRAMES;

interface Props {
  onAngleChange?: (angle: number) => void;
}

export function Vehicle360Viewer({ onAngleChange }: Props) {
  const [currentAngle, setCurrentAngle] = useState(45); // Start at 3/4 front
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startAngleRef = useRef(0);

  // Normalize angle to 0-360
  const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;

  // Get current frame index
  const frameIndex = Math.round(normalizeAngle(currentAngle) / FRAME_STEP) % TOTAL_FRAMES;

  // Mouse/touch handlers
  const handleStart = useCallback((clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX;
    startAngleRef.current = currentAngle;
  }, [currentAngle]);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const deltaX = clientX - startXRef.current;
    const sensitivity = 360 / containerWidth; // Full rotation across container width
    const newAngle = normalizeAngle(startAngleRef.current + deltaX * sensitivity);

    setCurrentAngle(newAngle);
    onAngleChange?.(newAngle);
  }, [isDragging, onAngleChange]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onMouseUp = () => handleEnd();
  const onMouseLeave = () => handleEnd();

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  };
  const onTouchEnd = () => handleEnd();

  // Preset angle buttons
  const goToAngle = (angle: number) => {
    setCurrentAngle(angle);
    onAngleChange?.(angle);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentAngle(prev => normalizeAngle(prev - 10));
      } else if (e.key === 'ArrowRight') {
        setCurrentAngle(prev => normalizeAngle(prev + 10));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ width: '100%' }}>
      {/* Main viewer */}
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          background: 'linear-gradient(180deg, #F8F6F0 0%, #EDEBE6 100%)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          touchAction: 'none',
        }}
      >
        {/* Vehicle image placeholder - replace with actual 360 frames */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* This would be replaced with actual 360° image frames */}
          <img
            src={`/data/vehicles/es300/360/frame-${String(frameIndex).padStart(2, '0')}.webp`}
            alt={`1997 Lexus ES300 - ${Math.round(currentAngle)}°`}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
            onError={(e) => {
              // Fallback to placeholder if image doesn't exist
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />

          {/* Fallback visualization */}
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              color: 'var(--text-muted)',
            }}
          >
            <svg width="200" height="80" viewBox="0 0 200 80" fill="none">
              {/* Simplified ES300 silhouette */}
              <path
                d="M 20 55
                   Q 25 35, 55 30
                   L 75 28
                   Q 90 20, 120 20
                   Q 150 20, 165 28
                   L 180 35
                   Q 190 40, 190 55
                   L 185 55
                   Q 185 50, 175 50
                   Q 165 50, 165 55
                   L 55 55
                   Q 55 50, 45 50
                   Q 35 50, 35 55
                   Z"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.5"
                style={{
                  transform: `rotateY(${currentAngle}deg)`,
                  transformOrigin: 'center',
                }}
              />
              {/* Wheels */}
              <circle cx="45" cy="55" r="8" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
              <circle cx="170" cy="55" r="8" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 500 }}>
              Drag to rotate • {Math.round(currentAngle)}°
            </span>
          </div>
        </div>

        {/* Drag indicator */}
        {!isDragging && (
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-md)',
              fontSize: 12,
              color: 'var(--text-muted)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h12M2 8l3-3M2 8l3 3M14 8l-3-3M14 8l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Drag to rotate</span>
          </div>
        )}
      </div>

      {/* Angle presets */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          marginTop: 16,
          flexWrap: 'wrap',
        }}
      >
        {ANGLES.map((angle) => {
          const isActive = Math.abs(normalizeAngle(currentAngle) - angle.rotation) < 15 ||
                          Math.abs(normalizeAngle(currentAngle) - angle.rotation) > 345;
          return (
            <button
              key={angle.id}
              onClick={() => goToAngle(angle.rotation)}
              style={{
                padding: '8px 16px',
                background: isActive ? 'var(--accent)' : 'var(--bg-surface)',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                border: isActive ? 'none' : '1px solid var(--border)',
                borderRadius: 'var(--radius-full)',
                fontSize: 13,
                fontWeight: 500,
                transition: 'all 0.2s ease',
              }}
            >
              {angle.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
