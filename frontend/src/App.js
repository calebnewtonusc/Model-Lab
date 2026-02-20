import './App.css';
import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { modernDarkTheme, modernLightTheme } from './utils/ModernThemes';
import GlobalStyles from './GlobalStyles';
import ModelLab from './pages/ModelLab';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const Body = styled.div`
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  width: 100%;
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

// Inner app that has access to AuthContext
const AppInner = () => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  if (loading) {
    return (
      <Body style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a14' }}>
        <div style={{ color: '#a78bfa', fontSize: '1.125rem', fontFamily: 'system-ui, sans-serif' }}>
          Loading ModelLab...
        </div>
      </Body>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={modernDarkTheme}>
        <GlobalStyles />
        <LoginPage onLoginSuccess={() => {}} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={isDark ? modernDarkTheme : modernLightTheme}>
      <GlobalStyles />
      <Body>
        <ModelLab
          user={user}
          onLogout={logout}
          isDark={isDark}
          setIsDark={setIsDark}
        />
      </Body>
    </ThemeProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
