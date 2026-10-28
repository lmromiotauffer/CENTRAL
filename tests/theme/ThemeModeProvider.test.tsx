import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { ThemeModeProvider } from '@/theme/ThemeModeProvider';
import { useThemeMode } from '@/theme/ThemeModeProvider';
import { STORAGE_KEY } from '@/theme/themeMode';
import { instalarMatchMedia, definirPreferenciaEscura } from '@/test/matchMedia';

function Probe() {
  const { mode, resolvedMode, setMode } = useThemeMode();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="resolved">{resolvedMode}</span>
      <button onClick={() => setMode('dark')}>set-dark</button>
      <button onClick={() => setMode('auto')}>set-auto</button>
    </div>
  );
}

describe('ThemeModeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    instalarMatchMedia(false);
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults to auto when no stored value', () => {
    render(<ThemeModeProvider><Probe /></ThemeModeProvider>);
    expect(screen.getByTestId('mode').textContent).toBe('auto');
    expect(screen.getByTestId('resolved').textContent).toBe('light');
  });

  it('reads stored mode on mount', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    render(<ThemeModeProvider><Probe /></ThemeModeProvider>);
    expect(screen.getByTestId('mode').textContent).toBe('dark');
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
  });

  it('resolves auto via system preference', () => {
    instalarMatchMedia(true);
    render(<ThemeModeProvider><Probe /></ThemeModeProvider>);
    expect(screen.getByTestId('mode').textContent).toBe('auto');
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
  });

  it('setMode persists, updates state, sets data-theme', () => {
    render(<ThemeModeProvider><Probe /></ThemeModeProvider>);
    act(() => screen.getByText('set-dark').click());
    expect(screen.getByTestId('mode').textContent).toBe('dark');
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('reacts to system change while in auto', () => {
    render(<ThemeModeProvider><Probe /></ThemeModeProvider>);
    expect(screen.getByTestId('resolved').textContent).toBe('light');
    act(() => definirPreferenciaEscura(true));
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
  });

  it('useThemeMode throws outside the provider', () => {
    const Boom = () => {
      useThemeMode();
      return null;
    };
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Boom />)).toThrow();
    errSpy.mockRestore();
  });
});
