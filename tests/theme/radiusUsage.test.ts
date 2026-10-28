import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const textChipFiles = [
  'src/components/FAQItem.tsx',
  'src/components/SearchSuggestions.tsx',
] as const;

describe('radius usage contract', () => {
  it('does not apply fully rounded pill radius to variable-width text chips', () => {
    textChipFiles.forEach(filePath => {
      const source = readFileSync(filePath, 'utf8');

      expect(source).not.toMatch(/borderRadius:\s*radius\.pill/);
      expect(source).toMatch(/borderRadius:\s*radius\.control/);
    });
  });

  it('keeps the search suggestions HUD below the default system radius', () => {
    const source = readFileSync('src/components/SearchSuggestions.tsx', 'utf8');

    expect(source).not.toMatch(/borderRadius:\s*radius\.surface/);
    expect(source).toMatch(/borderRadius:\s*2/);
  });
});
