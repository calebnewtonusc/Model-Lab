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

/* ─────────────────────────────────────────────────────────────────────────────
   Root Container
───────────────────────────────────────────────────────────────────────────── */

const Container = styled.div`
  min-height: 100vh;
  background: #f2f2f7;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif;
  position: relative;
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Navigation Bar
   Apple Instruments / developer-tool feel:
   sticky frosted glass, 56px tall, max-width 1200px inner layout
───────────────────────────────────────────────────────────────────────────── */

const NavBar = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  height: 56px;
  background: rgba(242, 242, 247, 0.88);
  backdrop-filter: blur(20px) saturate(1.8);
  -webkit-backdrop-filter: blur(20px) saturate(1.8);
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.15);
  box-shadow: none;
  transition: background 0.25s ease, border-color 0.25s ease;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

/* ─── Logo ──────────────────────────────────────────────────────────────── */

const Logo = styled.button`
  display: flex;
  align-items: center;
  gap: 9px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.2s ease;
  flex-shrink: 0;

  &:hover {
    opacity: 0.78;
  }

  &:active {
    opacity: 0.6;
  }
`;

const LogoIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #6366f1;
  box-shadow: 0 1px 4px rgba(99, 102, 241, 0.3);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.span`
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #1c1c1e;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  line-height: 1;
`;

/* ─── Tab Segmented Control ─────────────────────────────────────────────── */

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  background: rgba(116, 116, 128, 0.12);
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
`;

const NavLink = styled.button`
  position: relative;
  padding: 5px 13px;
  background: ${({ active }) => active ? '#ffffff' : 'transparent'};
  border: none;
  border-radius: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
  font-size: 13px;
  font-weight: ${({ active }) => active ? 600 : 500};
  color: ${({ active }) => active ? '#1c1c1e' : '#8e8e93'};
  cursor: pointer;
  white-space: nowrap;
  box-shadow: ${({ active }) =>
    active
      ? '0 1px 4px rgba(0,0,0,0.12), 0 0.5px 1px rgba(0,0,0,0.08)'
      : 'none'};
  transition:
    background 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    color: ${({ active }) => active ? '#1c1c1e' : '#3a3a3c'};
  }

  &:active {
    opacity: 0.85;
  }
`;

/* ─── Right Side: User + Logout ─────────────────────────────────────────── */

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

const UserBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px 5px 5px;
  background: #ffffff;
  border: 0.5px solid rgba(60, 60, 67, 0.18);
  border-radius: 9999px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
`;

const UserAvatar = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  flex-shrink: 0;
`;

const UserName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #1c1c1e;
`;

const UserRole = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: #8e8e93;
`;

const LogoutBtn = styled.button`
  padding: 5px 12px;
  background: transparent;
  border: 0.5px solid rgba(60, 60, 67, 0.18);
  border-radius: 9px;
  color: #ff3b30;
  font-size: 13px;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 59, 48, 0.07);
    border-color: rgba(255, 59, 48, 0.28);
  }

  &:active {
    background: rgba(255, 59, 48, 0.13);
  }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Content Area
───────────────────────────────────────────────────────────────────────────── */

const Content = styled.main`
  background: #f2f2f7;
  min-height: calc(100vh - 56px);
  /* Inner pages own their own max-width + padding so we don't double-constrain */
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Footer
───────────────────────────────────────────────────────────────────────────── */

const Footer = styled.footer`
  background: transparent;
  border-top: 0.5px solid rgba(60, 60, 67, 0.12);
  padding: 20px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BuiltBySection = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px 8px 8px;
  background: #ffffff;
  border-radius: 9999px;
  border: 0.5px solid rgba(60, 60, 67, 0.12);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.07);
  text-decoration: none;
  cursor: pointer;
  transition: box-shadow 0.22s ease, transform 0.22s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.10);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.07);
  }
`;

const CreatorImage = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center 30%;
  border: 1.5px solid rgba(60, 60, 67, 0.14);
  flex-shrink: 0;
  transition: border-color 0.2s ease;

  ${BuiltBySection}:hover & {
    border-color: rgba(99, 102, 241, 0.4);
  }
`;

const CreatorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const BuiltByLabel = styled.span`
  font-size: 11px;
  color: #8e8e93;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
  line-height: 1;
`;

const CreatorName = styled.span`
  font-size: 13px;
  color: #1c1c1e;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  letter-spacing: -0.2px;
  line-height: 1;
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Tab definitions
───────────────────────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'home',      label: 'Home' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'projects',  label: 'Projects' },
  { id: 'datasets',  label: 'Datasets' },
  { id: 'runs',      label: 'Runs' },
  { id: 'compare',   label: 'Compare' },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────────────────── */

const ModelLab = ({ isDark, setIsDark }) => {
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

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <NavBar>
        <NavContent>

          {/* Left: Logo */}
          <Logo onClick={() => handleNavigation('home')}>
            <LogoIcon />
            <LogoText>ModelLab</LogoText>
          </Logo>

          {/* Center: Segmented tab control */}
          <NavLinks>
            {TABS.map((tab) => (
              <NavLink
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => handleNavigation(tab.id)}
              >
                {tab.label}
              </NavLink>
            ))}
          </NavLinks>

          {/* Right: User badge + logout */}
          <NavRight>
            {auth.user && (
              <>
                <UserBadge>
                  <UserAvatar>{auth.user.username?.[0] || 'U'}</UserAvatar>
                  <UserName>{auth.user.username}</UserName>
                  {auth.user.role && (
                    <UserRole>{auth.user.role}</UserRole>
                  )}
                </UserBadge>
                <LogoutBtn onClick={auth.logout}>
                  Sign out
                </LogoutBtn>
              </>
            )}
          </NavRight>

        </NavContent>
      </NavBar>

      {/* ── Page Content ─────────────────────────────────────────────────── */}
      <Content>
        {renderContent()}
      </Content>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <Footer>
        <BuiltBySection
          href="https://calebnewton.me"
          target="_blank"
          rel="noopener noreferrer"
        >
          <CreatorImage
            src="/caleb-usc.jpg"
            alt="Caleb Newton"
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
