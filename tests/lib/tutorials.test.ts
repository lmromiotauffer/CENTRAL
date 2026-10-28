import { describe, it, expect } from 'vitest';
import { tutorials, getTutorial, getTutorialsByModule } from '@/lib/tutorials';

describe('tutorials loader', () => {
  it('loads at least one tutorial', () => {
    expect(tutorials.length).toBeGreaterThan(0);
  });

  it('carrega o texto bruto de todo tutorial para a busca', () => {
    expect(tutorials.every(t => t.rawText.startsWith('---'))).toBe(true);
  });

  it('finds tutorial by module + slug', () => {
    const t = getTutorial('gestao-contratos', 'cadastro-de-contratos');
    expect(t?.title).toBe('Cadastro de Contratos: Dados Gerais');
  });

  it('lists tutorials by module sorted by order', () => {
    const list = getTutorialsByModule('gestao-contratos');
    expect(list[0].slug).toBe('cadastro-de-contratos');
  });

  it('loads tutorials migrated from the legacy Google Sites structure', () => {
    expect(getTutorialsByModule('gestao-fornecedores').length).toBeGreaterThan(0);
    expect(getTutorialsByModule('gestao-fiscalizacao').length).toBeGreaterThan(0);
    expect(getTutorial('gestao-medicoes', 'cadastro-de-medicoes')?.title).toBe('Medições: Cadastro de Medições');
  });
});
