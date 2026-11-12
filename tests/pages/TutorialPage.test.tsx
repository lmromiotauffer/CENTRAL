import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
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

      // Etapa vazia: todos os nós dela são títulos escondidos (data-tutorial-chrome).
      const etapasVazias = stepTitles.filter(
        (_, etapa) => !document.querySelector(`[data-tutorial-step="${etapa}"]:not([data-tutorial-chrome])`),
      );

      expect(numberedStepTitles).toEqual([]);
      expect({ slug: tutorial.slug, duplicateStepTitles }).toEqual({ slug: tutorial.slug, duplicateStepTitles: [] });
      expect({ slug: tutorial.slug, etapasVazias }).toEqual({ slug: tutorial.slug, etapasVazias: [] });
      unmount();
    }
  });

  it('abre na etapa pedida em ?etapa= e cai na primeira quando o valor não serve', () => {
    const caminho = '/modulos/gestao-obra-servico/eventos-da-obra-consulta';

    for (const [busca, esperada] of [['?etapa=2', 2], ['?etapa=abc', 1], ['?etapa=999', 1], ['?etapa=0', 1]] as const) {
      const { unmount } = renderTutorialPage(caminho + busca);
      expect(screen.getByTestId('tutorial-step-progress')).toHaveTextContent(new RegExp(`Etapa ${esperada} de`, 'i'));
      unmount();
    }
  });

  it('guarda a etapa na URL ao avançar, para sobreviver a recarregar e compartilhar', () => {
    function Busca() {
      return <output data-testid="busca">{useLocation().search}</output>;
    }
    renderComTema(
      <MemoryRouter initialEntries={['/modulos/gestao-obra-servico/eventos-da-obra-consulta']}>
        <Routes>
          <Route path="/modulos/:moduloSlug/:tutorialSlug" element={<><TutorialPage /><Busca /></>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /próxima etapa/i }));

    expect(screen.getByTestId('busca')).toHaveTextContent('?etapa=2');
  });

  it('abre o tutorial apontado por um link interno do texto sem recarregar o site', () => {
    renderTutorialPage('/modulos/gestao-medicoes/cadastro-de-cronogramas');

    fireEvent.click(screen.getByRole('link', { name: 'Serviços de cronograma' }));

    expect(screen.getByRole('heading', { level: 1, name: 'Cronogramas: Serviços de Cronograma' })).toBeInTheDocument();
  });

  it('does not repeat the selected step title as an article heading', () => {
    renderTutorialPage('/modulos/gestao-contratos/cadastro-de-contratos');

    fireEvent.click(screen.getByRole('button', { name: /abrir etapa 2: informações básicas/i }));

    expect(screen.getAllByRole('heading', { name: 'Informações básicas' })).toHaveLength(1);
  });});
