export type ThemeMode = 'auto' | 'light' | 'dark';
export type ResolvedMode = 'light' | 'dark';

export const STORAGE_KEY = 'central:theme-mode';

export function readStoredMode(): ThemeMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === 'light' || raw === 'dark' ? raw : 'auto';
  } catch {
    return 'auto';
  }
}

export function writeStoredMode(mode: ThemeMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* storage may be unavailable (private mode); fail silent */
  }
}

export function resolveMode(mode: ThemeMode): ResolvedMode {
  if (mode !== 'auto') return mode;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
