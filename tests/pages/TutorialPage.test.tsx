import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fireEvent, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TutorialPage from '@/pages/TutorialPage';
import { tutorials } from '@/lib/tutorials';
import { renderComTema } from '@/test/renderComTema';

function renderTutorialPage(path = '/modulos/gestao-obra-servico/eventos-da-obra-consulta') {
  return renderComTema(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/modulos/:moduloSlug/:tutorialSlug" element={<TutorialPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('TutorialPage paginated reader', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses the same internal page shell as documentation, contacts, and modules', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/pages/TutorialPage.tsx'), 'utf8');

    expect(source).toContain('<PaginaInterna');
    expect(source).toContain('component="nav"');
  });

  it('renders a paginated tutorial reader with progress', () => {
    renderTutorialPage();

    expect(screen.getByRole('heading', { level: 1, name: 'Eventos da Obra: Consulta' })).toBeInTheDocument();
    expect(screen.getByTestId('tutorial-step-progress')).toHaveTextContent(/Etapa 1 de/i);
    expect(screen.getByRole('navigation', { name: /etapas do tutorial/i })).toBeInTheDocument();
  });

  it('keeps the tutorial header aligned with the reader column', () => {
    renderTutorialPage();

    const readerColumn = screen.getByTestId('tutorial-reader-column');

    expect(within(readerColumn).getByRole('heading', { level: 1, name: 'Eventos da Obra: Consulta' })).toBeInTheDocument();
    expect(within(readerColumn).getByTestId('tutorial-step-progress')).toBeInTheDocument();
  });

  it('esconde o título do MDX que repete só parte do título do tutorial', () => {
    renderTutorialPage('/modulos/gestao-contratos/cadastro-de-contratos');

    const repetido = [...document.querySelectorAll('article h2')].find(h => h.textContent === 'Cadastro de Contratos');
    expect(repetido).toHaveAttribute('data-tutorial-chrome', 'true');
  });

  it('moves between tutorial steps without rendering a single endless article', () => {
    renderTutorialPage();

    const firstProgress = screen.getByTestId('tutorial-step-progress').textContent;
    fireEvent.click(screen.getByRole('button', { name: /próxima etapa/i }));

    expect(screen.getByTestId('tutorial-step-progress')).toHaveTextContent(/Etapa 2 de/i);
    expect(screen.getByTestId('tutorial-step-progress').textContent).not.toBe(firstProgress);
  });

  it('moves the window to the top when changing tutorial steps', () => {
    const scrollTo = vi.mocked(window.scrollTo);

    renderTutorialPage();

    scrollTo.mockClear();
    fireEvent.click(screen.getByRole('button', { name: /próxima etapa/i }));

    expect(screen.getByTestId('tutorial-step-progress')).toHaveTextContent(/Etapa 2 de/i);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' });
  });

  it('allows direct step selection from the step navigation', () => {
    renderTutorialPage();

    fireEvent.click(screen.getByRole('button', { name: /^abrir etapa 2:/i }));

    expect(screen.getByTestId('tutorial-step-progress')).toHaveTextContent(/Etapa 2 de/i);
  });

  it('does not expose generic Parte labels for tutorial steps', () => {
    renderTutorialPage('/modulos/gestao-contratos/cadastro-de-contratos');

    expect(screen.queryByText(/^Parte\b/i)).not.toBeInTheDocument();
  });

  it('does not expose automatically numbered duplicate step titles', () => {
    for (const tutorial of tutorials) {
      const { unmount } = renderTutorialPage(`/modulos/${tutorial.moduleSlug}/${tutorial.slug}`);
      const stepTitles = screen
        .queryAllByRole('button', { name: /^abrir etapa/i })
        .map(button => button.getAttribute('aria-label') ?? '')
        .map(label => label.replace(/^Abrir etapa \d+:\s*/i, ''));
      const numberedStepTitles = stepTitles.filter(title => /\(\d+\)$/.test(title));
      const duplicateStepTitles = stepTitles.filter((title, index) => stepTitles.indexOf(title) !== index);

      expect(numberedStepTitles).toEqual([]);
      expect({ slug: tutorial.slug, duplicateStepTitles }).toEqual({ slug: tutorial.slug, duplicateStepTitles: [] });
      unmount();
    }
  });

  it('does not repeat the selected step title as an article heading', () => {
    renderTutorialPage('/modulos/gestao-contratos/cadastro-de-contratos');

    fireEvent.click(screen.getByRole('button', { name: /abrir etapa 2: informações básicas/i }));

    expect(screen.getAllByRole('heading', { name: 'Informações básicas' })).toHaveLength(1);
  });

  it('clips rounded tutorial scroll surfaces while keeping their inner lists scrollable', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/pages/TutorialPage.tsx'), 'utf8');

    expect(source).toContain('data-testid="tutorial-step-nav-scroll"');
    expect(source).toContain("id: 'tutorial-step-menu-scroll'");
    expect(source).toContain("overflow: 'hidden'");
    expect(source).toContain("overflowY: { md: 'auto' }");
    expect(source).toContain("overflowY: 'auto'");
    expect(source).toContain("pr: { xs: 0, md: 1.5 }");
  });
});
