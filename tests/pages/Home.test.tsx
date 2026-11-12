import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Home from '@/pages/Home';
import { anoDoConteudo, modules } from '@/content/modules';
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

  it('mostra o ano de revisão do conteúdo, fixado à mão, e não o ano do relógio do visitante', () => {
    vi.useFakeTimers({ now: new Date(anoDoConteudo + 3, 0, 1) });
    try {
      renderHome();

      expect(screen.getByText(`ATUALIZADO PARA ${anoDoConteudo}`)).toBeInTheDocument();
      expect(screen.getByText(`ÍNDICE DE SISTEMAS — ${anoDoConteudo}`)).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
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

  it('does not render ordinal counters in module tiles', () => {
    renderHome();

    const launchpad = screen.getByRole('region', { name: /módulos do sistema/i });

    modules.forEach((_, index) => {
      const ordinal = String(index + 1).padStart(2, '0');
      expect(within(launchpad).queryByText(ordinal)).not.toBeInTheDocument();
    });
  });
});
