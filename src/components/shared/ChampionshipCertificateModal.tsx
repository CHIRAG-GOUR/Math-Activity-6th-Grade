// ============================================================
// SKILLIZEE ARCADE — Downloadable / Printable Championship Certificate
// High-Resolution Gold-Bordered Diploma of Mathematical Excellence:
// - Authentic ornate frame, metallic gold badge & official club seal
// - Dynamic Team Name, Score, Activity Title, and Verification Date
// - Native Browser Print & PDF Export Support via `@media print`
// ============================================================

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Printer, X, Download, Star, CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  winnerName: string;
  winnerScore: number;
  gameTitle: string;
  topicTitle?: string;
  runnerUpName?: string;
  runnerUpScore?: number;
}

export const ChampionshipCertificateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  winnerName,
  winnerScore,
  gameTitle,
  topicTitle = 'Grade 6 Mathematics Club',
  runnerUpName,
  runnerUpScore,
}) => {
  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md select-none pointer-events-auto overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl border-4 border-black shadow-[12px_12px_0px_#000000] overflow-hidden text-slate-950 flex flex-col"
        >
          {/* Top Actions Bar (Hidden during Print) */}
          <div className="print:hidden px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b-3 border-black">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-300">
                Official Championship Certificate
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000000] active:scale-95 transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-black" />
                <span>Print / Save PDF</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition active:scale-95 cursor-pointer border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Certificate Body */}
          <div className="p-6 sm:p-8 bg-[#fffbf0] border-8 border-double border-amber-600 m-3 sm:m-4 rounded-2xl relative text-center flex flex-col items-center">
            {/* Background watermark seal */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none text-slate-950 text-9xl font-black">
              SKILLIZEE
            </div>

            {/* Certificate Header Stamp */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 border-2 border-black shadow-md flex items-center justify-center text-black">
                <Award className="w-7 h-7 stroke-[2.5]" />
              </div>
            </div>

            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-amber-800 block">
              SKILLIZEE MATHEMATICS CLUB • GRADE 6 HONORS
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight uppercase mt-1 mb-2">
              CERTIFICATE OF EXCELLENCE
            </h1>

            <div className="w-24 h-1 bg-amber-500 rounded-full mx-auto mb-4" />

            <p className="text-xs sm:text-sm font-serif italic text-slate-700">
              This official distinction is proudly presented to
            </p>

            {/* Recipient Team Name */}
            <div className="my-2 px-6 py-2 rounded-2xl bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-100 border-3 border-black shadow-[4px_4px_0px_#000000] inline-block">
              <h2 className="text-xl sm:text-2xl font-black uppercase text-slate-950 tracking-wide">
                🏆 {winnerName}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-md mx-auto leading-relaxed mt-2">
              For demonstrating master-level mathematical precision, tactical speed, and problem-solving excellence in
            </p>

            <div className="text-base sm:text-lg font-black uppercase text-amber-900 tracking-wider my-1">
              ★ {gameTitle} ★
            </div>

            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-4">
              {topicTitle}
            </p>

            {/* Performance Stats Cards */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-md my-2 text-left">
              <div className="p-2.5 rounded-xl bg-white border-2 border-black shadow-xs flex flex-col justify-between">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">CHAMPION SCORE</span>
                <span className="text-lg font-black font-mono text-emerald-700">{winnerScore.toLocaleString()} PTS</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border-2 border-black shadow-xs flex flex-col justify-between">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">AWARD DATE</span>
                <span className="text-xs font-black text-slate-900">{currentDate}</span>
              </div>
            </div>

            {/* Signatures & Seal Footer */}
            <div className="w-full flex items-end justify-between mt-6 pt-4 border-t-2 border-slate-300 px-4 text-left">
              <div className="flex flex-col">
                <span className="font-serif italic text-xs text-slate-800">Skillizee Academy</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">MATHEMATICS FACULTY</span>
              </div>

              {/* Official Gold Seal Badge */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-amber-400 border-2 border-black flex items-center justify-center shadow-xs">
                  <Star className="w-5 h-5 fill-yellow-100 text-black stroke-[1.5]" />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-amber-900 mt-0.5">VERIFIED</span>
              </div>

              <div className="flex flex-col text-right">
                <span className="font-mono text-xs font-bold text-slate-800">CLASSROOM 6A</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">COMPETITION SEAL</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
