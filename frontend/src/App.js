import './App.css';
import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { modernDarkTheme, modernLightTheme } from './utils/ModernThemes';
import GlobalStyles from './GlobalStyles';
import ModelLab from './pages/ModelLab';
import { AuthProvider } from './contexts/AuthContext';

const Body = styled.div`
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  width: 100%;
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : false;
  });

  return (
    <AuthProvider>
      <ThemeProvider theme={isDark ? modernDarkTheme : modernLightTheme}>
        <GlobalStyles />
        <Body>
          <ModelLab
            isDark={isDark}
            setIsDark={setIsDark}
          />
        </Body>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
