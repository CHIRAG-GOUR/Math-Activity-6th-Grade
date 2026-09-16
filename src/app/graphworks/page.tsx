import { Metadata } from 'next';
import { GraphworksGame } from '@/game/graphworks/ui/GraphworksGame';

export const metadata: Metadata = {
  title: 'Graphworks — The Data City | Grade 6 Graphs | Skillizee Arcade',
  description: 'Two-team arcade game: build graphs, power a living 3D city, interpret data, and compete across 6 city districts.',
};

export default function GraphworksPage() {
  return <GraphworksGame />;
}
