// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Neo-Brutalist Team Score Sign
// Tactile Carnival Scoreboard Plaque for Team Blue & Team Red
// Mirrored Geometry, High Contrast, Hard Drop Shadows
// ============================================================

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamId, TeamState } from '../types';
import { Star, Flame, Ticket } from 'lucide-react';

interface TeamScoreBadgeProps {
  team: TeamState;
  side: TeamId;
}

export const TeamScoreBadge: React.FC<TeamScoreBadgeProps> = ({ team, side }) => {
  const isBlue = side === 'blue';

  return (
    <div
      className={`relative flex items-center gap-2 p-1.5 rounded-2xl border-4 border-[#111111] shadow-[5px_5px_0px_#111111] select-none ${
        isBlue ? 'bg-[#2463EB]' : 'bg-[#E53935]'
      }`}
    >
      {/* ── Left Side: Blue Icon or Red Content ── */}
      {isBlue ? (
        <>
          {/* Team Emblem Letter */}
          <div className="w-11 h-11 rounded-xl bg-[#FFC928] border-3 border-[#111111] flex items-center justify-center font-black text-xl text-[#111111] shadow-[2px_2px_0px_#111111] shrink-0">
            B
          </div>

          {/* Score & Ticket Info Container */}
          <div className="flex flex-col px-3 py-1 bg-[#FFF8E7] rounded-xl border-3 border-[#111111] shadow-[2px_2px_0px_#111111] min-w-[150px]">
            {/* Team Label & Tickets */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#111111]">
                {team.name}
              </span>
              <div className="flex items-center gap-1 bg-[#FFC928] px-1.5 py-0.2 rounded border border-[#111111] text-[9px] font-black text-[#111111]">
                <Ticket className="w-2.5 h-2.5 fill-[#111111] text-[#111111]" />
                <span>{team.goldTickets}</span>
              </div>
            </div>

            {/* Main Score Counter */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <Star className="w-4 h-4 fill-[#FFC928] text-[#111111] stroke-[2.5]" />
              <motion.span
                key={team.score}
                initial={{ scale: 1.3, color: '#E53935' }}
                animate={{ scale: 1, color: '#111111' }}
                transition={{ duration: 0.3 }}
                className="text-lg font-black font-mono leading-none"
              >
                {team.score.toLocaleString()}
              </motion.span>
              <span className="text-[10px] font-black text-[#E53935] font-sans">PTS</span>

              {/* Streak Multiplier */}
              {team.streak > 1 && (
                <div className="ml-auto flex items-center gap-0.5 bg-[#FFC928] px-1 py-0.2 rounded border border-[#111111] text-[8px] font-black">
                  <Flame className="w-2.5 h-2.5 fill-[#E53935] text-[#E53935]" />
                  <span>{team.streak}x</span>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Red Team Score & Ticket Info Container (Mirrored) */}
          <div className="flex flex-col px-3 py-1 bg-[#FFF8E7] rounded-xl border-3 border-[#111111] shadow-[2px_2px_0px_#111111] min-w-[150px] text-right">
            {/* Team Label & Tickets */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 bg-[#FFC928] px-1.5 py-0.2 rounded border border-[#111111] text-[9px] font-black text-[#111111]">
                <Ticket className="w-2.5 h-2.5 fill-[#111111] text-[#111111]" />
                <span>{team.goldTickets}</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#111111]">
                {team.name}
              </span>
            </div>

            {/* Main Score Counter */}
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              {/* Streak Multiplier */}
              {team.streak > 1 && (
                <div className="mr-auto flex items-center gap-0.5 bg-[#FFC928] px-1 py-0.2 rounded border border-[#111111] text-[8px] font-black">
                  <Flame className="w-2.5 h-2.5 fill-[#E53935] text-[#E53935]" />
                  <span>{team.streak}x</span>
                </div>
              )}
              <motion.span
                key={team.score}
                initial={{ scale: 1.3, color: '#E53935' }}
                animate={{ scale: 1, color: '#111111' }}
                transition={{ duration: 0.3 }}
                className="text-lg font-black font-mono leading-none"
              >
                {team.score.toLocaleString()}
              </motion.span>
              <span className="text-[10px] font-black text-[#E53935] font-sans">PTS</span>
              <Star className="w-4 h-4 fill-[#FFC928] text-[#111111] stroke-[2.5]" />
            </div>
          </div>

          {/* Team Emblem Letter */}
          <div className="w-11 h-11 rounded-xl bg-[#FFC928] border-3 border-[#111111] flex items-center justify-center font-black text-xl text-[#111111] shadow-[2px_2px_0px_#111111] shrink-0">
            R
          </div>
        </>
      )}

      {/* ── Floating Points Reward Floater ── */}
      <AnimatePresence>
        {team.scoreGained > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.7 }}
            animate={{ opacity: 1, y: -25, scale: 1.2 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className={`absolute -top-3 ${
              isBlue ? 'left-1/2' : 'right-1/2'
            } px-2.5 py-1 rounded-xl bg-[#2E9B57] text-[#FFFFFF] border-2 border-[#111111] font-black text-xs shadow-[3px_3px_0px_#111111] pointer-events-none z-50`}
          >
            +{team.scoreGained} PTS
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
