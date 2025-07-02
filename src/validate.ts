export function isValidURL(payload?: string): boolean {
  if (!payload) return false;
  try {
    const url = new URL(payload);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
