import { MathEscapeVaultGame } from '@/components/MathEscapeVaultGame';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Math Escape Vault | Grade 6 Mental Math Heist | Skillizee Arcade',
  description: 'Head-to-head fast keypad math heist activity for Grade 6 classroom touchscreen and projectors.',
};

export default function MathVaultPage() {
  return <MathEscapeVaultGame />;
}
