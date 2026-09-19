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
import { sceneClock, SCENE_LENGTH } from './StudioPerformance';

/** Only the film camera renders this layer, so the cards never appear on set. */
const FEED_ONLY_LAYER = 1;

function drawCard(lines: { text: string; size: number; gap: number; color: string }[]) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 576;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#05070f';
  ctx.fillRect(0, 0, 1024, 576);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 5;
  ctx.strokeRect(48, 48, 928, 480);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  let y = 288 - lines.reduce((a, l) => a + l.gap, 0) / 2;
  for (const line of lines) {
    y += line.gap / 2;
    ctx.fillStyle = line.color;
    ctx.font = `900 ${line.size}px "Arial Black", Impact, sans-serif`;
    ctx.fillText(line.text, 512, y, 880);
    y += line.gap / 2;
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

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
    c.layers.enable(FEED_ONLY_LAYER);
    return c;
  }, []);

  // Title and end cards ride on the camera itself, on a layer only it renders,
  // so the film gets a head and a tail without anything floating on set.
  const cards = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const dist = 0.5;
    const h = 2 * Math.tan(THREE.MathUtils.degToRad(34 / 2)) * dist;
    const geo = new THREE.PlaneGeometry(h * (16 / 9), h);

    const make = (tex: THREE.Texture) => {
      const m = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, transparent: true })
      );
      m.position.set(0, 0, -dist);
      m.layers.set(FEED_ONLY_LAYER);
      m.visible = false;
      m.renderOrder = 10;
      feedCam.add(m);
      return m;
    };

    return {
      title: make(
        drawCard([
          { text: 'SPLIT THE REEL', size: 92, gap: 130, color: '#facc15' },
          { text: 'A RATIO RUSH PICTURE', size: 38, gap: 76, color: '#e2e8f0' },
          { text: 'SCENE 12  ·  TAKE 1', size: 28, gap: 60, color: '#94a3b8' },
        ])
      ),
      end: make(
        drawCard([
          { text: 'THE END', size: 104, gap: 140, color: '#facc15' },
          { text: 'THEY SPLIT IT 1 : 1', size: 44, gap: 84, color: '#e2e8f0' },
        ])
      ),
    };
  }, [feedCam]);

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

    // Head and tail of the picture. The scene loops, so in the theatre the
    // film runs title → scene → end card → title again, like a real reel.
    if (cards) {
      const st = sceneClock.time;
      const inScene = st === null ? null : ((st % SCENE_LENGTH) + SCENE_LENGTH) % SCENE_LENGTH;
      cards.title.visible = inScene !== null && inScene < 2.6;
      cards.end.visible = inScene !== null && inScene > SCENE_LENGTH - 1.4;
    }

    // Never let the camera see the screens that are showing its own feed.
    screenMaterial.visible = false;
    gl.setRenderTarget(target);
    gl.render(scene, feedCam);
    gl.setRenderTarget(null);
    screenMaterial.visible = true;
  });

  return (
    <LiveFeedContext.Provider value={value}>
      {/* The film camera must live in the scene graph for its cards to render. */}
      <primitive object={feedCam} />
      {children}
    </LiveFeedContext.Provider>
  );
};
