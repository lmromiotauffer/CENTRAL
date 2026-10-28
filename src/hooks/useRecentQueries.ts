import { useCallback, useState } from 'react';

const STORAGE_KEY = 'central.searchRecent';
const MAX_ENTRIES = 5;

function readStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function writeStorage(entries: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage unavailable (private mode / SSR) — silent no-op
  }
}

export function useRecentQueries() {
  const [recent, setRecent] = useState<string[]>(readStorage);

  const addRecent = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setRecent(prev => {
      const lower = trimmed.toLowerCase();
      const deduped = prev.filter(v => v.toLowerCase() !== lower);
      const next = [trimmed, ...deduped].slice(0, MAX_ENTRIES);
      writeStorage(next);
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecent([]);
    writeStorage([]);
  }, []);

  return { recent, addRecent, clearRecent };
}
