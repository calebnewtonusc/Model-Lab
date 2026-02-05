import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing?.[8] || '2rem'};
  background: ${({ theme }) => theme.bg || '#0a0a0f'};
`;

const ErrorCard = styled.div`
  max-width: 600px;
  background: ${({ theme }) => theme.cardElevated || '#252532'};
  border: 1px solid ${({ theme }) => (theme.error || '#ef4444') + '40'};
  border-radius: ${({ theme }) => theme.borderRadius?.xl || '0.75rem'};
  padding: ${({ theme }) => theme.spacing?.[10] || '2.5rem'};
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${({ theme }) => theme.spacing?.[4] || '1rem'};
`;

const ErrorTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize?.['3xl'] || '1.875rem'};
  font-weight: ${({ theme }) => theme.fontWeight?.bold || 700};
  color: ${({ theme }) => theme.text_primary || '#ffffff'};
  margin-bottom: ${({ theme }) => theme.spacing?.[4] || '1rem'};
`;

const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSize?.lg || '1.125rem'};
  color: ${({ theme }) => theme.text_secondary || '#b4b4c8'};
  margin-bottom: ${({ theme }) => theme.spacing?.[6] || '1.5rem'};
  line-height: 1.6;
`;

const ErrorDetails = styled.pre`
  background: ${({ theme }) => theme.bg || '#0a0a0f'};
  border: 1px solid ${({ theme }) => theme.border || '#2a2a38'};
  border-radius: ${({ theme }) => theme.borderRadius?.lg || '0.5rem'};
  padding: ${({ theme }) => theme.spacing?.[4] || '1rem'};
  text-align: left;
  overflow-x: auto;
  font-size: ${({ theme }) => theme.fontSize?.sm || '0.875rem'};
  color: ${({ theme }) => theme.error || '#ef4444'};
  margin-bottom: ${({ theme }) => theme.spacing?.[6] || '1.5rem'};
`;

const Button = styled.button`
  background: ${({ theme }) => theme.primary?.[500] || theme.primary?.gradient || '#10b981'};
  color: white;
  border: none;
  padding: ${({ theme }) => `${theme.spacing?.[3] || '0.75rem'} ${theme.spacing?.[8] || '2rem'}`};
  border-radius: ${({ theme }) => theme.borderRadius?.lg || '0.5rem'};
  font-size: ${({ theme }) => theme.fontSize?.base || '1rem'};
  font-weight: ${({ theme }) => theme.fontWeight?.semibold || 600};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.primary?.[600] || '#059669'};
    transform: translateY(-2px);
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorCard>
            <ErrorIcon>⚠️</ErrorIcon>
            <ErrorTitle>Something went wrong</ErrorTitle>
            <ErrorMessage>
              We're sorry, but something unexpected happened. The error has been logged
              and we'll look into it.
            </ErrorMessage>
            {this.state.error && (
              <ErrorDetails>
                {this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </ErrorDetails>
            )}
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
