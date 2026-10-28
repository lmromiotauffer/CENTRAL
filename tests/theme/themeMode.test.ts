import { readFileSync } from 'node:fs';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  STORAGE_KEY,
  readStoredMode,
  writeStoredMode,
  resolveMode,
} from '@/theme/themeMode';
import { instalarMatchMedia } from '@/test/matchMedia';

describe('themeMode helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('readStoredMode', () => {
    it('returns "auto" when nothing is stored', () => {
      expect(readStoredMode()).toBe('auto');
    });
    it('returns the stored mode when valid', () => {
      localStorage.setItem(STORAGE_KEY, 'dark');
      expect(readStoredMode()).toBe('dark');
    });
    it('falls back to "auto" when stored value is invalid', () => {
      localStorage.setItem(STORAGE_KEY, 'pumpkin');
      expect(readStoredMode()).toBe('auto');
    });
  });

  describe('writeStoredMode', () => {
    it('persists the mode under the storage key', () => {
      writeStoredMode('dark');
      expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    });
  });

  describe('resolveMode', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('returns the chosen mode when not auto', () => {
      instalarMatchMedia(true);
      expect(resolveMode('light')).toBe('light');
      expect(resolveMode('dark')).toBe('dark');
    });
    it('follows system preference when auto', () => {
      instalarMatchMedia(true);
      expect(resolveMode('auto')).toBe('dark');
      instalarMatchMedia(false);
      expect(resolveMode('auto')).toBe('light');
    });
  });
});

it('o script inline do index.html lê a mesma chave de tema', () => {
  const html = readFileSync('index.html', 'utf-8');
  expect(html).toContain(`localStorage.getItem('${STORAGE_KEY}')`);
});
