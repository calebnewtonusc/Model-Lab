import './App.css';
import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './utils/Themes';
import ModelLab from './pages/ModelLab';

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
    return saved ? saved === 'dark' : true; // Default to dark theme
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <Body>
        <ModelLab />
      </Body>
    </ThemeProvider>
  );
}

export default App;
