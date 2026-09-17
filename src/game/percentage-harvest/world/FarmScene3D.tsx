// ============================================================
// PERCENTAGE HARVEST — MAIN 3D FARM CANVAS & ENVIRONMENT
// Parallax Camera (Mouse Scroll Zoom Disabled), Village Atmosphere,
// Day/Night Transitions, and Stage Progression
// ============================================================

import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { FarmTerrain3D } from './FarmTerrain3D';
import { FarmBuildings3D } from './FarmBuildings3D';
import { CropFields3D } from './CropFields3D';
import { FarmVehicles3D } from './FarmVehicles3D';
import { FarmWorkers3D } from './FarmWorkers3D';
import { FarmAnimals3D } from './FarmAnimals3D';
import { farmSim } from '../engine/farmSim';

// ─────────────────────────────────────────────────────────────
// SMOOTH PARALLAX CAMERA CONTROLLER (No Scroll Wheel Zooming)
// ─────────────────────────────────────────────────────────────
const ParallaxCameraController: React.FC = () => {
  const { camera, pointer } = useThree();
  const basePos = useRef(new THREE.Vector3(0, 20, 25.5));

  useFrame(() => {
    // Smooth parallax sway driven by mouse pointer coordinates
    const targetX = basePos.current.x + pointer.x * 3.0;
    const targetY = basePos.current.y - pointer.y * 1.6;
    const targetZ = basePos.current.z;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.04);
    camera.lookAt(0, 0.6, 1.6);
  });

  return null;
};

const DynamicEnvironment: React.FC = () => {
  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const [sunPos, setSunPos] = useState<[number, number, number]>([14, 26, 16]);
  const [lightColor, setLightColor] = useState('#fffdf0');
  const [ambientIntensity, setAmbientIntensity] = useState(1.15);

  useFrame((_, delta) => {
    farmSim.update(delta);
    const clk = farmSim.clock;

    if (clk.isNightTransition) {
      const angle = clk.sunAngle;
      const sx = Math.cos(angle) * 30;
      const sy = Math.sin(angle) * 30;
      const sz = 16;
      setSunPos([sx, sy, sz]);

      if (sy < 5) {
        setLightColor('#818cf8'); // Night indigo
        setAmbientIntensity(0.45);
      } else if (sy < 15) {
        setLightColor('#fb923c'); // Sunset amber
        setAmbientIntensity(0.75);
      } else {
        setLightColor('#fffdf0');
        setAmbientIntensity(1.15);
      }
    } else {
      setSunPos([14, 26, 16]);
      setLightColor('#fffdf0');
      setAmbientIntensity(1.15);
    }
  });

  return (
    <>
      <Sky
        sunPosition={sunPos}
        turbidity={2.0}
        rayleigh={0.4}
        mieCoefficient={0.002}
        mieDirectionalG={0.82}
      />
      <ambientLight color="#e0f2fe" intensity={ambientIntensity} />
      <directionalLight
        ref={sunLightRef}
        position={sunPos}
        intensity={2.3}
        color={lightColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-28}
        shadow-camera-right={28}
        shadow-camera-top={28}
        shadow-camera-bottom={-28}
        shadow-camera-near={0.5}
        shadow-camera-far={95}
        shadow-bias={-0.0001}
      />
      <directionalLight
        position={[-16, 18, -10]}
        intensity={0.8}
        color="#dbeafe"
      />
    </>
  );
};

export const FarmScene3D: React.FC = () => {
  const [stageNotice, setStageNotice] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStageNotice(farmSim.clock.stageNotice);
      setIsTransitioning(farmSim.clock.isNightTransition);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 20, 25.5], fov: 38 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <ParallaxCameraController />
        <DynamicEnvironment />
        <FarmTerrain3D />
        <FarmBuildings3D />
        <CropFields3D />
        <FarmVehicles3D />
        <FarmWorkers3D />
        <FarmAnimals3D />

        <OrbitControls
          target={[0, 0.6, 1.6]}
          enableZoom={false} // Disable mouse wheel zoom completely
          enablePan={false}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 4}
          enableRotate={false} // Use smooth mouse parallax instead of jerky rotations
        />
      </Canvas>

      {/* ── TIME ADVANCING / AFTER SOME DAYS FLOATING NOTIFICATION ── */}
      {stageNotice && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all animate-bounce">
          <div className="px-6 py-3 rounded-2xl bg-white/95 text-slate-900 shadow-2xl border-2 border-amber-400 backdrop-blur-md flex items-center gap-3">
            <span className="text-2xl">⏱️</span>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">
                {isTransitioning ? 'AFTER SOME DAYS...' : 'FARM ACTIVITY'}
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900">
                {stageNotice}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
