'use client';

import React, { useEffect, useRef } from 'react';
import { TreasureChest } from './TreasureChest';

export const CaveScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle motes and floating gold embers
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      color: string;
      phase: number;
      isGlow: boolean;
    }

    const particles: Particle[] = [];
    const colors = ['#FFD700', '#FFE082', '#00F0FF', '#FF3366', '#FFF9C4', '#80D8FF'];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speedY: -(Math.random() * 0.45 + 0.15),
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.7 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2,
        isGlow: Math.random() > 0.5,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.phase += 0.025;

        if (p.y < -15) {
          p.y = height + 15;
          p.x = Math.random() * width;
        }
        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;

        const currentOpacity = Math.max(0.1, p.opacity + Math.sin(p.phase) * 0.3);

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentOpacity;
        ctx.shadowBlur = p.isGlow ? 14 : 6;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10 bg-[#020409]">
      {/* 1. BACKGROUND: Deep Cavern Atmosphere Gradients */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 45%, rgba(32, 45, 72, 0.4) 0%, rgba(10, 15, 26, 0.9) 65%, #020408 100%),
            radial-gradient(circle at 6% 35%, rgba(0, 229, 255, 0.15) 0%, transparent 45%),
            radial-gradient(circle at 94% 35%, rgba(255, 42, 95, 0.15) 0%, transparent 45%)
          `,
        }}
      />

      {/* 2. MIDGROUND: Top Cavern Roof Stalactites Frame */}
      <div className="absolute top-0 left-0 right-0 h-16 opacity-50">
        <svg viewBox="0 0 1200 65" preserveAspectRatio="none" className="w-full h-full text-[#080d1a] fill-current">
          <polygon points="0,0 45,40 90,12 150,50 210,15 300,55 380,18 470,45 560,12 650,50 750,15 850,55 940,12 1030,45 1120,15 1200,50 1200,0" />
        </svg>
      </div>

      {/* 3. PARTICLES CANVAS */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 4. LEFT FLANK: Glowing Cyan Crystal Cluster & Volumetric Blue Light */}
      <div className="absolute -left-28 top-1/4 w-[480px] h-[480px] rounded-full bg-cyan-500/18 blur-[130px] pointer-events-none" />
      <div className="absolute left-2 bottom-10 w-64 h-[420px] opacity-75 pointer-events-none animate-crystal-pulse text-cyan-400">
        <svg viewBox="0 0 200 320" className="w-full h-full drop-shadow-[0_0_25px_rgba(0,229,255,0.8)]">
          {/* Main Giant Cyan Crystal Spire */}
          <polygon points="45,300 25,180 60,65 85,190 90,300" fill="url(#cyanGemSpire1)" />
          <polygon points="60,65 85,190 65,300 45,300" fill="url(#cyanGemSpire2)" opacity="0.9" />
          {/* Cluster Crystals */}
          <polygon points="80,300 105,120 135,35 155,160 140,300" fill="url(#cyanGemSpire1)" />
          <polygon points="135,35 155,160 130,300 105,120" fill="url(#cyanGemSpire2)" opacity="0.85" />
          <polygon points="135,300 150,190 175,125 195,220 180,300" fill="url(#cyanGemSpire1)" opacity="0.8" />
          <defs>
            <linearGradient id="cyanGemSpire1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0f7fa" />
              <stop offset="40%" stopColor="#00e5ff" />
              <stop offset="80%" stopColor="#00838f" />
              <stop offset="100%" stopColor="#004d40" />
            </linearGradient>
            <linearGradient id="cyanGemSpire2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#80deea" />
              <stop offset="70%" stopColor="#0097a7" />
              <stop offset="100%" stopColor="#00363a" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 5. RIGHT FLANK: Glowing Ruby Crystal Cluster & Volumetric Red Light */}
      <div className="absolute -right-28 top-1/4 w-[480px] h-[480px] rounded-full bg-rose-500/18 blur-[130px] pointer-events-none" />
      <div className="absolute right-2 bottom-10 w-64 h-[420px] opacity-75 pointer-events-none animate-crystal-pulse text-rose-400">
        <svg viewBox="0 0 200 320" className="w-full h-full drop-shadow-[0_0_25px_rgba(255,42,95,0.8)]">
          {/* Main Giant Ruby Crystal Spire */}
          <polygon points="45,300 25,180 60,65 85,190 90,300" fill="url(#rubyGemSpire1)" />
          <polygon points="60,65 85,190 65,300 45,300" fill="url(#rubyGemSpire2)" opacity="0.9" />
          {/* Cluster Crystals */}
          <polygon points="80,300 105,120 135,35 155,160 140,300" fill="url(#rubyGemSpire1)" />
          <polygon points="135,35 155,160 130,300 105,120" fill="url(#rubyGemSpire2)" opacity="0.85" />
          <polygon points="135,300 150,190 175,125 195,220 180,300" fill="url(#rubyGemSpire1)" opacity="0.8" />
          <defs>
            <linearGradient id="rubyGemSpire1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffebee" />
              <stop offset="40%" stopColor="#ff1744" />
              <stop offset="80%" stopColor="#ad1457" />
              <stop offset="100%" stopColor="#4a148c" />
            </linearGradient>
            <linearGradient id="rubyGemSpire2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#ff80ab" />
              <stop offset="70%" stopColor="#c2185b" />
              <stop offset="100%" stopColor="#560027" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 6. FOREGROUND TREASURE CHESTS (Corners) */}
      <div className="absolute left-6 bottom-4 w-44 sm:w-52 md:w-60 h-28 sm:h-36 opacity-85 pointer-events-none">
        <TreasureChest side="left" />
      </div>
      <div className="absolute right-6 bottom-4 w-44 sm:w-52 md:w-60 h-28 sm:h-36 opacity-85 pointer-events-none scale-x-[-1]">
        <TreasureChest side="right" />
      </div>

      {/* 7. CENTER WARM GOLDEN VAULT VOLUMETRIC AURA */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full bg-amber-500/15 blur-[160px] pointer-events-none" />

      {/* 8. BOTTOM SHADOW VIGNETTE */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
    </div>
  );
};
