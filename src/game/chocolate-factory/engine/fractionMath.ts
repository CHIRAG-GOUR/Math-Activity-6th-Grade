// ============================================================
// THE CHOCOLATE FACTORY — FRACTION ARITHMETIC
//
// Every fraction stays an exact { num, den } ratio until the moment it is
// displayed or turned into a physical quantity. Nothing here ever rounds a
// fraction to guess an answer — nothing is validated by comparing floats.
// ============================================================

import type { Fraction } from '../types';

export const frac = (num: number, den: number): Fraction => ({ num, den });

export function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

export function simplify(f: Fraction): Fraction {
  const g = gcd(f.num, f.den);
  return { num: f.num / g, den: f.den / g };
}

export function toDecimal(f: Fraction): number {
  return f.num / f.den;
}

export function equalsValue(a: Fraction, b: Fraction): boolean {
  // Cross-multiply, so this is exact for any pair of integer fractions.
  return a.num * b.den === b.num * a.den;
}

export function add(a: Fraction, b: Fraction): Fraction {
  return simplify(frac(a.num * b.den + b.num * a.den, a.den * b.den));
}
export function subtract(a: Fraction, b: Fraction): Fraction {
  return simplify(frac(a.num * b.den - b.num * a.den, a.den * b.den));
}
export function multiply(a: Fraction, b: Fraction): Fraction {
  return simplify(frac(a.num * b.num, a.den * b.den));
}
export function compare(a: Fraction, b: Fraction): -1 | 0 | 1 {
  const l = a.num * b.den, r = b.num * a.den;
  return l === r ? 0 : l < r ? -1 : 1;
}

/** Least common denominator two given fractions can share. */
export function lcd(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

/** Formats a fraction for display: whole numbers, mixed numbers, or "n/d". */
export function formatFraction(f: Fraction): string {
  const s = simplify(f);
  if (s.den === 1) return `${s.num}`;
  if (Math.abs(s.num) > s.den) {
    const whole = Math.trunc(s.num / s.den);
    const rem = Math.abs(s.num - whole * s.den);
    return rem === 0 ? `${whole}` : `${whole} ${rem}/${s.den}`;
  }
  return `${s.num}/${s.den}`;
}

/** How much of ONE BATCH this fraction represents, and how many whole batches on top. */
export function batchesOf(f: Fraction): { wholeBatches: number; partial: Fraction } {
  const s = simplify(f);
  const whole = Math.floor(s.num / s.den);
  const remNum = s.num - whole * s.den;
  return { wholeBatches: whole, partial: remNum === 0 ? frac(0, 1) : frac(remNum, s.den) };
}
