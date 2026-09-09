// ============================================================
// SKILLIZEE ARCADE — 3D Physical Retro Arcade Cabinet Component
// Authentic Three.js Mesh Model with:
// - Curved 3D Side Wings matching the retro cabinet drawing
// - Skillizee Circular Speaker Medallions & Custom Side Decals
// - Vibrant Backlit Top Marquee Cards with High-Contrast Game Titles
// - Live CRT Monitor with High-Res Game Artwork & Retro Scanline Glow
// - Slanted 3D Control Deck with Animated Joysticks & Arcade Buttons
// - Stamped Coin Door with Illuminated 25¢ Insert Reject Buttons
// - Dynamic On-Hover Floating Badge & Direct Click-to-Play
// ============================================================

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';
import { soundManager } from '@/utils/audio';

export interface ArcadeCabinetConfig {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  grade: string;
  category: string;
  status: 'active' | 'planned';
  image: string;
  route: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  theme: {
    cabinetColor: string;
    tMoldingColor: string;
    tMoldingEmissive: string;
    marqueeBg: string;
    marqueeTextColor: string;
    marqueeGlow: string;
    screenBezelColor: string;
    screenGlowColor: string;
    deckColor: string;
    joystickBallColor: string;
    joystickBallEmissive: string;
    buttonColors: string[];
    coinDoorColor: string;
    sideArtAccent: string;
    floorGlowColor: string;
  };
}

