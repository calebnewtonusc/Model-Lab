// Enhanced Design System with comprehensive design tokens

export const designTokens = {
  // Typography System
  fontFamily: {
    primary: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', 'Roboto', 'Helvetica Neue', sans-serif",
    mono: "'SF Mono', 'Monaco', 'Consolas', 'Courier New', monospace",
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
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Spacing System (8px base unit)
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },

  // Border Radius System
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    base: '0.5rem',  // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
    '2xl': '2rem',   // 32px
    full: '9999px',
  },

  // Elevation System (consistent shadows)
  elevation: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
    md: '0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08)',
    lg: '0 8px 16px 0 rgba(0, 0, 0, 0.15), 0 4px 8px 0 rgba(0, 0, 0, 0.1)',
    xl: '0 16px 32px 0 rgba(0, 0, 0, 0.2), 0 8px 16px 0 rgba(0, 0, 0, 0.15)',
    '2xl': '0 24px 48px 0 rgba(0, 0, 0, 0.25), 0 12px 24px 0 rgba(0, 0, 0, 0.2)',
  },

  // Transition System
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export const darkTheme = {
  ...designTokens,

  // Primary Color Palette
  primary: {
    50: '#e6f7e9',
    100: '#b3e6c0',
    200: '#80d596',
    300: '#4dc46c',
    400: '#26b856',
    500: '#10b981',
    600: '#0ea874',
    700: '#0c9463',
    800: '#0a8053',
    900: '#065e3b',
  },

  // Semantic Colors
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',

  // Neutral Palette
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },

  // Background & Surface Colors
  bg: '#0a0a0a',
  bgLight: '#121218',
  bgElevated: '#171721',

  // Card & Surface Colors
  card: '#171721',
  cardLight: '#1f1f2a',
  cardElevated: '#252532',
  cardHover: '#2a2a38',

  // Text Colors
  text_primary: '#ffffff',
  text_secondary: '#a3a3a3',
  text_tertiary: '#737373',
  text_disabled: '#525252',

  // Border Colors
  border: '#2a2a38',
  borderLight: 'rgba(255, 255, 255, 0.06)',
  borderMedium: 'rgba(255, 255, 255, 0.12)',
  borderStrong: 'rgba(255, 255, 255, 0.18)',

  // Interactive States
  hover: 'rgba(255, 255, 255, 0.05)',
  active: 'rgba(255, 255, 255, 0.1)',
  focus: 'rgba(16, 185, 129, 0.1)',
  disabled: 'rgba(255, 255, 255, 0.02)',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.75)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',

  // Backdrop Blur
  backdropBlur: 'blur(12px)',

  // Legacy (for backwards compatibility)
  button: '#10b981',
  white: '#FFFFFF',
  black: '#000000',
  green: '#10b981',
  greenLight: '#4dc46c',
};

export const lightTheme = {
  ...designTokens,

  // Primary Color Palette
  primary: {
    50: '#e6f7e9',
    100: '#b3e6c0',
    200: '#80d596',
    300: '#4dc46c',
    400: '#26b856',
    500: '#10b981',
    600: '#0ea874',
    700: '#0c9463',
    800: '#0a8053',
    900: '#065e3b',
  },

  // Semantic Colors
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',

  // Neutral Palette
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },

  // Background & Surface Colors
  bg: '#ffffff',
  bgLight: '#f9fafb',
  bgElevated: '#f3f4f6',

  // Card & Surface Colors
  card: '#ffffff',
  cardLight: '#f9fafb',
  cardElevated: '#f3f4f6',
  cardHover: '#e5e7eb',

  // Text Colors
  text_primary: '#0a0a0a',
  text_secondary: '#525252',
  text_tertiary: '#737373',
  text_disabled: '#a3a3a3',

  // Border Colors
  border: '#e5e5e5',
  borderLight: 'rgba(0, 0, 0, 0.06)',
  borderMedium: 'rgba(0, 0, 0, 0.12)',
  borderStrong: 'rgba(0, 0, 0, 0.18)',

  // Interactive States
  hover: 'rgba(0, 0, 0, 0.05)',
  active: 'rgba(0, 0, 0, 0.1)',
  focus: 'rgba(16, 185, 129, 0.1)',
  disabled: 'rgba(0, 0, 0, 0.02)',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Backdrop Blur
  backdropBlur: 'blur(12px)',

  // Legacy (for backwards compatibility)
  button: '#10b981',
  white: '#FFFFFF',
  black: '#000000',
  green: '#10b981',
  greenLight: '#4dc46c',
};

// Chart Theme Configuration
export const chartTheme = {
  colors: {
    primary: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'],
    gradient: [
      ['#10b981', '#0ea874'],
      ['#3b82f6', '#2563eb'],
      ['#f59e0b', '#d97706'],
      ['#ef4444', '#dc2626'],
      ['#8b5cf6', '#7c3aed'],
      ['#ec4899', '#db2777'],
    ],
  },

  grid: {
    stroke: 'rgba(255, 255, 255, 0.08)',
    strokeDasharray: '3 3',
  },

  axis: {
    stroke: 'rgba(255, 255, 255, 0.2)',
    fontSize: 12,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  tooltip: {
    background: '#1f1f2a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.25)',
    padding: '12px',
  },

  legend: {
    fontSize: 14,
    fontWeight: 500,
  },
};

export default { darkTheme, lightTheme, chartTheme };
