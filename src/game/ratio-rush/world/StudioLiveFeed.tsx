// ============================================================
// RATIO RUSH — LIVE CAMERA FEED
//
// Every screen in the building (both camera viewfinders, the director's
// video-village monitor and the cinema screen at the premiere) shows what
// the A-camera is actually pointing at, rendered for real from the film
// camera's position into a render target — not a painted picture of a stage.
//
// The screens share one material, so the feed pass simply switches that
// material off for the duration of its own render; the camera can never
// film its own monitors.
// ============================================================

import React, { createContext, useContext, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface LiveFeed {
  /** Material to put on any surface that should show the live shot. */
  screenMaterial: THREE.MeshBasicMaterial;
  texture: THREE.Texture;
}

const LiveFeedContext = createContext<LiveFeed | null>(null);

export const useLiveFeed = (): LiveFeed | null => useContext(LiveFeedContext);

/**
 * Where the A-camera is parked, and what it is framed on. This sits just in
 * front of CAM 1's matte box — any closer to the tripod and the feed is a
 * close-up of the camera's own body.
 */
const CAM_POS = new THREE.Vector3(1.4, 1.62, 2.55);
const CAM_TARGET = new THREE.Vector3(-0.3, 1.3, -2.25);

export const StudioLiveFeedProvider: React.FC<{
  isFilming: boolean;
  children: React.ReactNode;
}> = ({ isFilming, children }) => {
  const target = useMemo(() => {
    // three writes render targets in linear space, so the texture must stay
    // linear too — tagging it sRGB would decode it a second time on sample
    // and every monitor would come out almost black.
    return new THREE.WebGLRenderTarget(640, 360, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      colorSpace: THREE.LinearSRGBColorSpace,
      depthBuffer: true,
      stencilBuffer: false,
    });
  }, []);

  const feedCam = useMemo(() => {
    const c = new THREE.PerspectiveCamera(34, 16 / 9, 0.1, 80);
    c.position.copy(CAM_POS);
    c.lookAt(CAM_TARGET);
    return c;
  }, []);

  const screenMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ map: target.texture, toneMapped: false }),
    [target]
  );

  const value = useMemo<LiveFeed>(
    () => ({ screenMaterial, texture: target.texture }),
    [screenMaterial, target]
  );

  const lookAt = useRef(new THREE.Vector3());
  const frame = useRef(0);

  useFrame(({ gl, scene, clock }) => {
    // The monitors only need ~30fps; the main view still runs full rate.
    frame.current += 1;
    if (frame.current % 2 === 0) return;

    const t = clock.getElapsedTime();
    // A touch of operator handheld once the camera is rolling.
    if (isFilming) {
      feedCam.position.set(
        CAM_POS.x + Math.sin(t * 1.7) * 0.03,
        CAM_POS.y + Math.cos(t * 1.3) * 0.02,
        CAM_POS.z
      );
      lookAt.current.set(
        CAM_TARGET.x + Math.sin(t * 0.7) * 0.22,
        CAM_TARGET.y + Math.cos(t * 0.9) * 0.05,
        CAM_TARGET.z
      );
    } else {
      feedCam.position.copy(CAM_POS);
      lookAt.current.copy(CAM_TARGET);
    }
    feedCam.lookAt(lookAt.current);

    // Never let the camera see the screens that are showing its own feed.
    screenMaterial.visible = false;
    gl.setRenderTarget(target);
    gl.render(scene, feedCam);
    gl.setRenderTarget(null);
    screenMaterial.visible = true;
  });

  return <LiveFeedContext.Provider value={value}>{children}</LiveFeedContext.Provider>;
};
