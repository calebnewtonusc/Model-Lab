import React, { useState } from 'react';
import styled from 'styled-components';
import ErrorBoundary from '../../components/ErrorBoundary';
import Landing from '../Landing';
import Dashboard from './DashboardModern';
import Datasets from './DatasetsEnhanced';
import Runs from './RunsEnhanced';
import Compare from './CompareEnhanced';
import Projects from './ProjectsEnhanced';
import { Toast } from './components/SharedComponents';
import { useToast } from './components/useToast';
import { useAuth } from '../../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif;
  position: relative;
`;

const NavBar = styled.nav`
  background: rgba(242, 242, 247, 0.85);
  backdrop-filter: blur(20px) saturate(1.8);
  -webkit-backdrop-filter: blur(20px) saturate(1.8);
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.18);
  box-shadow: none;
  position: sticky;
  top: 0;
  z-index: 100;
  padding: ${({ theme }) => theme.spacing?.[4] || "1rem"} ${({ theme }) => theme.spacing?.[8] || "2rem"};
  transition: background 0.25s ease, border-color 0.25s ease;
`;

const NavContent = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.[8] || "2rem"};
`;

const Logo = styled.div`
  font-size: ${({ theme }) => theme.fontSize?.['2xl'] || '1.5rem'};
  font-weight: 800;
  margin-right: auto;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.[3] || '0.75rem'};
  letter-spacing: -0.5px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: opacity 0.2s ease;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const LogoImage = styled.img`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.borderRadius?.lg || "0.75rem"};
  object-fit: contain;
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing?.[2] || "0.5rem"};
`;

const NavLink = styled.button`
  padding: ${({ theme }) => `${theme.spacing?.[2] || '0.5rem'} ${theme.spacing?.[4] || '1rem'}`};
  background: transparent;
  color: ${({ active, theme }) =>
    active ? '#6366f1' : (theme.text_secondary || '#3a3a3c')};
  border: none;
  border-radius: 12px;
  font-weight: ${({ active }) => active ? 600 : 500};
  font-size: ${({ theme }) => theme.fontSize?.base || '1rem'};
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
  white-space: nowrap;
  position: relative;

  ${({ active }) => active && `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 2px;
      background: #6366f1;
      border-radius: 1px;
    }
  `}

  &:hover {
    background: rgba(99, 102, 241, 0.07);
    color: #6366f1;
  }

  &:active {
    background: rgba(99, 102, 241, 0.12);
  }
`;

const Content = styled.div`
  min-height: calc(100vh - 200px);
  background: transparent;
`;

const Footer = styled.footer`
  padding: ${({ theme }) => theme.spacing?.[8] || '2rem'};
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border-top: 0.5px solid rgba(60, 60, 67, 0.12);
  margin-top: ${({ theme }) => theme.spacing?.[12] || '3rem'};
`;

const BuiltBySection = styled.a`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.[4] || '1rem'};
  padding: ${({ theme }) => `${theme.spacing?.[4] || '1rem'} ${theme.spacing?.[6] || '1.5rem'}`};
  background: #ffffff;
  border-radius: 9999px;
  border: 0.5px solid rgba(60, 60, 67, 0.12);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.07);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.10);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.07);
  }
`;

const CreatorImage = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 9999px;
  object-fit: cover;
  object-position: center 30%;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.10);
  border: 2px solid rgba(99, 102, 241, 0.30);
  transition: border-color 0.2s ease, transform 0.2s ease;

  ${BuiltBySection}:hover & {
    border-color: #6366f1;
    transform: scale(1.04);
  }
`;

const CreatorInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing?.[1] || "0.25rem"};
`;

const BuiltByLabel = styled.span`
  font-size: 11px;
  color: #8e8e93;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
`;

const CreatorName = styled.span`
  font-size: 1rem;
  color: #1c1c1e;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  letter-spacing: -0.2px;
