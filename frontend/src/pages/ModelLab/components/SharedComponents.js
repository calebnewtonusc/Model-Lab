import React from 'react';
import styled, { keyframes } from 'styled-components';

// Loading spinner animation
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

// Spinner
export const Spinner = styled.div`
  border: 3px solid ${({ theme }) => theme.text_primary + '20'};
  border-top: 3px solid ${({ theme }) => theme.primary};
  border-radius: 50%;
  width: ${({ size }) => size || '40px'};
  height: ${({ size }) => size || '40px'};
  animation: ${spin} 0.8s linear infinite;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
`;

export const LoadingText = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 1rem;
`;

// Skeleton loaders
export const Skeleton = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.text_primary + '10'} 25%,
    ${({ theme }) => theme.text_primary + '20'} 50%,
    ${({ theme }) => theme.text_primary + '10'} 75%
  );
  background-size: 200% 100%;
  animation: ${pulse} 1.5s ease-in-out infinite;
  border-radius: ${({ radius }) => radius || '8px'};
  height: ${({ height }) => height || '20px'};
  width: ${({ width }) => width || '100%'};
`;

export const SkeletonCard = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.text_primary + '12'};
  border-radius: 12px;
  padding: 1.5rem;
`;

// Empty state
export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: ${({ theme }) => theme.text_secondary};
`;

export const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 0.5rem;
`;

export const EmptyStateText = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

// Toast notification
const ToastContainer = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
`;

const ToastItem = styled.div`
  background: ${({ theme, type }) => {
    if (type === 'success') return theme.primary;
    if (type === 'error') return '#ef4444';
    if (type === 'warning') return '#f59e0b';
    return theme.card;
  }};
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: ${({ removing }) => removing ? slideOut : slideIn} 0.3s ease;
`;

const ToastMessage = styled.div`
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
`;

const ToastClose = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  opacity: 0.8;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
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

// Button components
export const Button = styled.button`
  padding: ${({ size }) => {
    if (size === 'small') return '0.5rem 1rem';
    if (size === 'large') return '1rem 2rem';
    return '0.75rem 1.5rem';
  }};
  background: ${({ variant, theme }) => {
    if (variant === 'secondary') return 'transparent';
    if (variant === 'danger') return '#ef4444';
    return theme.primary;
  }};
  color: ${({ variant, theme }) => {
    if (variant === 'secondary') return theme.text_primary;
    return 'white';
  }};
  border: ${({ variant, theme }) => {
    if (variant === 'secondary') return `1px solid ${theme.text_primary + '30'}`;
    return 'none';
  }};
  border-radius: 8px;
  font-weight: 600;
  font-size: ${({ size }) => {
    if (size === 'small') return '0.875rem';
    if (size === 'large') return '1.125rem';
    return '1rem';
  }};
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: ${({ variant, theme }) => {
      if (variant === 'secondary') return theme.text_primary + '10';
      if (variant === 'danger') return '#dc2626';
      return theme.primary + 'dd';
    }};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

// Badge component
export const Badge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ variant, theme }) => {
    if (variant === 'success') return theme.primary + '20';
    if (variant === 'error') return '#ef4444' + '20';
    if (variant === 'warning') return '#f59e0b' + '20';
    if (variant === 'info') return '#3b82f6' + '20';
    return theme.text_secondary + '20';
  }};
  color: ${({ variant, theme }) => {
    if (variant === 'success') return theme.primary;
    if (variant === 'error') return '#ef4444';
    if (variant === 'warning') return '#f59e0b';
    if (variant === 'info') return '#3b82f6';
    return theme.text_secondary;
  }};
`;

// Card component
export const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.text_primary + '12'};
  border-radius: 12px;
  padding: ${({ padding }) => padding || '1.5rem'};
  transition: all 0.3s ease;

  ${({ clickable }) => clickable && `
    cursor: pointer;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }
  `}
`;

// Input components
export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme, error }) => error ? '#ef4444' : theme.text_primary + '20'};
  border-radius: 8px;
  color: ${({ theme }) => theme.text_primary};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme, error }) => error ? '#ef4444' : theme.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text_secondary};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme, error }) => error ? '#ef4444' : theme.text_primary + '20'};
  border-radius: 8px;
  color: ${({ theme }) => theme.text_primary};
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  line-height: 1.5;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme, error }) => error ? '#ef4444' : theme.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text_secondary};
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme, error }) => error ? '#ef4444' : theme.text_primary + '20'};
  border-radius: 8px;
  color: ${({ theme }) => theme.text_primary};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme, error }) => error ? '#ef4444' : theme.primary};
  }

  option {
    background: ${({ theme }) => theme.card};
    color: ${({ theme }) => theme.text_primary};
  }
`;

// Tooltip
const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipText = styled.div`
  visibility: ${({ show }) => show ? 'visible' : 'hidden'};
  opacity: ${({ show }) => show ? '1' : '0'};
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text_primary};
  text-align: center;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  position: absolute;
  z-index: 1000;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.875rem;
  border: 1px solid ${({ theme }) => theme.text_primary + '20'};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: opacity 0.3s;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: ${({ theme }) => theme.card} transparent transparent transparent;
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

// Progress bar
export const ProgressBar = styled.div`
  width: 100%;
  height: ${({ height }) => height || '8px'};
  background: ${({ theme }) => theme.text_primary + '20'};
  border-radius: ${({ height }) => height ? `calc(${height} / 2)` : '4px'};
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: ${({ theme, variant }) => {
    if (variant === 'success') return theme.primary;
    if (variant === 'error') return '#ef4444';
    if (variant === 'warning') return '#f59e0b';
    return theme.primary;
  }};
  width: ${({ progress }) => Math.min(100, Math.max(0, progress))}%;
  transition: width 0.3s ease;
`;

// Modal
export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: ${({ show }) => show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

export const ModalContent = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  padding: 2rem;
  max-width: ${({ maxWidth }) => maxWidth || '600px'};
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const ModalTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
`;

export const ModalClose = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.text_primary + '10'};
    color: ${({ theme }) => theme.text_primary};
  }
`;

// Table
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  text-align: left;
  padding: 0.75rem;
  border-bottom: 2px solid ${({ theme }) => theme.text_primary + '12'};
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.text_primary + '08'};
  color: ${({ theme }) => theme.text_primary};
`;

// Tabs
const TabsContainer = styled.div`
  display: flex;
  border-bottom: 2px solid ${({ theme }) => theme.text_primary + '12'};
  margin-bottom: 1.5rem;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: ${({ active, theme }) => active ? theme.primary : theme.text_secondary};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: -2px;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }

  ${({ active, theme }) => active && `
    border-bottom-color: ${theme.primary};
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

// Breadcrumbs
export const BreadcrumbsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

export const BreadcrumbItem = styled.span`
  color: ${({ active, theme }) => active ? theme.text_primary : theme.text_secondary};
  cursor: ${({ active }) => active ? 'default' : 'pointer'};

  &:hover {
    color: ${({ theme, active }) => !active && theme.primary};
  }
`;

export const BreadcrumbSeparator = styled.span`
  color: ${({ theme }) => theme.text_secondary};
`;
