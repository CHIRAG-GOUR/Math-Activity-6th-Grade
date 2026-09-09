// ============================================================
// BLUEPRINT BLITZ — Championship Winner Ceremony
// Displays grand victory podium, final match statistics,
// and return controls to Arcade.
// 100% Sunny Daytime styling — Zero Dark Navy.
// ============================================================

import React from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Award, RotateCcw, Home } from 'lucide-react';
import { useBlueprintStore } from '../store/blueprintStore';
import { blueprintAudio } from '../audio/blueprintAudio';

export const WinnerCeremony: React.FC = () => {
  const router = useRouter();
  const { winner, blueTeam, redTeam, restartGame } = useBlueprintStore();

  const handleReturnToArcade = () => {
    blueprintAudio.stopBgm();
    router.push('/');
  };

  const isBlueWinner = winner === 'blue';
  const isRedWinner = winner === 'red';
  const isTie = winner === 'tie';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/75 backdrop-blur-sm animate-in zoom-in-95 duration-500">
      <div className="w-full max-w-3xl bg-[#fff8e7] border-4 border-slate-950 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-6 text-center text-slate-950">
        {/* Trophy Icon Badge */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 shadow-xl border-4 border-slate-950">
          <Trophy className="w-10 h-10" />
        </div>

        {/* Victory Headline */}
        <div>
          <span className="text-xs font-black tracking-widest text-amber-700 uppercase">
            CHAMPIONSHIP MEGA BUILD COMPLETE
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-1 text-slate-950">
            {isTie
              ? '🤝 IT IS A DRAW!'
              : isBlueWinner
                ? '🏆 BLUE TEAM VICTORIOUS!'
                : '🏆 RED TEAM VICTORIOUS!'}
          </h1>
          <p className="text-sm text-slate-700 mt-2 max-w-md mx-auto font-medium">
            Outstanding mastery of 3D architectural dimensions, rectangular areas, and cubic volumes!
          </p>
        </div>

        {/* Final Team Stats Cards */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {/* Blue Squad */}
          <div
            className={`flex flex-col items-center p-5 rounded-2xl border-4 ${
              isBlueWinner
                ? 'bg-blue-50 border-blue-500 shadow-xl'
                : 'bg-white border-slate-300'
            }`}
          >
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest">
              BLUE SQUAD
            </span>
            <span className="text-4xl font-black text-slate-950 mt-1 font-mono">
              {blueTeam.score} <span className="text-sm text-amber-600 font-bold">PTS</span>
            </span>
            <div className="text-xs text-slate-600 font-bold mt-2">
              ✓ {blueTeam.completedChallengesCount} Structures Approved
            </div>
          </div>

          {/* Red Squad */}
          <div
            className={`flex flex-col items-center p-5 rounded-2xl border-4 ${
              isRedWinner
                ? 'bg-red-50 border-red-500 shadow-xl'
                : 'bg-white border-slate-300'
            }`}
          >
            <span className="text-xs font-black text-red-600 uppercase tracking-widest">
              RED SQUAD
            </span>
            <span className="text-4xl font-black text-slate-950 mt-1 font-mono">
              {redTeam.score} <span className="text-sm text-amber-600 font-bold">PTS</span>
            </span>
            <div className="text-xs text-slate-600 font-bold mt-2">
              ✓ {redTeam.completedChallengesCount} Structures Approved
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center gap-4 w-full pt-2">
          <button
            onClick={restartGame}
            className="flex-1 py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg border-3 border-slate-950 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={handleReturnToArcade}
            className="flex-1 py-4 px-6 rounded-2xl bg-white hover:bg-slate-100 active:scale-95 text-slate-950 font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 border-3 border-slate-950 shadow-lg transition-all"
          >
            <Home className="w-5 h-5" />
            <span>ARCADE LOBBY</span>
          </button>
        </div>
      </div>
    </div>
  );
};
