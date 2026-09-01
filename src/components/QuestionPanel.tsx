'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Sparkles, Lightbulb } from 'lucide-react';
import { Question } from '@/types/game';

interface QuestionPanelProps {
  question: Question | null;
  roundNumber: number;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({
  question,
  roundNumber,
}) => {
  const [showHint, setShowHint] = useState(false);

  // Reset hint on new question
  React.useEffect(() => {
    setShowHint(false);
  }, [question?.id]);

  if (!question) return null;

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 w-full max-w-[520px]">
      {/* Plaque Header: Round & Topic Tag */}
      <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-slate-950/90 border-2 border-amber-400/70 shadow-[0_4px_15px_rgba(0,0,0,0.8),0_0_12px_rgba(255,215,0,0.3)] mb-2 z-10">
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span className="text-[12px] sm:text-[13px] font-black uppercase tracking-widest text-amber-200 font-game">
          ROUND {roundNumber} • {question.topic.toUpperCase()}
        </span>
      </div>

      {/* Massive Bolted Obsidian & Gold Question Plaque */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, scale: 0.88, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.08, y: -15 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="question-plaque relative w-full py-4 sm:py-5 px-6 sm:px-8 rounded-3xl flex flex-col items-center justify-center"
        >
          {/* 4 Heavy Brass Corner Screws */}
          <div className="absolute top-2.5 left-2.5 w-3 h-3 rounded-full bg-gradient-to-br from-amber-200 to-amber-700 border border-amber-100 shadow flex items-center justify-center">
            <div className="w-1.5 h-0.5 bg-amber-950" />
          </div>
          <div className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full bg-gradient-to-br from-amber-200 to-amber-700 border border-amber-100 shadow flex items-center justify-center">
            <div className="w-1.5 h-0.5 bg-amber-950" />
          </div>
          <div className="absolute bottom-2.5 left-2.5 w-3 h-3 rounded-full bg-gradient-to-br from-amber-200 to-amber-700 border border-amber-100 shadow flex items-center justify-center">
            <div className="w-1.5 h-0.5 bg-amber-950" />
          </div>
          <div className="absolute bottom-2.5 right-2.5 w-3 h-3 rounded-full bg-gradient-to-br from-amber-200 to-amber-700 border border-amber-100 shadow flex items-center justify-center">
            <div className="w-1.5 h-0.5 bg-amber-950" />
          </div>

          {/* ULTRA READABLE HIGH-CONTRAST QUESTION */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.4rem] font-black tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,1)] font-display my-1 leading-tight select-none">
            {question.text}
          </h2>

          {/* Subtext if applicable */}
          {question.subText && (
            <p className="text-sm sm:text-base font-bold text-amber-200 mt-1 drop-shadow">
              {question.subText}
            </p>
          )}

          {/* Collapsible Student Hint Area */}
          <div className="mt-2.5 flex flex-col items-center">
            {question.hint && (
              <>
                {!showHint ? (
                  <button
                    onClick={() => setShowHint(true)}
                    className="tactile-btn flex items-center gap-1.5 text-xs font-black text-amber-300 bg-amber-950/70 hover:bg-amber-900/80 px-3.5 py-1 rounded-full border border-amber-400/50 shadow transition-all cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-yellow-300" />
                    <span>TAP FOR HINT</span>
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-xs sm:text-sm font-semibold text-amber-200 bg-black/85 border border-amber-400/60 px-4 py-2 rounded-xl shadow-inner mt-1 max-w-[420px]"
                  >
                    💡 {question.hint}
                  </motion.div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
