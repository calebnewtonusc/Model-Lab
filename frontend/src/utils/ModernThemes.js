/**
 * Modern Design System - Enhanced Themes for ModelLab
 * Glassmorphism, gradients, and modern visual effects
 */

// Modern color palettes with extended variants - Dark Purple/Blue ML aesthetic
const colorPalettes = {
  // Primary gradient palette (Violet/Purple - ML aesthetic)
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',  // Main violet
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
    gradientHover: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 50%, #7c3aed 100%)',
  },

  // Secondary gradient palette (Indigo/Blue)
  secondary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)',
  },

  // Accent gradient palette (Blue/Cyan)
  accent: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)',
  },
};

// Glassmorphism styles
const glass = {
  light: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  },

  medium: {
    background: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(16px) saturate(180%)',
    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },

  heavy: {
    background: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(12px) saturate(180%)',
    WebkitBackdropFilter: 'blur(12px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.16)',
  },

  dark: {
    light: {
      background: 'rgba(23, 23, 33, 0.7)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.24)',
    },

    medium: {
      background: 'rgba(23, 23, 33, 0.5)',
      backdropFilter: 'blur(16px) saturate(180%)',
      WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.32)',
    },

    heavy: {
      background: 'rgba(23, 23, 33, 0.3)',
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    },
  },
};

// Enhanced elevation system
const elevation = {
  xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
  md: '0 4px 6px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.08)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.12), 0 10px 10px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px rgba(0, 0, 0, 0.16), 0 15px 25px rgba(0, 0, 0, 0.08)',
  '3xl': '0 35px 60px rgba(0, 0, 0, 0.20), 0 20px 30px rgba(0, 0, 0, 0.12)',

  // Colored shadows for emphasis
  primaryGlow: '0 0 30px rgba(16, 185, 129, 0.3), 0 10px 25px rgba(16, 185, 129, 0.2)',
  secondaryGlow: '0 0 30px rgba(168, 85, 247, 0.3), 0 10px 25px rgba(168, 85, 247, 0.2)',
  accentGlow: '0 0 30px rgba(34, 211, 238, 0.3), 0 10px 25px (34, 211, 238, 0.2)',

  // Inner shadows
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.08)',
  innerLg: 'inset 0 4px 8px rgba(0, 0, 0, 0.12)',
};

// Modern typography scale
const typography = {
  fontFamily: {
    primary: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif",
    sans: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif",
    mono: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", "Dank Mono", "Consolas", monospace',
    display: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
  },

  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
    '8xl': '6rem',      // 96px
    '9xl': '8rem',      // 128px
  },

  fontWeight: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// Enhanced animation system
const animations = {
  // Durations
  duration: {
    instant: '75ms',
    fast: '150ms',
    base: '250ms',
    moderate: '350ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms',
  },

  // Easing functions
  easing: {
    linear: 'cubic-bezier(0, 0, 1, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    bounce: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
    elastic: 'cubic-bezier(0.68, -0.8, 0.265, 2)',
  },

  // Keyframes
  keyframes: {
    fadeIn: `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `,

    slideInUp: `
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,

    slideInDown: `
      @keyframes slideInDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,

    scaleIn: `
      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `,

    shimmer: `
      @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
      }
    `,

    pulse: `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `,

    spin: `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `,

    bounce: `
      @keyframes bounce {
        0%, 100% {
          transform: translateY(-25%);
          animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
        }
        50% {
          transform: translateY(0);
          animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
        }
      }
    `,

    float: `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
    `,

    gradientShift: `
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `,
  },

  // Animation references (use these in styled components)
  animation: {
    fadeIn: 'fadeIn',
    slideUp: 'slideInUp',
    slideDown: 'slideInDown',
    scaleIn: 'scaleIn',
    shimmer: 'shimmer',
    pulse: 'pulse',
    spin: 'spin',
    bounce: 'bounce',
    float: 'float',
    gradientShift: 'gradientShift',
  },
};

// Spacing system (8px grid)
const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
};

// Border radius system
const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
};

