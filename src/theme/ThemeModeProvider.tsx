import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from 'react';
import {
  readStoredMode,
  writeStoredMode,
  resolveMode,
  type ThemeMode,
  type ResolvedMode,
} from '@/theme/themeMode';
import { sinfraPalettes, type SinfraPalette } from '@/theme';

type ThemeModeContextValue = {
  mode: ThemeMode;
  resolvedMode: ResolvedMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

const DARK_QUERY = '(prefers-color-scheme: dark)';

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readStoredMode);
  const [resolvedMode, setResolvedMode] = useState<ResolvedMode>(() => resolveMode(mode));

  // Layout effect: o atributo precisa existir no mesmo commit do flushSync da View Transition do tema.
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = resolvedMode;
  }, [resolvedMode]);

  useEffect(() => {
    setResolvedMode(resolveMode(mode));
    if (mode !== 'auto') return;
    const mql = window.matchMedia(DARK_QUERY);
    const handler = (e: MediaQueryListEvent) =>
      setResolvedMode(e.matches ? 'dark' : 'light');
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => {
    writeStoredMode(next);
    setModeState(next);
    setResolvedMode(resolveMode(next));
  }, []);

  const value: ThemeModeContextValue = { mode, resolvedMode, setMode };

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used inside <ThemeModeProvider>');
  return ctx;
}

export function useSinfra(): SinfraPalette {
  const { resolvedMode } = useThemeMode();
  return sinfraPalettes[resolvedMode];
}
