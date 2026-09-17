// ============================================================
// PERCENTAGE HARVEST — MATHEMATICAL ENGINE & CROP CATALOG
// Grade 6 Percentage Calculation, Conversions & Agriculture Logic
// ============================================================

import { CropConfig, CropType } from '../types';

export const CROP_CATALOG: Record<CropType, CropConfig> = {
  wheat: {
    id: 'wheat',
    name: 'Golden Amber Wheat',
    color: '#eab308',
    fieldColor: '#ca8a04',
    matureColor: '#fef08a',
    yieldPerHa: 25, // 25 kg per hectare scale factor
    basePricePerKg: 30, // ₹30/kg
    icon: '🌾',
    unit: 'kg',
    description: 'High-protein grain for flour mills and bakeries',
  },
  corn: {
    id: 'corn',
    name: 'Sweet Sunburst Corn',
    color: '#84cc16',
    fieldColor: '#4d7c0f',
    matureColor: '#facc15',
    yieldPerHa: 35,
    basePricePerKg: 24, // ₹24/kg
    icon: '🌽',
    unit: 'kg',
    description: 'Tall golden stalks harvested for food and silage',
  },
  tomatoes: {
    id: 'tomatoes',
    name: 'Ruby Ripe Tomatoes',
    color: '#ef4444',
    fieldColor: '#15803d',
    matureColor: '#dc2626',
    yieldPerHa: 40,
    basePricePerKg: 45, // ₹45/kg
    icon: '🍅',
    unit: 'kg',
    description: 'Juicy greenhouse & field vine tomatoes for city markets',
  },
  vegetables: {
    id: 'vegetables',
    name: 'Fresh Garden Greens',
    color: '#10b981',
    fieldColor: '#166534',
    matureColor: '#34d399',
    yieldPerHa: 30,
    basePricePerKg: 38, // ₹38/kg
    icon: '🥦',
    unit: 'kg',
    description: 'Crisp lettuce, carrots, and cabbage row crops',
  },
  sunflowers: {
    id: 'sunflowers',
    name: 'Helios Sunflowers',
    color: '#f59e0b',
    fieldColor: '#a16207',
    matureColor: '#fbbf24',
    yieldPerHa: 20,
    basePricePerKg: 65, // ₹65/kg (oil seeds)
    icon: '🌻',
    unit: 'kg',
    description: 'Tall oilseed flowers following the sun',
  },
  cotton: {
    id: 'cotton',
    name: 'Silver Cloud Cotton',
    color: '#f8fafc',
    fieldColor: '#334155',
    matureColor: '#ffffff',
    yieldPerHa: 18,
    basePricePerKg: 80, // ₹80/kg
    icon: '☁️',
    unit: 'kg',
    description: 'Pure white fiber harvested for regional textile looms',
  },
};

/** Formats money in Indian Rupee format e.g. ₹15,400 */
export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount);
  return '₹' + rounded.toLocaleString('en-IN');
}

/** Formats standard weight cleanly in kg */
export function formatWeight(kg: number): string {
  const rounded = Math.round(kg);
  return `${rounded.toLocaleString('en-IN')} kg`;
}

/** Calculates percentage of a quantity: (P / 100) * Q */
export function calcPercentOfQuantity(percent: number, quantity: number): number {
  return (percent / 100) * quantity;
}

/** Calculates what percent A is of B: (A / B) * 100 */
export function calcPercentageOfWhole(part: number, total: number): number {
  if (total <= 0) return 0;
  return (part / total) * 100;
}

/** Calculates quantity after percentage increase */
export function calcPercentIncrease(base: number, percentIncrease: number): number {
  return base * (1 + percentIncrease / 100);
}

/** Calculates quantity after percentage decrease */
export function calcPercentDecrease(base: number, percentDecrease: number): number {
  return base * (1 - percentDecrease / 100);
}

/** Finds the whole quantity given the part and its percentage: Part / (P / 100) */
export function findWholeFromPercentage(part: number, percent: number): number {
  if (percent <= 0) return 0;
  return part / (percent / 100);
}

/** Reduce a fraction to lowest terms */
export function simplifyFraction(numerator: number, denominator: number): [number, number] {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = Math.abs(gcd(numerator, denominator));
  return [numerator / divisor, denominator / divisor];
}

/** Converts a percentage to simplified fraction string e.g. 25% -> "1/4" */
export function percentToFractionStr(percent: number): string {
  const [num, den] = simplifyFraction(Math.round(percent * 10), 1000);
  return `${num}/${den}`;
}

/** Converts a percentage to decimal string e.g. 35% -> "0.35" */
export function percentToDecimalStr(percent: number): string {
  return (percent / 100).toFixed(2).replace(/\.?0+$/, '');
}
