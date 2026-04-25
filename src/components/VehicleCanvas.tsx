import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useLayersStore } from '@/stores/useLayersStore';
import { useSelectedComponentStore } from '@/stores/useSelectedComponentStore';
import { useManualStore } from '@/stores/useManualStore';
import { useNotesStore } from '@/stores/useNotesStore';

// Component hotspot positions in 3D space
const HOTSPOTS = [
  { id: 'engine-block', position: [0, 0.3, 1.2] as [number, number, number], label: 'Engine' },
  { id: 'radiator', position: [0, 0.2, 2.0] as [number, number, number], label: 'Radiator' },
  { id: 'battery', position: [-0.5, 0.4, 1.5] as [number, number, number], label: 'Battery' },
  { id: 'alternator', position: [0.4, 0.2, 1.3] as [number, number, number], label: 'Alternator' },
  { id: 'fuel-pump', position: [0, 0.1, -1.5] as [number, number, number], label: 'Fuel Pump' },
  { id: 'catalytic-converter', position: [0, -0.2, 0.5] as [number, number, number], label: 'Cat' },
  { id: 'front-brake-rotor', position: [0.7, 0, 1.5] as [number, number, number], label: 'Brake' },
  { id: 'ecu', position: [0, 0.5, 0] as [number, number, number], label: 'ECU' },
];

// 3D Car Body Component
function CarBody({ opacity }: { opacity: number }) {
  const bodyColor = new THREE.Color('#1a1a2e');
  const glassColor = new THREE.Color('#87ceeb');

  return (
    <group name="body">
      {/* Main body */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.5, 4.5]} />
        <meshStandardMaterial color={bodyColor} metalness={0.8} roughness={0.2} transparent opacity={opacity} />
      </mesh>

      {/* Cabin */}
      <mesh position={[0, 0.85, -0.3]} castShadow>
        <boxGeometry args={[1.6, 0.45, 2.0]} />
        <meshStandardMaterial color={bodyColor} metalness={0.8} roughness={0.2} transparent opacity={opacity} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.85, 0.7]} rotation={[-0.4, 0, 0]}>
        <planeGeometry args={[1.5, 0.6]} />
        <meshStandardMaterial color={glassColor} metalness={0.1} roughness={0.1} transparent opacity={opacity * 0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Rear window */}
      <mesh position={[0, 0.85, -1.3]} rotation={[0.3, 0, 0]}>
        <planeGeometry args={[1.4, 0.5]} />
        <meshStandardMaterial color={glassColor} metalness={0.1} roughness={0.1} transparent opacity={opacity * 0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Hood */}
      <mesh position={[0, 0.65, 1.5]} castShadow>
        <boxGeometry args={[1.7, 0.08, 1.4]} />
        <meshStandardMaterial color={bodyColor} metalness={0.8} roughness={0.2} transparent opacity={opacity} />
      </mesh>

      {/* Trunk */}
      <mesh position={[0, 0.6, -1.8]} castShadow>
        <boxGeometry args={[1.7, 0.1, 0.8]} />
        <meshStandardMaterial color={bodyColor} metalness={0.8} roughness={0.2} transparent opacity={opacity} />
      </mesh>

      {/* Front bumper */}
      <mesh position={[0, 0.2, 2.3]} castShadow>
        <boxGeometry args={[1.9, 0.25, 0.15]} />
        <meshStandardMaterial color="#111" metalness={0.3} roughness={0.7} transparent opacity={opacity} />
      </mesh>

      {/* Rear bumper */}
      <mesh position={[0, 0.2, -2.3]} castShadow>
        <boxGeometry args={[1.9, 0.25, 0.15]} />
        <meshStandardMaterial color="#111" metalness={0.3} roughness={0.7} transparent opacity={opacity} />
      </mesh>

      {/* Headlights */}
      <mesh position={[-0.65, 0.35, 2.2]}>
        <boxGeometry args={[0.35, 0.15, 0.1]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.3} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0.65, 0.35, 2.2]}>
        <boxGeometry args={[0.35, 0.15, 0.1]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.3} transparent opacity={opacity} />
      </mesh>

      {/* Taillights */}
      <mesh position={[-0.7, 0.4, -2.2]}>
        <boxGeometry args={[0.25, 0.12, 0.08]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.2} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0.7, 0.4, -2.2]}>
        <boxGeometry args={[0.25, 0.12, 0.08]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.2} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

