import { describe, it, expect } from 'vitest';
import { modules } from '@/content/modules';

describe('modules data', () => {
  it('includes the modules represented in the legacy help center', () => {
    const slugs = modules.map(module => module.slug);

    expect(slugs).toEqual(expect.arrayContaining([
      'gestao-contratos',
      'gestao-obra-servico',
      'gestao-medicoes',
      'gestao-fiscalizacao',
      'gestao-fornecedores',
      'gestao-projetos',
    ]));
  });
});
