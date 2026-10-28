import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const moduleDetailPadding = {
  pt: 'pt: { xs: 4, md: 5.5 }',
  pb: 'pb: { xs: 7.5, md: 11 }',
};

const lerFonte = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

// Páginas internas com breadcrumb usam a casca compartilhada PaginaInterna.
const paginasComCasca = [
  'src/pages/Modules.tsx',
  'src/pages/ModuleDetail.tsx',
  'src/pages/Documentation.tsx',
  'src/pages/Contacts.tsx',
  'src/pages/SearchResults.tsx',
  'src/pages/TutorialPage.tsx',
  'src/pages/Videos.tsx',
];

describe('Internal page padding', () => {
  it('keeps the standard padding, transparent background and breadcrumb in the shared internal page shell', () => {
    const source = lerFonte('src/components/PaginaInterna.tsx');

    expect(source).toContain(moduleDetailPadding.pt);
    expect(source).toContain(moduleDetailPadding.pb);
    // Sem fundo próprio: o fundo animado do html aparece atrás.
    expect(source).not.toContain('bgcolor');
    expect(source).toContain('maxWidth="xl"');
    expect(source).toContain('<Breadcrumb');
  });

  it('renders every non-home page with breadcrumb through the shared shell', () => {
    paginasComCasca.forEach(path => {
      const source = lerFonte(path);

      expect(source, path).toContain('<PaginaInterna');
      expect(source, path).not.toContain('py: spacing.pagePy');
    });
  });

  it('keeps the standard padding on the not found page, which has no breadcrumb', () => {
    const source = lerFonte('src/pages/NotFound.tsx');

    expect(source).toContain(moduleDetailPadding.pt);
    expect(source).toContain(moduleDetailPadding.pb);
    expect(source).not.toContain('py: spacing.pagePy');
  });
});