// Wheel component
function Wheel({ position, opacity }: { position: [number, number, number]; opacity: number }) {
  return (
    <group position={position}>
      {/* Tire */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.32, 0.12, 16, 32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} transparent opacity={opacity} />
      </mesh>
      {/* Rim */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.15, 16]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

// Engine component
function Engine({ visible, opacity }: { visible: boolean; opacity: number }) {
  if (!visible) return null;

  return (
    <group name="engine" position={[0, 0.25, 1.3]}>
      {/* Engine block */}
      <mesh castShadow>
        <boxGeometry args={[0.7, 0.5, 0.8]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.6} roughness={0.4} transparent opacity={opacity} />
      </mesh>
      {/* Valve cover */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.65, 0.1, 0.7]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} transparent opacity={opacity} />
      </mesh>
      {/* Intake manifold */}
      <mesh position={[0.4, 0.15, 0]} castShadow>
        <boxGeometry args={[0.15, 0.2, 0.5]} />
        <meshStandardMaterial color="#555" metalness={0.5} roughness={0.5} transparent opacity={opacity} />
      </mesh>
      {/* Alternator */}
      <mesh position={[0.45, 0, 0.2]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.15, 16]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

// Cooling System component
function CoolingSystem({ visible, opacity }: { visible: boolean; opacity: number }) {
  if (!visible) return null;

  return (
    <group name="cooling" position={[0, 0.3, 2.0]}>
      {/* Radiator */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.5, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.6} transparent opacity={opacity} />
      </mesh>
      {/* Radiator fins */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[1.1, 0.45, 0.02]} />
        <meshStandardMaterial color="#333" metalness={0.6} roughness={0.4} transparent opacity={opacity} />
      </mesh>
      {/* Hoses */}
      <mesh position={[0.4, 0.1, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
        <meshStandardMaterial color="#222" roughness={0.8} transparent opacity={opacity} />
      </mesh>
      <mesh position={[-0.4, 0.1, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
        <meshStandardMaterial color="#222" roughness={0.8} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

// Exhaust System component
function ExhaustSystem({ visible, opacity }: { visible: boolean; opacity: number }) {
  if (!visible) return null;

  return (
    <group name="exhaust" position={[0, -0.1, 0]}>
      {/* Exhaust manifold */}
      <mesh position={[-0.3, 0.2, 1.0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.08, 0.4, 8]} />
        <meshStandardMaterial color="#555" metalness={0.7} roughness={0.4} transparent opacity={opacity} />
      </mesh>
      {/* Catalytic converter */}
      <mesh position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.5, 16]} />
        <meshStandardMaterial color="#666" metalness={0.6} roughness={0.4} transparent opacity={opacity} />
      </mesh>
      {/* Muffler */}
      <mesh position={[0.3, 0, -1.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
        <meshStandardMaterial color="#444" metalness={0.5} roughness={0.5} transparent opacity={opacity} />
      </mesh>
      {/* Exhaust pipe */}
      <mesh position={[0.1, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2.5, 8]} />
        <meshStandardMaterial color="#555" metalness={0.6} roughness={0.4} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

// Fuel System component
function FuelSystem({ visible, opacity }: { visible: boolean; opacity: number }) {
  if (!visible) return null;

  return (
    <group name="fuel">
      {/* Fuel tank */}
      <mesh position={[0, 0.15, -1.5]} castShadow>
        <boxGeometry args={[1.0, 0.25, 0.8]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.3} roughness={0.7} transparent opacity={opacity} />
      </mesh>
      {/* Fuel lines */}
      <mesh position={[0.2, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 2.5, 8]} />
        <meshStandardMaterial color="#111" roughness={0.6} transparent opacity={opacity} />
      </mesh>
      {/* Fuel rail */}
      <mesh position={[0, 0.35, 1.3]}>
        <cylinderGeometry args={[0.025, 0.025, 0.6, 8]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

// Suspension component
function Suspension({ visible, opacity }: { visible: boolean; opacity: number }) {
  if (!visible) return null;

  const strutPositions: [number, number, number][] = [
    [-0.75, 0.2, 1.4],
    [0.75, 0.2, 1.4],
    [-0.75, 0.2, -1.4],
    [0.75, 0.2, -1.4],
  ];

  return (
    <group name="suspension">
      {strutPositions.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Strut */}
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
            <meshStandardMaterial color="#666" metalness={0.6} roughness={0.4} transparent opacity={opacity} />
          </mesh>
          {/* Spring */}
          <mesh position={[0, 0.1, 0]}>
            <torusGeometry args={[0.06, 0.015, 8, 16]} />
            <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} transparent opacity={opacity} />
          </mesh>
        </group>
      ))}
      {/* Control arms */}
      <mesh position={[-0.5, 0, 1.4]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.04, 0.4, 0.04]} />
        <meshStandardMaterial color="#444" metalness={0.5} roughness={0.5} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0.5, 0, 1.4]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.04, 0.4, 0.04]} />
        <meshStandardMaterial color="#444" metalness={0.5} roughness={0.5} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

// Brakes component
function Brakes({ visible, opacity }: { visible: boolean; opacity: number }) {
  if (!visible) return null;

  const brakePositions: [number, number, number][] = [
    [-0.85, 0, 1.4],
    [0.85, 0, 1.4],
    [-0.85, 0, -1.4],
    [0.85, 0, -1.4],
  ];

  return (
    <group name="brakes">
      {brakePositions.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Rotor */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.03, 24]} />
            <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} transparent opacity={opacity} />
          </mesh>
          {/* Caliper */}
          <mesh position={[i % 2 === 0 ? 0.1 : -0.1, 0.08, 0]}>
            <boxGeometry args={[0.08, 0.12, 0.1]} />
            <meshStandardMaterial color="#c41e3a" metalness={0.4} roughness={0.5} transparent opacity={opacity} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Wiring component
function Wiring({ visible, opacity }: { visible: boolean; opacity: number }) {
  if (!visible) return null;

  return (
    <group name="wiring">
      {/* Main harness */}
      <mesh position={[0, 0.5, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <tubeGeometry args={[
          new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.3, 0.5, 0),
            new THREE.Vector3(0, 1.5, 0),
            new THREE.Vector3(-0.2, 2, 0),
          ]),
          32, 0.02, 8, false
        ]} />
        <meshStandardMaterial color="#222" roughness={0.8} transparent opacity={opacity} />
      </mesh>
      {/* Secondary harness */}
      <mesh position={[-0.3, 0.5, 0]} rotation={[0, Math.PI / 4, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.5, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

// Drivetrain component
function Drivetrain({ visible, opacity }: { visible: boolean; opacity: number }) {
  if (!visible) return null;

  return (
    <group name="drivetrain">
      {/* Transmission */}
      <mesh position={[0, 0.1, 0.8]} castShadow>
        <boxGeometry args={[0.5, 0.35, 0.6]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.5} roughness={0.5} transparent opacity={opacity} />
      </mesh>
      {/* Front axles */}
      <mesh position={[0, 0, 1.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 1.7, 8]} />
        <meshStandardMaterial color="#444" metalness={0.6} roughness={0.4} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

// Clickable Hotspot component
function Hotspot({
  id,
  position,
  label,
  selected,
  onClick
}: {
  id: string;
  position: [number, number, number];
  label: string;
  selected: boolean;
  onClick: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <mesh
        onClick={(e) => { e.stopPropagation(); onClick(id); }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={selected ? '#10b981' : hovered ? '#34d399' : '#065f46'}
          emissive={selected ? '#10b981' : hovered ? '#059669' : '#064e3b'}
          emissiveIntensity={selected ? 0.8 : hovered ? 0.5 : 0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      {(hovered || selected) && (
        <Html center distanceFactor={8}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.95)',
            color: selected ? '#10b981' : '#fff',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            border: selected ? '1px solid #10b981' : '1px solid #334155',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}>
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

// Main Car Model component
function CarModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { activeLayers, globalOpacity, layerOpacity } = useLayersStore();
  const { selectedComponent, setSelectedComponent } = useSelectedComponentStore();
  const { getData } = useManualStore();
  const { trackComponentVisit } = useNotesStore();

  const opacity = globalOpacity / 100;

  const isLayerVisible = (layerId: string) => activeLayers.includes(layerId);
  const getLayerOpacity = (layerId: string) => ((layerOpacity[layerId] ?? 100) / 100) * opacity;

  const handleHotspotClick = (id: string) => {
    const data = getData(id);
    trackComponentVisit(id);
    setSelectedComponent({
      id,
      label: data?.label || id,
      ...data,
    });
  };

  // Gentle auto-rotation when idle
  useFrame(() => {
    if (groupRef.current) {
      // Very subtle idle animation
      groupRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Base car body - always visible */}
      {isLayerVisible('chassis') && (
        <>
          <CarBody opacity={getLayerOpacity('chassis')} />
          <Wheel position={[-0.85, 0, 1.4]} opacity={getLayerOpacity('chassis')} />
          <Wheel position={[0.85, 0, 1.4]} opacity={getLayerOpacity('chassis')} />
          <Wheel position={[-0.85, 0, -1.4]} opacity={getLayerOpacity('chassis')} />
          <Wheel position={[0.85, 0, -1.4]} opacity={getLayerOpacity('chassis')} />
        </>
      )}

      {/* Engine */}
      <Engine visible={isLayerVisible('engine-mechanical')} opacity={getLayerOpacity('engine-mechanical')} />

      {/* Cooling System */}
      <CoolingSystem visible={isLayerVisible('cooling-system')} opacity={getLayerOpacity('cooling-system')} />

      {/* Exhaust */}
      <ExhaustSystem visible={isLayerVisible('intake-exhaust')} opacity={getLayerOpacity('intake-exhaust')} />

      {/* Fuel System */}
      <FuelSystem visible={isLayerVisible('fuel-system')} opacity={getLayerOpacity('fuel-system')} />

      {/* Suspension */}
      <Suspension visible={isLayerVisible('suspension-steering')} opacity={getLayerOpacity('suspension-steering')} />

      {/* Brakes */}
      <Brakes visible={isLayerVisible('brakes')} opacity={getLayerOpacity('brakes')} />

      {/* Wiring */}
      <Wiring visible={isLayerVisible('engine-wiring') || isLayerVisible('full-wiring')} opacity={getLayerOpacity('full-wiring')} />

      {/* Drivetrain */}
      <Drivetrain visible={isLayerVisible('drivetrain')} opacity={getLayerOpacity('drivetrain')} />

      {/* Clickable hotspots */}
      {HOTSPOTS.map((h) => (
        <Hotspot
          key={h.id}
          id={h.id}
          position={h.position}
          label={h.label}
          selected={selectedComponent?.id === h.id}
          onClick={handleHotspotClick}
        />
      ))}
    </group>
  );
}

// Loading component
function Loader() {
  return (
    <Html center>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid #1e293b',
          borderTop: '3px solid #10b981',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <div style={{ color: '#94a3b8', fontSize: 14 }}>Loading 3D Model...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Html>
  );
}

// Main VehicleCanvas component
export function VehicleCanvas() {
  const { activeLayers } = useLayersStore();

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      }}
    >
      <Canvas
        camera={{ position: [4, 2, 4], fov: 50 }}
        shadows
        dpr={[1, 1.5]} // Limit pixel ratio for performance
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={<Loader />}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-5, 5, -5]} intensity={0.5} />
          <pointLight position={[0, 3, 0]} intensity={0.3} color="#10b981" />

          {/* Environment for reflections */}
          <Environment preset="city" />

          {/* Ground shadow */}
          <ContactShadows
            position={[0, -0.5, 0]}
            opacity={0.6}
            scale={12}
            blur={2}
            far={4}
          />

          {/* The Car */}
          <CarModel />

          {/* Orbit Controls */}
          <OrbitControls
            makeDefault
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={15}
            minPolarAngle={0.2}
            maxPolarAngle={Math.PI / 2 + 0.3}
            autoRotate={false}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay - Layer count */}
      <div style={{
        position: 'absolute',
        top: 16,
        left: 16,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        maxWidth: 300,
      }}>
        {activeLayers.length > 0 && activeLayers.slice(0, 4).map((id) => (
          <span key={id} style={{
            padding: '4px 10px',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 500,
            background: 'rgba(30, 41, 59, 0.9)',
            border: '1px solid #334155',
            color: '#cbd5e1',
          }}>
            {id.replace(/-/g, ' ')}
          </span>
        ))}
        {activeLayers.length > 4 && (
          <span style={{
            padding: '4px 10px',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            background: '#059669',
            color: '#fff',
          }}>
            +{activeLayers.length - 4}
          </span>
        )}
      </div>

      {/* Controls hint */}
      <div style={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        padding: '8px 14px',
        borderRadius: 10,
        background: 'rgba(30, 41, 59, 0.9)',
        border: '1px solid #334155',
        fontSize: 11,
        color: '#94a3b8',
      }}>
        <span style={{ color: '#10b981' }}>Drag</span> to rotate &nbsp;•&nbsp;
        <span style={{ color: '#10b981' }}>Scroll</span> to zoom &nbsp;•&nbsp;
        <span style={{ color: '#10b981' }}>Right-drag</span> to pan
      </div>

      {/* Empty state */}
      {activeLayers.length === 0 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          padding: 24,
          borderRadius: 16,
          background: 'rgba(30, 41, 59, 0.95)',
          border: '1px solid #334155',
        }}>
          <div style={{ fontSize: 14, color: '#cbd5e1', fontWeight: 500 }}>No layers visible</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Enable layers in the sidebar to explore</div>
        </div>
      )}
    </div>
  );
}
