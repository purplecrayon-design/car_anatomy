import { useCallback } from 'react';
import { useStore } from '@/store';
import { SessionManager } from './SessionManager';
import { StatusSelector } from './StatusSelector';
import { VoltageInput } from './VoltageInput';
import { AnnotationEditor } from './AnnotationEditor';
import { ProgressTracker } from './ProgressTracker';
import type { VoltageReading, Annotation } from '@/types/diagnostic';

export function DiagnosticPanel() {
  const selectedNodeId = useStore((s) => s.selectedNodeId);
  const statuses = useStore((s) => s.componentStatuses);
  const setComponentStatus = useStore((s) => s.setComponentStatus);
  const addVoltageReading = useStore((s) => s.addVoltageReading);
  const annotations = useStore((s) => s.annotations);
  const addAnnotation = useStore((s) => s.addAnnotation);
  const removeAnnotation = useStore((s) => s.removeAnnotation);
  const currentPage = useStore((s) => s.currentPage);
  const sessionId = useStore((s) => s.activeSessionId);

  const handleVoltageSubmit = useCallback(
    (reading: Omit<VoltageReading, 'id' | 'sessionId'>) => {
      addVoltageReading({
        ...reading,
        sessionId,
      } as VoltageReading);
    },
    [addVoltageReading, sessionId]
  );

  const handleAnnotationAdd = useCallback(
    (annotation: Omit<Annotation, 'id' | 'sessionId'>) => {
      addAnnotation({
        ...annotation,
        sessionId,
      } as Annotation);
    },
    [addAnnotation, sessionId]
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: 4,
      }}
    >
      {/* Progress tracker */}
      <ProgressTracker />

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border-subtle)' }} />

      {/* Session manager */}
      <section>
        <h2
          style={{
            fontSize: 8,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          Session
        </h2>
        <SessionManager />
      </section>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border-subtle)' }} />

      {/* Selected component diagnostics */}
      {selectedNodeId ? (
        <section>
          <h2
            style={{
              fontSize: 8,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            Component Diagnostics
          </h2>

          {/* Status selector */}
          <div style={{ marginBottom: 12 }}>
            <StatusSelector
              componentId={selectedNodeId}
              componentLabel={selectedNodeId}
              status={statuses[selectedNodeId] || 'untested'}
              onStatusChange={setComponentStatus}
            />
          </div>

          {/* Voltage input */}
          <div style={{ marginBottom: 12 }}>
            <VoltageInput
              testPointId={selectedNodeId}
              testPointLabel={`${selectedNodeId} voltage`}
              expectedVoltage={12.6}
              onSubmit={handleVoltageSubmit}
            />
          </div>
        </section>
      ) : (
        <div
          style={{
            padding: 24,
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: 10,
          }}
        >
          Select a component to run diagnostics
        </div>
      )}

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border-subtle)' }} />

      {/* Annotations */}
      <section>
        <AnnotationEditor
          annotations={annotations}
          currentPageId={currentPage}
          onAdd={handleAnnotationAdd}
          onRemove={removeAnnotation}
        />
      </section>
    </div>
  );
}
