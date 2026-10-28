import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
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
  it('uses the same centered internal page layout as documentation and contacts', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/pages/Modules.tsx'), 'utf8');

    expect(source).toContain('<PaginaInterna');
    expect(source).toContain("sx={{ maxWidth: 720, mx: 'auto' }}");
  });

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
