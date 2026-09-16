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
      camera={{ position: [0, 16, 26], fov: 46 }}
      shadows
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      dpr={[1, 1.75]}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <DataCity3D />
      </Suspense>
    </Canvas>
  );
}