`;

const UserBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.[3] || '0.75rem'};
  padding: ${({ theme }) => `${theme.spacing?.[2] || '0.5rem'} ${theme.spacing?.[4] || '1rem'}`};
  background: #ffffff;
  border: 0.5px solid rgba(60, 60, 67, 0.18);
  border-radius: 9999px;
  font-size: ${({ theme }) => theme.fontSize?.sm || '0.875rem'};
  color: #3a3a3c;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
`;

const UserAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
`;

const LogoutBtn = styled.button`
  padding: ${({ theme }) => `${theme.spacing?.[2] || '0.5rem'} ${theme.spacing?.[4] || '1rem'}`};
  background: transparent;
  border: 0.5px solid rgba(60, 60, 67, 0.18);
  border-radius: 12px;
  color: #ff3b30;
  font-size: ${({ theme }) => theme.fontSize?.sm || '0.875rem'};
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: rgba(255, 59, 48, 0.07);
    border-color: rgba(255, 59, 48, 0.30);
  }

  &:active {
    background: rgba(255, 59, 48, 0.12);
  }
`;

const ModelLab = ({ user, onLogout, isDark, setIsDark }) => {
  const [activeTab, setActiveTab] = useState('home');
  const { toasts, removeToast } = useToast();
  const auth = useAuth();

  const handleNavigation = (tab) => {
    console.log('Navigating to:', tab);
    setActiveTab(tab);
  };

  const renderContent = () => {
    const content = (() => {
      switch (activeTab) {
        case 'home':
          return <Landing onGetStarted={() => handleNavigation('dashboard')} />;
        case 'dashboard':
          return <Dashboard onNavigate={handleNavigation} />;
        case 'projects':
          return <Projects />;
        case 'datasets':
          return <Datasets />;
        case 'runs':
          return <Runs />;
        case 'compare':
          return <Compare />;
        default:
          return <Landing onGetStarted={() => handleNavigation('dashboard')} />;
      }
    })();

    return <ErrorBoundary>{content}</ErrorBoundary>;
  };

  return (
    <Container>
      <Toast toasts={toasts} removeToast={removeToast} />
      <NavBar>
        <NavContent>
          <Logo>
            <LogoImage src="/modellab-logo.png" alt="ModelLab Logo" />
            ModelLab
          </Logo>
          <NavLinks>
            <NavLink
              active={activeTab === 'home'}
              onClick={() => handleNavigation('home')}
            >
              Home
            </NavLink>
            <NavLink
              active={activeTab === 'dashboard'}
              onClick={() => handleNavigation('dashboard')}
            >
              Dashboard
            </NavLink>
            <NavLink
              active={activeTab === 'projects'}
              onClick={() => handleNavigation('projects')}
            >
              Projects
            </NavLink>
            <NavLink
              active={activeTab === 'datasets'}
              onClick={() => handleNavigation('datasets')}
            >
              Datasets
            </NavLink>
            <NavLink
              active={activeTab === 'runs'}
              onClick={() => handleNavigation('runs')}
            >
              Runs
            </NavLink>
            <NavLink
              active={activeTab === 'compare'}
              onClick={() => handleNavigation('compare')}
            >
              Compare
            </NavLink>
          </NavLinks>

          {auth.user && (
            <>
              <UserBadge>
                <UserAvatar>{auth.user.username?.[0] || 'U'}</UserAvatar>
                <span style={{ fontWeight: 600 }}>{auth.user.username}</span>
                <span style={{ opacity: 0.5, fontSize: '0.75rem' }}>{auth.user.role}</span>
              </UserBadge>
              <LogoutBtn onClick={auth.logout}>
                Sign out
              </LogoutBtn>
            </>
          )}
        </NavContent>
      </NavBar>

      <Content>
        {renderContent()}
      </Content>

      <Footer>
        <BuiltBySection href="https://calebnewton.me" target="_blank" rel="noopener noreferrer">
          <CreatorImage
            src="/caleb-usc.jpg"
            alt="Caleb Newton at USC"
          />
          <CreatorInfo>
            <BuiltByLabel>Built by</BuiltByLabel>
            <CreatorName>Caleb Newton</CreatorName>
          </CreatorInfo>
        </BuiltBySection>
      </Footer>
    </Container>
  );
};

export default ModelLab;
