export function logError(prefix: string, error: unknown): void {
  if (error instanceof Error) {
    console.warn(`${prefix}: ${error.message}`);
  } else {
    console.warn(`${prefix}: ${String(error)}`);
  }
}

export function pluralize(count: number, words: [string, string]): string {
  return `${count} ${count === 1 ? words[0] : words[1]}`;
}
