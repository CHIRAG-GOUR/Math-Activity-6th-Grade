'use client';

// ============================================================
// SKILLIZEE RETRO ARCADE LOBBY — 3D Three.js Immersive Environment
// Full-window 3D Arcade Arena with:
// - Physical 3D Arcade Cabinets in Bright, Vibrant Activity Colors
// - Prominent Overhead Name & Topic Floating Cards
// - Polished Honey-Wood & Neon Reflective Flooring
// - Overhead Neon Signage, Ceiling Trusses, and Warm Retro Lighting
// - Themed Dynamic Spotlights focused on each machine
// - Smooth Parallax Camera Rig with Responsive Layout & Interactive Selection
// ============================================================

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ArcadeCabinet3D, ArcadeCabinetConfig } from './ArcadeCabinet3D';

export const ARCADE_CABINET_DATA: ArcadeCabinetConfig[] = [
  {
    id: 'math-escape-vault',
    number: '01',
    title: 'MATH ESCAPE VAULT',
    subtitle: 'Grade 6 Mental Math Heist',
    topic: 'Place Value & Rounding',
    grade: 'Grade 6',
    category: 'Heist & Escape',
    status: 'active',
    image: '/images/math-vault-card.jpg',
    route: '/math-vault',
    position: [-4.2, 0, -0.1],
    rotation: [0, 0.24, 0],
    theme: {
      cabinetColor: '#1d4ed8',
      secondaryColor: '#3b82f6',
      tMoldingColor: '#fbbf24',
      tMoldingEmissive: '#f59e0b',
      marqueeBg: '#f59e0b',
      marqueeTextColor: '#020617',
      marqueeGlow: '#fbbf24',
      screenBezelColor: '#1e40af',
      screenGlowColor: '#fbbf24',
      deckColor: '#d97706',
      joystickBallColor: '#ef4444',
      joystickBallEmissive: '#dc2626',
      buttonColors: ['#fbbf24', '#38bdf8', '#3b82f6', '#f59e0b'],
      coinDoorColor: '#b45309',
      sideArtAccent: '#fbbf24',
      floorGlowColor: '#f59e0b',
      topicBadgeBg: '#fef3c7',
      topicBadgeText: '#92400e',
      cardBorderColor: '#f59e0b',
    },
  },
  {
    id: 'number-railway',
    number: '02',
    title: 'THE GREAT NUMBER RAILWAY',
    subtitle: 'Place Value & Operations',
    topic: 'Place Value & Rounding',
    grade: 'Grade 6',
    category: 'Adventure & Strategy',
    status: 'active',
    image: '/images/number-railway-card.jpg',
    route: '/number-railway',
    position: [-1.4, 0, 0.15],
    rotation: [0, 0.08, 0],
    theme: {
      cabinetColor: '#0284c7',
      secondaryColor: '#0ea5e9',
      tMoldingColor: '#38bdf8',
      tMoldingEmissive: '#0284c7',
      marqueeBg: '#0284c7',
      marqueeTextColor: '#020617',
      marqueeGlow: '#38bdf8',
      screenBezelColor: '#0369a1',
      screenGlowColor: '#38bdf8',
      deckColor: '#c2410c',
      joystickBallColor: '#38bdf8',
      joystickBallEmissive: '#0284c7',
      buttonColors: ['#38bdf8', '#2dd4bf', '#fbbf24', '#f43f5e'],
      coinDoorColor: '#0284c7',
      sideArtAccent: '#ffffff',
      floorGlowColor: '#38bdf8',
      topicBadgeBg: '#e0f2fe',
      topicBadgeText: '#0369a1',
      cardBorderColor: '#38bdf8',
    },
  },
  {
    id: 'carnival-of-chance',
    number: '03',
    title: 'THE GREAT CARNIVAL OF CHANCE',
    subtitle: 'Probability & Chance Arena',
    topic: 'Probability & Chance',
    grade: 'Grade 6',
    category: 'Theme Park & Chance',
    status: 'active',
    image: '/images/carnival-card.jpg',
    route: '/carnival-of-chance',
    position: [1.4, 0, 0.15],
    rotation: [0, -0.08, 0],
    theme: {
      cabinetColor: '#dc2626',
      secondaryColor: '#ef4444',
      tMoldingColor: '#fbbf24',
      tMoldingEmissive: '#f59e0b',
      marqueeBg: '#ef4444',
      marqueeTextColor: '#020617',
      marqueeGlow: '#fbbf24',
      screenBezelColor: '#b91c1c',
      screenGlowColor: '#fbbf24',
      deckColor: '#b91c1c',
      joystickBallColor: '#fbbf24',
      joystickBallEmissive: '#f59e0b',
      buttonColors: ['#fbbf24', '#e11d48', '#34d399', '#38bdf8'],
      coinDoorColor: '#d97706',
      sideArtAccent: '#fbbf24',
      floorGlowColor: '#ef4444',
      topicBadgeBg: '#fee2e2',
      topicBadgeText: '#991b1b',
      cardBorderColor: '#ef4444',
    },
  },
  {
    id: 'slot-04',
    number: '04',
    title: 'COMING SOON',
    subtitle: 'Next Activity in Production',
    topic: 'Next Math Duel',
    grade: 'Grade 6',
    category: 'Arcade Arena',
    status: 'planned',
    image: '/images/math-vault-card.jpg',
    route: '#',
    position: [4.2, 0, -0.1],
    rotation: [0, -0.24, 0],
    theme: {
      cabinetColor: '#7e22ce',
      secondaryColor: '#9333ea',
      tMoldingColor: '#e879f9',
      tMoldingEmissive: '#c084fc',
      marqueeBg: '#9333ea',
      marqueeTextColor: '#ffffff',
      marqueeGlow: '#e879f9',
      screenBezelColor: '#6b21a8',
      screenGlowColor: '#e879f9',
      deckColor: '#581c87',
      joystickBallColor: '#e879f9',
      joystickBallEmissive: '#c084fc',
      buttonColors: ['#c084fc', '#e879f9', '#f472b6', '#64748b'],
      coinDoorColor: '#6b21a8',
      sideArtAccent: '#f0abfc',
      floorGlowColor: '#c084fc',
      topicBadgeBg: '#f3e8ff',
      topicBadgeText: '#6b21a8',
      cardBorderColor: '#a855f7',
    },
  },
];

