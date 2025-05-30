export function logError(prefix: string, error: unknown): void {
  if (error instanceof Error) {
    console.warn(`${prefix}: ${error.message}`);
  } else {
    console.warn(`${prefix}: ${String(error)}`);
  }
}
