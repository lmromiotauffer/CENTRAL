import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Home from '@/pages/Home';
import { modules } from '@/content/modules';
import { renderComTema } from '@/test/renderComTema';

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderHome() {
  return renderComTema(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
}

describe('Home module launchpad', () => {
  it('renders only the active and preload hero images instead of every hero asset', () => {
    const { container } = renderHome();

    const renderedHeroImages = container.querySelectorAll('[data-home-hero-image="true"]');

    expect(renderedHeroImages.length).toBeGreaterThan(1);
    expect(renderedHeroImages.length).toBeLessThanOrEqual(3);
  });

  it('does not rotate the hero image when reduced motion is preferred', () => {
    const originalMatchMedia = window.matchMedia;
    const intervalSpy = vi.spyOn(window, 'setInterval');
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }));

    const { unmount } = renderHome();

    expect(intervalSpy).not.toHaveBeenCalled();

    unmount();
    window.matchMedia = originalMatchMedia;
    intervalSpy.mockRestore();
  });

  it('uses shared current-year copy and leaves a hint of content below the hero', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/pages/Home.tsx'), 'utf8');

    expect(source).toContain('currentContentYear');
    expect(source).not.toContain('ATUALIZADO PARA 2026');
    expect(source).not.toContain('ÍNDICE DE SISTEMAS — 2026');
    expect(source).not.toContain("xs: '64vh'");
    expect(source).not.toContain("md: '92vh'");
    expect(source).not.toContain("md: 'min(78vh, 760px)'");
    expect(source).toContain("xs: 'min(56svh, 480px)'");
    expect(source).toContain("md: 'min(68vh, 640px)'");
  });

  it('keeps the modules-to-faq transition compact', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/pages/Home.tsx'), 'utf8');

    expect(source).not.toContain('height: { xs: 80, md: 120 }');
    expect(source).not.toContain('height: { xs: 32, md: 56 }');
    expect(source).toContain('pt: spacing.pagePy,');
    expect(source).toContain('pb: { xs: 3, md: 4 },');
    // Sem faixa de gradiente entre as seções: ambas são transparentes sobre o fundo animado.
    expect(source).not.toContain('height: { xs: 24, md: 32 }');
    expect(source).toContain('pt: { xs: 3, md: 4 },');
    expect(source).toContain('pb: spacing.pagePy,');
  });

  it('uses the same search placeholder as the navbar search field', () => {
    renderHome();

    expect(screen.getByPlaceholderText('Pesquisar na Central')).toBeInTheDocument();
  });

  it('keeps a single document h1 and uses section headings for internal blocks', () => {
    renderHome();

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 2, name: /módulos do sistema/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /o que mais perguntam/i })).toBeInTheDocument();
  });

  it('renders a launchpad link for each module', () => {
    renderHome();

    const launchpad = screen.getByRole('region', { name: /módulos do sistema/i });
    expect(within(launchpad).getAllByText(/Explorar módulo/i)).toHaveLength(modules.length);

    modules.forEach(module => {
      const link = within(launchpad).getByRole('link', {
        name: new RegExp(escapeRegExp(module.title), 'i'),
      });

      expect(link).toHaveAttribute('href', `/modulos/${module.slug}`);
      expect(within(link).getByText(module.description)).toBeInTheDocument();
    });
  });

  it('matches the modules page grid spacing for mirrored module tiles', () => {
    const homeSource = readFileSync(resolve(process.cwd(), 'src/pages/Home.tsx'), 'utf8');
    const modulesSource = readFileSync(resolve(process.cwd(), 'src/pages/Modules.tsx'), 'utf8');

    expect(homeSource).toContain('spacing={{ xs: 2.5, md: 3 }}');
    expect(modulesSource).toContain('spacing={{ xs: 2.5, md: 3 }}');
  });

  it('does not render ordinal counters in module tiles', () => {
    renderHome();

    const launchpad = screen.getByRole('region', { name: /módulos do sistema/i });

    modules.forEach((_, index) => {
      const ordinal = String(index + 1).padStart(2, '0');
      expect(within(launchpad).queryByText(ordinal)).not.toBeInTheDocument();
    });
  });
});
