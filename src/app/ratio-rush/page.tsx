import { RatioRushGame } from '@/game/ratio-rush/ui/RatioRushGame';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ratio Rush — Movie Production House | Grade 6 Mathematics Arcade Machine 13',
  description:
    'Ratios, rates, proportions, and unit rates inside a complete 3D film studio complex. Two studio teams compete to build movie sets and produce a cinematic film.',
};

export default function RatioRushPage() {
  return <RatioRushGame />;
}
