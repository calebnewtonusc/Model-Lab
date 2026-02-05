/**
 * Modern UI Components Library
 * Glassmorphism, animations, and enhanced interactions
 */

import styled, { keyframes, css } from 'styled-components';
import { useState, useEffect } from 'react';

// ===== ANIMATIONS =====

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// ===== GLASS CARD =====

export const GlassCard = styled.div`
  position: relative;
  background: ${({ theme, variant = 'medium' }) =>
    theme.glass?.[variant]?.background || 'rgba(255, 255, 255, 0.1)'};
  backdrop-filter: ${({ theme, variant = 'medium' }) =>
    theme.glass?.[variant]?.backdropFilter || 'blur(16px) saturate(180%)'};
  -webkit-backdrop-filter: ${({ theme, variant = 'medium' }) =>
    theme.glass?.[variant]?.WebkitBackdropFilter || 'blur(16px) saturate(180%)'};
  border: ${({ theme, variant = 'medium' }) =>
    theme.glass?.[variant]?.border || '1px solid rgba(255, 255, 255, 0.1)'};
  border-radius: ${({ theme }) => theme.borderRadius?.['2xl'] || '1rem'};
  padding: ${({ theme, padding = '6' }) => theme.spacing?.[padding] || '1.5rem'};
  box-shadow: ${({ theme, variant = 'medium' }) =>
    theme.glass?.[variant]?.boxShadow || '0 8px 32px rgba(0, 0, 0, 0.12)'};

  transition: all ${({ theme }) => theme.animations?.duration?.moderate || '350ms'}
              ${({ theme }) => theme.animations?.easing?.easeInOut || 'ease-in-out'};

  ${({ hover }) => hover && css`
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${({ theme }) => theme.elevation?.xl || '0 20px 25px rgba(0, 0, 0, 0.12)'};
      border-color: ${({ theme }) => theme.primary?.[500] || '#10b981'};
    }
  `}

  ${({ clickable }) => clickable && css`
    cursor: pointer;
    user-select: none;

    &:active {
      transform: translateY(-2px);
    }
  `}

  animation: ${fadeIn} ${({ theme }) => theme.animations?.duration?.moderate || '350ms'}
             ${({ theme }) => theme.animations?.easing?.easeOut || 'ease-out'};
`;

// ===== GRADIENT CARD =====

export const GradientCard = styled(GlassCard)`
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ gradient }) => gradient || 'linear-gradient(90deg, #10b981, #059669, #047857)'};
  }

  ${({ glowOnHover }) => glowOnHover && css`
    &:hover {
      box-shadow: ${({ theme }) => theme.elevation?.primaryGlow || '0 0 30px rgba(16, 185, 129, 0.3)'};
    }
  `}
`;

// ===== MODERN BUTTON =====

