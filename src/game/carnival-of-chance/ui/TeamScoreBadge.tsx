// ============================================================
// THE GREAT CARNIVAL OF CHANCE — NEUBRUTALIST SCORE BADGES
// Solid Blue & Red Score Signs with Guaranteed Inline Styles & Outlines
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
      style={{
        backgroundColor: isBlue ? '#3B82F6' : '#FF2A6D',
        border: '4px solid #000000',
        boxShadow: '6px 6px 0px #000000',
        borderRadius: '20px',
      }}
      className="relative flex items-center gap-2 p-1.5 select-none shrink-0"
    >
      {/* ── Blue Team Layout: Emblem on Left ── */}
      {isBlue ? (
        <>
          {/* Emblem Stamp */}
          <div
            style={{
              backgroundColor: '#FED500',
              border: '3px solid #000000',
              boxShadow: '2px 2px 0px #000000',
              borderRadius: '12px',
              color: '#000000',
            }}
            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center font-black text-lg sm:text-xl shrink-0"
          >
            B
          </div>

          {/* Opaque Cream Score Display */}
          <div
            style={{
              backgroundColor: '#FFF7E5',
              border: '3px solid #000000',
              boxShadow: '2px 2px 0px #000000',
              borderRadius: '14px',
            }}
            className="flex flex-col px-2.5 sm:px-3 py-0.5 sm:py-1 min-w-[130px] sm:min-w-[150px]"
          >
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-black">
                {team.name}
              </span>
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

            <div className="flex items-center gap-1.5 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-[#FED500] text-black stroke-[2.5]" />
              <motion.span
                key={team.score}
                initial={{ scale: 1.3, color: '#E53935' }}
                animate={{ scale: 1, color: '#000000' }}
                transition={{ duration: 0.3 }}
                className="text-base sm:text-lg font-black font-mono leading-none text-black"
              >
                {team.score.toLocaleString()}
              </motion.span>
              <span className="text-[10px] font-black text-black font-sans">PTS</span>

              {team.streak > 1 && (
                <div
                  style={{
                    backgroundColor: '#FED500',
                    border: '1.5px solid #000000',
                    borderRadius: '6px',
                  }}
                  className="ml-auto flex items-center gap-0.5 px-1 py-0.2 text-[8px] font-black"
                >
                  <Flame className="w-2.5 h-2.5 fill-[#FF2A6D] text-[#FF2A6D]" />
                  <span>{team.streak}x</span>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Red Team Layout: Mirrored ── */}
          <div
            style={{
              backgroundColor: '#FFF7E5',
              border: '3px solid #000000',
              boxShadow: '2px 2px 0px #000000',
              borderRadius: '14px',
            }}
            className="flex flex-col px-2.5 sm:px-3 py-0.5 sm:py-1 min-w-[130px] sm:min-w-[150px] text-right"
          >
            <div className="flex items-center justify-between gap-1.5">
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
              <span className="text-[10px] font-black uppercase tracking-wider text-black">
                {team.name}
              </span>
            </div>

            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              {team.streak > 1 && (
                <div
                  style={{
                    backgroundColor: '#FED500',
                    border: '1.5px solid #000000',
                    borderRadius: '6px',
                  }}
                  className="mr-auto flex items-center gap-0.5 px-1 py-0.2 text-[8px] font-black"
                >
                  <Flame className="w-2.5 h-2.5 fill-[#FF2A6D] text-[#FF2A6D]" />
                  <span>{team.streak}x</span>
                </div>
              )}
              <motion.span
                key={team.score}
                initial={{ scale: 1.3, color: '#E53935' }}
                animate={{ scale: 1, color: '#000000' }}
                transition={{ duration: 0.3 }}
                className="text-base sm:text-lg font-black font-mono leading-none text-black"
              >
                {team.score.toLocaleString()}
              </motion.span>
              <span className="text-[10px] font-black text-black font-sans">PTS</span>
              <Star className="w-3.5 h-3.5 fill-[#FED500] text-black stroke-[2.5]" />
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#FED500',
              border: '3px solid #000000',
              boxShadow: '2px 2px 0px #000000',
              borderRadius: '12px',
              color: '#000000',
            }}
            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center font-black text-lg sm:text-xl shrink-0"
          >
            R
          </div>
        </>
      )}

      {/* ── Points Floater (+120 PTS!) ── */}
      <AnimatePresence>
        {team.scoreGained > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.7 }}
            animate={{ opacity: 1, y: -26, scale: 1.2 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            style={{
              backgroundColor: '#00F0A8',
              color: '#000000',
              border: '3px solid #000000',
              boxShadow: '4px 4px 0px #000000',
              borderRadius: '12px',
            }}
            className={`absolute -top-3 ${
              isBlue ? 'left-1/2' : 'right-1/2'
            } px-2.5 py-0.5 font-black text-xs pointer-events-none z-50`}
          >
            +{team.scoreGained} PTS!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
