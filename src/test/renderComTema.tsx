import type { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { buildTheme } from '@/theme';
import { ThemeModeProvider } from '@/theme/ThemeModeProvider';

// Par de providers que todo componente da UI exige. Router fica no call-site:
// cada teste precisa do seu (MemoryRouter puro, initialEntries ou Routes).
export function renderComTema(ui: ReactNode) {
  return render(
    <ThemeModeProvider>
      <ThemeProvider theme={buildTheme('light')}>{ui}</ThemeProvider>
    </ThemeModeProvider>,
  );
}
