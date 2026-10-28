import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ModuleDetail from '@/pages/ModuleDetail';
import { renderComTema } from '@/test/renderComTema';

function renderModuleDetail(path = '/modulos/gestao-obra-servico') {
  return renderComTema(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/modulos/:moduloSlug" element={<ModuleDetail />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ModuleDetail page layout', () => {
  it('uses the same wide catalog layout as the modules index', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/pages/ModuleDetail.tsx'), 'utf8');

    // O padding vertical é coberto por tests/pages/InternalPagePadding.test.ts
    expect(source).not.toContain('maxWidth="lg"');
    expect(source).toContain('<PaginaInterna');
  });

  it('uses the same centered internal page shell as documentation, contacts, and modules', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/pages/ModuleDetail.tsx'), 'utf8');

    expect(source).toContain('<PaginaInterna');
    expect(source).toContain("sx={{ maxWidth: 720, mx: 'auto' }}");
  });

  it('matches the home and modules catalog spacing for tutorial grids', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/pages/ModuleDetail.tsx'), 'utf8');

    expect(source).toContain('spacing={{ xs: 2.5, md: 3 }}');
  });

  it('renders tutorial cards for the selected module', () => {
    renderModuleDetail();

    expect(screen.getByRole('heading', { level: 1, name: 'Gestão de Obra/Serviço' })).toBeInTheDocument();
    expect(screen.getAllByText(/Abrir tutorial/i).length).toBeGreaterThan(1);
  });
});
