export function SvgDefs() {
  return (
    <defs>
      {/* Glow filter for selected elements */}
      <filter id="glo" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="5" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Soft shadow for elevated elements */}
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
      </filter>

      {/* Wire flow animation gradient */}
      <linearGradient id="wireFlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
        <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.8" />
        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
      </linearGradient>

      {/* Status indicator gradients */}
      <radialGradient id="statusGood" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#66BB6A" stopOpacity="1" />
        <stop offset="100%" stopColor="#4CAF50" stopOpacity="0.8" />
      </radialGradient>

      <radialGradient id="statusBad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#EF5350" stopOpacity="1" />
        <stop offset="100%" stopColor="#E53935" stopOpacity="0.8" />
      </radialGradient>

      <radialGradient id="statusSuspected" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFA726" stopOpacity="1" />
        <stop offset="100%" stopColor="#FF9800" stopOpacity="0.8" />
      </radialGradient>

      <radialGradient id="statusTesting" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#4FC3F7" stopOpacity="1" />
        <stop offset="100%" stopColor="#29B6F6" stopOpacity="0.8" />
      </radialGradient>

      {/* Arrow marker for directed edges */}
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 10 3.5, 0 7" fill="var(--text-muted)" />
      </marker>

      {/* Ground symbol pattern */}
      <pattern id="groundLines" width="10" height="10" patternUnits="userSpaceOnUse">
        <line x1="0" y1="10" x2="10" y2="0" stroke="var(--border)" strokeWidth="0.5" />
      </pattern>
    </defs>
  );
}
