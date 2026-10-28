import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function source(path: string) {
  return readFileSync(path, 'utf8');
}

describe('outline-free sinfra surfaces', () => {
  it('keeps FAQ items as line-based rows instead of outlined cards', () => {
    const faqItem = source('src/components/FAQItem.tsx');

    expect(faqItem).not.toMatch(/borderRadius:\s*radius\.surface/);
    expect(faqItem).not.toMatch(/outline:\s*`?2px solid/);
  });

  it('keeps top navigation active state as a local marker instead of a bar outline', () => {
    const topNav = source('src/layout/TopNavBar.tsx');

    expect(topNav).not.toMatch(/borderBottomColor:\s*scrolled\s*\?\s*sinfra\.accent/);
    expect(topNav).not.toMatch(/borderBottomColor:\s*isActive\s*\?\s*sinfra\.accent/);
    expect(topNav).not.toMatch(/borderRadius:\s*radius\.control/);
  });

  it('keeps the FAQ section CTA free of outlined-button framing', () => {
    const home = source('src/pages/Home.tsx');

    expect(home).not.toMatch(/variant="outlined"/);
  });
});
