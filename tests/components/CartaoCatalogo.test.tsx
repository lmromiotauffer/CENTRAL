import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('CartaoCatalogo surface', () => {
  it('holds the compact catalog card language shared by module tiles and tutorial cards', () => {
    const cartao = readFileSync(resolve(process.cwd(), 'src/components/CartaoCatalogo.tsx'), 'utf8');

    expect(cartao).toContain('component="article"');
    // Fundo e borda de vidro vêm do override de MuiCard no tema, não do cartão.
    expect(cartao).not.toMatch(/bgcolor: sinfra\.paper|border: `1px solid \$\{sinfra\.rule\}`/);
    expect(cartao).not.toMatch(/borderTop:/);
    expect(cartao).toContain('minHeight: { xs: 144, md: 156 }');
    expect(cartao).toContain("flexDirection: 'column'");
    expect(cartao).toContain("alignItems: 'flex-start'");
    expect(cartao).toContain('fontSize: { xs: 20, md: 22 }');
    expect(cartao).toContain('WebkitLineClamp: 2');
  });
});