// Modern dark theme - Deep Purple/Blue ML aesthetic
export const modernDarkTheme = {
  // Brand colors
  ...colorPalettes,

  // Background layers - deep dark blue/purple
  bg: '#080812',
  bgLight: '#0e0e1e',
  bgElevated: '#13132a',
  bgOverlay: 'rgba(8, 8, 18, 0.95)',

  // Card variants
  card: '#0f0f22',
  cardLight: '#181830',
  cardElevated: '#1e1e3a',
  cardHover: '#252548',

  // Text hierarchy
  text_primary: '#f0efff',
  text_secondary: '#a8a0cc',
  text_tertiary: '#6b6490',
  text_disabled: '#3d3860',
  text_inverse: '#080812',

  // Border colors
  border: '#1e1a3a',
  borderLight: '#2a2550',
  borderMedium: '#38306a',
  borderStrong: '#504880',

  // Interactive states
  hover: 'rgba(139, 92, 246, 0.08)',
  hoverStrong: 'rgba(139, 92, 246, 0.14)',
  active: 'rgba(139, 92, 246, 0.2)',
  focus: 'rgba(139, 92, 246, 0.28)',
  disabled: '#2a2550',

  // Semantic colors
  success: '#10b981',
  successLight: '#34d399',
  successDark: '#047857',
  error: '#ef4444',
  errorLight: '#f87171',
  errorDark: '#dc2626',
  warning: '#f59e0b',
  warningLight: '#fbbf24',
  warningDark: '#d97706',
  info: '#3b82f6',
  infoLight: '#60a5fa',
  infoDark: '#2563eb',

  // Glassmorphism - purple tinted
  glass: {
    light: {
      background: 'rgba(15, 12, 40, 0.7)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(139, 92, 246, 0.15)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    },
    medium: {
      background: 'rgba(15, 12, 40, 0.5)',
      backdropFilter: 'blur(16px) saturate(180%)',
      WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      border: '1px solid rgba(139, 92, 246, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    },
    heavy: {
      background: 'rgba(15, 12, 40, 0.3)',
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      border: '1px solid rgba(139, 92, 246, 0.08)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
    },
  },

  // Backdrop effects
  backdropBlur: 'blur(12px)',

  // Elevation - purple-tinted shadows
  elevation: {
    ...elevation,
    primaryGlow: '0 0 30px rgba(139, 92, 246, 0.3), 0 10px 25px rgba(139, 92, 246, 0.2)',
    secondaryGlow: '0 0 30px rgba(99, 102, 241, 0.3), 0 10px 25px rgba(99, 102, 241, 0.2)',
    accentGlow: '0 0 30px rgba(59, 130, 246, 0.3), 0 10px 25px rgba(59, 130, 246, 0.2)',
  },

  // Transitions
  transition: {
    fast: '0.15s ease',
    base: '0.3s ease',
    slow: '0.5s ease',
  },

  // Easing functions
  easing: {
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Typography (spread to root for easy access)
  ...typography,

  // Animations
  ...animations,

  // Spacing
  spacing,

  // Border radius
  borderRadius,
};

// Modern light theme — Apple-inspired design system
export const modernLightTheme = {
  // Brand colors
  ...colorPalettes,

  // Background layers — iOS system palette
  bg: '#f2f2f7',
  bgLight: '#f2f2f7',
  bgElevated: '#ffffff',
  bgOverlay: 'rgba(242, 242, 247, 0.95)',

  // Card variants
  bg_card: '#ffffff',
  bg_secondary: '#ffffff',
  card: '#ffffff',
  cardLight: '#ffffff',
  cardElevated: '#ffffff',
  cardHover: '#f2f2f7',

  // Text hierarchy — Apple HIG colors
  text_primary: '#1c1c1e',
  text_secondary: '#3a3a3c',
  text_muted: '#8e8e93',
  text_tertiary: '#8e8e93',
  text_disabled: '#c7c7cc',
  text_inverse: '#ffffff',

  // Accent — indigo/violet ML identity
  primary: '#6366f1',

  // Border colors — Apple separator
  border: 'rgba(60, 60, 67, 0.12)',
  borderLight: 'rgba(60, 60, 67, 0.08)',
  borderMedium: 'rgba(60, 60, 67, 0.18)',
  borderStrong: 'rgba(60, 60, 67, 0.29)',

  // Interactive states
  hover: 'rgba(60, 60, 67, 0.04)',
  hoverStrong: 'rgba(99, 102, 241, 0.08)',
  active: 'rgba(99, 102, 241, 0.14)',
  focus: 'rgba(99, 102, 241, 0.24)',
  disabled: '#e5e5ea',

  // Semantic colors
  success: '#34c759',
  successLight: '#30d158',
  successDark: '#248a3d',
  error: '#ff3b30',
  errorLight: '#ff6961',
  errorDark: '#c0392b',
  warning: '#ff9500',
  warningLight: '#ffcc00',
  warningDark: '#c0720a',
  info: '#007aff',
  infoLight: '#409cff',
  infoDark: '#0055b3',

  // Glassmorphism — adapted for light mode (white frosted glass)
  glass: {
    light: {
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(20px) saturate(1.8)',
      WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
      border: '0.5px solid rgba(60, 60, 67, 0.18)',
      boxShadow: '0 1px 6px rgba(0, 0, 0, 0.07)',
    },
    medium: {
      background: 'rgba(242, 242, 247, 0.85)',
      backdropFilter: 'blur(20px) saturate(1.8)',
      WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
      border: '0.5px solid rgba(60, 60, 67, 0.18)',
      boxShadow: '0 1px 6px rgba(0, 0, 0, 0.07)',
    },
    heavy: {
      background: 'rgba(242, 242, 247, 0.72)',
      backdropFilter: 'blur(16px) saturate(1.6)',
      WebkitBackdropFilter: 'blur(16px) saturate(1.6)',
      border: '0.5px solid rgba(60, 60, 67, 0.14)',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
    },
  },

  // Backdrop effects
  backdropBlur: 'blur(20px)',

  // Elevation — Apple-style subtle shadows
  elevation: {
    ...elevation,
    xs: '0 1px 3px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 6px rgba(0, 0, 0, 0.07)',
    md: '0 2px 12px rgba(0, 0, 0, 0.08)',
    lg: '0 4px 24px rgba(0, 0, 0, 0.10)',
    xl: '0 8px 40px rgba(0, 0, 0, 0.12)',
    primaryGlow: '0 0 20px rgba(99, 102, 241, 0.20), 0 4px 16px rgba(99, 102, 241, 0.15)',
    secondaryGlow: '0 0 20px rgba(139, 92, 246, 0.20), 0 4px 16px rgba(139, 92, 246, 0.15)',
    accentGlow: '0 0 20px rgba(59, 130, 246, 0.20), 0 4px 16px rgba(59, 130, 246, 0.15)',
  },

  // Transitions
  transition: {
    fast: '0.15s ease',
    base: '0.25s ease',
    slow: '0.4s ease',
  },

  // Easing functions
  easing: {
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Typography (spread to root for easy access)
  ...typography,

  // Animations
  ...animations,

  // Spacing
  spacing,

  // Border radius
  borderRadius,
};
