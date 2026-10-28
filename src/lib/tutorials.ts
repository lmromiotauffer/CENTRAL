import type { MDXContent } from 'mdx/types';
import type { Tutorial, TutorialFrontmatter } from '@/types/content';

type MDXModule = {
  default: MDXContent;
  frontmatter: TutorialFrontmatter;
};

const modules = import.meta.glob<MDXModule>('/src/content/tutorials/**/*.mdx', { eager: true });

// Same glob base as `modules` → identical keys, so rawText[path] resolves directly.
const rawText = import.meta.glob<string>('/src/content/tutorials/**/*.mdx', { eager: true, query: '?raw', import: 'default' });

export const tutorials: Tutorial[] = Object.entries(modules).map(([path, mod]) => {
  const match = path.match(/\/tutorials\/([^/]+)\/([^/]+)\.mdx$/);
  if (!match) throw new Error(`Invalid tutorial path: ${path}`);
  const [, moduleSlug, slug] = match;
  return {
    ...mod.frontmatter,
    moduleSlug,
    slug,
    Component: mod.default,
    rawText: rawText[path],
  };
});

export function getTutorial(moduleSlug: string, slug: string): Tutorial | undefined {
  return tutorials.find(t => t.moduleSlug === moduleSlug && t.slug === slug);
}

export function getTutorialsByModule(moduleSlug: string): Tutorial[] {
  return tutorials.filter(t => t.moduleSlug === moduleSlug).sort((a, b) => a.order - b.order);
}
