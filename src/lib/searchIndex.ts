import { tutorials } from './tutorials';
import { modules } from '@/content/modules';
import { faq } from '@/content/faq';
import { sinfralogNorms } from '@/content/documentation';
import { contacts } from '@/content/contacts';
import { videos } from '@/content/videos';

export type SearchResult =
  | { kind: 'tutorial'; moduleSlug: string; slug: string; title: string; description: string }
  | { kind: 'module'; slug: string; title: string; description: string }
  | { kind: 'faq'; index: number; title: string; description: string }
  | { kind: 'documentation'; section: string; href: string; title: string; description: string }
  | { kind: 'contact'; email: string; title: string; description: string }
  | { kind: 'video'; id: string; title: string; description: string };

function stripMdx(s: string): string {
  return s.replace(/^---[\s\S]*?---/m, '').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/<[^>]+>/g, ' ').replace(/[#*_`]/g, ' ');
}

const docs = [
  ...tutorials.map(t => ({
    text: `${t.title} ${t.description} ${(t.tags ?? []).join(' ')} ${stripMdx(t.rawText)}`,
    result: { kind: 'tutorial' as const, moduleSlug: t.moduleSlug, slug: t.slug, title: t.title, description: t.description },
  })),
  ...modules.map(m => ({
    text: `${m.title} ${m.description}`,
    result: { kind: 'module' as const, slug: m.slug, title: m.title, description: m.description },
  })),
  ...faq.map((f, i) => ({
    text: `${f.pergunta} ${f.resposta}`,
    result: { kind: 'faq' as const, index: i, title: f.pergunta, description: f.resposta },
  })),
  ...sinfralogNorms.flatMap(section => section.items.map(item => ({
    text: `${section.title} ${item.title} ${item.description ?? ''} ${item.href}`,
    result: {
      kind: 'documentation' as const,
      section: section.title,
      href: item.href,
      title: item.title,
      description: item.description ?? section.title,
    },
  }))),
  ...contacts.map(contact => ({
    text: `${contact.nome} ${contact.setor} ${contact.email}`,
    result: {
      kind: 'contact' as const,
      email: contact.email,
      title: contact.nome,
      description: `${contact.setor} · ${contact.email}`,
    },
  })),
  ...videos.map(v => ({
    text: `${v.title} ${v.description}`,
    result: { kind: 'video' as const, id: v.id, title: v.title, description: v.description },
  })),
].map(d => ({
  result: d.result,
  text: normalize(d.text),
  title: normalize(d.result.title),
}));

function normalize(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function search(query: string, limit = 20): SearchResult[] {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  // Empate final resolvido pela ordem de docs: Array.prototype.sort é estável (ES2019).
  return docs
    .flatMap(d => {
      const positions = tokens.map(t => d.text.indexOf(t));
      if (positions.some(p => p === -1)) return [];
      return [{
        result: d.result,
        titleMatch: tokens.every(t => d.title.includes(t)),
        pos: Math.min(...positions),
      }];
    })
    .sort((a, b) => {
      if (a.titleMatch !== b.titleMatch) return a.titleMatch ? -1 : 1;
      return a.pos - b.pos;
    })
    .slice(0, limit)
    .map(m => m.result);
}

export const MIN_CHARS = 2;

export const KIND_ORDER = ['tutorial', 'module', 'faq', 'documentation', 'contact', 'video'] as const;

export const KIND_LABELS: Record<SearchResult['kind'], string> = {
  tutorial: 'Tutoriais',
  module: 'Módulos',
  faq: 'FAQ',
  documentation: 'Documentação',
  contact: 'Contatos',
  video: 'Vídeos',
};

export function linkFor(r: SearchResult): string {
  if (r.kind === 'tutorial') return `/modulos/${r.moduleSlug}/${r.slug}`;
  if (r.kind === 'module') return `/modulos/${r.slug}`;
  if (r.kind === 'documentation') return r.href;
  if (r.kind === 'contact') return '/contatos';
  if (r.kind === 'video') return `/videos#${r.id}`;
  return '/#duvidas'; // faq: as perguntas vivem na seção FAQ da Home
}

export function keyFor(r: SearchResult): string {
  if (r.kind === 'tutorial') return `tutorial:${r.moduleSlug}/${r.slug}`;
  if (r.kind === 'module') return `module:${r.slug}`;
  if (r.kind === 'faq') return `faq:${r.index}`;
  if (r.kind === 'documentation') return `documentation:${r.href}`;
  if (r.kind === 'video') return `video:${r.id}`;
  return `contact:${r.email}`;
}

export function groupByKind(results: SearchResult[]): Record<SearchResult['kind'], SearchResult[]> {
  const g = Object.fromEntries(KIND_ORDER.map(k => [k, [] as SearchResult[]])) as Record<SearchResult['kind'], SearchResult[]>;
  results.forEach(r => g[r.kind].push(r));
  return g;
}
