// ============================================================
// SKILLIZEE ARCADE — 3D Physical Retro Arcade Cabinet Component
// Authentic Three.js Mesh Model with:
// - Curved 3D Side Wings with Rich Vibrant Colors & Decals
// - Skillizee Circular Speaker Medallions
// - Ultra-Clear, High-Contrast Marquees with Simple, Highly Legible Typography
// - Compact, Perfectly Spaced Floating Name & Topic Cards (No Overlap)
// - Live CRT Monitor with High-Res Game Artwork & Retro Scanline Glow
// - Slanted 3D Control Deck with Animated Joysticks & Candy Arcade Buttons
// - Vibrant Stamped Coin Door with Illuminated 25¢ Insert Buttons
// - Interactive Hover Float, Joystick Wiggle & Direct Click-to-Play
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
  topic: string;
  grade: string;
  category: string;
  status: 'active' | 'planned';
  image: string;
  route: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  theme: {
    cabinetColor: string;
    secondaryColor: string;
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
    topicBadgeBg: string;
    topicBadgeText: string;
    cardBorderColor: string;
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
      grad.addColorStop(0, '#1e3a8a');
      grad.addColorStop(0.5, '#2563eb');
      grad.addColorStop(1, '#172554');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 768);

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(512, 340, 180, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 56px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MATH ESCAPE VAULT', 512, 320);
      ctx.font = 'bold 34px Arial, sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.fillText(`TOPIC: ${config.topic.toUpperCase()}`, 512, 390);
    } else if (config.id === 'number-railway') {
      const grad = ctx.createLinearGradient(0, 0, 1024, 768);
      grad.addColorStop(0, '#0284c7');
      grad.addColorStop(0.5, '#38bdf8');
      grad.addColorStop(1, '#0369a1');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 768);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(512, 340, 180, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 54px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('THE GREAT NUMBER RAILWAY', 512, 320);
      ctx.font = 'bold 34px Arial, sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.fillText(`TOPIC: ${config.topic.toUpperCase()}`, 512, 390);
    } else if (config.id === 'carnival-of-chance') {
      const grad = ctx.createLinearGradient(0, 0, 1024, 768);
      grad.addColorStop(0, '#b91c1c');
      grad.addColorStop(0.5, '#ef4444');
      grad.addColorStop(1, '#991b1b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 768);

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(512, 340, 180, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 52px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('THE GREAT CARNIVAL OF CHANCE', 512, 320);
      ctx.font = 'bold 34px Arial, sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.fillText(`TOPIC: ${config.topic.toUpperCase()}`, 512, 390);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 1024, 768);
      grad.addColorStop(0, '#6b21a8');
      grad.addColorStop(0.5, '#a855f7');
      grad.addColorStop(1, '#4c1d95');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 768);

      ctx.strokeStyle = '#f0abfc';
      ctx.lineWidth = 12;
      ctx.strokeRect(120, 120, 784, 528);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 64px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('★ COMING SOON ★', 512, 330);
      ctx.font = 'bold 32px Arial, sans-serif';
      ctx.fillStyle = '#f0abfc';
      ctx.fillText(`TOPIC: ${config.topic.toUpperCase()}`, 512, 400);
    }

    // CRT Scanlines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    for (let y = 0; y < 768; y += 8) {
      ctx.fillRect(0, y, 1024, 4);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [config]);

  // Ultra-Sharp, High-Visibility, Simple Font Procedural Canvas for Physical Top Marquee
  const marqueeTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 680;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Rich Vibrant Solid Gradient Background
    const bgGrad = ctx.createLinearGradient(0, 0, 2048, 0);
    if (config.id === 'math-escape-vault') {
      bgGrad.addColorStop(0, '#1d4ed8');
      bgGrad.addColorStop(0.5, '#3b82f6');
      bgGrad.addColorStop(1, '#1d4ed8');
    } else if (config.id === 'number-railway') {
      bgGrad.addColorStop(0, '#0284c7');
      bgGrad.addColorStop(0.5, '#38bdf8');
      bgGrad.addColorStop(1, '#0284c7');
    } else if (config.id === 'carnival-of-chance') {
      bgGrad.addColorStop(0, '#b91c1c');
      bgGrad.addColorStop(0.5, '#ef4444');
      bgGrad.addColorStop(1, '#b91c1c');
    } else {
      bgGrad.addColorStop(0, '#6b21a8');
      bgGrad.addColorStop(0.5, '#a855f7');
      bgGrad.addColorStop(1, '#6b21a8');
    }

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 2048, 680);

    // Outer Illuminated Bezel Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 18;
    ctx.strokeRect(16, 16, 2016, 648);

    // Inner Glowing Accent Border
    ctx.strokeStyle = config.theme.tMoldingColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(36, 36, 1976, 608);

    // 1. Top Subheader: Grade & Cabinet (Clean, Simple Arial Font in Bright Yellow/Cyan)
    ctx.fillStyle = config.id === 'number-railway' ? '#e0f2fe' : config.id === 'slot-04' ? '#f3e8ff' : '#fef08a';
    ctx.font = 'bold 52px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`★ CABINET #${config.number}  •  ${config.grade.toUpperCase()} ★`, 1024, 118);

    // 2. Main Game Title in Ultra-Legible, Simple, Bold Pure White Font with Soft Shadow
    ctx.font = '900 102px Arial, sans-serif';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillText(config.title, 1028, 298); // Clean drop shadow for maximum contrast
    ctx.fillStyle = '#ffffff';
    ctx.fillText(config.title, 1024, 294);

    // 3. Bottom Topic Badge: Solid High-Contrast Pill with Bold White Text (NOT black)
    const pillBg = config.id === 'math-escape-vault' 
      ? '#b45309' 
      : config.id === 'number-railway' 
      ? '#0369a1' 
      : config.id === 'carnival-of-chance' 
      ? '#7f1d1d' 
      : '#4c1d95';

    ctx.fillStyle = pillBg;
    ctx.beginPath();
    ctx.roundRect(240, 420, 1568, 160, 80);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.font = 'bold 64px Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`TOPIC: ${config.topic.toUpperCase()}`, 1024, 526);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.generateMipmaps = true;
    return tex;
  }, [config]);

  // Procedural Side Art Decal Texture with Bright Themes
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
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(0, 150);
    ctx.bezierCurveTo(200, 250, 300, 550, 512, 600);
    ctx.stroke();

    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, 220);
    ctx.bezierCurveTo(220, 320, 320, 620, 512, 670);
    ctx.stroke();

    // Central Circular Speaker Medallion
    ctx.fillStyle = config.theme.secondaryColor || '#ffffff';
    ctx.beginPath();
    ctx.arc(256, 420, 115, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = config.theme.tMoldingColor;
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.fillStyle = config.theme.cabinetColor;
    ctx.beginPath();
    ctx.arc(256, 420, 88, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SKILLIZEE', 256, 415);
    ctx.font = 'bold 22px Arial, sans-serif';
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
      const pulse = 0.88 + Math.sin(t * 3) * 0.12;
      mat.emissiveIntensity = hovered ? 1.4 : pulse;
    }

    if (screenMeshRef.current && screenMeshRef.current.material) {
      const mat = screenMeshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = hovered ? 0.45 : 0.2;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (config.status === 'active' && config.route !== '#') {
      soundManager.playArcadeGameStart();
      if (onSelect) {
        onSelect(config.id);
      }
      setTimeout(() => {
        router.push(config.route);
      }, 260);
    } else {
      soundManager.playClick();
      if (onSelect) {
        onSelect(config.id);
      }
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
          opacity={hovered ? 0.75 : 0.4}
        />
      </mesh>

      {/* ── CABINET BASE PLINTH & RUBBER FEET ── */}
      <group position={[0, 0.12, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[1.5, 0.24, 1.3]} />
          <meshStandardMaterial color={config.theme.secondaryColor || '#1e293b'} roughness={0.7} />
        </mesh>
        {[
          [-0.65, -0.1, 0.55],
          [0.65, -0.1, 0.55],
          [-0.65, -0.1, -0.55],
          [0.65, -0.1, -0.55],
        ].map(([fx, fy, fz], i) => (
          <mesh key={`foot-${i}`} position={[fx, fy, fz]}>
            <cylinderGeometry args={[0.07, 0.08, 0.08, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} metalness={0.2} />
          </mesh>
        ))}
      </group>

      {/* ── LOWER FRONT CHASSIS & COIN DOOR (`y = 0.9, z = 0`) ── */}
      <group position={[0, 0.9, 0]}>
        {/* Main Lower Box in Vibrant Theme Color */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.44, 1.32, 1.25]} />
          <meshStandardMaterial color={config.theme.cabinetColor} roughness={0.5} />
        </mesh>

        {/* Front Metal Door Recess Plate */}
        <mesh position={[0, 0, 0.63]} receiveShadow castShadow>
          <boxGeometry args={[1.32, 1.18, 0.04]} />
          <meshStandardMaterial color={config.theme.coinDoorColor} roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Stamped Heavy Steel Coin Door Frame */}
        <group position={[0, -0.05, 0.66]}>
          <mesh castShadow>
            <boxGeometry args={[0.62, 0.82, 0.05]} />
            <meshStandardMaterial color={config.theme.secondaryColor || '#1e293b'} roughness={0.3} metalness={0.7} />
          </mesh>

          {/* Dual 25¢ Coin Reject Inserts with Glowing Orange/Red Buttons */}
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
          <meshStandardMaterial color={config.theme.deckColor} roughness={0.3} metalness={0.3} />
        </mesh>

        <mesh position={[0, 0.065, 0]}>
          <boxGeometry args={[1.52, 0.01, 0.68]} />
          <meshStandardMaterial color={config.theme.secondaryColor || '#0f172a'} roughness={0.8} />
        </mesh>

        {/* Player 1 Controls */}
        <group position={[-0.42, 0.08, 0.04]}>
          <group ref={p1StickRef}>
            <mesh>
              <cylinderGeometry args={[0.14, 0.14, 0.02, 24]} />
              <meshStandardMaterial color="#0f172a" roughness={0.9} />
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
                emissiveIntensity={0.6}
                roughness={0.2}
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
              <meshStandardMaterial color="#0f172a" roughness={0.9} />
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
                emissiveIntensity={0.6}
                roughness={0.2}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* ── RECESSED CRT MONITOR HOUSING (`y = 2.45, z = 0.08`) ── */}
      <group position={[0, 2.45, 0.08]} rotation={[-0.32, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.44, 1.25, 0.22]} />
          <meshStandardMaterial color={config.theme.secondaryColor || '#0f172a'} roughness={0.7} />
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
          <meshStandardMaterial color={config.theme.cabinetColor} roughness={0.4} />
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
          <meshStandardMaterial color={config.theme.secondaryColor || '#1e293b'} roughness={0.4} metalness={0.7} />
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
          <meshStandardMaterial color={config.theme.secondaryColor || '#1e293b'} roughness={0.4} metalness={0.7} />
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

      {/* ── 3D COMPACT FLOATING NAME & TOPIC CARD OVERHEAD (Floating cleanly above marquee, no overlap) ── */}
      <Html position={[0, 4.25, 0.35]} center distanceFactor={13.5}>
        <div
          className={`flex flex-col items-center select-none transition-all duration-300 transform pointer-events-auto cursor-pointer ${
            hovered ? 'scale-110 -translate-y-2' : 'scale-100 opacity-95'
          }`}
          onClick={handleClick}
        >
          <div
            className="px-2.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md shadow-md flex flex-col items-center text-center gap-1 w-[128px]"
            style={{
              border: `2px solid ${config.theme.cardBorderColor || config.theme.tMoldingColor}`,
              boxShadow: hovered
                ? `0 10px 24px ${config.theme.tMoldingEmissive}88, 0 0 14px ${config.theme.tMoldingColor}55`
                : `0 4px 12px rgba(0,0,0,0.12)`,
            }}
          >
            {/* Header Tag */}
            <div className="flex items-center gap-1 text-[8px] font-black font-game tracking-wider uppercase text-slate-500 leading-none">
              <span>CAB #{config.number}</span>
              <span>•</span>
              <span className="text-amber-600 font-bold">{config.grade}</span>
            </div>

            {/* Main Machine Name - Full title with clean wrapping */}
            <h3 className="text-[9.5px] font-black font-bank uppercase tracking-tight text-slate-950 leading-tight">
              {config.title}
            </h3>

            {/* Topic Badge */}
            <div
              className="px-2 py-0.5 rounded-full text-[8px] font-bold font-game uppercase tracking-tight shadow-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-full leading-tight"
              style={{
                backgroundColor: config.theme.topicBadgeBg,
                color: config.theme.topicBadgeText,
              }}
            >
              {config.topic}
            </div>

            {/* Play Indicator */}
            {config.status === 'active' ? (
              <div className="flex items-center gap-1 text-[7.5px] font-bold text-emerald-700 font-game tracking-wider leading-none mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>PLAY →</span>
              </div>
            ) : (
              <div className="text-[7.5px] font-bold text-purple-700 font-game tracking-wider leading-none mt-0.5">
                COMING SOON
              </div>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
};
