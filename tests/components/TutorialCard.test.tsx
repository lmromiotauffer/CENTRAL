import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// O contrato visual do cartão compartilhado vive em CartaoCatalogo.test.tsx.
describe('TutorialCard catalog surface', () => {
  it('uses the shared compact catalog card language as module tiles', () => {
    const card = readFileSync(resolve(process.cwd(), 'src/components/TutorialCard.tsx'), 'utf8');

    expect(card).toContain('ArticleOutlinedIcon');
    expect(card).toContain('iconeFontSize={24}');
  });
});
