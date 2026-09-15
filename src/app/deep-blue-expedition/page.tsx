import { Metadata } from 'next';
import { SolarForgeGame } from '@/game/solar-forge/ui/SolarForgeGame';

export const metadata: Metadata = {
  title: 'The Solar Forge | Grade 6 Angles & Constructions | Skillizee Arcade',
  description: 'Two-team solar engineering challenge: control giant heliostats, sundials, angles, and geometric constructions to power the Solar Forge.',
};

export default function DeepBlueExpeditionReplacementPage() {
  return <SolarForgeGame />;
}
