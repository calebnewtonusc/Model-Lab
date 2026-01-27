import React from 'react';
import styled, { keyframes, css } from 'styled-components';

// ============================================================================
// Animations
// ============================================================================

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
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

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const ripple = keyframes`
  to {
    transform: scale(4);
    opacity: 0;
  }
`;

// ============================================================================
// Loading Components
// ============================================================================

export const Spinner = styled.div`
  border: 3px solid ${({ theme }) => theme.borderLight};
  border-top: 3px solid ${({ theme }) => theme.primary[500]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  width: ${({ size }) => size || '40px'};
  height: ${({ size }) => size || '40px'};
  animation: ${spin} 0.8s linear infinite;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[12]};
  gap: ${({ theme }) => theme.spacing[4]};
  animation: ${fadeIn} 0.3s ease;
`;

export const LoadingText = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

// Skeleton loaders
export const Skeleton = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.neutral[800]} 0%,
    ${({ theme }) => theme.neutral[700]} 50%,
    ${({ theme }) => theme.neutral[800]} 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: ${({ theme, radius }) => theme.borderRadius[radius] || theme.borderRadius.base};
  height: ${({ height }) => height || '20px'};
  width: ${({ width }) => width || '100%'};
`;

export const SkeletonCard = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  animation: ${fadeIn} 0.3s ease;
`;

// ============================================================================
// Empty State Components
// ============================================================================

export const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[8]};
  color: ${({ theme }) => theme.text_secondary};
  animation: ${fadeIn} 0.4s ease;
`;

export const EmptyStateIcon = styled.div`
  font-size: ${({ theme }) => theme.fontSize['5xl']};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  opacity: 0.4;
  color: ${({ theme }) => theme.text_tertiary};
`;

export const EmptyStateTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const EmptyStateText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.base};
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  line-height: ${({ theme }) => theme.lineHeight.relaxed};
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

// ============================================================================
// Toast Notification System
// ============================================================================

const ToastContainer = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing[8]};
  right: ${({ theme }) => theme.spacing[8]};
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  max-width: 420px;
  pointer-events: none;
`;

const ToastItem = styled.div`
  background: ${({ theme, type }) => {
    if (type === 'success') return theme.success;
    if (type === 'error') return theme.error;
    if (type === 'warning') return theme.warning;
    return theme.cardElevated;
  }};
  color: white;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[5]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.elevation.xl};
  backdrop-filter: ${({ theme }) => theme.backdropBlur};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  animation: ${({ removing }) => removing ? slideOut : slideIn} 0.3s ease;
  pointer-events: auto;
  border: 1px solid ${({ theme }) => theme.borderLight};
`;

const ToastMessage = styled.div`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  line-height: ${({ theme }) => theme.lineHeight.normal};
`;

const ToastClose = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: ${({ theme }) => theme.fontSize.xl};
  cursor: pointer;
  opacity: 0.8;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  transition: ${({ theme }) => theme.transition.fast};

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.2);
  }
`;

export const Toast = ({ toasts, removeToast }) => {
  return (
    <ToastContainer>
      {toasts.map(toast => (
        <ToastItem key={toast.id} type={toast.type} removing={toast.removing}>
          <ToastMessage>{toast.message}</ToastMessage>
          <ToastClose onClick={() => removeToast(toast.id)}>×</ToastClose>
        </ToastItem>
      ))}
    </ToastContainer>
  );
};

// ============================================================================
// Button Components
// ============================================================================

const getRippleStyles = () => css`
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1) translate(-50%, -50%);
    transform-origin: 50% 50%;
  }

  &:active::after {
    animation: ${ripple} 0.6s ease-out;
  }
