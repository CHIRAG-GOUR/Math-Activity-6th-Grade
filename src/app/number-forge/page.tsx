import { NumberForgeGame } from '@/game/number-forge/components/NumberForgeGame';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Number Forge | Grade 6 Place Value & Rounding | Skillizee Arcade',
  description: 'Interactive 3D mathematical workshop for Grade 6 Place Value and Rounding.',
};

export default function NumberForgePage() {
  return <NumberForgeGame />;
}