export const ModernButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing?.[2] || '0.5rem'};
  padding: ${({ size = 'md', theme }) => {
    const sizes = {
      sm: `${theme.spacing?.[2] || '0.5rem'} ${theme.spacing?.[4] || '1rem'}`,
      md: `${theme.spacing?.[3] || '0.75rem'} ${theme.spacing?.[6] || '1.5rem'}`,
      lg: `${theme.spacing?.[4] || '1rem'} ${theme.spacing?.[8] || '2rem'}`,
    };
    return sizes[size];
  }};

  font-family: ${({ theme }) => theme.typography?.fontFamily?.sans};
  font-size: ${({ size = 'md', theme }) => {
    const sizes = {
      sm: theme.typography?.fontSize?.sm || '0.875rem',
      md: theme.typography?.fontSize?.base || '1rem',
      lg: theme.typography?.fontSize?.lg || '1.125rem',
    };
    return sizes[size];
  }};
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.semibold || 600};

  color: ${({ variant = 'primary', theme }) => {
    if (variant === 'primary' || variant === 'gradient') return theme.text_inverse || '#fff';
    if (variant === 'secondary') return theme.text_primary || '#000';
    if (variant === 'ghost') return theme.primary?.[500] || '#10b981';
    return theme.text_primary;
  }};

  background: ${({ variant = 'primary', theme }) => {
    if (variant === 'primary') return theme.primary?.[600] || '#059669';
    if (variant === 'gradient') return theme.primary?.gradient || 'linear-gradient(135deg, #10b981, #059669)';
    if (variant === 'secondary') return theme.card || '#171721';
    if (variant === 'ghost') return 'transparent';
    return 'transparent';
  }};

  border: ${({ variant = 'primary', theme }) => {
    if (variant === 'ghost') return `2px solid ${theme.primary?.[500] || '#10b981'}`;
    if (variant === 'secondary') return `1px solid ${theme.border || '#2a2a38'}`;
    return 'none';
  }};

  border-radius: ${({ theme }) => theme.borderRadius?.lg || '0.5rem'};
  cursor: pointer;
  outline: none;
  overflow: hidden;

  transition: all ${({ theme }) => theme.animations?.duration?.base || '250ms'}
              ${({ theme }) => theme.animations?.easing?.easeInOut || 'ease-in-out'};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ variant, theme }) => {
      if (variant === 'primary' || variant === 'gradient') return theme.elevation?.primaryGlow;
      return theme.elevation?.md;
    }};

    ${({ variant }) => variant === 'gradient' && css`
      background: ${({ theme }) => theme.primary?.gradientHover || 'linear-gradient(135deg, #34d399, #10b981)'};
    `}
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Ripple effect container */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:active::after {
    width: 300px;
    height: 300px;
  }
`;

// ===== STAT CARD =====

export const StatCard = styled(GlassCard)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.[3] || '0.75rem'};
  min-height: 140px;
`;

export const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius?.xl || '0.75rem'};
  background: ${({ color = 'primary', theme }) =>
    `linear-gradient(135deg, ${theme[color]?.[500] || theme.primary?.[500]}, ${theme[color]?.[600] || theme.primary?.[600]})`};
  box-shadow: ${({ theme }) => theme.elevation?.md || '0 4px 6px rgba(0, 0, 0, 0.1)'};

  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;

export const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography?.fontSize?.['4xl'] || '2.25rem'};
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.bold || 700};
  color: ${({ theme }) => theme.text_primary || '#fff'};
  line-height: 1;

  ${({ trend }) => trend === 'up' && css`
    color: ${({ theme }) => theme.success || '#10b981'};
  `}

  ${({ trend }) => trend === 'down' && css`
    color: ${({ theme }) => theme.error || '#ef4444'};
  `}
`;

export const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography?.fontSize?.sm || '0.875rem'};
  color: ${({ theme }) => theme.text_secondary || '#b4b4c8'};
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.medium || 500};
`;

export const StatTrend = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.[1] || '0.25rem'};
  font-size: ${({ theme }) => theme.typography?.fontSize?.sm || '0.875rem'};
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.semibold || 600};

  color: ${({ trend, theme }) => {
    if (trend === 'up') return theme.success || '#10b981';
    if (trend === 'down') return theme.error || '#ef4444';
    return theme.text_tertiary || '#808090';
  }};
`;

// ===== SIDEBAR NAVIGATION =====

export const Sidebar = styled.nav`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${({ collapsed }) => collapsed ? '80px' : '280px'};
  background: ${({ theme }) => theme.glass?.dark?.medium?.background || 'rgba(23, 23, 33, 0.5)'};
  backdrop-filter: ${({ theme }) => theme.glass?.dark?.medium?.backdropFilter || 'blur(16px) saturate(180%)'};
  -webkit-backdrop-filter: ${({ theme }) => theme.glass?.dark?.medium?.WebkitBackdropFilter || 'blur(16px) saturate(180%)'};
  border-right: ${({ theme }) => `1px solid ${theme.border || '#2a2a38'}`};
  padding: ${({ theme }) => theme.spacing?.[6] || '1.5rem'} ${({ theme }) => theme.spacing?.[4] || '1rem'};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.[8] || '2rem'};
  z-index: 1000;

  transition: width ${({ theme }) => theme.animations?.duration?.moderate || '350ms'}
              ${({ theme }) => theme.animations?.easing?.easeInOut || 'ease-in-out'};

  animation: ${slideInLeft} ${({ theme }) => theme.animations?.duration?.moderate || '350ms'}
             ${({ theme }) => theme.animations?.easing?.easeOut || 'ease-out'};
