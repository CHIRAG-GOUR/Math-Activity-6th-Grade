import type { Metadata, Viewport } from 'next';
import './globals.css';
import '../game/carnival-of-chance/carnival-comic.css';
import '../game/equation-mission-control/mission-control.css';

export const metadata: Metadata = {
  title: 'Math Vault | Interactive Classroom Math Heist',
  description: 'A thrilling two-team competitive mathematics classroom game for large touchscreens.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#357fca',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#eaf0f6] text-slate-900 overflow-hidden select-none font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
