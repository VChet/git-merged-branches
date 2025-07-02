import { defineConfig } from "eslint/config";
import neostandard from "neostandard";

export default defineConfig([
  ...neostandard({
    ts: true,
    noJsx: true,
    semi: true,
    ignores: ["dist/**/*"]
  }),
  {
    rules: {
      "@stylistic/brace-style": "off",
      "@stylistic/comma-dangle": ["error", "never"],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/space-before-function-paren": ["error", "never"]
    }
  }
]);
