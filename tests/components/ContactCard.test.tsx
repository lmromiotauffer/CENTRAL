import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderComTema } from '@/test/renderComTema';
import ContactCard from '@/components/ContactCard';

const renderCard = (onCopy = vi.fn()) =>
  renderComTema(
    <ContactCard
      contact={{
        nome: 'Paulo Fernandes Rodrigues',
        setor: 'UNIGEP',
        email: 'pfrodrigues@sinfra.mt.gov.br',
      }}
      onCopy={onCopy}
    />,
  );

describe('ContactCard', () => {
  it('renders name, sector, email and initials', () => {
    renderCard();
    expect(screen.getByText('Paulo Fernandes Rodrigues')).toBeInTheDocument();
    expect(screen.getByText('UNIGEP')).toBeInTheDocument();
    expect(screen.getByText('pfrodrigues@sinfra.mt.gov.br')).toBeInTheDocument();
    expect(screen.getByText('PR')).toBeInTheDocument();
  });

  it('email link uses mailto scheme', () => {
    renderCard();
    const link = screen.getByRole('link', { name: /pfrodrigues@sinfra\.mt\.gov\.br/ });
    expect(link).toHaveAttribute('href', 'mailto:pfrodrigues@sinfra.mt.gov.br');
  });

  it('copy button is labelled per contact and invokes onCopy with the email', () => {
    const onCopy = vi.fn();
    renderCard(onCopy);
    const button = screen.getByRole('button', {
      name: /copiar e-mail de paulo fernandes rodrigues/i,
    });
    fireEvent.click(button);
    expect(onCopy).toHaveBeenCalledWith('pfrodrigues@sinfra.mt.gov.br');
  });

  it('exposes the card as a labelled article', () => {
    renderCard();
    const article = screen.getByRole('article', { name: 'Paulo Fernandes Rodrigues' });
    expect(article).toBeInTheDocument();
  });
});
