'use client';

import React, { useEffect, useRef } from 'react';

export const CaveBackground: React.FC = () => {
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
      isSparkle: boolean;
    }

    const particles: Particle[] = [];
    const colors = ['#FFD700', '#00F0FF', '#FF3366', '#FFF3B0', '#64B5F6', '#FFAB91'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speedY: -(Math.random() * 0.45 + 0.12),
        speedX: (Math.random() - 0.5) * 0.35,
        opacity: Math.random() * 0.7 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2,
        isSparkle: Math.random() > 0.6,
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
        ctx.shadowBlur = p.isSparkle ? 12 : 6;
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
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10 bg-[#03050a]">
      {/* 1. Deep Cavern Atmosphere Layer */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 45%, rgba(30, 42, 68, 0.45) 0%, rgba(10, 15, 26, 0.85) 60%, #030408 100%),
            radial-gradient(circle at 8% 35%, rgba(0, 240, 255, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 92% 35%, rgba(255, 51, 102, 0.12) 0%, transparent 45%)
          `,
        }}
      />

      {/* 2. Top Cavern Roof Stalactites Silhouette */}
      <div className="absolute top-0 left-0 right-0 h-14 opacity-40">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="w-full h-full text-[#080d18] fill-current">
          <polygon points="0,0 60,35 110,12 170,45 230,10 320,50 410,15 500,40 600,10 700,45 820,15 910,50 1020,10 1110,40 1200,0" />
        </svg>
      </div>

      {/* 3. Floating Sparkle Particles Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 4. Left Team Blue Cyan Crystal Clusters & Ambient Aura */}
      <div className="absolute -left-20 top-1/4 w-[420px] h-[420px] rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute left-2 bottom-12 w-56 h-96 opacity-65 pointer-events-none animate-crystal-glow text-cyan-400">
        <svg viewBox="0 0 200 320" className="w-full h-full drop-shadow-[0_0_20px_rgba(0,240,255,0.7)]">
          {/* Main Giant Cyan Crystal Spire */}
          <polygon points="45,300 25,180 60,70 85,190 90,300" fill="url(#cyan3D1)" />
          {/* Front Highlight Facet */}
          <polygon points="60,70 85,190 65,300 45,300" fill="url(#cyan3D2)" opacity="0.9" />
          {/* Side Gem Crystals */}
          <polygon points="80,300 105,120 135,40 155,160 140,300" fill="url(#cyan3D1)" />
          <polygon points="135,40 155,160 130,300 105,120" fill="url(#cyan3D2)" opacity="0.85" />
          <polygon points="135,300 150,190 175,130 195,220 180,300" fill="url(#cyan3D1)" opacity="0.8" />
          <defs>
            <linearGradient id="cyan3D1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0f7fa" />
              <stop offset="40%" stopColor="#00e5ff" />
              <stop offset="80%" stopColor="#00838f" />
              <stop offset="100%" stopColor="#004d40" />
            </linearGradient>
            <linearGradient id="cyan3D2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#80deea" />
              <stop offset="70%" stopColor="#0097a7" />
              <stop offset="100%" stopColor="#00363a" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 5. Right Team Red Ruby Crystal Clusters & Ambient Aura */}
      <div className="absolute -right-20 top-1/4 w-[420px] h-[420px] rounded-full bg-rose-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute right-2 bottom-12 w-56 h-96 opacity-65 pointer-events-none animate-crystal-glow text-rose-400">
        <svg viewBox="0 0 200 320" className="w-full h-full drop-shadow-[0_0_20px_rgba(255,51,102,0.7)]">
          {/* Main Giant Ruby Crystal Spire */}
          <polygon points="45,300 25,180 60,70 85,190 90,300" fill="url(#ruby3D1)" />
          {/* Front Highlight Facet */}
          <polygon points="60,70 85,190 65,300 45,300" fill="url(#ruby3D2)" opacity="0.9" />
          {/* Side Ruby Crystals */}
          <polygon points="80,300 105,120 135,40 155,160 140,300" fill="url(#ruby3D1)" />
          <polygon points="135,40 155,160 130,300 105,120" fill="url(#ruby3D2)" opacity="0.85" />
          <polygon points="135,300 150,190 175,130 195,220 180,300" fill="url(#ruby3D1)" opacity="0.8" />
          <defs>
            <linearGradient id="ruby3D1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffebee" />
              <stop offset="40%" stopColor="#ff1744" />
              <stop offset="80%" stopColor="#ad1457" />
              <stop offset="100%" stopColor="#4a148c" />
            </linearGradient>
            <linearGradient id="ruby3D2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#ff80ab" />
              <stop offset="70%" stopColor="#c2185b" />
              <stop offset="100%" stopColor="#560027" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 6. Gold Central Cavern Glow Behind Vault */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-amber-500/12 blur-[140px] pointer-events-none" />

      {/* 7. Bottom Gold Coin Spill Vignette */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
    </div>
  );
};
