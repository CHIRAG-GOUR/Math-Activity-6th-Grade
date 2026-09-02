import { ArcadeHubDashboard } from '@/components/ArcadeHubDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Skillizee Arcade Hub | Club Learning Activities & Games',
  description: 'Interactive classroom arcade learning stations and head-to-head educational duels.',
};

export default function HomePage() {
  return <ArcadeHubDashboard />;
}
