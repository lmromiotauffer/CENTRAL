import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { renderComTema } from '@/test/renderComTema';
import FAQItem from '@/components/FAQItem';

const itemBase = {
  pergunta: 'Como redefinir minha senha de acesso?',
  resposta: 'Acesse a tela de login e clique em "Esqueci minha senha".',
  categoria: 'Acesso',
};

function renderItem(overrides = {}) {
  return renderComTema(<FAQItem item={{ ...itemBase, ...overrides }} />);
}

describe('FAQItem', () => {
  it('renderiza o texto da pergunta', () => {
    renderItem();
    expect(screen.getByText(itemBase.pergunta)).toBeInTheDocument();
  });

  it('renderiza a tag de categoria', () => {
    renderItem();
    expect(screen.getByText('Acesso')).toBeInTheDocument();
  });

  it('oculta a resposta por padrão', () => {
    renderItem();
    expect(screen.queryByText(itemBase.resposta)).not.toBeInTheDocument();
  });

  it('exibe a resposta ao clicar no summary', () => {
    renderItem();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText(itemBase.resposta)).toBeInTheDocument();
  });

  it('oculta a resposta ao clicar duas vezes', async () => {
    renderItem();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText(itemBase.resposta)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    await waitForElementToBeRemoved(() => screen.queryByText(itemBase.resposta));
  });

  it('renderiza sem quebrar para categoria desconhecida (fallback de ícone)', () => {
    renderItem({ categoria: 'Outro' });
    expect(screen.getByText('Outro')).toBeInTheDocument();
    expect(screen.getByText(itemBase.pergunta)).toBeInTheDocument();
  });

  it('respects reduced motion for collapse and content reveal', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/components/FAQItem.tsx'), 'utf8');

    expect(source).toContain('useMediaQuery');
    expect(source).toContain('prefers-reduced-motion: reduce');
    expect(source).toContain('timeout={prefersReducedMotion ? 0');
  });
});
