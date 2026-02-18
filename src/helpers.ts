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

export const red = (payload: string): string => styleText("red", payload);
export const cyan = (payload: string): string => styleText("cyan", payload);
export const yellow = (payload: string): string => styleText("yellow", payload);
export const green = (payload: string): string => styleText("green", payload);
export const bold = (payload: string): string => styleText("bold", payload);
export const underline = (payload: string): string => styleText("underline", payload);
