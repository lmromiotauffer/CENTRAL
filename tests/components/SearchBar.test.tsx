import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect, vi } from 'vitest';
import { act, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';
import { renderComTema } from '@/test/renderComTema';

const searchSuggestionsMock = vi.hoisted(() =>
  vi.fn(({ id, topOffset }: { id: string; topOffset: number }) => (
    <div id={id} role="listbox" data-top-offset={topOffset} />
  )),
);

vi.mock('@/components/SearchSuggestions', () => ({
  default: searchSuggestionsMock,
}));

function renderSearchBar() {
  return renderComTema(
    <MemoryRouter>
      <SearchBar variant="navChip" />
    </MemoryRouter>,
  );
}

describe('SearchBar navChip variant', () => {
  it('starts compact and expands into a searchable input on interaction', () => {
    renderSearchBar();

    const input = screen.getByRole('combobox');
    const form = input.closest('form');

    expect(form).toHaveAttribute('data-expanded', 'false');
    expect(form).toHaveStyle({ width: '100%' });
    expect(input).toHaveAttribute('placeholder', 'BUSCAR');

    fireEvent.focus(input);

    expect(form).toHaveAttribute('data-expanded', 'true');
    expect(form).toHaveStyle({ width: '100%' });
    expect(input).toHaveAttribute('placeholder', 'Pesquisar na Central');
  });

  it('collapses back to compact on Escape, Tab, blur, and outside click when empty', () => {
    renderSearchBar();

    const input = screen.getByRole('combobox');
    const form = input.closest('form');

    fireEvent.focus(input);
    expect(form).toHaveAttribute('data-expanded', 'true');

    fireEvent.keyDown(input, { key: 'Escape' });
    expect(form).toHaveAttribute('data-expanded', 'false');

    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'Tab' });
    expect(form).toHaveAttribute('data-expanded', 'false');

    fireEvent.focus(input);
    fireEvent.blur(input, { relatedTarget: document.body });
    expect(form).toHaveAttribute('data-expanded', 'false');

    fireEvent.focus(input);
    fireEvent.blur(input, { relatedTarget: null });
    expect(form).toHaveAttribute('data-expanded', 'false');
  });

  it('stays expanded when closing suggestions while the query has text', () => {
    renderSearchBar();

    const input = screen.getByRole('combobox');
    const form = input.closest('form');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'folha' } });

    fireEvent.keyDown(input, { key: 'Escape' });
    expect(form).toHaveAttribute('data-expanded', 'true');

    fireEvent.blur(input, { relatedTarget: null });
    expect(form).toHaveAttribute('data-expanded', 'true');
  });

  it('focuses the input when the nav chip chrome or search icon is clicked', () => {
    renderSearchBar();

    const input = screen.getByRole('combobox');
    const form = input.closest('form');
    const searchIcon = form?.querySelector('svg');

    expect(input).not.toHaveFocus();

    fireEvent.mouseDown(form!);
    expect(input).toHaveFocus();

    input.blur();
    expect(input).not.toHaveFocus();

    fireEvent.mouseDown(searchIcon!);
    expect(input).toHaveFocus();
  });

  it('does not clip suggestions from the compact form bounds', () => {
    renderSearchBar();

    const input = screen.getByRole('combobox');
    const form = input.closest('form');

    expect(form).not.toHaveStyle({ overflow: 'hidden' });

    fireEvent.focus(input);

    expect(form).not.toHaveStyle({ overflow: 'hidden' });
  });

  it('uses the tighter pill suggestion offset for the nav chip', () => {
    renderSearchBar();

    fireEvent.focus(screen.getByRole('combobox'));

    expect(screen.getByRole('listbox')).toHaveAttribute('data-top-offset', '1');
  });

  it('renders the submit button inside the expanded nav chip', () => {
    renderSearchBar();

    fireEvent.focus(screen.getByRole('combobox'));

    expect(screen.getByRole('button', { name: 'Buscar' })).toBeInTheDocument();
  });

  it('guards smooth scrolling behind the reduced motion preference', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/components/SearchBar.tsx'), 'utf8');

    expect(source).toContain("matchMedia('(prefers-reduced-motion: reduce)')");
    expect(source).toContain("prefersReducedMotion ? ('auto' as const) : ('smooth' as const)");
  });
});

function LocalAtual() {
  const { pathname, search } = useLocation();
  return <output data-testid="local">{pathname + search}</output>;
}

describe('SearchBar teclado', () => {
  it('Enter logo após digitar busca o termo novo, não o item destacado da lista antiga', () => {
    vi.useFakeTimers();
    try {
      renderComTema(
        <MemoryRouter>
          <SearchBar variant="navChip" />
          <LocalAtual />
        </MemoryRouter>,
      );
      const input = screen.getByRole('combobox');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'empenho' } });
      act(() => { vi.advanceTimersByTime(200); });
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      fireEvent.change(input, { target: { value: 'empenhos' } });
      fireEvent.submit(input.closest('form')!);

      expect(screen.getByTestId('local')).toHaveTextContent('/busca?q=empenhos');
    } finally {
      vi.useRealTimers();
    }
  });
});
