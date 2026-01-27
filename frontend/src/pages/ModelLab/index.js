import React, { useState } from 'react';
import styled from 'styled-components';
import Dashboard from './DashboardEnhanced';
import Datasets from './DatasetsEnhanced';
import Runs from './RunsEnhanced';
import Compare from './CompareEnhanced';
import { Toast } from './components/SharedComponents';
import { useToast } from './components/useToast';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
`;

const NavBar = styled.nav`
  background: ${({ theme }) => theme.card};
  border-bottom: 1px solid ${({ theme }) => theme.text_primary + '12'};
  padding: 1rem 2rem;
`;

const NavContent = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  margin-right: auto;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NavLink = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ active, theme }) =>
    active ? theme.primary : 'transparent'};
  color: ${({ active, theme }) =>
    active ? 'white' : theme.text_primary};
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ active, theme }) =>
      active ? theme.primary : theme.text_primary + '10'};
  }
`;

const Content = styled.div`
  min-height: calc(100vh - 100px);
`;

const Footer = styled.footer`
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.bg};
  border-top: 1px solid ${({ theme }) => theme.text_primary + '12'};
`;

const BuiltBySection = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: ${({ theme }) => theme.card};
  border-radius: 50px;
  border: 2px solid ${({ theme }) => theme.primary + '33'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${({ theme }) => theme.primary + '33'};
    border-color: ${({ theme }) => theme.primary};
  }
`;

const CreatorImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center 30%;
  box-shadow: 0 3px 10px ${({ theme }) => theme.primary + '50'};
  border: 2px solid ${({ theme }) => theme.primary + '50'};
`;

const CreatorInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
`;

const BuiltByLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text_secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
`;

const CreatorName = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 700;
`;

const ModelLab = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toasts, removeToast } = useToast();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'datasets':
        return <Datasets />;
      case 'runs':
        return <Runs />;
      case 'compare':
        return <Compare />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Container>
      <Toast toasts={toasts} removeToast={removeToast} />
      <NavBar>
        <NavContent>
          <Logo>ModelLab</Logo>
          <NavLinks>
            <NavLink
              active={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </NavLink>
            <NavLink
              active={activeTab === 'datasets'}
              onClick={() => setActiveTab('datasets')}
            >
              Datasets
            </NavLink>
            <NavLink
              active={activeTab === 'runs'}
              onClick={() => setActiveTab('runs')}
            >
              Runs
            </NavLink>
            <NavLink
              active={activeTab === 'compare'}
              onClick={() => setActiveTab('compare')}
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
