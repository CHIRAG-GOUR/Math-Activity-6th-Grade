import { PercentageHarvestGame } from '@/game/percentage-harvest/ui/PercentageHarvestGame';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Percentage Harvest — The Smart Farm | Grade 6 Mathematics Arcade Machine 11',
  description:
    'Two rival farms compete side by side: calculate percentages, sow golden crops, harvest with tractors, weigh yields, and sell at the market for maximum farm revenue.',
};

export default function PercentageHarvestPage() {
  return <PercentageHarvestGame />;
}
