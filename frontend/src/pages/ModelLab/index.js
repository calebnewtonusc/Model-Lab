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

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
  font-family: ${({ theme }) => theme.fontFamily.primary};
  position: relative;
`;

const NavBar = styled.nav`
  background: ${({ theme }) => theme.glass?.medium?.background || theme.cardElevated};
  backdrop-filter: ${({ theme }) => theme.glass?.medium?.backdropFilter || theme.backdropBlur};
  border-bottom: 2px solid ${({ theme }) => theme.glass?.medium?.border || theme.border};
  box-shadow: ${({ theme }) => theme.elevation?.lg || theme.elevation.sm};
  position: sticky;
  top: 0;
  z-index: 100;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[8]};
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg,
      transparent,
      ${({ theme }) => theme.primary?.[500] || theme.primary}40,
      transparent
    );
  }
`;

const NavContent = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[8]};
`;

const Logo = styled.div`
  font-size: ${({ theme }) => theme.fontSize?.['2xl'] || '1.5rem'};
  font-weight: ${({ theme }) => theme.fontWeight?.extrabold || 800};
  margin-right: auto;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.[3] || '0.75rem'};
  letter-spacing: -0.03em;
  background: ${({ theme }) => theme.primary?.gradient || `linear-gradient(135deg, ${theme.primary[400]}, ${theme.primary[600]})`};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.2);
  }
`;

const LogoImage = styled.img`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  object-fit: contain;
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const NavLink = styled.button`
  padding: ${({ theme }) => `${theme.spacing?.[3] || '0.75rem'} ${theme.spacing?.[6] || '1.5rem'}`};
  background: ${({ active, theme }) =>
    active ? (theme.primary?.gradient || theme.primary?.[500]) : (theme.glass?.light?.background || 'transparent')};
  color: ${({ active }) => active ? 'white' : ({ theme }) => theme.text_primary};
  border: ${({ active, theme }) =>
    active ? 'none' : (theme.glass?.light?.border || `1px solid ${theme.borderLight}`)};
  border-radius: ${({ theme }) => theme.borderRadius?.xl || theme.borderRadius?.lg || '0.75rem'};
  font-weight: ${({ theme }) => theme.fontWeight?.semibold || 600};
  font-size: ${({ theme }) => theme.fontSize?.base || '1rem'};
  font-family: ${({ theme }) => theme.fontFamily?.primary};
  cursor: pointer;
  transition: all 0.3s ${({ theme }) => theme.easing?.spring || 'cubic-bezier(0.34, 1.56, 0.64, 1)'};
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  backdrop-filter: ${({ active, theme }) => active ? 'none' : (theme.glass?.light?.backdropFilter || 'blur(12px)')};

  ${({ active, theme }) => active && `
    box-shadow: ${theme.elevation?.primaryGlow || theme.elevation?.md || '0 8px 16px rgba(0,0,0,0.2)'};
  `}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.primary?.[500] || theme.primary}20, transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    background: ${({ active, theme }) =>
      active
        ? (theme.primary?.[600] || theme.primary)
        : (theme.glass?.medium?.background || theme.hover)};
    border-color: ${({ active, theme }) =>
      active ? 'transparent' : (theme.primary?.[500] || theme.borderMedium)};
    transform: translateY(-2px);
    ${({ active, theme }) => active && `
      box-shadow: ${theme.elevation?.primaryGlow || theme.elevation?.lg || '0 12px 24px rgba(0,0,0,0.3)'};
    `}
  }

  &:active {
    transform: translateY(0);
  }
`;

const Content = styled.div`
  min-height: calc(100vh - 200px);
`;

const Footer = styled.footer`
  padding: ${({ theme }) => theme.spacing?.[8] || '2rem'};
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.glass?.light?.background || theme.bg};
  backdrop-filter: ${({ theme }) => theme.glass?.light?.backdropFilter || 'blur(12px)'};
  border-top: 2px solid ${({ theme }) => theme.glass?.light?.border || theme.border};
  margin-top: ${({ theme }) => theme.spacing?.[12] || '3rem'};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg,
      transparent,
      ${({ theme }) => theme.primary?.[500] || theme.primary}40,
      transparent
    );
  }
`;

const BuiltBySection = styled.a`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.[4] || '1rem'};
  padding: ${({ theme }) => `${theme.spacing?.[5] || '1.25rem'} ${theme.spacing?.[8] || '2rem'}`};
  background: ${({ theme }) => theme.glass?.medium?.background || theme.cardElevated};
  backdrop-filter: ${({ theme }) => theme.glass?.medium?.backdropFilter || 'blur(16px)'};
  border-radius: ${({ theme }) => theme.borderRadius?.full || '9999px'};
  border: 2px solid ${({ theme }) => (theme.primary?.[500] || theme.primary) + '40'};
  box-shadow: ${({ theme }) => theme.elevation?.lg || '0 10px 40px rgba(0,0,0,0.2)'};
  transition: all 0.4s ${({ theme }) => theme.easing?.spring || 'cubic-bezier(0.34, 1.56, 0.64, 1)'};
  text-decoration: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, ${({ theme }) => (theme.primary?.[500] || theme.primary) + '15'}, transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: ${({ theme }) => theme.elevation?.primaryGlow || theme.elevation?.xl || '0 20px 60px rgba(0,0,0,0.3)'};
    border-color: ${({ theme }) => theme.primary?.[500] || theme.primary};

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-2px) scale(1.01);
  }
`;

const CreatorImage = styled.img`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.borderRadius?.full || '9999px'};
  object-fit: cover;
  object-position: center 30%;
  box-shadow: ${({ theme }) => theme.elevation?.primaryGlow || theme.elevation?.md || '0 4px 12px rgba(0,0,0,0.2)'};
  border: 3px solid ${({ theme }) => (theme.primary?.[500] || theme.primary) + '60'};
  transition: all 0.4s ${({ theme }) => theme.easing?.spring || 'cubic-bezier(0.34, 1.56, 0.64, 1)'};

  ${BuiltBySection}:hover & {
    border-color: ${({ theme }) => theme.primary?.[500] || theme.primary};
    box-shadow: ${({ theme }) => theme.elevation?.primaryGlow || theme.elevation?.lg || '0 8px 24px rgba(0,0,0,0.3)'};
    transform: scale(1.05) rotate(5deg);
  }
`;

const CreatorInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const BuiltByLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.text_secondary};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const CreatorName = styled.span`
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.text_primary};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const ModelLab = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { toasts, removeToast } = useToast();

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
