import type { MDXContent } from 'mdx/types';

export interface ModuleMeta {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export interface TutorialFrontmatter {
  title: string;
  description: string;
  order: number;
  tags?: string[];
}

export interface Tutorial extends TutorialFrontmatter {
  moduleSlug: string;
  slug: string;
  Component: MDXContent;
  rawText: string;
}

export interface FAQItem {
  pergunta: string;
  resposta: string;
  categoria: string;
}

interface DocumentationLink {
  title: string;
  href: string;
  description?: string;
}

export interface DocumentationSection {
  title: string;
  items: DocumentationLink[];
}
