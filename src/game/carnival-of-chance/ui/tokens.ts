// ============================================================
// THE GREAT CARNIVAL OF CHANCE — Neo-Brutalist Design Tokens
// Strict Theme Variables for Colors, Borders, Shadows & Layout
// Designed specifically for 1920x1080 Classroom Touchscreen TVs
// ============================================================

import { ActivityId } from '../types';

export const CARNIVAL_THEME = {
  colors: {
    ink: '#111111',
    cream: '#FFF8E7',
    creamLight: '#FFFDF6',
    yellow: '#FFC928',
    yellowLight: '#FFE380',
    yellowDark: '#E0A800',
    red: '#E53935',
    redDark: '#B71C1C',
    redLight: '#FEE2E2',
    blue: '#2463EB',
    blueDark: '#1D4ED8',
    blueLight: '#DBEAFE',
    green: '#2E9B57',
    greenDark: '#1E6B3B',
    greenLight: '#DCFCE7',
    orange: '#F47C20',
    muted: '#E9E2D3',
    white: '#FFFFFF',
    navy: '#0F172A',
  },
  borders: {
    thin: 'border-2 border-[#111111]',
    standard: 'border-3 border-[#111111]',
    thick: 'border-4 border-[#111111]',
    heavy: 'border-[5px] border-[#111111]',
  },
  shadows: {
    sm: 'shadow-[3px_3px_0px_#111111]',
    md: 'shadow-[5px_5px_0px_#111111]',
    lg: 'shadow-[8px_8px_0px_#111111]',
    xl: 'shadow-[10px_10px_0px_#111111]',
    pressed: 'shadow-[1px_1px_0px_#111111]',
  },
  pressPhysics: 'transition-transform duration-75 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#111111]',
  pressPhysicsLg: 'transition-transform duration-75 active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0px_#111111]',
  layout: {
    hudHeight: 96,
    consoleWidth: 340,
    consoleTop: 104,
    consoleBottom: 20,
    minTouchTarget: 64,
    primaryButtonHeight: 72,
  },
  activityAccents: {
    'odds-wheel': {
      primary: '#FFC928',
      secondary: '#E53935',
      accent: '#2463EB',
      name: 'THE ODDS WHEEL',
      subtitle: 'PROBABILITY SPINNER',
      tagline: 'SPIN • PREDICT • DISCOVER',
      instruction: 'SELECT THEORETICAL ODDS → LOCK PREDICTION → SPIN THE WHEEL → OBSERVE SECTOR',
    },
    'mystery-bag': {
      primary: '#E53935',
      secondary: '#FFF8E7',
      accent: '#FFC928',
      name: 'MYSTERY CHESTS',
      subtitle: '3D MINECRAFT CHEST DRAW',
      tagline: 'DRAW • CALCULATE • OBSERVE',
      instruction: 'Answer correctly and find the ball from correct box',
    },
    'ball-drop': {
      primary: '#2463EB',
      secondary: '#FFC928',
      accent: '#2E9B57',
      name: 'THE HIGH STRIKER',
      subtitle: 'HAMMER BELL TOWER',
      tagline: 'SWING • POWER • RING THE BELL',
      instruction: 'Answer correctly and slam the sledgehammer to ring the top bell!',
    },
    'probability-lab': {
      primary: '#FFF8E7',
      secondary: '#2463EB',
      accent: '#F47C20',
      name: 'PROBABILITY EXPERIMENT LAB',
      subtitle: 'CENTRIFUGE & COMPOUND RATIOS',
      tagline: 'REACTORS • CATALYST • LASERS',
      instruction: 'Answer correctly to ignite the plasma reactor and forge the catalyst!',
    },
    'game-builder': {
      primary: '#E53935',
      secondary: '#FFC928',
      accent: '#111111',
      name: 'CARNIVAL GAME BUILDER',
      subtitle: 'FAIR GAME WORKSHOP',
      tagline: 'DESIGN • BALANCE • FAIR ODDS',
      instruction: 'ASSEMBLE SLOTS → VERIFY EQUAL CHANCE → TEST BALANCE SIMULATION',
    },
    'grand-carnival': {
      primary: '#FFC928',
      secondary: '#E53935',
      accent: '#2463EB',
      name: 'GRAND CARNIVAL ARENA',
      subtitle: 'CHAMPIONSHIP PRIZE VAULT',
      tagline: 'VAULT • COMPLEX ODDS • TROPHY',
      instruction: 'Answer correctly to unlock the Championship Prize Vault and claim the tokens!',
    },
    hub: {
      primary: '#FFC928',
      secondary: '#E53935',
      accent: '#2463EB',
      name: 'CARNIVAL ISLAND',
      subtitle: 'GRADE 6 PROBABILITY ARCADE',
      tagline: 'CHOOSE AN ATTRACTION TO ENTER',
      instruction: 'TOUCH ANY 3D ATTRACTION BUILDING ON THE ISLAND TO BEGIN',
    },
  } as Record<ActivityId, {
    primary: string;
    secondary: string;
    accent: string;
    name: string;
    subtitle: string;
    tagline: string;
    instruction: string;
  }>,
};
