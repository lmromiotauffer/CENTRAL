export function normalizeTutorialStepTitle(title: string): string {
  return title
    .replace(/\s*\((?:clique|toque)\s+(?:aqui\s+)?para\s+(?:detalhamento|saber|detalhar)\)\s*$/i, '')
    .trim();
}
