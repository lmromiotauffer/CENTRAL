import { vi } from 'vitest';

// jsdom não implementa matchMedia. O polyfill de setup.ts é estático
// (matches: false); este mock é controlável: guarda os listeners para que o
// teste possa disparar `change` e alternar a preferência do sistema.
const ouvintes: Array<(e: { matches: boolean }) => void> = [];
let prefereEscuro = false;

export function instalarMatchMedia(escuro = false) {
  ouvintes.length = 0;
  prefereEscuro = escuro;
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: prefereEscuro && query.includes('dark'),
    media: query,
    addEventListener: (_: string, cb: (e: { matches: boolean }) => void) => {
      ouvintes.push(cb);
    },
    removeEventListener: (_: string, cb: (e: { matches: boolean }) => void) => {
      const i = ouvintes.indexOf(cb);
      if (i >= 0) ouvintes.splice(i, 1);
    },
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
    onchange: null,
  }));
}

/** Muda a preferência do sistema e notifica quem estiver ouvindo `change`. */
export function definirPreferenciaEscura(escuro: boolean) {
  prefereEscuro = escuro;
  ouvintes.forEach((cb) => cb({ matches: escuro }));
}
