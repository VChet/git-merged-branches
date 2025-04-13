export function isValidURL(url?: string): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidIssuePrefix(prefix?: string): boolean {
  if (!prefix) return false;
  return /^[A-Z]{2,10}$/i.test(prefix);
}
