// ============================================================
// THE DECIMAL DELIVERY NETWORK — SCREEN LAYOUT METRICS
//
// One function decides where each team's station window sits on screen. The
// 3D renderer draws the close-up cameras into exactly these rectangles and the
// HTML frames are positioned from the same numbers, so the border and the
// picture can never drift apart.
//
// Consoles occupy the left and right rails (Blue left, Red right). The station
// windows sit side by side across the top of the centre band — each above its
// own team's console — leaving the lower centre for the live depot overview.
// ============================================================

export interface Rect { x: number; y: number; w: number; h: number }

export interface ScreenLayout {
  /** Width of each side console rail, including its padding. */
  rail: number;
  blue: Rect;
  red: Rect;
  /** The unobstructed part of the centre band below the station windows. */
  free: Rect;
}

const GAP = 10;

export function screenLayout(width: number, height: number): ScreenLayout {
  // Mirrors the console classes: w-[22rem] xl:w-[25rem] max-w-[30vw], p-2 xl:p-3.
  const wide = width >= 1280;
  const consoleW = Math.min(wide ? 400 : 352, width * 0.3);
  const rail = consoleW + (wide ? 24 : 16);

  const bandX = rail;
  const bandW = Math.max(200, width - rail * 2);

  const winW = (bandW - GAP * 3) / 2;
  const winH = Math.min(height * 0.42, winW * 0.66);

  return {
    rail,
    blue: { x: bandX + GAP, y: GAP, w: winW, h: winH },
    red: { x: bandX + GAP * 2 + winW, y: GAP, w: winW, h: winH },
    free: { x: bandX, y: winH + GAP * 2, w: bandW, h: Math.max(100, height - winH - GAP * 2) },
  };
}
