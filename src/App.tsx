import { useState } from 'react';
import { VehicleCanvas } from './components/VehicleCanvas';
import { LayerControls } from './components/LayerControls';
import { InfoPanel } from './components/InfoPanel';
import { Notepad } from './components/Notepad';
import { SplashScreen } from './components/shared/SplashScreen';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import './styles/global.css';

const SPLASH_SEEN_KEY = 'car-anatomy-splash-seen';

function AppContent() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem(SPLASH_SEEN_KEY);
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem(SPLASH_SEEN_KEY, 'true');
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="flex h-screen bg-[#F8F6F0] overflow-hidden">
      {/* Left sidebar */}
      <LayerControls />

      {/* Main canvas area */}
      <main className="flex-1 relative overflow-hidden">
        <VehicleCanvas />
        <Notepad />
      </main>

      {/* Right info panel */}
      <InfoPanel />
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
