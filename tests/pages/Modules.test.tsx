import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Modules from '@/pages/Modules';
import { modules } from '@/content/modules';
import { renderComTema } from '@/test/renderComTema';

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderModules() {
  return renderComTema(
    <MemoryRouter>
      <Modules />
    </MemoryRouter>,
  );
}

describe('Modules page cards', () => {
  it('renders the same module tile cards used by the home launchpad', () => {
    renderModules();

    expect(screen.getAllByRole('article')).toHaveLength(modules.length);
    expect(screen.getAllByText(/Explorar módulo/i)).toHaveLength(modules.length);

    modules.forEach(module => {
      const link = screen.getByRole('link', {
        name: new RegExp(escapeRegExp(module.title), 'i'),
      });

      expect(link).toHaveAttribute('href', `/modulos/${module.slug}`);
      expect(link.closest('article')).not.toBeNull();
      expect(within(link).getByText(module.description)).toBeInTheDocument();
    });
  });
});
