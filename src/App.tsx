import { useState } from 'react';
import { VehicleCanvas } from './components/VehicleCanvas';
import { LayerControls } from './components/LayerControls';
import { InfoPanel } from './components/InfoPanel';
import { Notepad } from './components/Notepad';
import { SplashScreen } from './components/shared/SplashScreen';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import './styles/global.css';

const SPLASH_SEEN_KEY = 'car-anatomy-v3-splash-seen';

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
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#0f172a',
      }}
    >
      {/* Left Sidebar - Fixed 280px */}
      <div
        style={{
          width: '280px',
          minWidth: '280px',
          maxWidth: '280px',
          height: '100%',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <LayerControls />
      </div>

      {/* Center - VehicleCanvas takes ALL remaining space */}
      <div
        style={{
          flex: 1,
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        <VehicleCanvas />
        <Notepad />
      </div>

      {/* Right Sidebar - Fixed 320px */}
      <div
        style={{
          width: '320px',
          minWidth: '320px',
          maxWidth: '320px',
          height: '100%',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <InfoPanel />
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