// ============================================================
// CAMERA RIG: Soft Parallax & Smooth Category Focusing
// ============================================================
const ArcadeCameraRig: React.FC<{ selectedCategory: string }> = ({ selectedCategory }) => {
  const { camera, pointer } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 2.15, 8.9));
  const lookAtPos = useRef(new THREE.Vector3(0, 1.9, 0));

  useFrame(() => {
    let focusX = 0;
    let focusZ = 8.9;
    let targetLookX = 0;

    if (selectedCategory === 'Heist & Escape' || selectedCategory === '#01 MATH VAULT') {
      focusX = -3.8;
      focusZ = 6.6;
      targetLookX = -4.2;
    } else if (selectedCategory === 'Adventure & Strategy' || selectedCategory === '#02 NUMBER RAILWAY') {
      focusX = -1.2;
      focusZ = 6.4;
      targetLookX = -1.4;
    } else if (selectedCategory === 'Theme Park & Chance' || selectedCategory === '#03 CARNIVAL OF CHANCE') {
      focusX = 1.2;
      focusZ = 6.4;
      targetLookX = 1.4;
    } else if (selectedCategory === 'Arcade Arena' || selectedCategory === '#04 COMING SOON') {
      focusX = 3.8;
      focusZ = 6.6;
      targetLookX = 4.2;
    }

    const parallaxX = pointer.x * 0.5;
    const parallaxY = pointer.y * 0.18;

    targetPos.current.set(focusX + parallaxX, 2.15 + parallaxY, focusZ);
    lookAtPos.current.set(targetLookX + parallaxX * 0.2, 1.9 + parallaxY * 0.15, 0);

    camera.position.lerp(targetPos.current, 0.05);
    camera.lookAt(lookAtPos.current);
  });

  return null;
};

