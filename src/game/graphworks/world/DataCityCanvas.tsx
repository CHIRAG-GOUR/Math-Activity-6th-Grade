// ============================================================
// GRAPHWORKS — DATA CITY 3D CANVAS
// Dynamic client-only Three.js Canvas container
// ============================================================
'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DataCity3D } from './DataCity3D';

export function DataCityCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 16, 26], fov: 48 }}
      shadows
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg, #87CEEB 0%, #B3E5FC 40%, #E1F5FE 100%)' }}
    >
      <Suspense fallback={null}>
        <DataCity3D />
      </Suspense>
      <OrbitControls
        enableRotate={true}
        enablePan={true}
        enableZoom={true}
        maxPolarAngle={Math.PI / 2.15}
        minDistance={12}
        maxDistance={45}
        target={[0, 2, -2]}
      />
    </Canvas>
  );
}