export const ArcadeCabinet3D: React.FC<{
  config: ArcadeCabinetConfig;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}> = ({ config, isSelected, onSelect }) => {
  const router = useRouter();
  const groupRef = useRef<THREE.Group>(null);
  const p1StickRef = useRef<THREE.Group>(null);
  const p2StickRef = useRef<THREE.Group>(null);
  const marqueeMeshRef = useRef<THREE.Mesh>(null);
  const screenMeshRef = useRef<THREE.Mesh>(null);

  const [hovered, setHovered] = useState(false);
  const [screenTex, setScreenTex] = useState<THREE.Texture | null>(null);

  // Load Game Artwork Texture for CRT screen
  useEffect(() => {
    if (typeof window === 'undefined' || !config.image || config.status !== 'active') return;
    const loader = new THREE.TextureLoader();
    loader.load(
      config.image,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
        setScreenTex(tex);
      },
      undefined,
      (err) => {
        console.warn('Screen texture fallback:', config.image, err);
      }
    );
  }, [config.image, config.status]);

  // High-Resolution Procedural Fallback / Game Screen Poster Texture
  const proceduralScreenTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    if (config.id === 'math-escape-vault') {
      const grad = ctx.createLinearGradient(0, 0, 1024, 768);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.5, '#1e3a8a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 768);

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.arc(512, 360, 200, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.font = '900 64px "Impact", "Arial Black", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MATH ESCAPE VAULT', 512, 340);
      ctx.font = 'bold 36px "Inter", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('CRACK THE GTA V TREASURY', 512, 410);
    } else if (config.id === 'number-railway') {
      const grad = ctx.createLinearGradient(0, 0, 1024, 768);
      grad.addColorStop(0, '#082f49');
      grad.addColorStop(0.5, '#0284c7');
      grad.addColorStop(1, '#0369a1');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 768);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.arc(512, 360, 200, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 64px "Impact", "Arial Black", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('THE GREAT NUMBER RAILWAY', 512, 340);
      ctx.font = 'bold 36px "Inter", sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('3D LOCOMOTIVE OPERATIONS', 512, 410);
    } else if (config.id === 'carnival-of-chance') {
      const grad = ctx.createLinearGradient(0, 0, 1024, 768);
      grad.addColorStop(0, '#7f1d1d');
      grad.addColorStop(0.5, '#dc2626');
      grad.addColorStop(1, '#450a0a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 768);

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.arc(512, 360, 200, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = '900 60px "Impact", "Arial Black", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('THE GREAT CARNIVAL OF CHANCE', 512, 340);
      ctx.font = 'bold 36px "Inter", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('PROBABILITY THEME PARK', 512, 410);
    } else {
      // Cyber Arcade Matrix Screen for Slot 4
      const grad = ctx.createLinearGradient(0, 0, 1024, 768);
      grad.addColorStop(0, '#2e1065');
      grad.addColorStop(0.5, '#581c87');
      grad.addColorStop(1, '#0f0a1e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 768);

      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 12;
      ctx.strokeRect(120, 120, 784, 528);

      ctx.fillStyle = '#f0abfc';
      ctx.font = '900 72px "Impact", "Arial Black", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('★ COMING SOON ★', 512, 350);
      ctx.font = 'bold 34px "Inter", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('NEW ACTIVITY IN PRODUCTION', 512, 430);
    }

    // CRT Scanlines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    for (let y = 0; y < 768; y += 8) {
      ctx.fillRect(0, y, 1024, 4);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [config]);

  // Procedural Canvas Texture for Illuminated Top Marquee Sign
  const marqueeTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const bgGrad = ctx.createLinearGradient(0, 0, 1024, 0);
    if (config.id === 'math-escape-vault') {
      bgGrad.addColorStop(0, '#451a03');
      bgGrad.addColorStop(0.5, '#f59e0b');
      bgGrad.addColorStop(1, '#b45309');
    } else if (config.id === 'number-railway') {
      bgGrad.addColorStop(0, '#0c4a6e');
      bgGrad.addColorStop(0.5, '#38bdf8');
      bgGrad.addColorStop(1, '#0284c7');
    } else if (config.id === 'carnival-of-chance') {
      bgGrad.addColorStop(0, '#7f1d1d');
      bgGrad.addColorStop(0.5, '#fbbf24');
      bgGrad.addColorStop(1, '#dc2626');
    } else {
      bgGrad.addColorStop(0, '#3b0764');
      bgGrad.addColorStop(0.5, '#c084fc');
      bgGrad.addColorStop(1, '#7e22ce');
    }

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 320);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 14;
    ctx.strokeRect(10, 10, 1004, 300);

    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 8;
    ctx.strokeRect(24, 24, 976, 272);

    ctx.fillStyle = '#020617';
    ctx.font = '900 32px "Inter", "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`★ CABINET #${config.number} • ${config.grade.toUpperCase()} ★`, 512, 72);

    ctx.font = '900 68px "Impact", "Arial Black", sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(config.title, 515, 185);
    ctx.fillStyle = config.theme.marqueeTextColor || '#ffffff';
    ctx.fillText(config.title, 512, 182);

    ctx.font = 'bold 30px "Inter", sans-serif';
    ctx.fillStyle = '#020617';
    ctx.fillText(config.subtitle.toUpperCase(), 512, 256);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [config]);

  // Procedural Side Art Decal Texture
  const sideArtTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = config.theme.cabinetColor;
    ctx.fillRect(0, 0, 512, 1024);

    ctx.strokeStyle = config.theme.sideArtAccent;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(0, 150);
    ctx.bezierCurveTo(200, 250, 300, 550, 512, 600);
    ctx.stroke();

    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 220);
    ctx.bezierCurveTo(220, 320, 320, 620, 512, 670);
    ctx.stroke();

    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.arc(256, 420, 110, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = config.theme.tMoldingEmissive;
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.fillStyle = config.theme.sideArtAccent;
    ctx.beginPath();
    ctx.arc(256, 420, 85, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 36px "Impact", "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SKILLIZEE', 256, 415);
    ctx.font = 'bold 22px "Inter", sans-serif';
    ctx.fillText('ARCADE', 256, 445);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [config]);

  // Animation Loop: Idle breathing, joystick wiggle on hover, and light pulsing
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      const breath = Math.sin(t * 1.5 + Number(config.number)) * 0.015;
      groupRef.current.position.y = config.position[1] + (hovered ? 0.08 : 0) + breath;
    }

    if (p1StickRef.current && p2StickRef.current) {
      if (hovered) {
        p1StickRef.current.rotation.x = Math.sin(t * 8) * 0.25;
        p1StickRef.current.rotation.z = Math.cos(t * 8) * 0.25;
        p2StickRef.current.rotation.x = Math.sin(t * 8 + 1) * 0.25;
        p2StickRef.current.rotation.z = Math.cos(t * 8 + 1) * 0.25;
      } else {
        p1StickRef.current.rotation.set(0, 0, 0);
        p2StickRef.current.rotation.set(0, 0, 0);
      }
    }

    if (marqueeMeshRef.current && marqueeMeshRef.current.material) {
      const mat = marqueeMeshRef.current.material as THREE.MeshStandardMaterial;
      const pulse = 0.85 + Math.sin(t * 3) * 0.15;
      mat.emissiveIntensity = hovered ? 1.4 : pulse;
    }

    if (screenMeshRef.current && screenMeshRef.current.material) {
      const mat = screenMeshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = hovered ? 0.45 : 0.2;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    soundManager.playClick();
    if (onSelect) {
      onSelect(config.id);
    }
    if (config.status === 'active' && config.route !== '#') {
      router.push(config.route);
    }
  };

  const activeScreenTexture = config.status === 'active' ? (screenTex || proceduralScreenTexture) : proceduralScreenTexture;

  return (
    <group
      ref={groupRef}
      position={config.position}
      rotation={config.rotation || [0, 0, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
      onClick={handleClick}
    >
      {/* ── 3D FLOOR UNDERGLOW NEON SPOT ── */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshBasicMaterial
          color={config.theme.floorGlowColor}
          transparent
          opacity={hovered ? 0.65 : 0.35}
        />
      </mesh>

      {/* ── CABINET BASE PLINTH & RUBBER FEET ── */}
      <group position={[0, 0.12, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[1.5, 0.24, 1.3]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>
        {[
          [-0.65, -0.1, 0.55],
          [0.65, -0.1, 0.55],
          [-0.65, -0.1, -0.55],
          [0.65, -0.1, -0.55],
        ].map(([fx, fy, fz], i) => (
          <mesh key={`foot-${i}`} position={[fx, fy, fz]}>
            <cylinderGeometry args={[0.07, 0.08, 0.08, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} metalness={0.2} />
          </mesh>
        ))}
      </group>

      {/* ── LOWER FRONT CHASSIS & COIN DOOR (`y = 0.9, z = 0`) ── */}
      <group position={[0, 0.9, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.44, 1.32, 1.25]} />
          <meshStandardMaterial color={config.theme.cabinetColor} roughness={0.6} />
        </mesh>

        <mesh position={[0, 0, 0.63]} receiveShadow castShadow>
          <boxGeometry args={[1.32, 1.18, 0.04]} />
          <meshStandardMaterial color={config.theme.coinDoorColor} roughness={0.4} metalness={0.5} />
        </mesh>

        <group position={[0, -0.05, 0.66]}>
          <mesh castShadow>
            <boxGeometry args={[0.62, 0.82, 0.05]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
          </mesh>

          {[-0.16, 0.16].map((cx, i) => (
            <group key={`coin-${i}`} position={[cx, 0.18, 0.035]}>
              <mesh castShadow>
                <boxGeometry args={[0.18, 0.24, 0.03]} />
                <meshStandardMaterial color="#1e293b" metalness={0.9} />
              </mesh>
              <mesh position={[0, 0, 0.02]}>
                <boxGeometry args={[0.13, 0.16, 0.02]} />
                <meshStandardMaterial
                  color="#ef4444"
                  emissive="#dc2626"
                  emissiveIntensity={0.8}
                  roughness={0.2}
                />
              </mesh>
              <mesh position={[0, 0.04, 0.032]}>
                <boxGeometry args={[0.08, 0.015, 0.01]} />
                <meshBasicMaterial color="#000000" />
              </mesh>
            </group>
          ))}

          <mesh position={[0, -0.22, 0.035]}>
            <cylinderGeometry args={[0.045, 0.045, 0.02, 16]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* ── ANGLED 3D CONTROL PANEL DECK (`y = 1.68, z = 0.58`) ── */}
      <group position={[0, 1.68, 0.58]} rotation={[0.3, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.56, 0.12, 0.72]} />
          <meshStandardMaterial color={config.theme.deckColor} roughness={0.3} metalness={0.4} />
        </mesh>

        <mesh position={[0, 0.065, 0]}>
          <boxGeometry args={[1.52, 0.01, 0.68]} />
          <meshStandardMaterial color="#020617" roughness={0.8} />
        </mesh>

        {/* Player 1 Controls */}
        <group position={[-0.42, 0.08, 0.04]}>
          <group ref={p1StickRef}>
            <mesh>
              <cylinderGeometry args={[0.14, 0.14, 0.02, 24]} />
              <meshStandardMaterial color="#020617" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.024, 0.024, 0.22, 12]} />
              <meshStandardMaterial color="#ffffff" metalness={0.98} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.24, 0]}>
              <sphereGeometry args={[0.1, 24, 24]} />
              <meshStandardMaterial
                color={config.theme.joystickBallColor}
                emissive={config.theme.joystickBallEmissive}
                emissiveIntensity={0.6}
                metalness={0.3}
                roughness={0.15}
              />
            </mesh>
          </group>

          {[
            [-0.18, 0.01, -0.12, config.theme.buttonColors[0]],
            [-0.06, 0.01, -0.16, config.theme.buttonColors[1]],
            [-0.18, 0.01, 0.08, config.theme.buttonColors[2]],
            [-0.06, 0.01, 0.04, config.theme.buttonColors[3]],
          ].map(([bx, by, bz, bColor], idx) => (
            <mesh key={`p1-btn-${idx}`} position={[Number(bx), Number(by), Number(bz)]}>
              <cylinderGeometry args={[0.045, 0.05, 0.03, 16]} />
              <meshStandardMaterial
                color={String(bColor)}
                emissive={String(bColor)}
                emissiveIntensity={0.5}
                roughness={0.3}
              />
            </mesh>
          ))}
        </group>

        {/* 1P / 2P Start Buttons */}
        <group position={[0, 0.08, 0.18]}>
          {[-0.08, 0.08].map((sx, i) => (
            <mesh key={`start-${i}`} position={[sx, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.045, 0.025, 16]} />
              <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.3} />
            </mesh>
          ))}
        </group>

        {/* Player 2 Controls */}
        <group position={[0.42, 0.08, 0.04]}>
          <group ref={p2StickRef}>
            <mesh>
              <cylinderGeometry args={[0.14, 0.14, 0.02, 24]} />
              <meshStandardMaterial color="#020617" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.024, 0.024, 0.22, 12]} />
              <meshStandardMaterial color="#ffffff" metalness={0.98} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.24, 0]}>
              <sphereGeometry args={[0.1, 24, 24]} />
              <meshStandardMaterial
                color={config.theme.joystickBallColor}
                emissive={config.theme.joystickBallEmissive}
                emissiveIntensity={0.6}
                metalness={0.3}
                roughness={0.15}
              />
            </mesh>
          </group>

          {[
            [0.06, 0.01, -0.16, config.theme.buttonColors[0]],
            [0.18, 0.01, -0.12, config.theme.buttonColors[1]],
            [0.06, 0.01, 0.04, config.theme.buttonColors[2]],
            [0.18, 0.01, 0.08, config.theme.buttonColors[3]],
          ].map(([bx, by, bz, bColor], idx) => (
            <mesh key={`p2-btn-${idx}`} position={[Number(bx), Number(by), Number(bz)]}>
              <cylinderGeometry args={[0.045, 0.05, 0.03, 16]} />
              <meshStandardMaterial
                color={String(bColor)}
                emissive={String(bColor)}
                emissiveIntensity={0.5}
                roughness={0.3}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* ── RECESSED CRT MONITOR HOUSING (`y = 2.45, z = 0.08`) ── */}
      <group position={[0, 2.45, 0.08]} rotation={[-0.32, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.44, 1.25, 0.22]} />
          <meshStandardMaterial color="#020617" roughness={0.8} />
        </mesh>

        <mesh position={[0, 0, 0.1]} receiveShadow>
          <boxGeometry args={[1.36, 1.15, 0.04]} />
          <meshStandardMaterial color={config.theme.screenBezelColor} roughness={0.4} />
        </mesh>

        {[
          [-0.62, 0.52],
          [0.62, 0.52],
          [-0.62, -0.52],
          [0.62, -0.52],
        ].map(([sx, sy], i) => (
          <mesh key={`screw-${i}`} position={[sx, sy, 0.125]}>
            <cylinderGeometry args={[0.02, 0.02, 0.01, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
        ))}

        <mesh ref={screenMeshRef} position={[0, 0, 0.125]}>
          <planeGeometry args={[1.22, 0.94]} />
          {activeScreenTexture && (
            <meshStandardMaterial
              map={activeScreenTexture}
              emissive="#ffffff"
              emissiveMap={activeScreenTexture}
              emissiveIntensity={0.25}
              roughness={0.2}
            />
          )}
        </mesh>

        <mesh position={[0, 0, 0.13]}>
          <planeGeometry args={[1.22, 0.94]} />
          <meshStandardMaterial
            transparent
            opacity={0.15}
            roughness={0.1}
            color="#ffffff"
          />
        </mesh>
      </group>

      {/* ── TOP ILLUMINATED MARQUEE LIGHTBOX (`y = 3.32, z = 0.36`) ── */}
      <group position={[0, 3.32, 0.36]} rotation={[0.22, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.52, 0.62, 0.44]} />
          <meshStandardMaterial color={config.theme.cabinetColor} roughness={0.5} />
        </mesh>

        <mesh position={[0, 0, 0.22]}>
          <boxGeometry args={[1.46, 0.54, 0.03]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>

        {marqueeTexture && (
          <mesh ref={marqueeMeshRef} position={[0, 0, 0.24]}>
            <planeGeometry args={[1.42, 0.48]} />
            <meshStandardMaterial
              map={marqueeTexture}
              emissive="#ffffff"
              emissiveMap={marqueeTexture}
              emissiveIntensity={0.95}
              toneMapped={false}
            />
          </mesh>
        )}
      </group>

      {/* ── 3D CONTOURED SIDE WINGS WITH DECALS & T-MOLDING ── */}
      {/* Left Wing */}
      <group position={[-0.75, 1.8, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.06, 3.4, 1.45]} />
          {sideArtTexture ? (
            <meshStandardMaterial map={sideArtTexture} roughness={0.4} />
          ) : (
            <meshStandardMaterial color={config.theme.cabinetColor} roughness={0.4} />
          )}
        </mesh>
        <mesh position={[-0.035, 0, 0.72]}>
          <boxGeometry args={[0.03, 3.42, 0.05]} />
          <meshStandardMaterial
            color={config.theme.tMoldingColor}
            emissive={config.theme.tMoldingEmissive}
            emissiveIntensity={hovered ? 1.0 : 0.6}
          />
        </mesh>
        <mesh position={[-0.04, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.26, 0.26, 0.03, 32]} />
          <meshStandardMaterial color="#020617" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[-0.058, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.01, 32]} />
          <meshStandardMaterial
            color={config.theme.tMoldingColor}
            emissive={config.theme.tMoldingEmissive}
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>

      {/* Right Wing */}
      <group position={[0.75, 1.8, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.06, 3.4, 1.45]} />
          {sideArtTexture ? (
            <meshStandardMaterial map={sideArtTexture} roughness={0.4} />
          ) : (
            <meshStandardMaterial color={config.theme.cabinetColor} roughness={0.4} />
          )}
        </mesh>
        <mesh position={[0.035, 0, 0.72]}>
          <boxGeometry args={[0.03, 3.42, 0.05]} />
          <meshStandardMaterial
            color={config.theme.tMoldingColor}
            emissive={config.theme.tMoldingEmissive}
            emissiveIntensity={hovered ? 1.0 : 0.6}
          />
        </mesh>
        <mesh position={[0.04, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.26, 0.26, 0.03, 32]} />
          <meshStandardMaterial color="#020617" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[0.058, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.01, 32]} />
          <meshStandardMaterial
            color={config.theme.tMoldingColor}
            emissive={config.theme.tMoldingEmissive}
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>

      {/* ── 3D FLOATING HUD BADGE OVERHEAD (Appears on Hover) ── */}
      {hovered && (
        <Html position={[0, 3.82, 0.5]} center distanceFactor={8}>
          <div className="flex flex-col items-center pointer-events-none select-none animate-bounce">
            {config.status === 'active' ? (
              <div className="px-4 py-1.5 rounded-full bg-amber-400 border-2 border-slate-950 text-slate-950 font-black text-xs font-game uppercase tracking-widest shadow-[0_6px_25px_rgba(245,158,11,1)] flex items-center gap-2 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                <span>★ CLICK TO PLAY ★</span>
              </div>
            ) : (
              <div className="px-3.5 py-1.5 rounded-full bg-purple-950 border-2 border-purple-400 text-purple-200 font-bold text-xs font-game uppercase tracking-wider shadow whitespace-nowrap">
                COMING SOON
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};
