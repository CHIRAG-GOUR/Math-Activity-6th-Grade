import { Metadata } from 'next';
import { BlueprintBlitzGame } from '@/game/blueprint-blitz/BlueprintBlitzGame';

export const metadata: Metadata = {
  title: 'Blueprint Blitz | Grade 6 Shapes, Area & Volume | Skillizee Arcade',
  description:
    'Two-team 3D construction math arcade game. Manipulate floor dimensions, stack 3D unit cubes, operate cranes, and pass precision measurement scanners.',
};

export default function BlueprintBlitzPage() {
  return <BlueprintBlitzGame />;
}
