import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import './styles/fonts.css';
import './styles/fundo.css';
import App from './App';
import { buildTheme } from './theme';
import { ThemeModeProvider, useThemeMode } from './theme/ThemeModeProvider';

function ThemedApp() {
  const { resolvedMode } = useThemeMode();
  const muiTheme = React.useMemo(() => buildTheme(resolvedMode), [resolvedMode]);
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeModeProvider>
      <ThemedApp />
    </ThemeModeProvider>
  </React.StrictMode>,
);
