import { NumberRailwayGame } from '@/game/number-railway/components/NumberRailwayGame';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Great Number Railway | Grade 6 Place Value & Rounding | Skillizee Arcade',
  description: 'Two-team 3D railway operations game. Use place value and rounding to route trains, operate switches, and restore the railway network.',
};

export default function NumberRailwayPage() {
  return <NumberRailwayGame />;
}
