import { Metadata } from 'next';
import { EquationMissionControlGame } from '@/game/equation-mission-control/components/EquationMissionControlGame';

export const metadata: Metadata = {
  title: 'Equation Mission Control | Grade 6 Expressions, Formulae & Equations | Skillizee Arcade',
  description:
    'Two-team 3D aerospace space launch math arcade game. Prepare and launch a 3D spacecraft across 5 mission stages: Expression Assembly, Variable Loading, Equation Balancing, Flight Calibration, and Launch Arming.',
};

export default function EquationMissionControlPage() {
  return <EquationMissionControlGame />;
}
