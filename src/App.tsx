import { useState } from 'react';
import { VehicleCanvas } from './components/VehicleCanvas';
import { LayerControls } from './components/LayerControls';
import { InfoPanel } from './components/InfoPanel';
import { Notepad } from './components/Notepad';
import { SplashScreen } from './components/shared/SplashScreen';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { MobileTabBar } from './components/layout/MobileTabBar';
import { useResponsive } from './hooks/useResponsive';
import './styles/global.css';

const SPLASH_SEEN_KEY = 'car-anatomy-v3-splash-seen';

type MobileTab = 'diagram' | 'layers' | 'components' | 'session';

function AppContent() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem(SPLASH_SEEN_KEY);
  });
  const [mobileTab, setMobileTab] = useState<MobileTab>('diagram');
  const bp = useResponsive();
  const isMobile = bp === 'mobile' || bp === 'tablet';

  const handleSplashComplete = () => {
    sessionStorage.setItem(SPLASH_SEEN_KEY, 'true');
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Mobile layout - tab-based navigation
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen h-[100dvh] bg-slate-950 overflow-hidden">
        <main className="flex-1 relative overflow-hidden pb-14">
          {mobileTab === 'diagram' && (
            <>
              <VehicleCanvas />
              <Notepad />
            </>
          )}
          {mobileTab === 'layers' && (
            <div className="h-full overflow-y-auto bg-slate-900">
              <LayerControls />
            </div>
          )}
          {mobileTab === 'components' && (
            <div className="h-full overflow-y-auto">
              <InfoPanel />
            </div>
          )}
          {mobileTab === 'session' && (
            <div className="h-full overflow-y-auto bg-slate-900 p-4">
              <SessionPanel />
            </div>
          )}
        </main>
        <MobileTabBar activeTab={mobileTab} onTabChange={setMobileTab} />
      </div>
    );
  }

  // Desktop layout - 3-column with fixed sidebars
  return (
    <div className="h-screen h-[100dvh] bg-slate-950 overflow-hidden flex">
      {/* Left sidebar - LayerControls (fixed 280px) */}
      <aside className="w-[280px] flex-shrink-0 h-full overflow-hidden">
        <LayerControls />
      </aside>

      {/* Main canvas area - fills remaining space */}
      <main className="flex-1 relative overflow-hidden min-w-0">
        <VehicleCanvas />
        <Notepad />
      </main>

      {/* Right sidebar - InfoPanel (fixed 320px) */}
      <aside className="w-[320px] flex-shrink-0 h-full overflow-hidden">
        <InfoPanel />
      </aside>
    </div>
  );
}

// Simple session panel for mobile
function SessionPanel() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Diagnostic Session</h2>
      <p className="text-slate-400 text-sm">
        Track your diagnostic progress here. Select components from the diagram to add notes and update their status.
      </p>
      <div className="p-4 bg-slate-800/80 backdrop-blur rounded-2xl border border-slate-700">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Quick Tips</p>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>• Tap on diagram components to see details</li>
          <li>• Mark components as OK, Suspect, or Failed</li>
          <li>• Add notes with tags for future reference</li>
          <li>• View torque specs and OBD data when available</li>
        </ul>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