`;

export const Button = styled.button`
  padding: ${({ size, theme }) => {
    if (size === 'small') return `${theme.spacing[2]} ${theme.spacing[4]}`;
    if (size === 'large') return `${theme.spacing[4]} ${theme.spacing[8]}`;
    return `${theme.spacing[3]} ${theme.spacing[6]}`;
  }};

  background: ${({ variant, theme }) => {
    if (variant === 'secondary') return theme.cardLight;
    if (variant === 'outline') return 'transparent';
    if (variant === 'ghost') return 'transparent';
    if (variant === 'danger') return theme.error;
    return theme.primary[500];
  }};

  color: ${({ variant, theme }) => {
    if (variant === 'secondary') return theme.text_primary;
    if (variant === 'outline') return theme.primary[500];
    if (variant === 'ghost') return theme.text_primary;
    return 'white';
  }};

  border: ${({ variant, theme }) => {
    if (variant === 'outline') return `2px solid ${theme.primary[500]}`;
    if (variant === 'secondary') return `1px solid ${theme.border}`;
    return 'none';
  }};

  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-family: ${({ theme }) => theme.fontFamily.primary};

  font-size: ${({ size, theme }) => {
    if (size === 'small') return theme.fontSize.sm;
    if (size === 'large') return theme.fontSize.lg;
    return theme.fontSize.base;
  }};

  cursor: pointer;
  transition: ${({ theme }) => theme.transition.base};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  white-space: nowrap;
  user-select: none;
  box-shadow: ${({ variant, theme }) => {
    if (variant === 'ghost') return 'none';
    return theme.elevation.sm;
  }};

  ${({ variant }) => variant !== 'ghost' && getRippleStyles()}

  &:hover:not(:disabled) {
    background: ${({ variant, theme }) => {
      if (variant === 'secondary') return theme.cardHover;
      if (variant === 'outline') return theme.primary[500] + '10';
      if (variant === 'ghost') return theme.hover;
      if (variant === 'danger') return theme.error + 'dd';
      return theme.primary[600];
    }};

    border-color: ${({ variant, theme }) => {
      if (variant === 'outline') return theme.primary[600];
      return undefined;
    }};

    transform: translateY(-1px);
    box-shadow: ${({ variant, theme }) => {
      if (variant === 'ghost') return 'none';
      return theme.elevation.md;
    }};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  ${({ loading }) => loading && css`
    position: relative;
    color: transparent;
    pointer-events: none;

    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin-left: -8px;
      margin-top: -8px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: ${spin} 0.6s linear infinite;
      color: ${({ variant }) => variant === 'outline' || variant === 'ghost' ? 'currentColor' : 'white'};
    }
  `}
`;

// ============================================================================
// Badge Component
// ============================================================================

export const Badge = styled.span`
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  white-space: nowrap;

  background: ${({ variant, theme }) => {
    if (variant === 'success') return theme.success + '20';
    if (variant === 'error') return theme.error + '20';
    if (variant === 'warning') return theme.warning + '20';
    if (variant === 'info') return theme.info + '20';
    return theme.neutral[700];
  }};

  color: ${({ variant, theme }) => {
    if (variant === 'success') return theme.success;
    if (variant === 'error') return theme.error;
    if (variant === 'warning') return theme.warning;
    if (variant === 'info') return theme.info;
    return theme.text_secondary;
  }};

  border: 1px solid ${({ variant, theme }) => {
    if (variant === 'success') return theme.success + '40';
    if (variant === 'error') return theme.error + '40';
    if (variant === 'warning') return theme.warning + '40';
    if (variant === 'info') return theme.info + '40';
    return theme.neutral[600];
  }};
`;

// ============================================================================
// Card Component
// ============================================================================

export const Card = styled.div`
  background: ${({ theme, elevated }) => elevated ? theme.cardElevated : theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ padding, theme }) => padding || theme.spacing[6]};
  transition: ${({ theme }) => theme.transition.base};
  box-shadow: ${({ theme, elevated }) => elevated ? theme.elevation.md : theme.elevation.sm};

  ${({ gradient, theme }) => gradient && css`
    border: 1px solid transparent;
    background: linear-gradient(${theme.card}, ${theme.card}) padding-box,
                linear-gradient(135deg, ${theme.primary[500]}40, ${theme.primary[700]}40) border-box;
  `}

  ${({ clickable, theme }) => clickable && css`
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: ${theme.elevation.lg};
      border-color: ${theme.borderMedium};
    }

    &:active {
      transform: translateY(0);
      box-shadow: ${theme.elevation.md};
    }
  `}

  animation: ${scaleIn} 0.2s ease;
`;

// ============================================================================
// Input Components
// ============================================================================

const InputBase = css`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  background: ${({ theme }) => theme.bgLight};
  border: 2px solid ${({ theme, error }) => error ? theme.error : theme.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.text_primary};
  font-size: ${({ theme }) => theme.fontSize.base};
  font-family: ${({ theme }) => theme.fontFamily.primary};
  transition: ${({ theme }) => theme.transition.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme, error }) => error ? theme.error : theme.primary[500]};
    background: ${({ theme }) => theme.bg};
    box-shadow: 0 0 0 3px ${({ theme, error }) => error ? theme.error + '20' : theme.primary[500] + '20'};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text_tertiary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${({ theme }) => theme.disabled};
  }
`;

export const Input = styled.input`
  ${InputBase}
`;

export const TextArea = styled.textarea`
  ${InputBase}
  resize: vertical;
  min-height: 100px;
  line-height: ${({ theme }) => theme.lineHeight.normal};
`;

export const Select = styled.select`
  ${InputBase}
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23737373' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right ${({ theme }) => theme.spacing[4]} center;
  padding-right: ${({ theme }) => theme.spacing[10]};

  option {
    background: ${({ theme }) => theme.card};
    color: ${({ theme }) => theme.text_primary};
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const InputError = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.error};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const InputHelper = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text_tertiary};
`;

// ============================================================================
// Tooltip Component
// ============================================================================

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipText = styled.div`
  visibility: ${({ show }) => show ? 'visible' : 'hidden'};
  opacity: ${({ show }) => show ? '1' : '0'};
  background: ${({ theme }) => theme.cardElevated};
  color: ${({ theme }) => theme.text_primary};
  text-align: center;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  position: absolute;
  z-index: 1000;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: ${({ theme }) => theme.fontSize.sm};
  border: 1px solid ${({ theme }) => theme.borderMedium};
  box-shadow: ${({ theme }) => theme.elevation.lg};
  backdrop-filter: ${({ theme }) => theme.backdropBlur};
  transition: ${({ theme }) => theme.transition.fast};
  pointer-events: none;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: ${({ theme }) => theme.cardElevated} transparent transparent transparent;
  }
