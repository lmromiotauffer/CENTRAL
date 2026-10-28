import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop';

describe('ScrollToTop', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('moves the window to the top when the route changes', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);

    render(
      <MemoryRouter initialEntries={['/primeira']}>
        <ScrollToTop />
        <Routes>
          <Route path="/primeira" element={<Link to="/segunda">Abrir segunda</Link>} />
          <Route path="/segunda" element={<h1>Segunda página</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    scrollTo.mockClear();
    fireEvent.click(screen.getByRole('link', { name: /abrir segunda/i }));

    expect(screen.getByRole('heading', { name: /segunda página/i })).toBeInTheDocument();
    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' });
  });
});
