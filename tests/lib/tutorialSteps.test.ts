import { describe, expect, it } from 'vitest';
import { normalizeTutorialStepTitle } from '@/lib/tutorialSteps';

describe('normalizeTutorialStepTitle', () => {
  it('removes interaction hints from tutorial step titles', () => {
    expect(normalizeTutorialStepTitle('Informações básicas (clique para detalhamento)')).toBe('Informações básicas');
    expect(normalizeTutorialStepTitle('É possível alterar ou excluir um serviço concluído? (clique aqui para saber)')).toBe(
      'É possível alterar ou excluir um serviço concluído?',
    );
    expect(normalizeTutorialStepTitle('Toque para detalhar')).toBe('Toque para detalhar');
  });

  it('leaves titles without hints untouched', () => {
    expect(normalizeTutorialStepTitle('  Valores  ')).toBe('Valores');
  });
});
