// ============================================================
// EQUATION MISSION CONTROL — Red Mission Control Console
// Right-Side Mission Controller (Bravo Station)
// ============================================================

'use client';

import React from 'react';
import { TeamMissionConsole } from './TeamMissionConsole';

export const RedMissionConsole: React.FC = () => {
  return <TeamMissionConsole team="red" />;
};
