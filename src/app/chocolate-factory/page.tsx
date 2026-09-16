import { ChocolateFactoryGame } from '@/game/chocolate-factory/ui/ChocolateFactoryGame';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Chocolate Factory | Grade 6 Fractions Production Challenge',
  description:
    'Two rival chocolate factories run side by side: every fraction a team applies sets the real amount of chocolate the line mixes, molds, packs and delivers to its customers.',
};

export default function ChocolateFactoryPage() {
  return <ChocolateFactoryGame />;
}
