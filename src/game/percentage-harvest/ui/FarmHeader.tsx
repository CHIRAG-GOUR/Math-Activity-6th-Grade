// ============================================================
// PERCENTAGE HARVEST — TOP ARCADE HEADER & CHALLENGE BANNER
// Glossy Team pills, Round tracker & Floating Center Math Banner
// ============================================================

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Volume2,
  VolumeX,
  HelpCircle,
  Maximize2,
  Minimize2,
  Sprout,
  Coins,
  ArrowLeft,
} from 'lucide-react';
import { useFarmStore } from '../store/farmStore';
import { formatCurrency } from '../engine/percentageMath';

interface FarmHeaderProps {
  activeMobileTab?: 'blue' | 'red';
}

export const FarmHeader: React.FC<FarmHeaderProps> = ({ activeMobileTab }) => {
  const router = useRouter();
  const muted = useFarmStore((s) => s.muted);
  const toggleMute = useFarmStore((s) => s.toggleMute);
  const setShowBriefing = useFarmStore((s) => s.setShowBriefing);
  const blue = useFarmStore((s) => s.blue);
  const red = useFarmStore((s) => s.red);

  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const matchQuestionCount = useFarmStore((s) => s.matchQuestionCount);
  const setMatchQuestionCount = useFarmStore((s) => s.setMatchQuestionCount);

  // If mobile tab is explicitly chosen, use that team's question; otherwise follow the active advancing team
  const activeQuestion = activeMobileTab === 'red'
    ? red.currentQuestion
    : activeMobileTab === 'blue'
    ? blue.currentQuestion
    : blue.currentRound >= red.currentRound
    ? blue.currentQuestion
    : red.currentQuestion;

  const currentRound = Math.max(blue.currentRound, red.currentRound);
  const totalQ = matchQuestionCount;
  const stageIdx = Math.min(5, Math.floor(((currentRound - 1) / totalQ) * 5) + 1);

  return (
    <header className="relative z-30 w-full flex flex-col items-center px-3 pt-2 pointer-events-none">
      {/* ── TOP CAPSULES BAR ── */}
      <div className="w-full flex items-center justify-between gap-2 max-w-[1880px]">
        {/* Left: Blue Farm Pill */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Small Arcade Return Button */}
          <button
            type="button"
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-slate-800 border-2 border-slate-300 shadow-md text-xs font-black uppercase tracking-wider active:scale-95 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ARCADE</span>
          </button>

          {/* Blue Team Capsule */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 border-2 border-blue-300 text-white shadow-lg">
            {/* Farmer Avatar */}
            <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-sm shadow-xs">
              👨‍🌾
            </div>
            <div className="text-xs sm:text-sm font-black tracking-wider uppercase">
              BLUE FARM
            </div>
            {/* Coin Badge */}
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-900/60 border border-blue-300/40 text-xs sm:text-sm font-black font-mono text-amber-300">
              <Coins className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{blue.totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Center: Question Count Selector, Round & Farm Clock Capsule */}
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 border-2 border-slate-300 text-slate-800 shadow-xl pointer-events-auto backdrop-blur-md">
          {/* Mode Selector 5Q / 10Q / 15Q */}
          <div className="flex items-center p-0.5 rounded-full bg-slate-100 border border-slate-300">
            {([5, 10, 15] as const).map((count) => (
              <button
                key={`qmode-${count}`}
                type="button"
                onClick={() => setMatchQuestionCount(count)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-black transition cursor-pointer ${
                  matchQuestionCount === count
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {count} Q
              </button>
            ))}
          </div>

          <span className="text-slate-300">|</span>

          {/* Farm Clock */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 font-mono text-xs font-black">
            <span>☀️</span>
            <span>DAY {stageIdx === 1 ? 1 : stageIdx === 2 ? 3 : stageIdx === 3 ? 6 : stageIdx === 4 ? 10 : 15}</span>
            <span className="text-amber-400">|</span>
            <span className="text-slate-700 font-mono text-[11px]">
              {stageIdx === 1 ? '08:30 AM' : stageIdx === 2 ? '10:15 AM' : stageIdx === 3 ? '02:00 PM' : stageIdx === 4 ? '09:45 AM' : '11:30 AM'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black tracking-wider uppercase font-mono text-emerald-700">
              QUESTION {currentRound}/{totalQ}
            </span>
          </div>
        </div>

        {/* Right: Red Farm Pill & Utilities */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Red Team Capsule */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 border-2 border-red-300 text-white shadow-lg">
            {/* Coin Badge */}
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-950/60 border border-red-300/40 text-xs sm:text-sm font-black font-mono text-amber-300">
              <Coins className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{red.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="text-xs sm:text-sm font-black tracking-wider uppercase">
              RED FARM
            </div>
            {/* Farmer Avatar */}
            <div className="w-7 h-7 rounded-full bg-red-100 border-2 border-white flex items-center justify-center text-sm shadow-xs">
              👨‍🌾
            </div>
          </div>

          {/* Utility Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowBriefing(true)}
              className="p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-800 border-2 border-slate-300 shadow-md active:scale-95 transition cursor-pointer"
              title="Help & Rules"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-800 border-2 border-slate-300 shadow-md active:scale-95 transition cursor-pointer"
              title={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? (
                <VolumeX className="w-4 h-4 text-rose-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              )}
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-800 border-2 border-slate-300 shadow-md active:scale-95 transition cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
