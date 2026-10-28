import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderComTema } from '@/test/renderComTema';
import Footer from '@/layout/Footer';

function renderFooter() {
  return renderComTema(<Footer />);
}

describe('Footer', () => {
  it('renders as contentinfo with official institutional identity', () => {
    renderFooter();

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByAltText('Governo de Mato Grosso')).toBeInTheDocument();
    expect(screen.getByText('SINFRALOG — Central de Ajuda')).toBeInTheDocument();
    expect(screen.getByText(`© ${new Date().getFullYear()} SINFRA / MT`)).toBeInTheDocument();
  });

  it('renders official external icon links', () => {
    renderFooter();

    const expectedLinks = [
      ['Instagram oficial da SINFRA', 'https://www.instagram.com/sinframtoficial/?hl=pt-br'],
      ['SINFRALOG', 'https://sinfralog.sinfra.mt.gov.br/login/'],
      ['SINFRA', 'https://www.sinfra.mt.gov.br/'],
      ['YouTube do SINFRALOG', 'https://www.youtube.com/@Sinfralog'],
    ] as const;

    expectedLinks.forEach(([name, href]) => {
      const link = screen.getByRole('link', { name });
      expect(link).toHaveAttribute('href', href);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('keeps footer spacing on the 4px grid and respects reduced motion', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/layout/Footer.tsx'), 'utf8');

    expect(source).not.toContain('xs: 1.25');
    expect(source).toContain('currentYear');
    expect(source).not.toContain('© 2026');
    expect(source).toContain('Container maxWidth="xl"');
    expect(source).not.toContain('Container maxWidth="lg"');
    expect(source).toContain('py: { xs: 2, md: 2.5 }');
    expect(source).toContain('@media (prefers-reduced-motion: reduce)');
    expect(source).toContain("borderTop: `1px solid ${sinfra.rule}`");
    expect(source).toContain("'&:focus-visible':");
    expect(source).toContain('opacity: 1');
    expect(source).toContain('color: sinfra.accent');
  });
});
