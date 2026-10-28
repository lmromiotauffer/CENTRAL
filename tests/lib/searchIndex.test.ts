import { describe, it, expect } from 'vitest';
import { search } from '@/lib/searchIndex';

describe('search', () => {
  it('returns empty for empty query', () => {
    expect(search('')).toEqual([]);
  });

  it('finds the empenho tutorial', () => {
    const results = search('empenho');
    expect(results.some(r => r.kind === 'tutorial' && r.title === 'Cadastro de Contratos: Empenho')).toBe(true);
  });

  it('finds modules by name', () => {
    const results = search('contratos');
    expect(results.some(r => r.kind === 'module')).toBe(true);
  });

  it('finds FAQ entries', () => {
    const results = search('senha');
    expect(results.some(r => r.kind === 'faq')).toBe(true);
  });

  it('finds documentation entries', () => {
    const results = search('recebimento provisório');
    expect(results.some(r => r.kind === 'documentation' && r.title === 'Instrução Normativa nº 4/2024/GS/SINFRA/MT')).toBe(true);
  });

  it('finds contacts by name and email', () => {
    const byName = search('Thiago Pazete');
    const byEmail = search('thiagopazete');

    expect(byName.some(r => r.kind === 'contact' && r.title === 'Thiago Pazete')).toBe(true);
    expect(byEmail.some(r => r.kind === 'contact' && r.title === 'Thiago Pazete')).toBe(true);
  });

  it('finds accented content when the query has no accent', () => {
    const results = search('modulo');
    expect(results.length).toBeGreaterThan(0);
  });

  it('encontra tutoriais por palavra que só aparece no corpo', () => {
    const results = search('homologação');
    expect(results.some(r => r.kind === 'tutorial' && r.slug === 'aprovacao-da-planilha-de-servicos-e-aditivo')).toBe(true);
  });

  it('não indexa caminhos nem legendas de imagem', () => {
    expect(search('png')).toEqual([]);
  });
});
