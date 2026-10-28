import { describe, expect, it } from 'vitest';
import { buildTheme, radius } from '@/theme';

function styleObject(value: unknown) {
  expect(typeof value).toBe('object');
  expect(value).not.toBeNull();
  return value as Record<string, unknown>;
}

describe('buildTheme radius system', () => {
  it('exposes balanced radius tokens', () => {
    expect(radius.control).toBe('6px');
    expect(radius.surface).toBe('8px');
    expect(radius.pill).toBe('999px');
  });

  it('applies rounded defaults to common Material UI components', () => {
    const theme = buildTheme('light');

    expect(theme.shape.borderRadius).toBe(6);
    expect(styleObject(theme.components?.MuiButton?.styleOverrides?.root).borderRadius).toBe(radius.control);
    expect(styleObject(theme.components?.MuiCard?.styleOverrides?.root).borderRadius).toBe(radius.surface);
  });

  it('turns every Card into a glass panel', () => {
    const card = styleObject(buildTheme('dark').components?.MuiCard?.styleOverrides?.root);

    expect(card.backgroundColor).toBe('#1415167a');
    expect(card.backdropFilter).toBe('blur(10px)');
  });
});
