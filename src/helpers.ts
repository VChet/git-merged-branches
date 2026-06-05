import { styleText } from "node:util";

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

export const style = {
  red: (payload: string): string => styleText("red", payload),
  cyan: (payload: string): string => styleText("cyan", payload),
  yellow: (payload: string): string => styleText("yellow", payload),
  green: (payload: string): string => styleText("green", payload),
  bold: (payload: string): string => styleText("bold", payload),
  underline: (payload: string): string => styleText("underline", payload)
};
