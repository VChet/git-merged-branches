import neostandard from "neostandard";

export default [
  ...neostandard({
    ts: true,
    noJsx: true,
    semi: true,
    ignores: ["dist/**/*"]
  }),
  {
    rules: {
      "@stylistic/arrow-parens": ["error", "always"],
      "@stylistic/comma-dangle": ["error", "never"],
      "@stylistic/operator-linebreak": ["error", "after"],
      "@stylistic/member-delimiter-style": ["error", {
        multiline: { delimiter: "none", requireLast: false },
        multilineDetection: "brackets",
        singleline: { delimiter: "comma" }
      }],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/space-before-function-paren": ["error", "never"],
      "no-else-return": ["error", { allowElseIf: true }]
    }
  }
];
