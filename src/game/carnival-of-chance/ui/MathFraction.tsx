// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Mathematical Fraction Component
// Crisp vertical numerator/denominator layout with percentage equivalence
// Visible & Readable from 10ft Classroom Distance on 1080p TV
// ============================================================

import React from 'react';
import { MathFraction } from '../types';

interface MathFractionProps {
  fraction: MathFraction;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showPercentage?: boolean;
  className?: string;
}

export const MathFractionDisplay: React.FC<MathFractionProps> = ({
  fraction,
  size = 'md',
  showPercentage = true,
  className = '',
}) => {
  const sizeStyles = {
    sm: { num: 'text-sm font-black', line: 'h-0.5 my-0.5', pct: 'text-xs' },
    md: { num: 'text-lg font-black', line: 'h-0.5 my-0.5', pct: 'text-sm' },
    lg: { num: 'text-2xl font-black', line: 'h-1 my-1', pct: 'text-base' },
    xl: { num: 'text-3xl font-black', line: 'h-1.5 my-1', pct: 'text-xl' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 font-mono select-none ${className}`}>
      {/* Stacked Fraction */}
      <div className="inline-flex flex-col items-center justify-center leading-none">
        <span className={`${sizeStyles.num} tracking-tight`}>
          {fraction.numerator}
        </span>
        <span className={`w-full ${sizeStyles.line} bg-current rounded-full`} />
        <span className={`${sizeStyles.num} tracking-tight`}>
          {fraction.denominator}
        </span>
      </div>

      {/* Percentage Equivalence */}
      {showPercentage && fraction.percentage && (
        <span className={`font-black tracking-tight ${sizeStyles.pct} font-sans opacity-95`}>
          = {fraction.percentage}
        </span>
      )}
    </div>
  );
};
