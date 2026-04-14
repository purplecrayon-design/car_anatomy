import { useEffect, useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './components/Dashboard';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { LoadingOverlay } from './components/shared/LoadingOverlay';
import { ToastContainer, useToast, toast } from './components/shared/Toast';
import { OfflineBanner } from './components/shared/OfflineBanner';
import { Disclaimer } from './components/shared/Disclaimer';
import { useKeyboardNav } from './hooks/useKeyboardNav';
import { useDiagnosticSession } from './hooks/useDiagnosticSession';
import { useStore } from './store';
import { ANATOMY_LAYER_IDS } from './types/anatomy';

const DISCLAIMER_KEY = 'lexwire-disclaimer-accepted';

function AppContent() {
  useKeyboardNav();
  useDiagnosticSession();

  const initLayers = useStore((s) => s.initLayers);
  const isHydrated = useStore((s) => s.isHydrated);
  const error = useStore((s) => s.error);
  const clearError = useStore((s) => s.clearError);
  const viewMode = useStore((s) => s.viewMode);
  const { toasts } = useToast();

  // Disclaimer state
  const [showDisclaimer, setShowDisclaimer] = useState(() => {
    return !localStorage.getItem(DISCLAIMER_KEY);
  });

  const handleAcceptDisclaimer = () => {
    localStorage.setItem(DISCLAIMER_KEY, 'true');
    setShowDisclaimer(false);
  };

  useEffect(() => {
    // Initialize anatomy layers on mount
    initLayers(ANATOMY_LAYER_IDS);
  }, [initLayers]);

  // Show loading state while hydrating session
  if (!isHydrated) {
    return <LoadingOverlay message="Restoring session..." isFullScreen />;
  }

  return (
    <>
      {/* Offline status banner */}
      <OfflineBanner />

      {/* Safety disclaimer (first-run) */}
      <Disclaimer isOpen={showDisclaimer} onAccept={handleAcceptDisclaimer} />

      {/* Main content - Dashboard or Explorer */}
      {viewMode === 'dashboard' ? <Dashboard /> : <AppShell />}

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={toast.dismiss} />

      {/* Error notification */}
      {error && (
        <div
          style={{
            position: 'fixed',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--danger)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: 4,
            fontSize: 11,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}
          role="alert"
          aria-live="assertive"
        >
          <span>{error}</span>
          <button
            onClick={clearError}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: 2,
              cursor: 'pointer',
              fontSize: 10,
            }}
            aria-label="Dismiss error"
          >
            Dismiss
          </button>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
