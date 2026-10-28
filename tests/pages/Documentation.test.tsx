import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Documentation from '@/pages/Documentation';
import { renderComTema } from '@/test/renderComTema';

function renderDocumentation() {
  return renderComTema(
    <MemoryRouter>
      <Documentation />
    </MemoryRouter>,
  );
}

describe('Documentation page', () => {
  it('renders SINFRALOG norms inside the documentation page', () => {
    renderDocumentation();

    expect(screen.getByRole('link', { name: /início/i })).toHaveAttribute('href', '/');
    expect(screen.getAllByText(/documentação/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('heading', { name: /normas do sinfralog/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /instruções normativas/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /portarias/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /o que mais perguntam/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /perguntas frequentes/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /instrução normativa nº 5\/2023\/sinfra/i })).toHaveAttribute(
      'href',
      '/documentacao/normas-do-sinfralog/instrucao-normativa-05-2023-sinfra.pdf',
    );
    expect(screen.getByRole('link', { name: /portaria nº 60\/2023\/sinfra/i })).toHaveAttribute(
      'href',
      '/documentacao/normas-do-sinfralog/portaria-60-2023-sinfra.pdf',
    );
  });
});
