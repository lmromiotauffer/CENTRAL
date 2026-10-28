import { describe, it, expect } from 'vitest';
import { screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { renderComTema } from '@/test/renderComTema';
import { mdxComponents } from '@/components/mdx';

function renderTutorialImage() {
  const Image = mdxComponents.img;

  return renderComTema(
    <Image src="/tutorials/modulo/tutorial/01.png" alt="Imagem 1 - Tutorial de teste" />,
  );
}

describe('TutorialImage', () => {
  it('opens the tutorial image in an enlarged dialog with original-image action', () => {
    renderTutorialImage();

    fireEvent.click(screen.getByRole('button', { name: /ampliar imagem 1 - tutorial de teste/i }));

    expect(screen.getByRole('dialog', { name: /imagem ampliada/i })).toBeInTheDocument();
    expect(screen.getByText('Imagem ampliada')).toBeInTheDocument();
    expect(screen.getByText('Imagem 1 - Tutorial de teste')).toBeInTheDocument();
    expect(screen.getAllByAltText('Imagem 1 - Tutorial de teste')).toHaveLength(2);
    expect(screen.getByRole('link', { name: /abrir imagem original/i })).toHaveAttribute(
      'href',
      '/tutorials/modulo/tutorial/01.png',
    );
  });

  it('keeps the interactive selection bounds constrained to the rendered image', () => {
    renderTutorialImage();

    expect(screen.getByRole('button', { name: /ampliar imagem 1 - tutorial de teste/i })).toHaveStyle({
      width: 'fit-content',
      maxWidth: '100%',
      overflow: 'hidden',
    });
  });

  it('closes the enlarged image dialog from the close control', async () => {
    renderTutorialImage();

    fireEvent.click(screen.getByRole('button', { name: /ampliar imagem 1 - tutorial de teste/i }));
    fireEvent.click(screen.getByRole('button', { name: /fechar imagem ampliada/i }));

    await waitForElementToBeRemoved(() => screen.queryByRole('dialog', { name: /imagem ampliada/i }));
  });
});
