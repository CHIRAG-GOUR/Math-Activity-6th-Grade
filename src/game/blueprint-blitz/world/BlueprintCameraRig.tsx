// ============================================================
// BLUEPRINT BLITZ — Smooth Cinematic Parallax Camera Rig
// Transitions seamlessly between:
// - Overview (Master dual-site view)
// - Blue Focus (Close construction shot on Left)
// - Red Focus (Close construction shot on Right)
// - Scanner Mode (Dynamic inspection angle)
// - Podium (Victory championship loop)
// ============================================================

import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useBlueprintStore } from '../store/blueprintStore';

export const BlueprintCameraRig: React.FC = () => {
  const { camera } = useThree();
  const cameraFocus = useBlueprintStore((state) => state.cameraFocus);
  const winner = useBlueprintStore((state) => state.winner);
  const phase = useBlueprintStore((state) => state.phase);

  const targetPos = useRef(new THREE.Vector3(0, 11, 20));
  const targetLookAt = useRef(new THREE.Vector3(0, 2, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 2, 0));

  useFrame((state, delta) => {
    // Subtle pointer parallax offset
    const px = state.pointer.x * 0.8;
    const py = state.pointer.y * 0.4;

    const isGameOver = phase === 'game-over';

    if (isGameOver || cameraFocus === 'podium') {
      const angle = state.clock.getElapsedTime() * 0.35;
      if (winner === 'blue') {
        // Dramatic close-up orbit around Blue Team's completed Dream House
        targetPos.current.set(-9 + Math.sin(angle) * 8.5, 5.0 + Math.sin(angle * 0.5) * 1.2, Math.cos(angle) * 8.5);
        targetLookAt.current.set(-9, 2.8, 0);
      } else if (winner === 'red') {
        // Dramatic close-up orbit around Red Team's completed Dream House
        targetPos.current.set(9 + Math.sin(angle) * 8.5, 5.0 + Math.sin(angle * 0.5) * 1.2, Math.cos(angle) * 8.5);
        targetLookAt.current.set(9, 2.8, 0);
      } else {
        targetPos.current.set(Math.sin(angle) * 16, 8, Math.cos(angle) * 16);
        targetLookAt.current.set(0, 2.5, 0);
      }
    } else {
      switch (cameraFocus) {
        case 'overview':
          targetPos.current.set(px, 10 + py, 19);
          targetLookAt.current.set(0, 2, 0);
          break;

        case 'blue':
          targetPos.current.set(-9 + px, 7 + py, 10);
          targetLookAt.current.set(-9, 2.5, 0);
          break;

        case 'red':
          targetPos.current.set(9 + px, 7 + py, 10);
          targetLookAt.current.set(9, 2.5, 0);
          break;

        case 'scanner':
          targetPos.current.set(px, 8 + py, 14);
          targetLookAt.current.set(0, 3, 0);
          break;
      }
    }

    // Smooth position interpolation
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPos.current.x, 3.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPos.current.y, 3.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPos.current.z, 3.5, delta);

    // Smooth lookAt interpolation
    currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, targetLookAt.current.x, 4, delta);
    currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, targetLookAt.current.y, 4, delta);
    currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, targetLookAt.current.z, 4, delta);

    camera.lookAt(currentLookAt.current);
  });

  return null;
};
