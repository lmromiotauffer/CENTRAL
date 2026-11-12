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
  it('renders tutorial cards for the selected module', () => {
    renderModuleDetail();

    expect(screen.getByRole('heading', { level: 1, name: 'Gestão de Obra/Serviço' })).toBeInTheDocument();
    expect(screen.getAllByText(/Abrir tutorial/i).length).toBeGreaterThan(1);
  });
});
