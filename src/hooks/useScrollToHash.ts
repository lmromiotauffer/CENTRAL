import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Rola suavemente até o elemento apontado pelo hash da URL. */
export function useScrollToHash(block: ScrollLogicalPosition) {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    el?.scrollIntoView({ behavior: 'smooth', block });
  }, [hash, block]);
}
