/**
 * Normalizes text by trimming whitespace and collapsing multiple spaces into one.
 */
export function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}
