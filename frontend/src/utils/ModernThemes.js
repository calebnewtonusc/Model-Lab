/**
 * Modern Design System - Enhanced Themes for ModelLab
 * Glassmorphism, gradients, and modern visual effects
 */

// Modern color palettes with extended variants
export const colorPalettes = {
  // Primary gradient palette (Emerald/Teal)
  primary: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',  // Main
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
    gradientHover: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)',
  },

  // Secondary gradient palette (Purple/Pink)
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #7e22ce 100%)',
  },

  // Accent gradient palette (Blue/Cyan)
  accent: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
    gradient: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 50%, #0891b2 100%)',
  },
};

// Glassmorphism styles
export const glass = {
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
export const elevation = {
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
export const typography = {
  fontFamily: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "SF Pro Display", Roboto, "Helvetica Neue", Arial, sans-serif',
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "SF Pro Display", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", "Dank Mono", "Consolas", monospace',
    display: '"Inter", -apple-system, system-ui, sans-serif',
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
export const animations = {
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
export const spacing = {
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
export const borderRadius = {
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

// Modern dark theme
export const modernDarkTheme = {
  // Brand colors
  ...colorPalettes,

  // Background layers
  bg: '#0a0a0f',
  bgLight: '#13131a',
  bgElevated: '#1a1a24',
  bgOverlay: 'rgba(10, 10, 15, 0.95)',

  // Card variants
  card: '#171721',
  cardLight: '#1f1f2e',
  cardElevated: '#252532',
  cardHover: '#2a2a3a',

  // Text hierarchy
  text_primary: '#ffffff',
  text_secondary: '#b4b4c8',
  text_tertiary: '#808090',
  text_disabled: '#545461',
  text_inverse: '#0a0a0f',

  // Border colors
  border: '#2a2a38',
  borderLight: '#35354a',
  borderMedium: '#40405c',
  borderStrong: '#50506e',

  // Interactive states
  hover: 'rgba(255, 255, 255, 0.08)',
  hoverStrong: 'rgba(255, 255, 255, 0.12)',
  active: 'rgba(255, 255, 255, 0.16)',
  focus: 'rgba(16, 185, 129, 0.24)',
  disabled: '#35354a',

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

  // Glassmorphism
  glass: glass.dark,

  // Backdrop effects
  backdropBlur: 'blur(12px)',

  // Elevation
  elevation,

  // Transitions
  transition: {
    fast: '0.15s ease',
    base: '0.3s ease',
    slow: '0.5s ease',
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

// Modern light theme
export const modernLightTheme = {
  // Brand colors
  ...colorPalettes,

  // Background layers
  bg: '#ffffff',
  bgLight: '#fafafa',
  bgElevated: '#f5f5f7',
  bgOverlay: 'rgba(255, 255, 255, 0.95)',

  // Card variants
  card: '#ffffff',
  cardLight: '#f9fafb',
  cardElevated: '#f3f4f6',
  cardHover: '#e5e7eb',

  // Text hierarchy
  text_primary: '#0a0a0f',
  text_secondary: '#4b5563',
  text_tertiary: '#9ca3af',
  text_disabled: '#d1d5db',
  text_inverse: '#ffffff',

  // Border colors
  border: '#e5e7eb',
  borderLight: '#d1d5db',
  borderMedium: '#9ca3af',
  borderStrong: '#6b7280',

  // Interactive states
  hover: 'rgba(0, 0, 0, 0.04)',
  hoverStrong: 'rgba(0, 0, 0, 0.08)',
  active: 'rgba(0, 0, 0, 0.12)',
  focus: 'rgba(16, 185, 129, 0.24)',
  disabled: '#e5e7eb',

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

  // Glassmorphism
  glass,

  // Backdrop effects
  backdropBlur: 'blur(12px)',

  // Elevation
  elevation,

  // Transitions
  transition: {
    fast: '0.15s ease',
    base: '0.3s ease',
    slow: '0.5s ease',
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

export default { modernDarkTheme, modernLightTheme };
