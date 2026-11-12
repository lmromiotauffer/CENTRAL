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
  });});
