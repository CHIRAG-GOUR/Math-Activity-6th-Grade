'use client';

// ============================================================
// SKILLIZEE RETRO ARCADE LOBBY — 3D Three.js Immersive Environment
// Full-window 3D Arcade Arena with:
// - Physical 3D Arcade Cabinets in Bright, Vibrant Activity Colors
// - Well-Spaced, Compact Overhead Name & Topic Floating Cards
// - Clear, Simple Font Marquees with High Visibility
// - Polished Honey-Wood & Neon Reflective Flooring
// - Themed Dynamic Spotlights focused on each machine
// - Smooth Parallax Camera Rig with Responsive Layout & Interactive Selection
// ============================================================

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ArcadeCabinet3D, ArcadeCabinetConfig } from './ArcadeCabinet3D';

export const PAGE_SPACING = 13.6;
export const MACHINES_PER_PAGE = 4;

export const RAW_ARCADE_CABINET_DATA: Omit<ArcadeCabinetConfig, 'position' | 'rotation'>[] = [
  // ── WING 1 (MACHINES #01 - #04) ──
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
    theme: {
      cabinetColor: '#1d4ed8',
      secondaryColor: '#3b82f6',
      tMoldingColor: '#fbbf24',
      tMoldingEmissive: '#f59e0b',
      marqueeBg: '#f59e0b',
      marqueeTextColor: '#ffffff',
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
    theme: {
      cabinetColor: '#0284c7',
      secondaryColor: '#0ea5e9',
      tMoldingColor: '#38bdf8',
      tMoldingEmissive: '#0284c7',
      marqueeBg: '#0284c7',
      marqueeTextColor: '#ffffff',
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
    title: 'CARNIVAL OF CHANCE',
    subtitle: 'Probability & Chance Arena',
    topic: 'Probability & Chance',
    grade: 'Grade 6',
    category: 'Theme Park & Chance',
    status: 'active',
    image: '/images/carnival-card.jpg',
    route: '/carnival-of-chance',
    theme: {
      cabinetColor: '#dc2626',
      secondaryColor: '#ef4444',
      tMoldingColor: '#fbbf24',
      tMoldingEmissive: '#f59e0b',
      marqueeBg: '#ef4444',
      marqueeTextColor: '#ffffff',
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
    id: 'blueprint-blitz',
    number: '04',
    title: 'BLUEPRINT BLITZ',
    subtitle: 'Build It • Measure It • Beat the Clock',
    topic: 'Shapes, Area & Volume',
    grade: 'Grade 6',
    category: '3D Construction',
    status: 'active',
    image: '/images/blueprint-blitz-card.jpg',
    route: '/blueprint-blitz',
    theme: {
      cabinetColor: '#0369a1',
      secondaryColor: '#0284c7',
      tMoldingColor: '#f59e0b',
      tMoldingEmissive: '#d97706',
      marqueeBg: '#0284c7',
      marqueeTextColor: '#ffffff',
      marqueeGlow: '#38bdf8',
      screenBezelColor: '#0c4a6e',
      screenGlowColor: '#38bdf8',
      deckColor: '#b45309',
      joystickBallColor: '#f59e0b',
      joystickBallEmissive: '#d97706',
      buttonColors: ['#f59e0b', '#38bdf8', '#10b981', '#ef4444'],
      coinDoorColor: '#0369a1',
      sideArtAccent: '#facc15',
      floorGlowColor: '#0284c7',
      topicBadgeBg: '#e0f2fe',
      topicBadgeText: '#0369a1',
      cardBorderColor: '#0284c7',
    },
  },

  // ── WING 2 (MACHINES #05 - #08: COMING SOON SLOTS) ──
  {
    id: 'equation-mission-control',
    number: '05',
    title: 'EQUATION MISSION CONTROL',
    subtitle: 'Expressions • Formulae • 3D Space Launch',
    topic: 'Expressions & Equations',
    grade: 'Grade 6',
    category: '3D Aerospace Launch',
    status: 'active',
    image: '/images/blueprint-blitz-card.jpg',
    route: '/equation-mission-control',
    theme: {
      cabinetColor: '#1e3a8a',
      secondaryColor: '#2563eb',
      tMoldingColor: '#f59e0b',
      tMoldingEmissive: '#d97706',
      marqueeBg: '#1e3a8a',
      marqueeTextColor: '#ffffff',
      marqueeGlow: '#60a5fa',
      screenBezelColor: '#0f172a',
      screenGlowColor: '#38bdf8',
      deckColor: '#1d4ed8',
      joystickBallColor: '#f59e0b',
      joystickBallEmissive: '#d97706',
      buttonColors: ['#f59e0b', '#ef4444', '#3b82f6', '#10b981'],
      coinDoorColor: '#1e3a8a',
      sideArtAccent: '#fde047',
      floorGlowColor: '#3b82f6',
      topicBadgeBg: '#dbeafe',
      topicBadgeText: '#1e40af',
      cardBorderColor: '#2563eb',
    },
  },
  {
    id: 'slot-06',
    number: '06',
    title: 'COMING SOON',
    subtitle: 'Next Activity in Production',
    topic: 'Next Math Duel',
    grade: 'Grade 6',
    category: 'Arcade Arena',
    status: 'planned',
    image: '/images/math-vault-card.jpg',
    route: '#',
    theme: {
      cabinetColor: '#ea580c',
      secondaryColor: '#f97316',
      tMoldingColor: '#fbbf24',
      tMoldingEmissive: '#f59e0b',
      marqueeBg: '#ea580c',
      marqueeTextColor: '#ffffff',
      marqueeGlow: '#fbbf24',
      screenBezelColor: '#c2410c',
      screenGlowColor: '#fbbf24',
      deckColor: '#9a3412',
      joystickBallColor: '#fbbf24',
      joystickBallEmissive: '#f59e0b',
      buttonColors: ['#fbbf24', '#f97316', '#38bdf8', '#a855f7'],
      coinDoorColor: '#c2410c',
      sideArtAccent: '#fed7aa',
      floorGlowColor: '#ea580c',
      topicBadgeBg: '#ffedd5',
      topicBadgeText: '#9a3412',
      cardBorderColor: '#f97316',
    },
  },
  {
    id: 'slot-07',
    number: '07',
    title: 'COMING SOON',
    subtitle: 'Next Activity in Production',
    topic: 'Next Math Duel',
    grade: 'Grade 6',
    category: 'Arcade Arena',
    status: 'planned',
    image: '/images/math-vault-card.jpg',
    route: '#',
    theme: {
      cabinetColor: '#4f46e5',
      secondaryColor: '#6366f1',
      tMoldingColor: '#06b6d4',
      tMoldingEmissive: '#0891b2',
      marqueeBg: '#4f46e5',
      marqueeTextColor: '#ffffff',
      marqueeGlow: '#06b6d4',
      screenBezelColor: '#3730a3',
      screenGlowColor: '#06b6d4',
      deckColor: '#312e81',
      joystickBallColor: '#06b6d4',
      joystickBallEmissive: '#0891b2',
      buttonColors: ['#06b6d4', '#818cf8', '#fbbf24', '#f43f5e'],
      coinDoorColor: '#3730a3',
      sideArtAccent: '#c7d2fe',
      floorGlowColor: '#4f46e5',
      topicBadgeBg: '#e0e7ff',
      topicBadgeText: '#312e81',
      cardBorderColor: '#6366f1',
    },
  },
  {
    id: 'slot-08',
    number: '08',
    title: 'COMING SOON',
    subtitle: 'Next Activity in Production',
    topic: 'Next Math Duel',
    grade: 'Grade 6',
    category: 'Arcade Arena',
    status: 'planned',
    image: '/images/math-vault-card.jpg',
    route: '#',
    theme: {
      cabinetColor: '#d97706',
      secondaryColor: '#f59e0b',
      tMoldingColor: '#fde047',
      tMoldingEmissive: '#eab308',
      marqueeBg: '#d97706',
      marqueeTextColor: '#ffffff',
      marqueeGlow: '#fde047',
      screenBezelColor: '#b45309',
      screenGlowColor: '#fde047',
      deckColor: '#78350f',
      joystickBallColor: '#fde047',
      joystickBallEmissive: '#eab308',
      buttonColors: ['#fde047', '#fb923c', '#38bdf8', '#ec4899'],
      coinDoorColor: '#b45309',
      sideArtAccent: '#fef08a',
      floorGlowColor: '#f59e0b',
      topicBadgeBg: '#fef9c3',
      topicBadgeText: '#713f12',
      cardBorderColor: '#f59e0b',
    },
  },
];

// Computed list with dynamic 3D continuous corridor positions
export const ARCADE_CABINET_DATA: ArcadeCabinetConfig[] = RAW_ARCADE_CABINET_DATA.map((cab, idx) => {
  const pageIndex = Math.floor(idx / MACHINES_PER_PAGE);
  const slot = idx % MACHINES_PER_PAGE;
  const offsets = [-4.6, -1.55, 1.55, 4.6];
  const rotations: [number, number, number][] = [
    [0, 0.22, 0],
    [0, 0.07, 0],
    [0, -0.07, 0],
    [0, -0.22, 0],
  ];
  const zOffsets = [-0.1, 0.15, 0.15, -0.1];

  return {
    ...cab,
    position: [pageIndex * PAGE_SPACING + offsets[slot], 0, zOffsets[slot]] as [number, number, number],
    rotation: rotations[slot],
  };
});

// ============================================================
// CAMERA RIG: Soft Parallax, Wing Panning & Smooth Machine Focusing
// ============================================================
const ArcadeCameraRig: React.FC<{
  activePage: number;
  selectedCategory: string;
}> = ({ activePage, selectedCategory }) => {
  const { camera, pointer } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 2.15, 9.2));
  const lookAtPos = useRef(new THREE.Vector3(0, 1.85, 0));

  useFrame(() => {
    const pageBaseX = activePage * PAGE_SPACING;
    let focusX = pageBaseX;
    let focusZ = 9.2;
    let targetLookX = pageBaseX;

    if (selectedCategory === 'Heist & Escape' || selectedCategory.includes('#01')) {
      focusX = 0 * PAGE_SPACING - 4.0;
      focusZ = 6.8;
      targetLookX = 0 * PAGE_SPACING - 4.6;
    } else if (selectedCategory === 'Adventure & Strategy' || selectedCategory.includes('#02')) {
      focusX = 0 * PAGE_SPACING - 1.3;
      focusZ = 6.6;
      targetLookX = 0 * PAGE_SPACING - 1.55;
    } else if (selectedCategory === 'Theme Park & Chance' || selectedCategory.includes('#03')) {
      focusX = 0 * PAGE_SPACING + 1.3;
      focusZ = 6.6;
      targetLookX = 0 * PAGE_SPACING + 1.55;
    } else if (selectedCategory === 'Arcade Arena' || selectedCategory.includes('#04')) {
      focusX = 0 * PAGE_SPACING + 4.0;
      focusZ = 6.8;
      targetLookX = 0 * PAGE_SPACING + 4.6;
    } else if (selectedCategory.includes('#05')) {
      focusX = 1 * PAGE_SPACING - 4.0;
      focusZ = 6.8;
      targetLookX = 1 * PAGE_SPACING - 4.6;
    } else if (selectedCategory.includes('#06')) {
      focusX = 1 * PAGE_SPACING - 1.3;
      focusZ = 6.6;
      targetLookX = 1 * PAGE_SPACING - 1.55;
    } else if (selectedCategory.includes('#07')) {
      focusX = 1 * PAGE_SPACING + 1.3;
      focusZ = 6.6;
      targetLookX = 1 * PAGE_SPACING + 1.55;
    } else if (selectedCategory.includes('#08')) {
      focusX = 1 * PAGE_SPACING + 4.0;
      focusZ = 6.8;
      targetLookX = 1 * PAGE_SPACING + 4.6;
    }

    const parallaxX = pointer.x * 0.45;
    const parallaxY = pointer.y * 0.16;

    targetPos.current.set(focusX + parallaxX, 2.1 + parallaxY, focusZ);
    lookAtPos.current.set(targetLookX + parallaxX * 0.18, 1.85 + parallaxY * 0.12, 0);

    camera.position.lerp(targetPos.current, 0.055);
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
    tex.repeat.set(14, 6);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  return (
    <group>
      {/* ── AMBIENT & RETRO LIGHTING ── */}
      <ambientLight color="#fffbeb" intensity={1.5} />
      <hemisphereLight color="#fde68a" groundColor="#0f172a" intensity={1.1} />
      <directionalLight
        position={[7, 9, 7]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* ── INDIVIDUAL SPOTLIGHTS OVER EVERY ACTIVE CABINET ── */}
      {ARCADE_CABINET_DATA.map((cab) => (
        <spotLight
          key={`spot-${cab.id}`}
          position={[cab.position[0], 7, 2]}
          target-position={[cab.position[0], 0, 0]}
          color={cab.theme.tMoldingColor}
          intensity={2.6}
          angle={0.5}
          penumbra={0.6}
          castShadow
        />
      ))}

      {/* ── CONTINUOUS BACK ARCADE ACCENT WALL (`z = -2.2`) ── */}
      <group position={[7, 3.5, -2.2]}>
        <mesh receiveShadow>
          <planeGeometry args={[64, 10]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.7} />
        </mesh>

        <mesh position={[0, -2.6, 0.05]} receiveShadow>
          <boxGeometry args={[64, 2.2, 0.1]} />
          <meshStandardMaterial color="#d97706" roughness={0.4} />
        </mesh>

        <mesh position={[0, -1.48, 0.12]}>
          <boxGeometry args={[64, 0.08, 0.05]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.6} metalness={0.8} />
        </mesh>

        {/* Neon Accent Trim along the Hall */}
        {ARCADE_CABINET_DATA.map((cab, idx) => (
          <group key={`neon-wall-${idx}`} position={[cab.position[0] - 7, 1.8, 0.08]}>
            <mesh>
              <boxGeometry args={[2.4, 0.06, 0.04]} />
              <meshStandardMaterial
                color={cab.theme.tMoldingColor}
                emissive={cab.theme.tMoldingEmissive}
                emissiveIntensity={1.2}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── CEILING STEEL TRUSSES ── */}
      <group position={[0, 6.8, 0]}>
        {[-5, -2, 1, 4, 8, 12, 16, 20].map((tx, idx) => (
          <mesh key={`truss-${idx}`} position={[tx, 0, 0]}>
            <boxGeometry args={[0.08, 0.4, 12]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* ── CONTINUOUS POLISHED HONEY WOOD FLOOR PLANE (`y = 0`) ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7, 0, 0]} receiveShadow>
        <planeGeometry args={[66, 22]} />
        <meshStandardMaterial
          map={woodFloorTexture || undefined}
          color={woodFloorTexture ? '#ffffff' : '#d97706'}
          roughness={0.25}
          metalness={0.15}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7, 0.01, -1.9]}>
        <planeGeometry args={[64, 0.08]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
    </group>
  );
};

// ============================================================
// MAIN EXPORTED 3D ARCADE LOBBY SCENE COMPONENT
// ============================================================
export const ArcadeLobbyScene: React.FC<{
  activePage?: number;
  selectedCategory?: string;
  onSelectCabinet?: (id: string) => void;
}> = ({ activePage = 0, selectedCategory = 'all', onSelectCabinet }) => {
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
        camera={{ position: [0, 2.15, 9.2], fov: 42 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        dpr={[1, 2]}
      >
        <color attach="background" args={['#fffbeb']} />
        <ArcadeCameraRig activePage={activePage} selectedCategory={selectedCategory} />
        <ArcadeRoomEnvironment />

        {/* Physical 3D Arcade Machines across continuous wings */}
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
