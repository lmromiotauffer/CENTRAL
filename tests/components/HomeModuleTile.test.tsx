import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// O contrato visual do cartão compartilhado vive em CartaoCatalogo.test.tsx.
describe('HomeModuleTile catalog surface', () => {
  it('configures the shared catalog card with the compact launchpad proportions', () => {
    const tile = readFileSync(resolve(process.cwd(), 'src/components/HomeModuleTile.tsx'), 'utf8');

    expect(tile).toContain('iconeFontSize={30}');
  });
});
