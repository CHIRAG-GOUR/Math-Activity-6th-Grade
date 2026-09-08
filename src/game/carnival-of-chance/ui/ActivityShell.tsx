// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Activity Shell Orchestrator
// Coordinates the Two-Team Operator Consoles, Step Guidance,
// Reasoning Feedback Modals, and 3D Machine Central Viewport
// ============================================================

'use client';

import React from 'react';
import { useCarnivalStore } from '../store/carnivalStore';
import { TwoTeamLayout } from './TwoTeamLayout';
import { ActivityStatus } from './ActivityStatus';
import { FeedbackBanner } from './FeedbackBanner';

export const ActivityShell: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const activeActivity = useCarnivalStore((s) => s.activeActivity);

  if (activeActivity === 'hub') return null;

  return (
    <>
      {/* ── Strict Two-Team Operator Consoles & Center Overlay ── */}
      <TwoTeamLayout>
        {/* Step Guidance Marquee Banner at bottom center */}
        <div className="w-full flex justify-center mt-auto">
          <ActivityStatus />
        </div>
      </TwoTeamLayout>

      {/* ── Observation, Reasoning & Flow Modals ── */}
      <FeedbackBanner />
    </>
  );
};
