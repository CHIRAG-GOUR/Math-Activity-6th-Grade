import { PatternRacersGame } from '@/game/pattern-racers/ui/PatternRacersGame';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pattern Racers | Grade 6 Sequence & Function Grand Prix',
  description: 'Head-to-head 3D mathematical racing and testing facility: manipulate sequence patterns, linear builders, and function machines to conquer the Grand Prix circuit.',
};

export default function PatternRacersPage() {
  return <PatternRacersGame />;
}
