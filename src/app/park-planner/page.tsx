import { ParkPlannerGame } from '@/game/park-planner/ui/ParkPlannerGame';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Park Planner — The Four-Quadrant City Park | Grade 6 Mathematics Arcade Machine 12',
  description:
    'Design, position, move, reflect, and rotate real park structures on a 3D Cartesian coordinate plane simulation. Two teams compete in real-time park architecture.',
};

export default function ParkPlannerPage() {
  return <ParkPlannerGame />;
}
