interface Zone {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page?: number;
}

interface Props {
  zones: Zone[];
  currentPage?: number;
  onZoneClick?: (zoneId: string) => void;
}

export function ZoneLabels({ zones, currentPage, onZoneClick }: Props) {
  if (zones.length === 0) {
    return <g className="zone-labels" />;
  }

  return (
    <g className="zone-labels" aria-label="Diagram zones">
      {zones.map((zone) => {
        const isCurrentPage = zone.page === currentPage;

        return (
          <g key={zone.id}>
            {/* Zone boundary (subtle dashed line) */}
            <rect
              x={zone.x}
              y={zone.y}
              width={zone.width}
              height={zone.height}
              fill="none"
              stroke={isCurrentPage ? 'var(--accent)' : 'var(--border-subtle)'}
              strokeWidth={isCurrentPage ? 1 : 0.5}
              strokeDasharray={isCurrentPage ? 'none' : '4 4'}
              opacity={0.5}
              rx={4}
              ry={4}
            />

            {/* Zone label */}
            <g
              onClick={() => onZoneClick?.(zone.id)}
              style={{ cursor: onZoneClick ? 'pointer' : 'default' }}
            >
              {/* Label background */}
              <rect
                x={zone.x + 4}
                y={zone.y + 4}
                width={zone.label.length * 6 + 12}
                height={16}
                fill={isCurrentPage ? 'var(--accent)' : 'var(--bg-elevated)'}
                stroke={isCurrentPage ? 'var(--accent)' : 'var(--border-subtle)'}
                strokeWidth={0.5}
                rx={2}
                ry={2}
              />

              {/* Label text */}
              <text
                x={zone.x + 10}
                y={zone.y + 15}
                fill={isCurrentPage ? 'var(--bg-base)' : 'var(--text-muted)'}
                fontSize={9}
                fontFamily="var(--font-mono)"
                fontWeight={isCurrentPage ? 600 : 400}
              >
                {zone.label}
              </text>

              {/* Page number indicator */}
              {zone.page !== undefined && (
                <text
                  x={zone.x + zone.width - 8}
                  y={zone.y + 14}
                  fill="var(--text-ghost)"
                  fontSize={8}
                  fontFamily="var(--font-mono)"
                  textAnchor="end"
                >
                  P{zone.page}
                </text>
              )}
            </g>
          </g>
        );
      })}
    </g>
  );
}
