import { describe, it, expect } from 'vitest';
import { contacts, type Contact } from '@/content/contacts';

describe('contacts data', () => {
  it('exports exactly 8 contacts', () => {
    expect(contacts).toHaveLength(8);
  });

  it('every entry has required fields and UNIGEP sector', () => {
    contacts.forEach((c: Contact) => {
      expect(c.nome.trim().length).toBeGreaterThan(0);
      expect(c.setor).toBe('UNIGEP');
      expect(c.email).toMatch(/^[^\s@]+@sinfra\.mt\.gov\.br$/);
    });
  });

  it('emails are unique', () => {
    const emails = contacts.map((c) => c.email.toLowerCase());
    expect(new Set(emails).size).toBe(emails.length);
  });
});
