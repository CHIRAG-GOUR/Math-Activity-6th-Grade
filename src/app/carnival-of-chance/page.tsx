import { CarnivalGame } from '@/game/carnival-of-chance/components/CarnivalGame';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Great Carnival of Chance | Grade 6 Probability | Skillizee Arcade',
  description: 'Two-team 3D carnival island game. Explore physical probability machines, run live experiments, and master chance on a classroom touchscreen.',
};

export default function CarnivalOfChancePage() {
  return <CarnivalGame />;
}
