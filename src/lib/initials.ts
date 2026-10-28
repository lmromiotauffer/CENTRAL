export function getInitials(fullName: string): string {
  const [first = '', ...rest] = fullName.trim().split(/\s+/);
  return (first.charAt(0) + (rest.at(-1)?.charAt(0) ?? '')).toUpperCase();
}
