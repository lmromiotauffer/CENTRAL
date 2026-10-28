import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { useThemeMode } from '@/theme/ThemeModeProvider';
import { STORAGE_KEY } from '@/theme/themeMode';
import { renderComTema } from '@/test/renderComTema';
import { instalarMatchMedia } from '@/test/matchMedia';
import ThemeModeToggle from '@/components/ThemeModeToggle';

function Probe() {
  const { resolvedMode } = useThemeMode();
  return <span data-testid="resolved">{resolvedMode}</span>;
}

function renderToggle() {
  return renderComTema(
    <>
      <ThemeModeToggle />
      <Probe />
    </>,
  );
}

describe('ThemeModeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    instalarMatchMedia(false);
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders trigger with aria-label naming the active mode', () => {
    renderToggle();
    const btn = screen.getByRole('button', { name: /tema/i });
    expect(btn).toBeInTheDocument();
    expect(btn.getAttribute('aria-label')).toMatch(/automático/i);
  });

  it('opens menu with three radio options', () => {
    renderToggle();
    fireEvent.click(screen.getByRole('button', { name: /tema/i }));
    const items = screen.getAllByRole('menuitemradio');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent(/automático/i);
    expect(items[1]).toHaveTextContent(/claro/i);
    expect(items[2]).toHaveTextContent(/escuro/i);
  });

  it('marks the active option with aria-checked', () => {
    renderToggle();
    fireEvent.click(screen.getByRole('button', { name: /tema/i }));
    const auto = screen.getByRole('menuitemradio', { name: /automático/i });
    const dark = screen.getByRole('menuitemradio', { name: /escuro/i });
    expect(auto).toHaveAttribute('aria-checked', 'true');
    expect(dark).toHaveAttribute('aria-checked', 'false');
  });

  it('selecting Escuro updates state, persists, closes menu', () => {
    renderToggle();
    fireEvent.click(screen.getByRole('button', { name: /tema/i }));
    fireEvent.click(screen.getByRole('menuitemradio', { name: /escuro/i }));
    expect(screen.getByTestId('resolved').textContent).toBe('dark');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
