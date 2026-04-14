import { useMemo } from 'react';
import { useStore } from '@/store';
import { StatusSelector } from '../notepad/StatusSelector';
import { VoltageInput } from '../notepad/VoltageInput';
import { ConnectedWires } from './ConnectedWires';
import { VoltageDisplay } from './VoltageDisplay';
import { Badge } from '@/components/shared/Badge';
import type { GraphData } from '@/types/circuit';
import type { VoltageReading } from '@/types/diagnostic';

// Import graph data
import chargingData from '@/data/vehicles/es300-1997/graphs/charging.json';

interface Props {
  nodeId: string;
}

const TYPE_LABELS: Record<string, string> = {
  power_source: 'Power Source',
  fuse: 'Fuse',
  relay: 'Relay',
  ecu: 'ECU',
  switch: 'Switch',
  actuator: 'Actuator',
  ground: 'Ground Point',
  splice: 'Splice',
  junction_block: 'Junction Block',
  sensor: 'Sensor',
  connector: 'Connector',
};

export function ComponentInfo({ nodeId }: Props) {
  const statuses = useStore((s) => s.componentStatuses);
  const setComponentStatus = useStore((s) => s.setComponentStatus);
  const addVoltageReading = useStore((s) => s.addVoltageReading);
  const voltageReadings = useStore((s) => s.voltageReadings);
  const setSelectedNode = useStore((s) => s.setSelectedNode);
  const sessionId = useStore((s) => s.activeSessionId);

  const graphData = chargingData as GraphData;

  // Find the node data
  const node = useMemo(() => {
    return graphData.nodes.find((n) => n.id === nodeId);
  }, [nodeId, graphData.nodes]);

  // Find connected wires
  const connectedWires = useMemo(() => {
    return graphData.edges.filter(
      (edge) => edge.source === nodeId || edge.target === nodeId
    );
  }, [nodeId, graphData.edges]);

  // Get voltage reading for this component
  const componentVoltageReading = voltageReadings[nodeId];
  const componentVoltageReadings = componentVoltageReading ? [componentVoltageReading] : [];

  if (!node) {
    return (
      <div style={{ padding: 12, color: 'var(--text-muted)', fontSize: 10 }}>
        Component not found: {nodeId}
      </div>
    );
  }

  const handleVoltageSubmit = (reading: Omit<VoltageReading, 'id' | 'sessionId'>) => {
    addVoltageReading({
      ...reading,
      sessionId,
    } as VoltageReading);
  };

  const typeLabel = TYPE_LABELS[node.type] || node.type;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Header */}
      <div
        style={{
          padding: 12,
          background: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Badge variant="default">{typeLabel}</Badge>
          {node.toyotaCode && (
            <Badge variant="primary" size="sm">{node.toyotaCode}</Badge>
          )}
        </div>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          {node.label}
        </h2>
      </div>

      {/* Location info */}
      {node.physicalLocation && (
        <div style={{ padding: '0 4px' }}>
          <h3
            style={{
              fontSize: 8,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 4,
            }}
          >
            Location
          </h3>
          <p style={{ fontSize: 10, color: 'var(--text-secondary)', margin: 0 }}>
            {node.physicalLocation}
          </p>
        </div>
      )}

      {/* Expected voltage */}
      {node.expectedVoltage && (
        <div style={{ padding: '0 4px' }}>
          <h3
            style={{
              fontSize: 8,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 4,
            }}
          >
            Expected Voltage
          </h3>
          <p style={{ fontSize: 10, color: 'var(--accent)', margin: 0 }}>{node.expectedVoltage}</p>
        </div>
      )}

      {/* Pins */}
      {node.pins && (
        <div style={{ padding: '0 4px' }}>
          <h3
            style={{
              fontSize: 8,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 4,
            }}
          >
            Pins
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {node.pins.split(', ').map((pin) => (
              <span
                key={pin}
                style={{
                  padding: '2px 6px',
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 9,
                  color: 'var(--text-secondary)',
                }}
              >
                {pin}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Systems */}
      <div style={{ padding: '0 4px' }}>
        <h3
          style={{
            fontSize: 8,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 4,
          }}
        >
          Systems
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {node.system.map((sys) => (
            <span
              key={sys}
              style={{
                padding: '2px 6px',
                background: `var(--system-${sys}, var(--bg-base))`,
                borderRadius: 'var(--radius-sm)',
                fontSize: 8,
                color: 'var(--bg-base)',
                fontWeight: 500,
              }}
            >
              {sys}
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }} />

      {/* Status selector */}
      <StatusSelector
        componentId={nodeId}
        componentLabel={node.label}
        status={statuses[nodeId] || 'untested'}
        onStatusChange={setComponentStatus}
      />

      {/* Voltage input */}
      <VoltageInput
        testPointId={nodeId}
        testPointLabel={`${node.label} voltage`}
        expectedVoltage={parseFloat(node.expectedVoltage?.replace(/[^\d.]/g, '') || '12.6')}
        onSubmit={handleVoltageSubmit}
      />

      {/* Voltage readings display */}
      {componentVoltageReadings.length > 0 && (
        <VoltageDisplay
          readings={componentVoltageReadings}
          expectedVoltage={parseFloat(node.expectedVoltage?.replace(/[^\d.]/g, '') || '12.6')}
        />
      )}

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }} />

      {/* Connected wires */}
      <ConnectedWires
        nodeId={nodeId}
        wires={connectedWires}
        onNodeSelect={setSelectedNode}
      />

      {/* Education section */}
      {node.education && (
        <>
          <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }} />

          <div style={{ padding: '0 4px' }}>
            <h3
              style={{
                fontSize: 8,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              Learn
            </h3>

            {/* Purpose */}
            <div style={{ marginBottom: 12 }}>
              <h4 style={{ fontSize: 9, color: 'var(--text-secondary)', marginBottom: 4 }}>
                Purpose
              </h4>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                {node.education.purpose}
              </p>
            </div>

            {/* Failure modes */}
            {node.education.failureModes && (
              <div style={{ marginBottom: 12 }}>
                <h4 style={{ fontSize: 9, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Common Failures
                </h4>
                <ul
                  style={{
                    margin: 0,
                    padding: '0 0 0 16px',
                    fontSize: 10,
                    color: 'var(--text-muted)',
                    lineHeight: 1.6,
                  }}
                >
                  {node.education.failureModes.map((mode, i) => (
                    <li key={i}>{mode}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Test procedure */}
            {node.education.testProcedure && (
              <div>
                <h4 style={{ fontSize: 9, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Test Procedure ({node.education.testProcedure.tool})
                </h4>
                <ol
                  style={{
                    margin: 0,
                    padding: '0 0 0 16px',
                    fontSize: 10,
                    color: 'var(--text-muted)',
                    lineHeight: 1.6,
                  }}
                >
                  {node.education.testProcedure.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
