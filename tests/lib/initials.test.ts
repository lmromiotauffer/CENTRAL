import { describe, it, expect } from 'vitest';
import { getInitials } from '@/lib/initials';

describe('getInitials', () => {
  it('returns first + last initial for a multi-word name', () => {
    expect(getInitials('Paulo Fernandes Rodrigues')).toBe('PR');
    expect(getInitials('Thiago Pazete')).toBe('TP');
  });

  it('returns a single uppercase letter for a single-word name', () => {
    expect(getInitials('Plato')).toBe('P');
  });

  it('handles diacritics by uppercasing', () => {
    expect(getInitials('Jéssica Pinho Barreto')).toBe('JB');
    expect(getInitials('Rogério Camargo Nery')).toBe('RN');
  });

  it('trims whitespace and ignores empty parts', () => {
    expect(getInitials('  Willian   de Lima Alves  ')).toBe('WA');
  });

  it('returns empty string for empty/whitespace input', () => {
    expect(getInitials('')).toBe('');
    expect(getInitials('   ')).toBe('');
  });
});
