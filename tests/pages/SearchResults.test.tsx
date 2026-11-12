import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchResults from '@/pages/SearchResults';
import { search } from '@/lib/searchIndex';
import { renderComTema } from '@/test/renderComTema';

describe('SearchResults', () => {
  it('lista todos os resultados, sem cortar no limite das sugestões', () => {
    const total = search('obra', Infinity).length;
    expect(total).toBeGreaterThan(20);

    renderComTema(
      <MemoryRouter initialEntries={['/busca?q=obra']}>
        <SearchResults />
      </MemoryRouter>,
    );

    expect(screen.getByText(`Busca · ${total} resultados`)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /obra/i }).length).toBeGreaterThan(20);
  });
});