`;

export const Tooltip = ({ children, text }) => {
  const [show, setShow] = React.useState(false);

  return (
    <TooltipContainer
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <TooltipText show={show}>{text}</TooltipText>
    </TooltipContainer>
  );
};

// ============================================================================
// Progress Bar
// ============================================================================

export const ProgressBar = styled.div`
  width: 100%;
  height: ${({ height, theme }) => height || theme.spacing[2]};
  background: ${({ theme }) => theme.bgLight};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  position: relative;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: ${({ theme, variant }) => {
    if (variant === 'success') return theme.success;
    if (variant === 'error') return theme.error;
    if (variant === 'warning') return theme.warning;
    return theme.primary[500];
  }};
  width: ${({ progress }) => Math.min(100, Math.max(0, progress))}%;
  transition: width 0.4s ease;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  position: relative;

  ${({ animated }) => animated && css`
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
      );
      animation: ${shimmer} 2s infinite;
    }
  `}
`;

// ============================================================================
// Modal Components
// ============================================================================

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.overlay};
  backdrop-filter: ${({ theme }) => theme.backdropBlur};
  display: ${({ show }) => show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing[8]};
  animation: ${fadeIn} 0.2s ease;
`;

export const ModalContent = styled.div`
  background: ${({ theme }) => theme.cardElevated};
  border: 1px solid ${({ theme }) => theme.borderMedium};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[8]};
  max-width: ${({ maxWidth }) => maxWidth || '600px'};
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.elevation['2xl']};
  animation: ${scaleIn} 0.2s ease;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
  line-height: ${({ theme }) => theme.lineHeight.tight};
`;

export const ModalClose = styled.button`
  background: ${({ theme }) => theme.hover};
  border: none;
  color: ${({ theme }) => theme.text_secondary};
  font-size: ${({ theme }) => theme.fontSize.xl};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[2]};
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  transition: ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme }) => theme.active};
    color: ${({ theme }) => theme.text_primary};
  }
`;

// ============================================================================
// Table Components
// ============================================================================

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

export const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  background: ${({ theme }) => theme.bgLight};
  border-bottom: 2px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text_secondary};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: ${({ sticky }) => sticky ? 'sticky' : 'static'};
  top: 0;
  z-index: 10;

  ${({ sortable }) => sortable && css`
    cursor: pointer;
    user-select: none;
    transition: ${({ theme }) => theme.transition.fast};

    &:hover {
      background: ${({ theme }) => theme.hover};
      color: ${({ theme }) => theme.text_primary};
    }
  `}
`;

export const Td = styled.td`
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[4]}`};
  border-bottom: 1px solid ${({ theme }) => theme.borderLight};
  color: ${({ theme }) => theme.text_primary};
  font-size: ${({ theme }) => theme.fontSize.sm};

  tr:hover & {
    background: ${({ theme }) => theme.hover};
  }

  tr:last-child & {
    border-bottom: none;
  }
`;

// ============================================================================
// Tabs Components
// ============================================================================

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 2px solid ${({ theme }) => theme.border};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Tab = styled.button`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: ${({ active, theme }) => active ? theme.primary[500] : theme.text_secondary};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.base};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.fast};
  margin-bottom: -2px;
  position: relative;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.primary[500]};
    background: ${({ theme }) => theme.hover};
  }

  ${({ active, theme }) => active && css`
    border-bottom-color: ${theme.primary[500]};
  `}
`;

export const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <TabsContainer>
      {tabs.map(tab => (
        <Tab
          key={tab.id}
          active={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </Tab>
      ))}
    </TabsContainer>
  );
};

// ============================================================================
// Breadcrumbs
// ============================================================================

export const BreadcrumbsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

export const BreadcrumbItem = styled.span`
  color: ${({ active, theme }) => active ? theme.text_primary : theme.text_secondary};
  font-weight: ${({ active, theme }) => active ? theme.fontWeight.medium : theme.fontWeight.normal};
  cursor: ${({ active }) => active ? 'default' : 'pointer'};
  transition: ${({ theme }) => theme.transition.fast};

  &:hover {
    color: ${({ theme, active }) => !active && theme.primary[500]};
  }
`;

export const BreadcrumbSeparator = styled.span`
  color: ${({ theme }) => theme.text_tertiary};
  user-select: none;
`;

// ============================================================================
// Divider
// ============================================================================

export const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.border};
  margin: ${({ theme, spacing }) => spacing || theme.spacing[6]} 0;

  ${({ vertical, theme, spacing }) => vertical && css`
    width: 1px;
    height: auto;
    margin: 0 ${spacing || theme.spacing[4]};
  `}
`;

// ============================================================================
// Section Header
// ============================================================================

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const SectionDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.base};
  color: ${({ theme }) => theme.text_secondary};
  margin: ${({ theme }) => theme.spacing[2]} 0 0 0;
  line-height: ${({ theme }) => theme.lineHeight.normal};
`;
