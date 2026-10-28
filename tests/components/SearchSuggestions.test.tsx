import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import SearchSuggestions from '@/components/SearchSuggestions';
import SearchBar from '@/components/SearchBar';
import { renderComTema } from '@/test/renderComTema';
import type { SearchResult } from '@/lib/searchIndex';

// Resultados intercalados (ordem de relevância != ordem visual agrupada por kind),
// para o teste de regressão de alinhamento highlight/Enter mais abaixo.
vi.mock('@/lib/searchIndex', async () => {
  const actual = await vi.importActual<typeof import('@/lib/searchIndex')>('@/lib/searchIndex');
  return {
    ...actual,
    search: () => [
      { kind: 'module', slug: 'gestao-fiscalizacao', title: 'Gestao de fiscalizacao', description: 'Modulo para acompanhar fiscalizacoes.' },
      { kind: 'tutorial', moduleSlug: 'gestao-fiscalizacao', slug: 'abrir-obra', title: 'Abrir obra', description: 'Como abrir uma obra no sistema.' },
      { kind: 'tutorial', moduleSlug: 'gestao-fiscalizacao', slug: 'fechar-obra', title: 'Fechar obra', description: 'Como fechar uma obra no sistema.' },
      { kind: 'faq', index: 0, title: 'Duvida sobre obra', description: 'Pergunta frequente sobre obra.' },
    ] satisfies SearchResult[],
  };
});

const results: SearchResult[] = [
  {
    kind: 'tutorial',
    moduleSlug: 'gestao-contratos',
    slug: 'cadastro-de-contratos',
    title: 'Cadastro de contratos',
    description: 'Aprenda a cadastrar contratos no sistema.',
  },
  {
    kind: 'module',
    slug: 'gestao-fiscalizacao',
    title: 'Gestao de fiscalizacao',
    description: 'Modulo para acompanhar fiscalizacoes.',
  },
  {
    kind: 'faq',
    index: 0,
    title: 'Como acessar o sistema?',
    description: 'Use suas credenciais institucionais.',
  },
];

function renderSuggestions(overrides = {}) {
  return renderComTema(
    <SearchSuggestions
      id="search-suggestions"
      results={results}
      recent={['contratos']}
      popular={['Fiscalizacao']}
      query="contrato"
      highlightIndex={-1}
      onSelect={vi.fn()}
      onSelectTerm={vi.fn()}
      onSubmitAll={vi.fn()}
      onHoverIndex={vi.fn()}
      onClear={vi.fn()}
      topOffset={1}
      {...overrides}
    />,
  );
}

describe('SearchSuggestions', () => {
  it('keeps scrolling inside the suggestions HUD instead of on the outer panel', () => {
    renderSuggestions();

    const panel = screen.getByRole('listbox');
    const viewport = screen.getByTestId('search-suggestions-scroll');
    const footer = screen.getByRole('option', { name: /ver todos os resultados/i });

    expect(panel).toHaveStyle({ overflow: 'hidden' });
    expect(viewport).toHaveStyle({ overflowY: 'auto' });
    expect(viewport).not.toHaveStyle({ marginRight: '8px' });
    expect(panel).toContainElement(viewport);
    expect(panel).toContainElement(footer);
    expect(viewport).not.toContainElement(footer);
  });

  it('neutralizes the footer icon nudge when reduced motion is requested', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/components/SearchSuggestions.tsx'), 'utf8');

    expect(source).toContain('@media (prefers-reduced-motion: reduce)');
    expect(source).toContain("'&:hover .sb-footer-icon': { transform: 'none' }");
  });
});

describe('SearchBar + SearchSuggestions keyboard highlight alignment', () => {
  function Location() {
    return <div data-testid="location">{useLocation().pathname}</div>;
  }

  function renderApp() {
    return renderComTema(
      <MemoryRouter initialEntries={['/']}>
        <SearchBar variant="navChip" />
        <Location />
      </MemoryRouter>,
    );
  }

  it('navigates to the item highlighted visually, not to the raw relevance-order item', async () => {
    renderApp();

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'obra' } });

    // Ordem visual esperada (agrupada por KIND_ORDER: tutorial, module, faq, ...),
    // diferente da ordem de relevância mockada acima (module, tutorial, tutorial, faq).
    await waitFor(() => {
      const options = screen.getAllByRole('option').filter(o => o.textContent);
      expect(options[0]).toHaveTextContent('Abrir obra');
      expect(options[1]).toHaveTextContent('Fechar obra');
      expect(options[2]).toHaveTextContent('Gestao de fiscalizacao');
    });

    // 3 ArrowDown: destaca o 3º item visual (índice 2) = módulo "Gestao de fiscalizacao".
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    const options = screen.getAllByRole('option').filter(o => o.textContent);
    const highlighted = options.filter(o => o.getAttribute('aria-selected') === 'true');
    expect(highlighted).toHaveLength(1);
    expect(highlighted[0]).toHaveTextContent('Gestao de fiscalizacao');
    expect(input).toHaveAttribute('aria-activedescendant', highlighted[0].id);

    fireEvent.submit(input.closest('form')!);

    // Enter deve abrir o mesmo item destacado (módulo), não o item da ordem de relevância crua (tutorial).
    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toBe('/modulos/gestao-fiscalizacao');
    });
  });
});
