// ============================================================
// SKILLIZEE ARCADE — Targeted Mathematical Misconception Engine
// Grade 6 Curriculum Specific Pitfall Diagnostics:
// When students make an initial error (1st Attempt), provides
// a concise, actionable hint addressing the exact conceptual trap.
// ============================================================

export type MathTopicCategory =
  | 'fractions'
  | 'integers'
  | 'probability'
  | 'geometry'
  | 'algebra'
  | 'numbers'
  | 'mixed'
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'decimals'
  | 'general'
  | (string & {});

const MISCONCEPTION_HINTS: Record<string, string[]> = {
  addition: [
    '💡 Addition Check: Double check your carry-overs in the tens and hundreds columns.',
    '💡 Mental Math: Break numbers into tens and ones (e.g. 48 + 35 = 40 + 30 + 8 + 5).',
  ],
  subtraction: [
    '💡 Subtraction Check: Remember to borrow correctly from the next column to the left.',
    '💡 Inverse Check: Add your answer back to the subtracted number to verify.',
  ],
  multiplication: [
    '💡 Multiplication Check: Remember to add a placeholder zero when multiplying by tens digits.',
    '💡 Factor Breakdown: 6 × 14 = (6 × 10) + (6 × 4) = 60 + 24 = 84.',
  ],
  division: [
    '💡 Division Check: Remember: Divide, Multiply, Subtract, Bring Down.',
    '💡 Remainder Tip: The remainder must always be strictly less than the divisor.',
  ],
  decimals: [
    '💡 Decimal Alignment: Always align the decimal points vertically before adding or subtracting.',
    '💡 Decimal Multiplication: Count total decimal places in both factors to place the decimal in the product.',
  ],
  numbers: [
    '💡 Number Pattern: Look at the step difference between adjacent numbers in the sequence.',
    '💡 Multiples & Factors: Remember that factors divide evenly into a number without a remainder.',
    '💡 Prime vs Composite: Prime numbers have exactly two factors (1 and itself). 1 is neither prime nor composite!',
  ],
  mixed: [
    '💡 Mixed Operations: Follow order of operations (PEMDAS/BODMAS) — Brackets, Powers, Multiply/Divide, Add/Subtract.',
    '💡 Problem Solving: Identify the key given information and the target variable before calculating.',
  ],
  fractions: [

    '💡 Fraction Trap: Remember to find a Common Denominator before adding or subtracting fractions!',
    '💡 Proportion Check: When converting a fraction to percentage, multiply the decimal value by 100.',
    '💡 Simplification Hint: Divide both numerator and denominator by their Greatest Common Divisor (GCD).',
    '💡 Mixed Number Tip: Multiply denominator by whole number and add numerator to convert to improper fraction.',
  ],
  integers: [
    '💡 Signs Rule: Subtracting a negative number is mathematically identical to adding a positive number (-(-x) = +x)!',
    '💡 Direction Hint: Moving left on the number line decreases value; moving right increases value.',
    '💡 Absolute Value: Distance from zero is always positive. When adding opposite signs, find the difference of absolute values.',
    '💡 Coordinate Quadrants: In (x, y), x measures horizontal step (left/right) and y measures vertical step (up/down).',
  ],
  probability: [
    '💡 Probability Formula: Probability = (Favorable Target Outcomes) ÷ (Total Possible Outcomes).',
    '💡 Complementary Rule: P(NOT event) = 1 - P(event). Total probability always sums to 1.0 (or 100%)!',
    '💡 Sample Space: Ensure you have counted ALL items in the container, not just the opposing colors.',
    '💡 Fair Spinner: Sector probability is directly proportional to its angle fraction over 360°.',
  ],
  geometry: [
    '💡 2D vs 3D: Area is 2D (Length × Width), while Volume is 3D (Length × Width × Height)!',
    '💡 Unit Cubes Hint: Count how many full unit cube layers make up the 3D prism.',
    '💡 Perimeter vs Area: Perimeter is the boundary distance around the edge, Area is the inside surface.',
    '💡 Missing Dimension: If Area = 24 and Length = 6, then Width = Area ÷ Length = 4.',
  ],
  algebra: [
    '💡 Golden Rule of Equations: Whatever arithmetic operation you perform on the left side, do the EXACT same on the right side!',
    '💡 Substitution Check: Replace the variable with the number and verify if both sides evaluate to the exact same value.',
    '💡 Inverse Operations: To undo addition use subtraction; to undo multiplication use division.',
    '💡 Two-Step Order: First undo addition or subtraction, then undo multiplication or division to isolate the variable.',
  ],
  general: [
    '💡 Calculation Check: Re-read the question carefully and check the arithmetic steps.',
    '💡 Estimation Tip: Estimate the magnitude of the answer first to eliminate impossible distractors.',
  ],
};

/**
 * Returns a targeted misconception hint based on topic category and attempt context.
 */
export function getMisconceptionHint(topic: MathTopicCategory, promptText?: string): string {
  const hints = MISCONCEPTION_HINTS[topic] || MISCONCEPTION_HINTS.general;
  
  if (promptText) {
    const lower = promptText.toLowerCase();
    if (lower.includes('not') || lower.includes('complement')) {
      return '💡 Complementary Rule: P(NOT event) = 1 - P(event). Subtract favorable outcomes from total!';
    }
    if (lower.includes('volume') || lower.includes('cube') || lower.includes('height')) {
      return '💡 Volume Formula: Multiply Length × Width × Height to get total 3D unit cubes!';
    }
    if (lower.includes('area') || lower.includes('tile')) {
      return '💡 Area Formula: Multiply Length × Width for 2D surface tiles!';
    }
    if (lower.includes('fraction') || lower.includes('simplify')) {
      return '💡 Fraction Tip: Find a common divisor to simplify both numerator and denominator!';
    }
    if (lower.includes('negative') || lower.includes('minus') || lower.includes('-')) {
      return '💡 Integer Tip: Remember that subtracting a negative equals adding a positive (+)!';
    }
    if (lower.includes('x') || lower.includes('equation') || lower.includes('=')) {
      return '💡 Equation Balance: Apply the inverse operation to BOTH sides to isolate the variable!';
    }
  }

  // Deterministic rotation based on current minute or random index
  return hints[Math.floor(Math.random() * hints.length)];
}
