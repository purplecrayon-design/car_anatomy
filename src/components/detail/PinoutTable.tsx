import type { WireEdge } from '@/types/circuit';
import { wireColorToHex, wireColorName } from '@/utils/wireColors';

interface PinInfo {
  pin: string;
  wire?: WireEdge;
  description?: string;
  expectedVoltage?: string;
}

interface Props {
  connectorId: string;
  pins: PinInfo[];
  onPinSelect?: (pin: string, wireId?: string) => void;
}

export function PinoutTable({ connectorId, pins, onPinSelect }: Props) {
  if (pins.length === 0) {
    return (
      <div
        style={{
          padding: 12,
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <p style={{ fontSize: 9, color: 'var(--text-muted)', margin: 0, textAlign: 'center' }}>
          No pin information available
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <h4
        style={{
          fontSize: 8,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 2,
        }}
      >
        Pinout - {connectorId}
      </h4>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 9,
        }}
        role="table"
        aria-label={`Pinout table for connector ${connectorId}`}
      >
        <thead>
          <tr>
            <th
              style={{
                textAlign: 'left',
                padding: '6px 8px',
                background: 'var(--bg-elevated)',
                borderBottom: '1px solid var(--border)',
                color: 'var(--text-muted)',
                fontWeight: 500,
                fontSize: 8,
                textTransform: 'uppercase',
              }}
            >
              Pin
            </th>
            <th
              style={{
                textAlign: 'left',
                padding: '6px 8px',
                background: 'var(--bg-elevated)',
                borderBottom: '1px solid var(--border)',
                color: 'var(--text-muted)',
                fontWeight: 500,
                fontSize: 8,
                textTransform: 'uppercase',
              }}
            >
              Wire
            </th>
            <th
              style={{
                textAlign: 'left',
                padding: '6px 8px',
                background: 'var(--bg-elevated)',
                borderBottom: '1px solid var(--border)',
                color: 'var(--text-muted)',
                fontWeight: 500,
                fontSize: 8,
                textTransform: 'uppercase',
              }}
            >
              Description
            </th>
            <th
              style={{
                textAlign: 'right',
                padding: '6px 8px',
                background: 'var(--bg-elevated)',
                borderBottom: '1px solid var(--border)',
                color: 'var(--text-muted)',
                fontWeight: 500,
                fontSize: 8,
                textTransform: 'uppercase',
              }}
            >
              Voltage
            </th>
          </tr>
        </thead>
        <tbody>
          {pins.map((pinInfo, index) => {
            const primaryHex = pinInfo.wire ? wireColorToHex(pinInfo.wire.primaryColor) : undefined;
            const stripeHex =
              pinInfo.wire?.stripeColor ? wireColorToHex(pinInfo.wire.stripeColor) : undefined;

            return (
              <tr
                key={pinInfo.pin}
                onClick={() => onPinSelect?.(pinInfo.pin, pinInfo.wire?.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onPinSelect?.(pinInfo.pin, pinInfo.wire?.id);
                  }
                }}
                tabIndex={onPinSelect ? 0 : -1}
                role={onPinSelect ? 'button' : undefined}
                style={{
                  cursor: onPinSelect ? 'pointer' : 'default',
                  background: index % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-base)',
                }}
              >
                <td
                  style={{
                    padding: '6px 8px',
                    borderBottom: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {pinInfo.pin}
                </td>
                <td
                  style={{
                    padding: '6px 8px',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  {pinInfo.wire ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div
                        style={{
                          width: 16,
                          height: 5,
                          borderRadius: 2,
                          background: stripeHex
                            ? `repeating-linear-gradient(90deg, ${primaryHex} 0px, ${primaryHex} 3px, ${stripeHex} 3px, ${stripeHex} 6px)`
                            : primaryHex,
                          flexShrink: 0,
                        }}
                        title={wireColorName(pinInfo.wire.colorLabel)}
                      />
                      <span style={{ color: 'var(--text-muted)' }}>{pinInfo.wire.colorLabel}</span>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-ghost)' }}>-</span>
                  )}
                </td>
                <td
                  style={{
                    padding: '6px 8px',
                    borderBottom: '1px solid var(--border-subtle)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {pinInfo.description || '-'}
                </td>
                <td
                  style={{
                    padding: '6px 8px',
                    borderBottom: '1px solid var(--border-subtle)',
                    color: pinInfo.expectedVoltage ? 'var(--accent)' : 'var(--text-ghost)',
                    textAlign: 'right',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {pinInfo.expectedVoltage || '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