`;

export const SidebarLogo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.[3] || '0.75rem'};
  padding: ${({ theme }) => theme.spacing?.[2] || '0.5rem'};

  svg {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }

  span {
    font-size: ${({ theme }) => theme.typography?.fontSize?.xl || '1.25rem'};
    font-weight: ${({ theme }) => theme.typography?.fontWeight?.bold || 700};
    background: ${({ theme }) => theme.primary?.gradient || 'linear-gradient(135deg, #10b981, #059669)'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    white-space: nowrap;
    opacity: ${({ collapsed }) => collapsed ? 0 : 1};
    transition: opacity ${({ theme }) => theme.animations?.duration?.base || '250ms'};
  }
`;

export const SidebarNav = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.[2] || '0.5rem'};
`;

export const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.[3] || '0.75rem'};
  padding: ${({ theme }) => theme.spacing?.[3] || '0.75rem'} ${({ theme }) => theme.spacing?.[4] || '1rem'};
  background: ${({ active, theme }) => active ? theme.primary?.[600] || '#059669' : 'transparent'};
  color: ${({ active, theme }) => active ? '#fff' : theme.text_secondary || '#b4b4c8'};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius?.lg || '0.5rem'};
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography?.fontFamily?.sans};
  font-size: ${({ theme }) => theme.typography?.fontSize?.base || '1rem'};
  font-weight: ${({ active, theme }) => active ?
    theme.typography?.fontWeight?.semibold || 600 :
    theme.typography?.fontWeight?.medium || 500};
  text-align: left;
  white-space: nowrap;
  overflow: hidden;

  transition: all ${({ theme }) => theme.animations?.duration?.base || '250ms'}
              ${({ theme }) => theme.animations?.easing?.easeInOut || 'ease-in-out'};

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    opacity: ${({ active }) => active ? 1 : 0.7};
  }

  span {
    opacity: ${({ collapsed }) => collapsed ? 0 : 1};
    transition: opacity ${({ theme }) => theme.animations?.duration?.fast || '150ms'};
  }

  &:hover {
    background: ${({ active, theme }) => active ?
      theme.primary?.[700] || '#047857' :
      theme.hover || 'rgba(255, 255, 255, 0.08)'};
    color: ${({ active }) => active ? '#fff' : '#fff'};
    transform: translateX(4px);
  }
`;

// ===== COMMAND PALETTE =====

export const CommandPalette = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
  z-index: 9999;

  animation: ${fadeIn} ${({ theme }) => theme.animations?.duration?.fast || '150ms'};
`;

export const CommandPaletteContent = styled.div`
  width: 100%;
  max-width: 640px;
  background: ${({ theme }) => theme.glass?.dark?.light?.background || 'rgba(23, 23, 33, 0.9)'};
  backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid ${({ theme }) => theme.border || '#2a2a38'};
  border-radius: ${({ theme }) => theme.borderRadius?.['2xl'] || '1rem'};
  box-shadow: ${({ theme }) => theme.elevation?.['3xl'] || '0 35px 60px rgba(0, 0, 0, 0.4)'};
  overflow: hidden;

  animation: ${scaleIn} ${({ theme }) => theme.animations?.duration?.moderate || '350ms'}
             ${({ theme }) => theme.animations?.easing?.spring || 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'};
`;

export const CommandInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing?.[5] || '1.25rem'} ${({ theme }) => theme.spacing?.[6] || '1.5rem'};
  background: transparent;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.text_primary || '#fff'};
  font-family: ${({ theme }) => theme.typography?.fontFamily?.sans};
  font-size: ${({ theme }) => theme.typography?.fontSize?.lg || '1.125rem'};

  &::placeholder {
    color: ${({ theme }) => theme.text_tertiary || '#808090'};
  }
`;

export const CommandList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  border-top: 1px solid ${({ theme }) => theme.border || '#2a2a38'};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border || '#2a2a38'};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.borderMedium || '#40405c'};
  }
