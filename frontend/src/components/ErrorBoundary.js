import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[8]};
  background: ${({ theme }) => theme.bg};
`;

const ErrorCard = styled.div`
  max-width: 600px;
  background: ${({ theme }) => theme.cardElevated};
  border: 1px solid ${({ theme }) => theme.error[500]}40;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[10]};
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ErrorTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  line-height: 1.6;
`;

const ErrorDetails = styled.pre`
  background: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: left;
  overflow-x: auto;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.error[500]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const Button = styled.button`
  background: ${({ theme }) => theme.primary[500]};
  color: white;
  border: none;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[8]}`};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.base};

  &:hover {
    background: ${({ theme }) => theme.primary[600]};
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
