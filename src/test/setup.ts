import { beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { instalarMatchMedia } from './matchMedia';

instalarMatchMedia();

// jsdom has no IntersectionObserver: a controllable stub so tests can drive
// the callback directly (see tests/layout/TopNavBar.test.tsx).
type IntersectionObserverStubEntry = Pick<IntersectionObserverEntry, 'isIntersecting'>;

export class IntersectionObserverStub {
  static instances: IntersectionObserverStub[] = [];
  target: Element | null = null;

  constructor(readonly callback: (entries: IntersectionObserverStubEntry[]) => void) {
    IntersectionObserverStub.instances.push(this);
  }

  observe(target: Element) {
    this.target = target;
  }

  unobserve() {
    this.target = null;
  }

  disconnect() {
    this.target = null;
  }
}

window.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;

beforeEach(() => {
  IntersectionObserverStub.instances.length = 0;
});
