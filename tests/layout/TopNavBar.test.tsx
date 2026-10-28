import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect, afterEach } from 'vitest';
import { act, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TopNavBar from '@/layout/TopNavBar';
import { renderComTema } from '@/test/renderComTema';
import { IntersectionObserverStub } from '@/test/setup';

function renderTopNavBar(initialPath = '/', { withHero = false } = {}) {
  return renderComTema(
    <MemoryRouter initialEntries={[initialPath]}>
      {withHero && <div data-home-hero-search="true" />}
      <TopNavBar />
    </MemoryRouter>,
  );
}

function setScrollY(scrollY: number) {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value: scrollY,
  });
}

afterEach(() => {
  setScrollY(0);
});

describe('TopNavBar', () => {
  it('keeps the home search hidden until the page has scrolled further down', () => {
    const { container } = renderTopNavBar('/', { withHero: true });
    const searchSlot = container.querySelector('.nav-search-slot');
    const observer = IntersectionObserverStub.instances.at(-1);

    expect(observer).toBeDefined();
    expect(searchSlot).toHaveAttribute('inert');

    setScrollY(0);
    act(() => {
      observer!.callback([{ isIntersecting: false }]);
    });
    expect(searchSlot).toHaveAttribute('inert');

    setScrollY(700);
    act(() => {
      observer!.callback([{ isIntersecting: false }]);
    });
    expect(searchSlot).not.toHaveAttribute('inert');

    act(() => {
      observer!.callback([{ isIntersecting: true }]);
    });
    expect(searchSlot).toHaveAttribute('inert');
  });

  it('keeps the hidden home search close to its final position for a softer reveal', () => {
    const { container } = renderTopNavBar('/');
    const searchSlot = container.querySelector('.nav-search-slot');

    expect(searchSlot).toHaveStyle({ width: '240px' });
    expect(searchSlot).toHaveStyle({ transform: 'translateX(-6px)' });
  });

  it('uses a subtle brand hover push for the navbar search slot', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/layout/TopNavBar.tsx'), 'utf8');

    expect(source).toContain("'--nav-search-logo-push': '3px'");
    expect(source).toContain('transform 720ms ${curva.suave}');
  });

  it('keeps brand text visible after animating it in on page load', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/layout/TopNavBar.tsx'), 'utf8');

    expect(source).toContain('const navBrandRuleIn = keyframes');
    expect(source).toContain('const navBrandRevealIn = keyframes');
    expect(source).toContain('maxWidth: 176');
    expect(source).toContain('opacity: 1');
    expect(source).toContain("transform: 'translateX(0)'");
    expect(source).toContain('animation: `${navBrandRevealIn} 720ms ${curva.suave} 180ms both`');
    expect(source).not.toContain("top: 'calc(100% + 6px)'");
    expect(source).not.toContain("left: 'calc(100% + 12px)'");
  });

  it('reveals the home nav search without animating layout width or margins', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/layout/TopNavBar.tsx'), 'utf8');

    expect(source).toContain('width: NAV_SEARCH_COMPACT_WIDTH');
    expect(source).toContain('ml: 2');
    expect(source).toContain('mr: 2');
    expect(source).toContain('opacity 520ms ease');
    expect(source).toContain('transform 720ms ${curva.suave}');
    expect(source).not.toContain('width 700ms');
    expect(source).not.toContain('margin 700ms');
    expect(source).not.toContain('width 760ms');
    expect(source).not.toContain('margin 760ms');
    expect(source).toContain('visibility 0ms linear');
  });

  it('uses the nav chip search variant in the desktop nav slot', () => {
    const { getByRole } = renderTopNavBar('/modulos');

    expect(getByRole('combobox', { name: 'Buscar na Central' })).toHaveAttribute(
      'placeholder',
      'BUSCAR',
    );
  });

  it('links to the documentation page from the nav', () => {
    renderTopNavBar('/');

    expect(screen.getByRole('link', { name: /documentação/i })).toHaveAttribute('href', '/documentacao');
    expect(screen.queryByRole('link', { name: /dúvidas/i })).not.toBeInTheDocument();
  });

  it('keeps parent navigation active on nested module pages', () => {
    renderTopNavBar('/modulos/gestao-contratos');

    const currentLinks = screen.getAllByRole('link').filter((link) =>
      link.getAttribute('aria-current') === 'page',
    );

    expect(currentLinks.some((link) => link.textContent?.includes('MÓDULOS'))).toBe(true);
  });

  it('does not clip the expanded nav chip or suggestions when visible', () => {
    const { container } = renderTopNavBar('/modulos');
    const searchSlot = container.querySelector('.nav-search-slot');

    expect(searchSlot).not.toHaveAttribute('inert');
    expect(searchSlot).not.toHaveStyle({ overflow: 'hidden' });
  });

  it('gives the desktop nav search chip more room at rest and on focus', () => {
    const { container } = renderTopNavBar('/modulos');
    const searchSlot = container.querySelector('.nav-search-slot');

    expect(searchSlot).toHaveStyle({ width: '240px' });
    expect(searchSlot).toHaveStyle({ maxWidth: '520px' });
  });

  it('keeps the navbar search width controlled by the slot instead of :has CSS', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/layout/TopNavBar.tsx'), 'utf8');
    const searchSource = readFileSync(resolve(process.cwd(), 'src/components/SearchBar.tsx'), 'utf8');

    expect(source).not.toContain(':has([data-expanded="true"])');
    expect(searchSource).toContain("width: '100%'");
    expect(searchSource).not.toContain('minWidth: expanded ? NAV_CHIP_EXPANDED_WIDTH');
  });

  it('removes hidden navbar search from focus order and exposes mobile drawer state', () => {
    const { container, getByLabelText } = renderTopNavBar('/');
    const searchSlot = container.querySelector('.nav-search-slot');
    const menuButton = getByLabelText('Abrir menu');

    expect(searchSlot).toHaveAttribute('inert', '');
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(menuButton).toHaveAttribute('aria-controls', 'mobile-navigation');
  });

  it('includes search in the mobile drawer without duplicating the theme toggle there', () => {
    const { getByLabelText } = renderTopNavBar('/modulos');

    act(() => {
      getByLabelText('Abrir menu').click();
    });

    const drawer = document.getElementById('mobile-navigation');
    expect(drawer).toBeInTheDocument();
    expect(within(drawer as HTMLElement).getByRole('combobox', { name: 'Buscar na Central' })).toBeInTheDocument();
    expect(within(drawer as HTMLElement).queryByLabelText(/tema:/i)).not.toBeInTheDocument();
  });

  it('uses the active page state in mobile navigation too', () => {
    const { getByLabelText, getAllByRole } = renderTopNavBar('/modulos');

    act(() => {
      getByLabelText('Abrir menu').click();
    });

    const currentLinks = getAllByRole('link').filter((link) =>
      link.getAttribute('aria-current') === 'page',
    );

    expect(currentLinks.some((link) => link.textContent?.includes('MÓDULOS'))).toBe(true);
  });
});