// ============================================================
// 3D ENVIRONMENT: Room Walls, Ceiling, Neon Sign & Honey Wood Floor
// ============================================================
const ArcadeRoomEnvironment: React.FC = () => {
  const woodFloorTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#d97706';
    ctx.fillRect(0, 0, 1024, 1024);

    for (let x = 0; x < 1024; x += 128) {
      ctx.fillStyle = x % 256 === 0 ? '#b45309' : '#f59e0b';
      ctx.fillRect(x, 0, 126, 1024);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x + 126, 0, 2, 1024);
    }

    for (let y = 0; y < 1024; y += 256) {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, y, 1024, 3);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const signTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 1024, 256);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 12;
    ctx.strokeRect(10, 10, 1004, 236);

    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 68px "Impact", "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★ SKILLIZEE ARCADE ARENA ★', 512, 140);

    ctx.font = 'bold 28px "Inter", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('GRADE 6 MATHEMATICS • CLASSROOM DUEL ARENA', 512, 200);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  return (
    <group>
      {/* ── AMBIENT & RETRO LIGHTING ── */}
      <ambientLight color="#fffbeb" intensity={1.5} />
      <hemisphereLight color="#fde68a" groundColor="#0f172a" intensity={1.1} />
      <directionalLight
        position={[0, 9, 7]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* ── INDIVIDUAL SPOTLIGHTS OVER EACH CABINET ── */}
      <spotLight position={[-4.2, 7, 2]} target-position={[-4.2, 0, 0]} color="#fbbf24" intensity={2.8} angle={0.5} penumbra={0.6} castShadow />
      <spotLight position={[-1.4, 7, 2]} target-position={[-1.4, 0, 0]} color="#38bdf8" intensity={2.6} angle={0.5} penumbra={0.6} castShadow />
      <spotLight position={[1.4, 7, 2]} target-position={[1.4, 0, 0]} color="#f43f5e" intensity={2.6} angle={0.5} penumbra={0.6} castShadow />
      <spotLight position={[4.2, 7, 2]} target-position={[4.2, 0, 0]} color="#c084fc" intensity={2.4} angle={0.5} penumbra={0.6} castShadow />

      {/* ── BACK ARCADE ACCENT WALL (`z = -2.2`) ── */}
      <group position={[0, 3.5, -2.2]}>
        <mesh receiveShadow>
          <planeGeometry args={[28, 10]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.7} />
        </mesh>

        <mesh position={[0, -2.6, 0.05]} receiveShadow>
          <boxGeometry args={[28, 2.2, 0.1]} />
          <meshStandardMaterial color="#d97706" roughness={0.4} />
        </mesh>

        <mesh position={[0, -1.48, 0.12]}>
          <boxGeometry args={[28, 0.08, 0.05]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.6} metalness={0.8} />
        </mesh>

        {[-3.8, 0, 3.8].map((nx, i) => (
          <group key={`neon-wall-${i}`} position={[nx, 1.8, 0.08]}>
            <mesh>
              <boxGeometry args={[2.8, 0.08, 0.04]} />
              <meshStandardMaterial
                color={i === 0 ? '#f59e0b' : i === 1 ? '#38bdf8' : '#f43f5e'}
                emissive={i === 0 ? '#f59e0b' : i === 1 ? '#0284c7' : '#e11d48'}
                emissiveIntensity={1.2}
              />
            </mesh>
          </group>
        ))}

        <group position={[0, 3.0, 0.15]}>
          <mesh>
            <boxGeometry args={[9.5, 1.1, 0.12]} />
            <meshStandardMaterial color="#020617" roughness={0.3} metalness={0.6} />
          </mesh>
          {signTexture && (
            <mesh position={[0, 0, 0.07]}>
              <planeGeometry args={[9.3, 0.96]} />
              <meshStandardMaterial
                map={signTexture}
                emissive="#ffffff"
                emissiveMap={signTexture}
                emissiveIntensity={0.85}
              />
            </mesh>
          )}
        </group>
      </group>

      {/* ── CEILING STEEL TRUSSES ── */}
      <group position={[0, 6.8, 0]}>
        {[-5, -2, 1, 4].map((tx, idx) => (
          <mesh key={`truss-${idx}`} position={[tx, 0, 0]}>
            <boxGeometry args={[0.08, 0.4, 12]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* ── POLISHED HONEY WOOD FLOOR PLANE (`y = 0`) ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 22]} />
        <meshStandardMaterial
          map={woodFloorTexture || undefined}
          color={woodFloorTexture ? '#ffffff' : '#d97706'}
          roughness={0.25}
          metalness={0.15}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -1.9]}>
        <planeGeometry args={[28, 0.08]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
    </group>
  );
};

// ============================================================
// MAIN EXPORTED 3D ARCADE LOBBY SCENE COMPONENT
// ============================================================
export const ArcadeLobbyScene: React.FC<{
  selectedCategory?: string;
  onSelectCabinet?: (id: string) => void;
}> = ({ selectedCategory = 'all', onSelectCabinet }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="absolute inset-0 bg-[#fffbeb] flex items-center justify-center">
        <div className="text-amber-800 font-game font-bold text-sm tracking-widest animate-pulse">
          INITIALIZING 3D RETRO ARCADE ARENA...
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <Canvas
        shadows
        camera={{ position: [0, 2.15, 8.9], fov: 42 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        dpr={[1, 2]}
      >
        <color attach="background" args={['#fffbeb']} />
        <ArcadeCameraRig selectedCategory={selectedCategory} />
        <ArcadeRoomEnvironment />

        {/* 4 Physical 3D Arcade Machines */}
        <group position={[0, 0, 0]}>
          {ARCADE_CABINET_DATA.map((config) => (
            <ArcadeCabinet3D
              key={config.id}
              config={config}
              onSelect={onSelectCabinet}
            />
          ))}
        </group>
      </Canvas>
    </div>
  );
};
