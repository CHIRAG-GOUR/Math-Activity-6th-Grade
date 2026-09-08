// ============================================================
// THE GREAT CARNIVAL OF CHANCE — NEUBRUTALIST SINGLE SCORE CARD
// Single Clean Solid White Card with 3.5px Black Outline & 4px Shadow
// No nested wrapper, no B/R letter box, clean score readout
// ============================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
      style={{
        backgroundColor: '#FFFFFF',
        border: '3.5px solid #000000',
        boxShadow: '4px 4px 0px #000000',
        borderRadius: '14px',
      }}
      className="flex flex-col px-3 py-1 min-w-[130px] sm:min-w-[145px] select-none shrink-0"
    >
      {/* ── Top Header: Team Label & Gold Tickets ── */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-full border border-black shrink-0"
            style={{ backgroundColor: isBlue ? '#2563EB' : '#FF2A6D' }}
          />
          <span
            className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider"
            style={{ color: isBlue ? '#1E40AF' : '#991B1B' }}
          >
            {team.name}
          </span>
        </div>

        {/* Tickets Tag */}
        <div
          style={{
            backgroundColor: '#FED500',
            border: '1.5px solid #000000',
            borderRadius: '6px',
          }}
          className="flex items-center gap-1 px-1.5 py-0.2 text-[9px] font-black text-black"
        >
          <Ticket className="w-2.5 h-2.5 fill-black text-black" />
          <span>{team.goldTickets}</span>
        </div>
      </div>

      {/* ── Bottom: Score & Streak ── */}
      <div className="flex items-center gap-1.5 mt-0.5">
        <Star className="w-3.5 h-3.5 fill-[#FED500] text-black stroke-[2.5]" />
        <motion.span
          key={team.score}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className="text-base sm:text-lg font-black font-mono leading-none text-black"
        >
          {team.score.toLocaleString()}
        </motion.span>
        <span className="text-[10px] font-black text-black">PTS</span>

        {team.streak > 1 && (
          <div
            style={{
              backgroundColor: '#FF2A6D',
              border: '1.5px solid #000000',
              borderRadius: '6px',
              color: '#FFFFFF',
            }}
            className="ml-auto flex items-center gap-0.5 px-1 py-0.2 text-[8px] font-black"
          >
            <Flame className="w-2.5 h-2.5 fill-white text-white" />
            <span>{team.streak}x</span>
          </div>
        )}
      </div>
    </div>
  );
};
