/**
 * Login / Register Page
 * Beautiful dark purple/blue ML aesthetic
 */

import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-12px) rotate(1deg); }
  66% { transform: translateY(-6px) rotate(-1deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a14;
  position: relative;
  overflow: hidden;
  padding: 2rem;
`;

const Background = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
`;

const Orb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: ${pulse} ${({ duration }) => duration || '4s'} ease-in-out infinite;
  animation-delay: ${({ delay }) => delay || '0s'};
`;

const OrbPurple = styled(Orb)`
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, rgba(109, 40, 217, 0.1) 60%, transparent 100%);
  top: -200px;
  right: -100px;
`;

const OrbBlue = styled(Orb)`
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.1) 60%, transparent 100%);
  bottom: -150px;
  left: -100px;
`;

const OrbIndigo = styled(Orb)`
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const GridLines = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(139, 92, 246, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 92, 246, 0.04) 1px, transparent 1px);
  background-size: 60px 60px;
`;

const Card = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 440px;
  background: rgba(15, 12, 30, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(139, 92, 246, 0.25);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow:
    0 0 0 1px rgba(139, 92, 246, 0.1),
    0 25px 60px rgba(0, 0, 0, 0.6),
    0 0 80px rgba(139, 92, 246, 0.08);
  animation: ${float} 8s ease-in-out infinite;
`;

const LogoArea = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const LogoIcon = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 2rem;
  box-shadow:
    0 0 30px rgba(124, 58, 237, 0.4),
    0 8px 16px rgba(0, 0, 0, 0.4);
`;

const LogoText = styled.h1`
  font-size: 1.875rem;
  font-weight: 800;
  background: linear-gradient(135deg, #a78bfa 0%, #818cf8 50%, #60a5fa 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 3s linear infinite;
  margin: 0;
  letter-spacing: -0.03em;
`;

const LogoSubtext = styled.p`
  font-size: 0.875rem;
  color: rgba(167, 139, 250, 0.7);
  margin: 0.25rem 0 0;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 500;
`;

const TabRow = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 1.75rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

const Tab = styled.button`
  flex: 1;
  padding: 0.625rem 1rem;
  border-radius: 9px;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  background: ${({ active }) =>
    active
      ? 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)'
      : 'transparent'};
  color: ${({ active }) => (active ? '#ffffff' : 'rgba(167, 139, 250, 0.6)')};
  box-shadow: ${({ active }) => active ? '0 4px 12px rgba(124, 58, 237, 0.35)' : 'none'};

  &:hover {
    color: ${({ active }) => (active ? '#ffffff' : 'rgba(167, 139, 250, 0.9)')};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: rgba(167, 139, 250, 0.8);
  margin-bottom: 0.5rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8125rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  color: #e2d9f3;
  font-size: 0.9375rem;
  font-family: inherit;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &::placeholder {
    color: rgba(167, 139, 250, 0.3);
  }

  &:focus {
    border-color: rgba(139, 92, 246, 0.6);
    background: rgba(139, 92, 246, 0.08);
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.9375rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%);
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(124, 58, 237, 0.35);
  letter-spacing: 0.02em;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
    transition: left 0.5s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(124, 58, 237, 0.5);
    &::before { left: 100%; }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: #fca5a5;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DemoHint = styled.div`
  margin-top: 1.5rem;
  padding: 0.875rem 1rem;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  font-size: 0.8125rem;
  color: rgba(167, 139, 250, 0.7);
  text-align: center;
  line-height: 1.6;
`;

const DemoCode = styled.span`
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
  background: rgba(139, 92, 246, 0.15);
  padding: 0.1em 0.4em;
  border-radius: 4px;
  color: #a78bfa;
  font-size: 0.8125rem;
`;

const LoginPage = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const { login, register } = useAuth();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');

    try {
      if (mode === 'login') {
        await login(formData.username, formData.password);
      } else {
        if (!formData.email) {
          setFormError('Email is required for registration');
          return;
        }
        await register(formData.username, formData.email, formData.password);
      }
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setFormError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <Background>
        <GridLines />
        <OrbPurple duration="5s" delay="0s" />
        <OrbBlue duration="6s" delay="2s" />
        <OrbIndigo duration="7s" delay="1s" />
      </Background>

      <Card>
        <LogoArea>
          <LogoIcon>
            <span role="img" aria-label="lab">🧪</span>
          </LogoIcon>
          <LogoText>ModelLab</LogoText>
          <LogoSubtext>ML Experiment Platform</LogoSubtext>
        </LogoArea>

        <TabRow>
          <Tab active={mode === 'login'} onClick={() => { setMode('login'); setFormError(''); }}>
            Sign In
          </Tab>
          <Tab active={mode === 'register'} onClick={() => { setMode('register'); setFormError(''); }}>
            Register
          </Tab>
        </TabRow>

        {formError && (
          <ErrorMessage>
            <span>!</span>
            {formError}
          </ErrorMessage>
        )}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Username</Label>
            <Input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </FormGroup>

          {mode === 'register' && (
            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </FormGroup>
          )}

          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              placeholder={mode === 'login' ? 'Enter password' : 'Min 6 characters'}
              value={formData.password}
              onChange={handleChange}
              required
              minLength={mode === 'register' ? 6 : undefined}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={submitting}>
            {submitting
              ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
              : (mode === 'login' ? 'Sign In' : 'Create Account')
            }
          </SubmitButton>
        </form>

        <DemoHint>
          Demo credentials: <DemoCode>admin</DemoCode> / <DemoCode>admin123</DemoCode>
        </DemoHint>
      </Card>
    </PageWrapper>
  );
};

export default LoginPage;