`;

export const CommandItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.[3] || '0.75rem'};
  padding: ${({ theme }) => theme.spacing?.[3] || '0.75rem'} ${({ theme }) => theme.spacing?.[6] || '1.5rem'};
  background: ${({ selected, theme }) => selected ? theme.hover || 'rgba(255, 255, 255, 0.08)' : 'transparent'};
  border: none;
  color: ${({ theme }) => theme.text_primary || '#fff'};
  font-family: ${({ theme }) => theme.typography?.fontFamily?.sans};
  font-size: ${({ theme }) => theme.typography?.fontSize?.base || '1rem'};
  text-align: left;
  cursor: pointer;

  transition: background ${({ theme }) => theme.animations?.duration?.fast || '150ms'};

  &:hover {
    background: ${({ theme }) => theme.hover || 'rgba(255, 255, 255, 0.08)'};
  }

  svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.primary?.[500] || '#10b981'};
  }
`;

// ===== LOADING STATES =====

export const SkeletonPulse = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.card || '#171721'} 0%,
    ${({ theme }) => theme.cardLight || '#1f1f2e'} 50%,
    ${({ theme }) => theme.card || '#171721'} 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: ${({ theme, radius = 'md' }) => theme.borderRadius?.[radius] || '0.375rem'};
  height: ${({ height = '20px' }) => height};
  width: ${({ width = '100%' }) => width};
`;

export const LoadingDots = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing?.[2] || '0.5rem'};

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme }) => theme.primary?.[500] || '#10b981'};
    animation: ${pulse} 1.4s ease-in-out infinite;

    &:nth-child(1) {
      animation-delay: 0s;
    }
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
`;

// ===== SEARCH BAR =====

export const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: ${({ maxWidth = '600px' }) => maxWidth};
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing?.[4] || '1rem'}
           ${({ theme }) => theme.spacing?.[6] || '1.5rem'}
           ${({ theme }) => theme.spacing?.[4] || '1rem'}
           ${({ theme }) => theme.spacing?.[12] || '3rem'};
  background: ${({ theme }) => theme.glass?.dark?.light?.background || 'rgba(23, 23, 33, 0.7)'};
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid ${({ theme }) => theme.border || '#2a2a38'};
  border-radius: ${({ theme }) => theme.borderRadius?.xl || '0.75rem'};
  color: ${({ theme }) => theme.text_primary || '#fff'};
  font-family: ${({ theme }) => theme.typography?.fontFamily?.sans};
  font-size: ${({ theme }) => theme.typography?.fontSize?.base || '1rem'};
  outline: none;

  transition: all ${({ theme }) => theme.animations?.duration?.base || '250ms'}
              ${({ theme }) => theme.animations?.easing?.easeInOut || 'ease-in-out'};

  &::placeholder {
    color: ${({ theme }) => theme.text_tertiary || '#808090'};
  }

  &:focus {
    border-color: ${({ theme }) => theme.primary?.[500] || '#10b981'};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.focus || 'rgba(16, 185, 129, 0.24)'};
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing?.[4] || '1rem'};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.text_tertiary || '#808090'};
  pointer-events: none;

  svg {
    width: 20px;
    height: 20px;
  }
`;

export default {
  GlassCard,
  GradientCard,
  ModernButton,
  StatCard,
  StatIcon,
  StatValue,
  StatLabel,
  StatTrend,
  Sidebar,
  SidebarLogo,
  SidebarNav,
  NavItem,
  CommandPalette,
  CommandPaletteContent,
  CommandInput,
  CommandList,
  CommandItem,
  SkeletonPulse,
  LoadingDots,
  SearchContainer,
  SearchInput,
  SearchIcon,
};
